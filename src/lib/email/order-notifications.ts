import { resend } from "@/lib/email/resend";
import { createAdminClient } from "@/lib/supabase/admin";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
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
      ].filter(Boolean);

      const personalization = [
        item.player_name
          ? `Name: ${item.player_name}`
          : null,
        item.player_number
          ? `Number: ${item.player_number}`
          : null,
      ].filter(Boolean);

      const customizations = Object.entries(
        item.customization ?? {}
      )
        .map(
          ([key, value]) =>
            `${key}: ${String(value)}`
        )
        .join("<br>");

      return `
        <div style="margin:0 0 18px;padding:16px;border:1px solid #e6e0d8;border-radius:12px;">
          <strong>${item.product_name}</strong>
          <div>Quantity: ${item.quantity}</div>

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
          .join(", ")
      : null;

  try {
    const { data, error } =
      await resend.emails.send({
        from:
          "Port Petals <onboarding@resend.dev>",

        to: [recipient],

        replyTo:
          order.customer_email || undefined,

        subject:
          `New Paid Order — ${order.order_number}`,

        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#284239;max-width:680px;margin:auto;">
            <h1 style="color:#153f32;">
              New Port Petals Order
            </h1>

            <p>
              <strong>Order:</strong>
              ${order.order_number}
            </p>

            <p>
              <strong>Customer:</strong>
              ${order.customer_name}
              <br>
              <strong>Email:</strong>
              ${order.customer_email}
              <br>
              <strong>Phone:</strong>
              ${order.customer_phone}
            </p>

            <p>
              <strong>Fulfillment:</strong>
              ${order.fulfillment_type}
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
                    <p>${order.notes}</p>
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
