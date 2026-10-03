import { resend } from "@/lib/email/resend";
import { createAdminClient } from "@/lib/supabase/admin";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatFulfillmentDate(
  value: string | null
) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(
    new Date(`${value}T12:00:00Z`)
  );
}

type SendOwnerPaidOrderEmailArgs = {
  squareOrderId: string;
};

export async function sendOwnerPaidOrderEmail({
  squareOrderId,
}: SendOwnerPaidOrderEmailArgs) {
  const recipient =
    process.env.ORDER_NOTIFICATION_EMAIL;

  if (!recipient) {
    throw new Error(
      "ORDER_NOTIFICATION_EMAIL is not configured."
    );
  }

  const supabase = createAdminClient();

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        fulfillment_type,
        requested_fulfillment_date,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip,
        subtotal,
        delivery_fee,
        tax_amount,
        total,
        notes,
        order_items (
          product_name,
          quantity,
          unit_price,
          line_total,
          variant_name,
          garment_type,
          size,
          color,
          player_name,
          player_number,
          customization
        )
      `)
      .eq("square_order_id", squareOrderId)
      .maybeSingle();

  if (orderError || !order) {
    throw new Error(
      "Unable to load paid order for owner notification."
    );
  }

  const notificationType = "owner_paid_order";

  const { data: existing } = await supabase
    .from("order_notifications")
    .select("id, status")
    .eq("order_id", order.id)
    .eq("notification_type", notificationType)
    .eq("recipient", recipient)
    .maybeSingle();

  if (existing?.status === "sent") {
    return {
      sent: false,
      duplicate: true,
    };
  }

  let notificationId = existing?.id;

  if (!notificationId) {
    const { data: created, error: createError } =
      await supabase
        .from("order_notifications")
        .insert({
          order_id: order.id,
          notification_type: notificationType,
          recipient,
          status: "pending",
        })
        .select("id")
        .single();

    if (createError) {
      // Another webhook may have created the same
      // notification between our read and insert.
      const { data: raced } = await supabase
        .from("order_notifications")
        .select("id, status")
        .eq("order_id", order.id)
        .eq("notification_type", notificationType)
        .eq("recipient", recipient)
        .maybeSingle();

      if (raced?.status === "sent") {
        return {
          sent: false,
          duplicate: true,
        };
      }

      notificationId = raced?.id;
    } else {
      notificationId = created.id;
    }
  }

  if (!notificationId) {
    throw new Error(
      "Unable to create notification record."
    );
  }

  const itemHtml = (order.order_items ?? [])
    .map((item) => {
      const details = [
        item.variant_name,
        item.garment_type,
        item.color,
        item.size,
      ]
        .filter(Boolean)
        .map(escapeEmailHtml);

      const personalization = [
        item.player_name
          ? `Name: ${escapeEmailHtml(
              item.player_name
            )}`
          : null,
        item.player_number
          ? `Number: ${escapeEmailHtml(
              item.player_number
            )}`
          : null,
      ].filter(Boolean);

      const customizations = Object.entries(
        item.customization ?? {}
      )
        .map(
          ([key, value]) =>
            `${escapeEmailHtml(
              key
            )}: ${escapeEmailHtml(value)}`
        )
        .join("<br>");

      return `
        <div style="margin:0 0 18px;padding:16px;border:1px solid #e6e0d8;border-radius:12px;">
          <strong>${escapeEmailHtml(
            item.product_name
          )}</strong>
          <div>Quantity: ${escapeEmailHtml(
            item.quantity
          )}</div>

          ${
            details.length
              ? `<div>${details.join(" / ")}</div>`
              : ""
          }

          ${
            personalization.length
              ? `<div>${personalization.join("<br>")}</div>`
              : ""
          }

          ${
            customizations
              ? `<div style="margin-top:6px;">${customizations}</div>`
              : ""
          }

          <div style="margin-top:6px;">
            ${formatPrice(Number(item.line_total))}
          </div>
        </div>
      `;
    })
    .join("");

  const deliveryAddress =
    order.fulfillment_type === "delivery"
      ? [
          order.delivery_address,
          order.delivery_city,
          order.delivery_state,
          order.delivery_zip,
        ]
          .filter(Boolean)
          .map(escapeEmailHtml)
          .join(", ")
      : null;

  try {
    const { data, error } =
      await resend.emails.send({
        from:
          "Port Petals <orders@portpetals.com>",

        to: [recipient],

        replyTo:
          "stacy@portpetals.com",

        subject:
          `New Paid Order — ${order.order_number}`,

        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#284239;max-width:680px;margin:auto;">
            <h1 style="color:#153f32;">
              New Port Petals Order
            </h1>

            <p>
              <strong>Order:</strong>
              ${escapeEmailHtml(
                order.order_number
              )}
            </p>

            <p>
              <strong>Customer:</strong>
              ${escapeEmailHtml(
                order.customer_name
              )}
              <br>
              <strong>Email:</strong>
              ${escapeEmailHtml(
                order.customer_email
              )}
              <br>
              <strong>Phone:</strong>
              ${escapeEmailHtml(
                order.customer_phone
              )}
            </p>

            <p>
              <strong>Fulfillment:</strong>
              ${escapeEmailHtml(
                order.fulfillment_type
              )}

              ${
                formatFulfillmentDate(
                  order.requested_fulfillment_date
                )
                  ? `
                    <br>
                    <strong>
                      Requested ${
                        order.fulfillment_type === "pickup"
                          ? "Pickup"
                          : "Delivery"
                      } Date:
                    </strong>
                    ${escapeEmailHtml(
                      formatFulfillmentDate(
                        order.requested_fulfillment_date
                      )
                    )}
                  `
                  : ""
              }

              ${
                deliveryAddress
                  ? `<br><strong>Delivery Address:</strong> ${deliveryAddress}`
                  : ""
              }
            </p>

            <h2 style="color:#153f32;">
              Items
            </h2>

            ${itemHtml}

            <div style="margin-top:24px;border-top:1px solid #e6e0d8;padding-top:16px;">
              <div>
                Merchandise:
                <strong>${formatPrice(Number(order.subtotal))}</strong>
              </div>

              ${
                Number(order.delivery_fee) > 0
                  ? `
                    <div>
                      Delivery:
                      <strong>${formatPrice(Number(order.delivery_fee))}</strong>
                    </div>
                  `
                  : ""
              }

              ${
                Number(order.tax_amount) > 0
                  ? `
                    <div>
                      Tax:
                      <strong>${formatPrice(Number(order.tax_amount))}</strong>
                    </div>
                  `
                  : ""
              }

              <div style="font-size:20px;margin-top:8px;">
                Total:
                <strong>
                  ${formatPrice(Number(order.total))}
                </strong>
              </div>
            </div>

            ${
              order.notes
                ? `
                  <div style="margin-top:24px;">
                    <strong>Customer Notes</strong>
                    <p>${escapeEmailHtml(
                      order.notes
                    )}</p>
                  </div>
                `
                : ""
            }

            <p style="margin-top:28px;">
              Sign in to the Port Petals admin area
              to manage this order.
            </p>
          </div>
        `,
      });

    if (error) {
      throw new Error(error.message);
    }

    await supabase
      .from("order_notifications")
      .update({
        status: "sent",
        provider_message_id:
          data?.id ?? null,
        error_message: null,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type:
          "owner_paid_notification_sent",
        message:
          "Paid order notification emailed to Port Petals.",
        metadata: {
          recipient,
          provider_message_id:
            data?.id ?? null,
        },
      });

    return {
      sent: true,
      duplicate: false,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown notification error.";

    await supabase
      .from("order_notifications")
      .update({
        status: "failed",
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    console.error(
      "Owner order notification failed:",
      error
    );

    return {
      sent: false,
      duplicate: false,
      error: message,
    };
  }
}

type SendCustomerPaidOrderEmailArgs = {
  squareOrderId: string;
};

function escapeEmailHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendCustomerPaidOrderEmail({
  squareOrderId,
}: SendCustomerPaidOrderEmailArgs) {
  const supabase = createAdminClient();

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        fulfillment_type,
        requested_fulfillment_date,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip,
        subtotal,
        delivery_fee,
        tax_amount,
        total,
        notes,
        order_items (
          product_name,
          quantity,
          unit_price,
          line_total,
          variant_name,
          garment_type,
          size,
          color,
          player_name,
          player_number,
          customization
        )
      `)
      .eq("square_order_id", squareOrderId)
      .maybeSingle();

  if (orderError || !order) {
    throw new Error(
      "Unable to load paid order for customer confirmation."
    );
  }

  const recipient =
    order.customer_email?.trim();

  if (!recipient) {
    throw new Error(
      "Paid order does not have a customer email address."
    );
  }

  const notificationType =
    "customer_paid_order";

  const { data: existing } = await supabase
    .from("order_notifications")
    .select("id, status")
    .eq("order_id", order.id)
    .eq("notification_type", notificationType)
    .eq("recipient", recipient)
    .maybeSingle();

  if (existing?.status === "sent") {
    return {
      sent: false,
      duplicate: true,
    };
  }

  let notificationId = existing?.id;

  if (!notificationId) {
    const { data: created, error: createError } =
      await supabase
        .from("order_notifications")
        .insert({
          order_id: order.id,
          notification_type:
            notificationType,
          recipient,
          status: "pending",
        })
        .select("id")
        .single();

    if (createError) {
      const { data: raced } = await supabase
        .from("order_notifications")
        .select("id, status")
        .eq("order_id", order.id)
        .eq(
          "notification_type",
          notificationType
        )
        .eq("recipient", recipient)
        .maybeSingle();

      if (raced?.status === "sent") {
        return {
          sent: false,
          duplicate: true,
        };
      }

      notificationId = raced?.id;
    } else {
      notificationId = created.id;
    }
  }

  if (!notificationId) {
    throw new Error(
      "Unable to create customer notification record."
    );
  }

  const itemHtml = (order.order_items ?? [])
    .map((item) => {
      const details = [
        item.variant_name,
        item.garment_type,
        item.color,
        item.size,
      ]
        .filter(Boolean)
        .map(escapeEmailHtml);

      const personalization = [
        item.player_name
          ? `Name: ${escapeEmailHtml(
              item.player_name
            )}`
          : null,
        item.player_number
          ? `Number: ${escapeEmailHtml(
              item.player_number
            )}`
          : null,
      ].filter(Boolean);

      const customizations = Object.entries(
        item.customization ?? {}
      )
        .map(
          ([key, value]) =>
            `${escapeEmailHtml(
              key
            )}: ${escapeEmailHtml(value)}`
        )
        .join("<br>");

      return `
        <div style="margin:0 0 16px;padding:16px;border:1px solid #e6e0d8;border-radius:12px;background:#fffdf9;">
          <strong style="color:#153f32;">
            ${escapeEmailHtml(
              item.product_name
            )}
          </strong>

          <div style="margin-top:6px;">
            Quantity:
            ${escapeEmailHtml(item.quantity)}
          </div>

          ${
            details.length
              ? `<div style="margin-top:4px;">${details.join(
                  " / "
                )}</div>`
              : ""
          }

          ${
            personalization.length
              ? `<div style="margin-top:6px;">${personalization.join(
                  "<br>"
                )}</div>`
              : ""
          }

          ${
            customizations
              ? `<div style="margin-top:6px;">${customizations}</div>`
              : ""
          }

          <div style="margin-top:8px;font-weight:600;">
            ${formatPrice(
              Number(item.line_total)
            )}
          </div>
        </div>
      `;
    })
    .join("");

  const deliveryAddress =
    order.fulfillment_type === "delivery"
      ? [
          order.delivery_address,
          order.delivery_city,
          order.delivery_state,
          order.delivery_zip,
        ]
          .filter(Boolean)
          .map(escapeEmailHtml)
          .join(", ")
      : null;

  try {
    const { data, error } =
      await resend.emails.send({
        from:
          "Port Petals <orders@portpetals.com>",

        to: [recipient],

        replyTo:
          "stacy@portpetals.com",

        subject:
          `Your Port Petals Order Is Confirmed — ${order.order_number}`,

        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#284239;max-width:680px;margin:auto;">
            <div style="padding:26px;border-radius:18px;background:#f7f1e8;">
              <p style="margin:0;color:#e76d61;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
                Payment Confirmed
              </p>

              <h1 style="margin:8px 0 0;color:#153f32;">
                Thank you for your order!
              </h1>

              <p style="margin-top:16px;">
                Hi ${escapeEmailHtml(
                  order.customer_name
                )},
              </p>

              <p>
                Your payment has been received and your
                Port Petals order is confirmed.
              </p>

              <p>
                <strong>Order:</strong>
                ${escapeEmailHtml(
                  order.order_number
                )}
              </p>

              <p>
                <strong>Fulfillment:</strong>
                ${escapeEmailHtml(
                  order.fulfillment_type
                )}

                ${
                  formatFulfillmentDate(
                    order.requested_fulfillment_date
                  )
                    ? `
                      <br>
                      <strong>
                        Requested ${
                          order.fulfillment_type === "pickup"
                            ? "Pickup"
                            : "Delivery"
                        } Date:
                      </strong>
                      ${escapeEmailHtml(
                        formatFulfillmentDate(
                          order.requested_fulfillment_date
                        )
                      )}
                    `
                    : ""
                }

                ${
                  deliveryAddress
                    ? `<br><strong>Delivery Address:</strong> ${deliveryAddress}`
                    : `
                      <br>
                      <strong>Pickup:</strong>
                      430 E Arnold Avenue,
                      Port Allegany, PA 16743
                    `
                }
              </p>

              <h2 style="margin-top:28px;color:#153f32;">
                Your Items
              </h2>

              ${itemHtml}

              <div style="margin-top:24px;border-top:1px solid #d8d2ca;padding-top:16px;">
                <div>
                  Merchandise:
                  <strong>
                    ${formatPrice(
                      Number(order.subtotal)
                    )}
                  </strong>
                </div>

                ${
                  Number(order.delivery_fee) > 0
                    ? `
                      <div>
                        Delivery:
                        <strong>
                          ${formatPrice(
                            Number(
                              order.delivery_fee
                            )
                          )}
                        </strong>
                      </div>
                    `
                    : ""
                }

                ${
                  Number(order.tax_amount) > 0
                    ? `
                      <div>
                        Tax:
                        <strong>
                          ${formatPrice(
                            Number(
                              order.tax_amount
                            )
                          )}
                        </strong>
                      </div>
                    `
                    : ""
                }

                <div style="margin-top:10px;font-size:20px;color:#153f32;">
                  Total Paid:
                  <strong>
                    ${formatPrice(
                      Number(order.total)
                    )}
                  </strong>
                </div>
              </div>

              ${
                order.notes
                  ? `
                    <div style="margin-top:24px;">
                      <strong>
                        Order Notes
                      </strong>
                      <p>
                        ${escapeEmailHtml(
                          order.notes
                        )}
                      </p>
                    </div>
                  `
                  : ""
              }

              <div style="margin-top:28px;padding:16px;border-radius:12px;background:#edf3e7;color:#36594c;">
                If you have questions about your order,
                contact Port Petals at
                <strong>814-642-1253</strong> or reply
                to this email.
              </div>

              <p style="margin-top:28px;font-size:13px;color:#718078;">
                Port Petals<br>
                430 E Arnold Avenue<br>
                Port Allegany, PA 16743
              </p>
            </div>
          </div>
        `,
      });

    if (error) {
      throw new Error(error.message);
    }

    await supabase
      .from("order_notifications")
      .update({
        status: "sent",
        provider_message_id:
          data?.id ?? null,
        error_message: null,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type:
          "customer_paid_confirmation_sent",
        message:
          "Paid order confirmation emailed to customer.",
        metadata: {
          recipient,
          provider_message_id:
            data?.id ?? null,
        },
      });

    return {
      sent: true,
      duplicate: false,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown notification error.";

    await supabase
      .from("order_notifications")
      .update({
        status: "failed",
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    console.error(
      "Customer order confirmation failed:",
      error
    );

    return {
      sent: false,
      duplicate: false,
      error: message,
    };
  }
}

type CustomerLifecycleStatus =
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

type SendCustomerOrderStatusEmailArgs = {
  orderId: string;
  status: CustomerLifecycleStatus;
};

export async function sendCustomerOrderStatusEmail({
  orderId,
  status,
}: SendCustomerOrderStatusEmailArgs) {
  const supabase = createAdminClient();

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        customer_name,
        customer_email,
        fulfillment_type,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip
      `)
      .eq("id", orderId)
      .maybeSingle();

  if (orderError || !order) {
    throw new Error(
      "Unable to load order for status notification."
    );
  }

  if (order.status !== status) {
    throw new Error(
      "Order status no longer matches the requested notification."
    );
  }

  const recipient =
    order.customer_email?.trim();

  if (!recipient) {
    throw new Error(
      "Order does not have a customer email address."
    );
  }

  const notificationType =
    `customer_status_${status}`;

  const { data: existing } = await supabase
    .from("order_notifications")
    .select("id, status")
    .eq("order_id", order.id)
    .eq(
      "notification_type",
      notificationType
    )
    .eq("recipient", recipient)
    .maybeSingle();

  if (existing?.status === "sent") {
    return {
      sent: false,
      duplicate: true,
    };
  }

  let notificationId = existing?.id;

  if (!notificationId) {
    const { data: created, error: createError } =
      await supabase
        .from("order_notifications")
        .insert({
          order_id: order.id,
          notification_type:
            notificationType,
          recipient,
          status: "pending",
        })
        .select("id")
        .single();

    if (createError) {
      const { data: raced } = await supabase
        .from("order_notifications")
        .select("id, status")
        .eq("order_id", order.id)
        .eq(
          "notification_type",
          notificationType
        )
        .eq("recipient", recipient)
        .maybeSingle();

      if (raced?.status === "sent") {
        return {
          sent: false,
          duplicate: true,
        };
      }

      notificationId = raced?.id;
    } else {
      notificationId = created.id;
    }
  }

  if (!notificationId) {
    throw new Error(
      "Unable to create status notification record."
    );
  }

  const deliveryAddress =
    order.fulfillment_type === "delivery"
      ? [
          order.delivery_address,
          order.delivery_city,
          order.delivery_state,
          order.delivery_zip,
        ]
          .filter(Boolean)
          .map(escapeEmailHtml)
          .join(", ")
      : null;

  const messages: Record<
    CustomerLifecycleStatus,
    {
      subject: string;
      eyebrow: string;
      heading: string;
      body: string;
    }
  > = {
    preparing: {
      subject:
        `We're Preparing Your Port Petals Order — ${order.order_number}`,
      eyebrow: "Order Update",
      heading: "We're preparing your order",
      body:
        "Your Port Petals order is now being prepared. We'll send you another update when it reaches the next step.",
    },

    ready: {
      subject:
        `Your Port Petals Order Is Ready for Pickup — ${order.order_number}`,
      eyebrow: "Ready for Pickup",
      heading: "Your order is ready!",
      body:
        "Your Port Petals order is ready for pickup at 430 E Arnold Avenue, Port Allegany, PA 16743.",
    },

    out_for_delivery: {
      subject:
        `Your Port Petals Order Is Out for Delivery — ${order.order_number}`,
      eyebrow: "Out for Delivery",
      heading: "Your order is on the way",
      body:
        "Your Port Petals order is now out for delivery.",
    },

    completed: {
      subject:
        `Your Port Petals Order Is Complete — ${order.order_number}`,
      eyebrow: "Order Complete",
      heading: "Your order is complete",
      body:
        "Your Port Petals order has been completed. Thank you for supporting Port Petals!",
    },

    cancelled: {
      subject:
        `Your Port Petals Order Has Been Cancelled — ${order.order_number}`,
      eyebrow: "Order Cancelled",
      heading: "Your order has been cancelled",
      body:
        "Your Port Petals order has been cancelled. If you have questions about payment or a refund, please contact Port Petals.",
    },
  };

  const message = messages[status];

  try {
    const { data, error } =
      await resend.emails.send({
        from:
          "Port Petals <orders@portpetals.com>",

        to: [recipient],

        replyTo:
          "stacy@portpetals.com",

        subject: message.subject,

        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#284239;max-width:680px;margin:auto;">
            <div style="padding:26px;border-radius:18px;background:#f7f1e8;">
              <p style="margin:0;color:#e76d61;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">
                ${escapeEmailHtml(
                  message.eyebrow
                )}
              </p>

              <h1 style="margin:8px 0 0;color:#153f32;">
                ${escapeEmailHtml(
                  message.heading
                )}
              </h1>

              <p style="margin-top:18px;">
                Hi ${escapeEmailHtml(
                  order.customer_name
                )},
              </p>

              <p>
                ${escapeEmailHtml(
                  message.body
                )}
              </p>

              <div style="margin-top:24px;padding:16px;border-radius:12px;background:#fffdf9;border:1px solid #e6e0d8;">
                <strong>Order:</strong>
                ${escapeEmailHtml(
                  order.order_number
                )}

                ${
                  status ===
                    "out_for_delivery" &&
                  deliveryAddress
                    ? `
                      <br>
                      <strong>
                        Delivery Address:
                      </strong>
                      ${deliveryAddress}
                    `
                    : ""
                }

                ${
                  status === "ready"
                    ? `
                      <br>
                      <strong>Pickup:</strong>
                      430 E Arnold Avenue,
                      Port Allegany, PA 16743
                    `
                    : ""
                }
              </div>

              <div style="margin-top:28px;padding:16px;border-radius:12px;background:#edf3e7;color:#36594c;">
                Questions? Reply to this email or call
                <strong>814-642-1253</strong>.
              </div>

              <p style="margin-top:28px;font-size:13px;color:#718078;">
                Port Petals<br>
                430 E Arnold Avenue<br>
                Port Allegany, PA 16743
              </p>
            </div>
          </div>
        `,
      });

    if (error) {
      throw new Error(error.message);
    }

    await supabase
      .from("order_notifications")
      .update({
        status: "sent",
        provider_message_id:
          data?.id ?? null,
        error_message: null,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type:
          `customer_status_${status}_sent`,
        message:
          `Customer email sent for order status ${status.replaceAll(
            "_",
            " "
          )}.`,
        metadata: {
          recipient,
          status,
          provider_message_id:
            data?.id ?? null,
        },
      });

    return {
      sent: true,
      duplicate: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown notification error.";

    await supabase
      .from("order_notifications")
      .update({
        status: "failed",
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    console.error(
      "Customer status notification failed:",
      error
    );

    return {
      sent: false,
      duplicate: false,
      error: errorMessage,
    };
  }
}
