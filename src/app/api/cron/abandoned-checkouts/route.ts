import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";

const FROM_EMAIL =
  "Port Petals <orders@portpetals.com>";

const OWNER_EMAIL =
  "stacy@portpetals.com";

const ONE_HOUR_MS =
  60 * 60 * 1000;

const CLAIM_STALE_MS =
  30 * 60 * 1000;

function escapeHtml(
  value: string
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(
  value: number | string | null
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(Number(value ?? 0));
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${value}T12:00:00Z`
    )
  );
}

function formatVariant(
  item: {
    variant_name:
      | string
      | null;
    garment_type:
      | string
      | null;
    size:
      | string
      | null;
    color:
      | string
      | null;
  }
) {
  const details = [
    item.garment_type,
    item.color,
    item.size,
  ].filter(Boolean);

  if (
    details.length > 0
  ) {
    return details.join(
      " / "
    );
  }

  return (
    item.variant_name ??
    ""
  );
}

function errorText(
  value: unknown
) {
  if (
    value instanceof Error
  ) {
    return value.message.slice(
      0,
      2000
    );
  }

  if (
    typeof value ===
    "string"
  ) {
    return value.slice(
      0,
      2000
    );
  }

  try {
    return JSON.stringify(
      value
    ).slice(0, 2000);
  } catch {
    return "Unknown email error";
  }
}

export async function POST(
  request: Request
) {
  const secret =
    process.env
      .ABANDONED_CHECKOUT_CRON_SECRET;

  const authorization =
    request.headers.get(
      "authorization"
    );

  if (
    !secret ||
    authorization !==
      `Bearer ${secret}`
  ) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const supabase =
    createAdminClient();

  const now =
    new Date();

  const cutoff =
    new Date(
      now.getTime() -
        ONE_HOUR_MS
    ).toISOString();

  const staleClaimCutoff =
    new Date(
      now.getTime() -
        CLAIM_STALE_MS
    ).toISOString();

  const {
    data: candidates,
    error: candidateError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      status,
      payment_status,
      fulfillment_type,
      requested_fulfillment_date,
      subtotal,
      delivery_fee,
      total,
      square_checkout_url,
      checkout_created_at,
      abandoned_checkout_reminder_sent_at,
      abandoned_checkout_reminder_claimed_at,
      abandoned_checkout_reminder_count,
      order_items (
        product_name,
        quantity,
        variant_name,
        garment_type,
        size,
        color
      )
    `)
    .eq(
      "status",
      "awaiting_payment"
    )
    .eq(
      "payment_status",
      "unpaid"
    )
    .not(
      "square_checkout_url",
      "is",
      null
    )
    .not(
      "checkout_created_at",
      "is",
      null
    )
    .lte(
      "checkout_created_at",
      cutoff
    )
    .is(
      "abandoned_checkout_reminder_sent_at",
      null
    )
    .order(
      "checkout_created_at",
      {
        ascending: true,
      }
    )
    .limit(25);

  if (candidateError) {
    console.error(
      "Unable to load abandoned checkout candidates:",
      candidateError
    );

    return NextResponse.json(
      {
        error:
          "Unable to load abandoned checkouts.",
      },
      {
        status: 500,
      }
    );
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (
    const order of
      candidates ?? []
  ) {
    if (
      !order.customer_email ||
      !order.square_checkout_url
    ) {
      skipped += 1;
      continue;
    }

    /*
     * Claim this order before sending.
     *
     * A stale claim may be reclaimed after 30 minutes,
     * which protects against an interrupted scheduler run.
     */
    let claimQuery =
      supabase
        .from("orders")
        .update({
          abandoned_checkout_reminder_claimed_at:
            now.toISOString(),
        })
        .eq(
          "id",
          order.id
        )
        .eq(
          "status",
          "awaiting_payment"
        )
        .eq(
          "payment_status",
          "unpaid"
        )
        .is(
          "abandoned_checkout_reminder_sent_at",
          null
        );

    if (
      order.abandoned_checkout_reminder_claimed_at
    ) {
      if (
        order.abandoned_checkout_reminder_claimed_at >
        staleClaimCutoff
      ) {
        skipped += 1;
        continue;
      }

      claimQuery =
        claimQuery.eq(
          "abandoned_checkout_reminder_claimed_at",
          order.abandoned_checkout_reminder_claimed_at
        );
    } else {
      claimQuery =
        claimQuery.is(
          "abandoned_checkout_reminder_claimed_at",
          null
        );
    }

    const {
      data: claimed,
      error: claimError,
    } =
      await claimQuery
        .select(
          "id"
        )
        .maybeSingle();

    if (
      claimError ||
      !claimed
    ) {
      skipped += 1;
      continue;
    }

    /*
     * Re-check the authoritative payment state after
     * claiming and immediately before email delivery.
     */
    const {
      data: current,
      error: currentError,
    } =
      await supabase
        .from("orders")
        .select(
          "id, status, payment_status, square_checkout_url"
        )
        .eq(
          "id",
          order.id
        )
        .maybeSingle();

    if (
      currentError ||
      !current ||
      current.status !==
        "awaiting_payment" ||
      current.payment_status !==
        "unpaid" ||
      !current.square_checkout_url
    ) {
      await supabase
        .from("orders")
        .update({
          abandoned_checkout_reminder_claimed_at:
            null,
        })
        .eq(
          "id",
          order.id
        );

      skipped += 1;
      continue;
    }

    const items =
      order.order_items ??
      [];

    const itemRows =
      items
        .map(
          (item) => {
            const variant =
              formatVariant(
                item
              );

            return `
              <tr>
                <td
                  style="
                    padding:12px 0;
                    border-bottom:1px solid #ece6dd;
                  "
                >
                  <strong
                    style="
                      color:#153f32;
                    "
                  >
                    ${escapeHtml(
                      item.product_name
                    )}
                  </strong>

                  ${
                    variant
                      ? `
                        <div
                          style="
                            margin-top:4px;
                            color:#607068;
                            font-size:13px;
                          "
                        >
                          ${escapeHtml(
                            variant
                          )}
                        </div>
                      `
                      : ""
                  }
                </td>

                <td
                  align="right"
                  style="
                    padding:12px 0;
                    border-bottom:1px solid #ece6dd;
                    color:#607068;
                  "
                >
                  Qty ${item.quantity}
                </td>
              </tr>
            `;
          }
        )
        .join("");

    const fulfillmentLabel =
      order.fulfillment_type ===
      "delivery"
        ? "Delivery"
        : "Pickup";

    const html = `
      <div
        style="
          margin:0 auto;
          max-width:680px;
          font-family:Arial,sans-serif;
          line-height:1.6;
          color:#284239;
        "
      >
        <div
          style="
            padding:28px;
            border-radius:18px;
            background:#f7f1e8;
          "
        >
          <p
            style="
              margin:0;
              color:#e76d61;
              font-size:12px;
              font-weight:700;
              text-transform:uppercase;
              letter-spacing:2px;
            "
          >
            Your Port Petals Order
          </p>

          <h1
            style="
              margin:8px 0 0;
              color:#153f32;
              font-size:28px;
            "
          >
            Your checkout is still waiting
          </h1>

          <p
            style="
              margin-top:16px;
            "
          >
            Hi ${escapeHtml(
              order.customer_name
            )},
          </p>

          <p>
            You started order
            <strong>
              ${escapeHtml(
                order.order_number
              )}
            </strong>
            but payment has not been completed.
          </p>

          <p>
            If you would still like the order,
            you can return to your secure Square
            checkout below and pick up where you
            left off.
          </p>

          <div
            style="
              margin:26px 0;
              text-align:center;
            "
          >
            <a
              href="${escapeHtml(
                current.square_checkout_url
              )}"
              style="
                display:inline-block;
                padding:14px 24px;
                border-radius:999px;
                background:#e76d61;
                color:#ffffff;
                font-weight:700;
                text-decoration:none;
              "
            >
              Complete My Order
            </a>
          </div>

          <p
            style="
              margin-top:18px;
              color:#607068;
              font-size:13px;
            "
          >
            Your order is not confirmed until
            payment is successfully completed.
          </p>
        </div>

        <div
          style="
            margin-top:22px;
            padding:22px;
            border:1px solid #e5ddd3;
            border-radius:16px;
          "
        >
          <h2
            style="
              margin:0;
              color:#153f32;
              font-size:20px;
            "
          >
            Order Summary
          </h2>

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              margin-top:10px;
              border-collapse:collapse;
            "
          >
            ${itemRows}
          </table>

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              margin-top:18px;
              border-collapse:collapse;
            "
          >
            <tr>
              <td
                style="
                  padding:5px 0;
                  color:#607068;
                "
              >
                Merchandise
              </td>

              <td
                align="right"
                style="
                  padding:5px 0;
                  color:#153f32;
                "
              >
                ${formatMoney(
                  order.subtotal
                )}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:5px 0;
                  color:#607068;
                "
              >
                Delivery
              </td>

              <td
                align="right"
                style="
                  padding:5px 0;
                  color:#153f32;
                "
              >
                ${formatMoney(
                  order.delivery_fee
                )}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0 0;
                  border-top:1px solid #ece6dd;
                  color:#153f32;
                  font-weight:700;
                "
              >
                Total
              </td>

              <td
                align="right"
                style="
                  padding:12px 0 0;
                  border-top:1px solid #ece6dd;
                  color:#e76d61;
                  font-weight:700;
                "
              >
                ${formatMoney(
                  order.total
                )}
              </td>
            </tr>
          </table>

          <p
            style="
              margin:18px 0 0;
              color:#607068;
              font-size:14px;
            "
          >
            <strong
              style="
                color:#153f32;
              "
            >
              ${fulfillmentLabel} date:
            </strong>
            ${formatDate(
              order.requested_fulfillment_date
            )}
          </p>
        </div>

        <p
          style="
            margin-top:22px;
            text-align:center;
            color:#607068;
            font-size:13px;
          "
        >
          Questions? Reply to this email or call
          814-642-1253.
          <br><br>
          Port Petals<br>
          430 E Arnold Avenue<br>
          Port Allegany, PA 16743
        </p>
      </div>
    `;

    const {
      error: emailError,
    } =
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [
          order.customer_email,
        ],
        replyTo:
          OWNER_EMAIL,
        subject:
          `Complete your Port Petals order ${order.order_number}`,
        html,
      });

    if (emailError) {
      console.error(
        "Abandoned checkout email error:",
        order.order_number,
        emailError
      );

      await supabase
        .from("orders")
        .update({
          abandoned_checkout_reminder_claimed_at:
            null,
        })
        .eq(
          "id",
          order.id
        );

      await supabase
        .from("order_events")
        .insert({
          order_id:
            order.id,
          event_type:
            "abandoned_checkout_reminder_failed",
          message:
            "Abandoned checkout reminder could not be sent.",
          metadata: {
            error:
              errorText(
                emailError
              ),
          },
        });

      failed += 1;
      continue;
    }

    const {
      error: updateError,
    } =
      await supabase
        .from("orders")
        .update({
          abandoned_checkout_reminder_sent_at:
            new Date().toISOString(),

          abandoned_checkout_reminder_claimed_at:
            null,

          abandoned_checkout_reminder_count:
            Number(
              order.abandoned_checkout_reminder_count ??
                0
            ) + 1,
        })
        .eq(
          "id",
          order.id
        );

    if (updateError) {
      console.error(
        "Unable to record abandoned checkout reminder:",
        order.order_number,
        updateError
      );
    }

    await supabase
      .from("order_events")
      .insert({
        order_id:
          order.id,
        event_type:
          "abandoned_checkout_reminder_sent",
        message:
          "Abandoned checkout reminder sent to customer.",
        metadata: {
          customer_email:
            order.customer_email,
          checkout_created_at:
            order.checkout_created_at,
        },
      });

    sent += 1;
  }

  return NextResponse.json({
    ok: true,
    checked:
      candidates?.length ??
      0,
    sent,
    skipped,
    failed,
  });
}
