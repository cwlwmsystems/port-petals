import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendCustomerPaidOrderEmail,
  sendOwnerPaidOrderEmail,
} from "@/lib/email/order-notifications";

export const runtime = "nodejs";

type SquarePayment = {
  id?: string;
  order_id?: string;
  status?: string;
};

type SquareWebhookEvent = {
  event_id?: string;
  type?: string;

  data?: {
    object?: {
      payment?: SquarePayment;
    };
  };
};

function verifySquareSignature({
  rawBody,
  signatureHeader,
  signatureKey,
  notificationUrl,
}: {
  rawBody: string;
  signatureHeader: string;
  signatureKey: string;
  notificationUrl: string;
}) {
  const payload = notificationUrl + rawBody;

  const expectedSignature = crypto
    .createHmac("sha256", signatureKey)
    .update(payload, "utf8")
    .digest("base64");

  const expected = Buffer.from(
    expectedSignature,
    "utf8"
  );

  const received = Buffer.from(
    signatureHeader,
    "utf8"
  );

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expected,
    received
  );
}

export async function POST(request: Request) {
  const signatureKey =
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  const notificationUrl =
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

  if (!signatureKey || !notificationUrl) {
    console.error(
      "Square webhook environment variables are missing."
    );

    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  const signatureHeader =
    request.headers.get(
      "x-square-hmacsha256-signature"
    );

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing Square signature." },
      { status: 403 }
    );
  }

  const validSignature =
    verifySquareSignature({
      rawBody,
      signatureHeader,
      signatureKey,
      notificationUrl,
    });

  if (!validSignature) {
    console.error(
      "Rejected Square webhook with invalid signature."
    );

    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 403 }
    );
  }

  let event: SquareWebhookEvent;

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON." },
      { status: 400 }
    );
  }

  // We only need payment.updated for the paid-state flow.
  if (event.type !== "payment.updated") {
    return NextResponse.json({
      received: true,
      ignored: true,
    });
  }

  const eventId = event.event_id;
  const payment =
    event.data?.object?.payment;

  if (!eventId || !payment) {
    console.error(
      "Square payment.updated webhook was missing required data."
    );

    return NextResponse.json(
      { error: "Invalid payment event." },
      { status: 400 }
    );
  }

  // Square sends payment.updated for multiple kinds of
  // changes. Only COMPLETED means the payment is paid.
  if (payment.status !== "COMPLETED") {
    return NextResponse.json({
      received: true,
      ignored: true,
      paymentStatus: payment.status ?? null,
    });
  }

  if (!payment.id || !payment.order_id) {
    return NextResponse.json(
      {
        error:
          "Completed payment is missing payment or order ID.",
      },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc(
    "complete_square_payment",
    {
      p_square_order_id: payment.order_id,
      p_square_payment_id: payment.id,
      p_square_event_id: eventId,
    }
  );

  if (error) {
    console.error(
      "Unable to complete Square payment:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update Port Petals order.",
      },
      { status: 500 }
    );
  }

  if (!data?.ok) {
    console.error(
      "Square payment did not match a Port Petals order:",
      data
    );

    return NextResponse.json(
      {
        error:
          "Square order could not be matched.",
      },
      { status: 404 }
    );
  }

  /*
   * If this payment happened after an abandoned-checkout
   * reminder was sent, mark it as recovered.
   *
   * This runs only after complete_square_payment succeeds,
   * so Square remains authoritative for payment completion.
   *
   * checkout_recovered_at IS NULL makes this idempotent:
   * duplicate Square webhook deliveries cannot create
   * duplicate recovery events.
   */
  try {
    const recoveredAt =
      new Date().toISOString();

    const {
      data: recoveredOrder,
      error: recoveryError,
    } = await supabase
      .from("orders")
      .update({
        checkout_recovered_at:
          recoveredAt,
      })
      .eq(
        "square_order_id",
        payment.order_id
      )
      .not(
        "abandoned_checkout_reminder_sent_at",
        "is",
        null
      )
      .is(
        "checkout_recovered_at",
        null
      )
      .select(
        "id, order_number, total, abandoned_checkout_reminder_sent_at"
      )
      .maybeSingle();

    if (recoveryError) {
      console.error(
        "Unable to mark recovered checkout:",
        recoveryError
      );
    } else if (recoveredOrder) {
      const {
        error: recoveryEventError,
      } = await supabase
        .from("order_events")
        .insert({
          order_id:
            recoveredOrder.id,
          event_type:
            "abandoned_checkout_recovered",
          message:
            "Order payment completed after an abandoned checkout reminder.",
          metadata: {
            recovered_at:
              recoveredAt,
            reminder_sent_at:
              recoveredOrder.abandoned_checkout_reminder_sent_at,
            recovered_revenue:
              Number(
                recoveredOrder.total ??
                  0
              ),
          },
        });

      if (recoveryEventError) {
        console.error(
          "Unable to create checkout recovery event:",
          recoveryEventError
        );
      }
    }
  } catch (recoveryTrackingError) {
    /*
     * Recovery analytics are secondary.
     * They must never cause a successfully paid Square
     * webhook to fail.
     */
    console.error(
      "Checkout recovery tracking failed:",
      recoveryTrackingError
    );
  }

  // Payment completion is authoritative. Email is a
  // secondary notification and must never cause a
  // successfully paid order to fail its Square webhook.
  try {
    const notification =
      await sendOwnerPaidOrderEmail({
        squareOrderId: payment.order_id,
      });

    if (
      !notification.sent &&
      !notification.duplicate
    ) {
      console.error(
        "Owner paid-order email was not sent:",
        notification.error ?? "Unknown email error."
      );
    }
  } catch (notificationError) {
    console.error(
      "Owner paid-order notification failed after payment completion:",
      notificationError
    );
  }

  try {
    const customerNotification =
      await sendCustomerPaidOrderEmail({
        squareOrderId: payment.order_id,
      });

    if (
      !customerNotification.sent &&
      !customerNotification.duplicate
    ) {
      console.error(
        "Customer paid-order email was not sent:",
        customerNotification.error ??
          "Unknown email error."
      );
    }
  } catch (notificationError) {
    console.error(
      "Customer paid-order confirmation failed after payment completion:",
      notificationError
    );
  }

  return NextResponse.json({
    received: true,
    processed: !data.duplicate,
    duplicate: Boolean(data.duplicate),
    orderNumber: data.order_number ?? null,
  });
}
