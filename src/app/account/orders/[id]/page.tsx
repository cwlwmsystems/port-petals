import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountNavigation from "@/components/account/AccountNavigation";

export const metadata: Metadata = {
  title: "Order Details",
};

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AccountOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/account/login");
  }

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        customer_name,
        fulfillment_type,
        delivery_area,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip,
        subtotal,
        delivery_fee,
        tax_amount,
        total,
        notes,
        requested_fulfillment_date,
        reward_redemption_id,
        reward_name,
        reward_code,
        created_at,
        paid_at
      `)
      .eq("id", id)
      .eq("customer_user_id", userId)
      .maybeSingle();

  if (orderError || !order) {
    notFound();
  }

  const { data: items, error: itemsError } =
    await supabase
      .from("order_items")
      .select(`
        id,
        product_name,
        product_slug,
        quantity,
        unit_price,
        line_total,
        variant_name,
        garment_type,
        size,
        color,
        player_name,
        player_number,
        customization,
        image_url
      `)
      .eq("order_id", order.id)
      .order("created_at", {
        ascending: true,
      });

  if (itemsError) {
    throw new Error(
      "Unable to load order items."
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          My Port Petals
        </p>

        <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
          Order Details
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
          Review the items, payment,
          fulfillment, and reward details
          for this order.
        </p>
      </section>

      <AccountNavigation />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        <Link
          href="/account/orders"
          className="inline-flex text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4"
        >
          ← Back to Orders
        </Link>

        <div className="mt-5 rounded-[2rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 border-b border-[#284239]/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Order Details
              </p>

              <h1 className="mt-2 break-words font-serif text-3xl font-semibold text-[#153f32] sm:text-4xl">
                {order.order_number}
              </h1>

              <p className="mt-2 text-sm text-[#607068]">
                Placed {formatDate(order.created_at)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="rounded-full bg-[#edf3e7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#31583b]">
                  {order.payment_status}
                </span>

                <span className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#665d55]">
                  {order.status}
                </span>
              </div>

              <p className="mt-3 font-serif text-2xl font-semibold text-[#e76d61]">
                {formatPrice(
                  Number(order.total)
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <section>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Items
              </h2>

              <div className="mt-4 divide-y divide-[#284239]/10">
                {(items ?? []).map((item) => {
                  const details = [
                    item.variant_name,
                    item.garment_type,
                    item.size,
                    item.color,
                    item.player_name
                      ? `Name: ${item.player_name}`
                      : null,
                    item.player_number
                      ? `#${item.player_number}`
                      : null,
                    ...Object.entries(
                      item.customization ?? {}
                    ).map(
                      ([key, value]) =>
                        `${key}: ${String(value)}`
                    ),
                  ].filter(Boolean);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 py-5 first:pt-0"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5efe6]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-[#718078]">
                            Port Petals
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-lg font-semibold text-[#153f32]">
                          {item.product_name}
                        </h3>

                        <p className="mt-1 text-sm text-[#607068]">
                          Qty {item.quantity}
                          {" • "}
                          {formatPrice(
                            Number(item.unit_price)
                          )} each
                        </p>

                        {details.length > 0 && (
                          <p className="mt-2 text-xs leading-5 text-[#718078]">
                            {details.join(" • ")}
                          </p>
                        )}
                      </div>

                      <strong className="shrink-0 text-[#153f32]">
                        {formatPrice(
                          Number(item.line_total)
                        )}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl bg-[#faf7f1] p-5">
                <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>Subtotal</span>
                    <strong>
                      {formatPrice(
                        Number(order.subtotal)
                      )}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Delivery</span>
                    <strong>
                      {formatPrice(
                        Number(order.delivery_fee)
                      )}
                    </strong>
                  </div>

                  {Number(order.tax_amount) > 0 && (
                    <div className="flex justify-between gap-4">
                      <span>Tax</span>
                      <strong>
                        {formatPrice(
                          Number(order.tax_amount)
                        )}
                      </strong>
                    </div>
                  )}

                  <div className="flex justify-between gap-4 border-t border-[#284239]/10 pt-3 text-base">
                    <span>Total</span>
                    <strong className="text-[#e76d61]">
                      {formatPrice(
                        Number(order.total)
                      )}
                    </strong>
                  </div>
                </div>
              </section>

              {order.reward_name && (
                <section className="rounded-2xl border border-[#31583b]/15 bg-[#edf3e7] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#31583b]">
                    Petals Reward
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                    {order.reward_name}
                  </h2>

                  {order.reward_code && (
                    <div className="mt-3 rounded-xl bg-white/70 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718078]">
                        Reward Code
                      </p>

                      <p className="mt-1 font-mono text-sm font-semibold text-[#153f32]">
                        {order.reward_code}
                      </p>
                    </div>
                  )}

                  <p className="mt-3 text-sm leading-6 text-[#36594c]">
                    {order.payment_status === "paid"
                      ? "This Petals reward was confirmed with your paid order and will be fulfilled with it."
                      : order.status === "cancelled"
                        ? "This unpaid order was cancelled. Any reserved Petals reward is released back to your reward wallet."
                        : "This reward is reserved for this order while payment is pending."}
                  </p>
                </section>
              )}

              <section className="rounded-2xl border border-[#284239]/10 p-5">
                <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                  Fulfillment
                </h2>

                <div className="mt-3 space-y-2 text-sm leading-6 text-[#607068]">
                  <p className="capitalize">
                    {order.fulfillment_type}
                  </p>

                  <p>
                    Requested date:{" "}
                    <strong className="text-[#284239]">
                      {order.requested_fulfillment_date ??
                        "—"}
                    </strong>
                  </p>

                  {order.fulfillment_type ===
                    "delivery" && (
                    <>
                      <p>
                        {order.delivery_address}
                      </p>

                      <p>
                        {order.delivery_city},{" "}
                        {order.delivery_state}{" "}
                        {order.delivery_zip}
                      </p>
                    </>
                  )}
                </div>
              </section>

              {order.notes && (
                <section className="rounded-2xl border border-[#284239]/10 p-5">
                  <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                    Order Notes
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#607068]">
                    {order.notes}
                  </p>
                </section>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
