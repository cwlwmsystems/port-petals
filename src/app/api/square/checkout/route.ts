import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SQUARE_API_VERSION = "2026-09-16";

function moneyToCents(value: number) {
  return Math.round(value * 100);
}

function formatVariant(item: {
  garment_type: string | null;
  size: string | null;
  color: string | null;
  variant_name: string | null;
}) {
  const parts = [
    item.garment_type,
    item.color,
    item.size,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" / ");
  }

  return item.variant_name ?? "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const environment =
      process.env.SQUARE_ENVIRONMENT ?? "sandbox";

    if (!accessToken || !locationId) {
      throw new Error(
        "Square environment variables are not configured."
      );
    }

    const supabase = createAdminClient();

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          payment_status,
          customer_email,
          subtotal,
          delivery_fee,
          tax_amount,
          total,
          referral_discount_amount,
          referral_discount_percent,
          referral_reward_code,
          petals_discount_amount,
          petals_discount_percent,
          reward_name,
          square_order_id,
          square_payment_link_id,
          square_checkout_url
        `)
        .eq("id", orderId)
        .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "This order has already been paid." },
        { status: 400 }
      );
    }

    if (
      order.status === "cancelled" ||
      order.status === "refunded"
    ) {
      return NextResponse.json(
        {
          error:
            "This order can no longer be paid online.",
        },
        { status: 400 }
      );
    }

    if (order.square_checkout_url) {
      return NextResponse.json({
        checkoutUrl: order.square_checkout_url,
        squareOrderId: order.square_order_id,
        reused: true,
      });
    }

    const { data: items, error: itemsError } =
      await supabase
        .from("order_items")
        .select(`
          id,
          product_name,
          quantity,
          unit_price,
          line_total,
          variant_name,
          garment_type,
          size,
          color,
          player_name,
          player_number
        `)
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });

    if (itemsError || !items || items.length === 0) {
      return NextResponse.json(
        { error: "This order has no items." },
        { status: 400 }
      );
    }

    const squareLineItems = items.map((item) => {
      const variant = formatVariant(item);

      const personalization = [
        item.player_name
          ? `Name: ${item.player_name}`
          : null,
        item.player_number
          ? `Number: ${item.player_number}`
          : null,
      ]
        .filter(Boolean)
        .join(", ");

      const noteParts = [
        variant || null,
        personalization || null,
      ].filter(Boolean);

      return {
        name: item.product_name.slice(0, 255),
        quantity: String(item.quantity),
        item_type: "ITEM",
        base_price_money: {
          amount: moneyToCents(
            Number(item.unit_price)
          ),
          currency: "USD",
        },
        ...(noteParts.length > 0
          ? {
              note: noteParts.join(" — ").slice(0, 500),
            }
          : {}),
      };
    });

    if (Number(order.delivery_fee) > 0) {
      squareLineItems.push({
        name: "Local Delivery",
        quantity: "1",
        item_type: "ITEM",
        base_price_money: {
          amount: moneyToCents(
            Number(order.delivery_fee)
          ),
          currency: "USD",
        },
      });
    }

    const referralDiscountCents =
      moneyToCents(
        Number(
          order.referral_discount_amount ??
          0
        )
      );

    const petalsDiscountCents =
      moneyToCents(
        Number(
          order.petals_discount_amount ??
          0
        )
      );

    if (
      referralDiscountCents > 0 &&
      petalsDiscountCents > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This order contains incompatible merchandise discounts.",
        },
        { status: 409 }
      );
    }

    const calculatedTotalCents =
      squareLineItems.reduce(
        (sum, item) =>
          sum +
          item.base_price_money.amount *
            Number(item.quantity),
        0
      ) -
      referralDiscountCents -
      petalsDiscountCents;

    const expectedTotalCents = moneyToCents(
      Number(order.total)
    );

    if (calculatedTotalCents !== expectedTotalCents) {
      return NextResponse.json(
        {
          error:
            "Order total does not match the saved order. Please contact Port Petals.",
        },
        { status: 409 }
      );
    }

    const baseUrl =
      environment === "production"
        ? "https://connect.squareup.com"
        : "https://connect.squareupsandbox.com";

    const siteOrigin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(
        /\/$/,
        ""
      ) ?? new URL(request.url).origin;

    const redirectUrl =
      `${siteOrigin}/payment/return` +
      `?orderId=${encodeURIComponent(order.id)}`;

    const idempotencyKey =
      `port-petals-${order.id}`;

    const squareResponse = await fetch(
      `${baseUrl}/v2/online-checkout/payment-links`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Square-Version": SQUARE_API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,

          description:
            `Port Petals ${order.order_number}`,

          order: {
            location_id: locationId,
            reference_id: order.order_number,
            line_items: squareLineItems,

            ...(
              referralDiscountCents > 0 ||
              petalsDiscountCents > 0
                ? {
                    discounts: [
                      referralDiscountCents > 0
                        ? {
                            name:
                              order.referral_discount_percent
                                ? `Referral Reward — ${Number(
                                    order.referral_discount_percent
                                  )}% Off`
                                : "Referral Reward",

                            type:
                              "FIXED_AMOUNT",

                            scope:
                              "ORDER",

                            amount_money: {
                              amount:
                                referralDiscountCents,
                              currency:
                                "USD",
                            },
                          }
                        : {
                            name:
                              order.reward_name ??
                              "Petals Reward",

                            type:
                              "FIXED_AMOUNT",

                            scope:
                              "ORDER",

                            amount_money: {
                              amount:
                                petalsDiscountCents,
                              currency:
                                "USD",
                            },
                          },
                    ],
                  }
                : {}
            ),
          },

          payment_note:
            `Port Petals order ${order.order_number}`,

          checkout_options: {
            allow_tipping: false,
            redirect_url: redirectUrl,
          },

          pre_populated_data: {
            buyer_email:
              order.customer_email ?? undefined,
          },
        }),
      }
    );

    const squareData = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error(
        "Square checkout error:",
        squareData
      );

      return NextResponse.json(
        {
          error:
            "Square could not create the payment page.",
          details: squareData.errors ?? null,
        },
        { status: squareResponse.status }
      );
    }

    const paymentLink = squareData.payment_link;

    if (
      !paymentLink?.url ||
      !paymentLink?.order_id
    ) {
      throw new Error(
        "Square did not return a valid checkout link."
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        square_order_id:
          paymentLink.order_id,

        square_payment_link_id:
          paymentLink.id ?? null,

        square_checkout_url:
          paymentLink.url,

        checkout_created_at:
          new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type: "square_checkout_created",
        message:
          "Square hosted checkout created.",
        metadata: {
          square_order_id: paymentLink.order_id,
          square_payment_link_id:
            paymentLink.id ?? null,
          environment,
        },
      });

    return NextResponse.json({
      checkoutUrl: paymentLink.url,
      squareOrderId: paymentLink.order_id,
      reused: false,
    });
  } catch (error) {
    console.error(
      "Square checkout creation failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Square checkout.",
      },
      { status: 500 }
    );
  }
}
