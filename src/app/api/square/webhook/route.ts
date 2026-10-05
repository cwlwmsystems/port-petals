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

function normalizeMarketingEmail(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function normalizeMarketingPhone(
  value: string
) {
  const digits =
    value.replace(
      /\D/g,
      ""
    );

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("1")
  ) {
    return `+${digits}`;
  }

  return value.trim();
}

function splitCustomerName(
  value: string
) {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  return {
    firstName:
      parts[0] ?? null,

    lastName:
      parts.length > 1
        ? parts
            .slice(1)
            .join(" ")
        : null,
  };
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
   * CUSTOMER CRM
   *
   * Square payment completion is authoritative.
   * Only after complete_square_payment succeeds do we promote
   * the checkout contact from prospect to customer.
   *
   * Metrics are recalculated from paid orders instead of
   * incremented. This keeps duplicate Square webhooks from
   * inflating order_count or lifetime_value.
   *
   * CRM synchronization is secondary and must never cause a
   * successfully completed payment webhook to fail.
   */
  try {
    const {
      data: paidOrder,
      error: paidOrderError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        total,
        paid_at
      `)
      .eq(
        "square_order_id",
        payment.order_id
      )
      .eq(
        "payment_status",
        "paid"
      )
      .maybeSingle();

    if (paidOrderError) {
      throw paidOrderError;
    }

    if (
      paidOrder &&
      paidOrder.customer_email
    ) {
      const normalizedEmail =
        normalizeMarketingEmail(
          paidOrder.customer_email
        );

      const normalizedPhone =
        paidOrder.customer_phone
          ? normalizeMarketingPhone(
              paidOrder.customer_phone
            )
          : null;

      const {
        firstName,
        lastName,
      } =
        splitCustomerName(
          paidOrder.customer_name ??
            ""
        );

      /*
       * Recalculate customer totals from authoritative paid
       * orders. Checkout attempts that never become paid are
       * deliberately excluded.
       */
      const {
        data: paidOrders,
        error: paidOrdersError,
      } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          paid_at
        `)
        .eq(
          "payment_status",
          "paid"
        )
        .ilike(
          "customer_email",
          normalizedEmail
        )
        .not(
          "paid_at",
          "is",
          null
        )
        .order(
          "paid_at",
          {
            ascending: true,
          }
        );

      if (paidOrdersError) {
        throw paidOrdersError;
      }

      const customerOrders =
        paidOrders ?? [];

      const orderCount =
        customerOrders.length;

      const lifetimeValue =
        customerOrders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.total ??
                0
            ),
          0
        );

      const firstOrderAt =
        customerOrders[0]
          ?.paid_at ??
        paidOrder.paid_at ??
        new Date().toISOString();

      const lastOrderAt =
        customerOrders[
          customerOrders.length - 1
        ]?.paid_at ??
        paidOrder.paid_at ??
        firstOrderAt;

      const {
        data: existingContact,
        error: contactLookupError,
      } = await supabase
        .from(
          "marketing_contacts"
        )
        .select(`
          id,
          email,
          phone
        `)
        .ilike(
          "email",
          normalizedEmail
        )
        .maybeSingle();

      if (contactLookupError) {
        throw contactLookupError;
      }

      let contactId:
        | string
        | null =
        existingContact?.id ??
        null;

      if (existingContact) {
        /*
         * Do not touch marketing consent here.
         * Payment changes customer status and customer metrics,
         * not marketing permission.
         */
        const {
          error: updateContactError,
        } = await supabase
          .from(
            "marketing_contacts"
          )
          .update({
            email:
              normalizedEmail,

            first_name:
              firstName,

            last_name:
              lastName,

            contact_type:
              "customer",

            first_order_at:
              firstOrderAt,

            last_order_at:
              lastOrderAt,

            order_count:
              orderCount,

            lifetime_value:
              lifetimeValue,
          })
          .eq(
            "id",
            existingContact.id
          );

        if (updateContactError) {
          throw updateContactError;
        }
      } else {
        /*
         * This fallback covers older orders or any case where
         * checkout CRM synchronization failed. Marketing
         * consent defaults to false.
         */
        const {
          data: createdContact,
          error: createContactError,
        } = await supabase
          .from(
            "marketing_contacts"
          )
          .insert({
            email:
              normalizedEmail,

            phone:
              normalizedPhone,

            first_name:
              firstName,

            last_name:
              lastName,

            contact_type:
              "customer",

            source:
              "paid_order",

            first_order_at:
              firstOrderAt,

            last_order_at:
              lastOrderAt,

            order_count:
              orderCount,

            lifetime_value:
              lifetimeValue,

            email_marketing_consent:
              false,

            sms_marketing_consent:
              false,
          })
          .select("id")
          .single();

        if (
          createContactError ||
          !createdContact
        ) {
          throw (
            createContactError ??
            new Error(
              "Unable to create paid customer CRM record."
            )
          );
        }

        contactId =
          createdContact.id;
      }

      if (contactId) {
        /*
         * Keep the latest phone number when it is safe to do so.
         * Phone has its own unique index, so a collision should
         * not prevent the rest of the customer metrics above
         * from being saved.
         */
        if (
          normalizedPhone &&
          existingContact &&
          existingContact.phone !==
            normalizedPhone
        ) {
          const {
            data: phoneOwner,
            error: phoneOwnerError,
          } = await supabase
            .from(
              "marketing_contacts"
            )
            .select("id")
            .eq(
              "phone",
              normalizedPhone
            )
            .maybeSingle();

          if (
            phoneOwnerError
          ) {
            console.error(
              "Unable to check CRM phone ownership:",
              phoneOwnerError
            );
          } else if (
            !phoneOwner ||
            phoneOwner.id ===
              contactId
          ) {
            const {
              error:
                phoneUpdateError,
            } =
              await supabase
                .from(
                  "marketing_contacts"
                )
                .update({
                  phone:
                    normalizedPhone,
                })
                .eq(
                  "id",
                  contactId
                );

            if (
              phoneUpdateError
            ) {
              console.error(
                "Unable to update CRM phone:",
                phoneUpdateError
              );
            }
          }
        }
      }
    }
  } catch (customerCrmError) {
    console.error(
      "Unable to synchronize paid customer CRM record:",
      customerCrmError
    );
  }

  /*
   * AUTOMATIC CUSTOMER INTERESTS
   *
   * After a confirmed Square payment, derive CRM interests
   * from the departments of products actually purchased.
   *
   * This only adds interests. It never removes manual tags.
   * The contact_id + interest primary key makes this
   * idempotent across duplicate Square webhook deliveries.
   */
  try {
    const allowedInterests =
      new Set([
        "flowers",
        "gifts-decor",
        "apparel",
        "gator-gear",
        "seasonal",
        "weddings-events",
      ]);

    const {
      data: interestOrder,
      error: interestOrderError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        customer_email
      `)
      .eq(
        "square_order_id",
        payment.order_id
      )
      .eq(
        "payment_status",
        "paid"
      )
      .maybeSingle();

    if (interestOrderError) {
      throw interestOrderError;
    }

    if (
      interestOrder?.id &&
      interestOrder.customer_email
    ) {
      const normalizedEmail =
        interestOrder.customer_email
          .trim()
          .toLowerCase();

      const {
        data: contact,
        error: contactError,
      } = await supabase
        .from(
          "marketing_contacts"
        )
        .select("id")
        .ilike(
          "email",
          normalizedEmail
        )
        .maybeSingle();

      if (contactError) {
        throw contactError;
      }

      if (contact) {
        const {
          data: orderItems,
          error: orderItemsError,
        } = await supabase
          .from("order_items")
          .select("product_id")
          .eq(
            "order_id",
            interestOrder.id
          );

        if (orderItemsError) {
          throw orderItemsError;
        }

        const productIds =
          Array.from(
            new Set(
              (
                orderItems ?? []
              )
                .map(
                  (item) =>
                    item.product_id
                )
                .filter(Boolean)
            )
          );

        if (
          productIds.length >
          0
        ) {
          const {
            data: products,
            error: productsError,
          } = await supabase
            .from("products")
            .select(`
              id,
              department
            `)
            .in(
              "id",
              productIds
            );

          if (productsError) {
            throw productsError;
          }

          const interests =
            Array.from(
              new Set(
                (
                  products ?? []
                )
                  .map(
                    (product) =>
                      product.department
                  )
                  .filter(
                    (
                      department
                    ): department is string =>
                      Boolean(
                        department &&
                        allowedInterests.has(
                          department
                        )
                      )
                  )
              )
            );

          if (
            interests.length >
            0
          ) {
            const {
              error:
                interestInsertError,
            } = await supabase
              .from(
                "marketing_contact_interests"
              )
              .upsert(
                interests.map(
                  (
                    interest
                  ) => ({
                    contact_id:
                      contact.id,

                    interest,

                    source:
                      "paid_order",
                  })
                ),
                {
                  onConflict:
                    "contact_id,interest",

                  ignoreDuplicates:
                    true,
                }
              );

            if (
              interestInsertError
            ) {
              throw interestInsertError;
            }
          }
        }
      }
    }
  } catch (
    customerInterestError
  ) {
    /*
     * CRM segmentation is secondary.
     * It must never cause a successfully completed Square
     * payment webhook to fail.
     */
    console.error(
      "Unable to assign customer purchase interests:",
      customerInterestError
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
