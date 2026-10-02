import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  return NextResponse.json({
    received: true,
    processed: !data.duplicate,
    duplicate: Boolean(data.duplicate),
    orderNumber: data.order_number ?? null,
  });
}
