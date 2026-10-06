import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AccountNavigation from "@/components/account/AccountNavigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Orders",
  description:
    "View your Port Petals order history.",
};

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(value);
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(value));
}

function statusLabel(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function statusClasses(
  value: string
) {
  switch (value) {
    case "paid":
    case "completed":
    case "ready":
      return "bg-[#edf3e7] text-[#31583b]";

    case "unpaid":
    case "pending":
    case "preparing":
      return "bg-[#fff4df] text-[#7b5b1d]";

    case "cancelled":
    case "refunded":
      return "bg-[#f4eeee] text-[#7b6666]";

    default:
      return "bg-[#f1ede7] text-[#665d55]";
  }
}

export default async function AccountOrdersPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect(
      "/account/login"
    );
  }

  const {
    data: orders,
    error,
  } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        fulfillment_type,
        total,
        requested_fulfillment_date,
        reward_name,
        reward_code,
        reward_redemption_id,
        created_at
      `)
      .eq(
        "customer_user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw new Error(
      "Unable to load your orders."
    );
  }

  const orderList =
    orders ?? [];

  const paidOrders =
    orderList.filter(
      (order) =>
        order.payment_status ===
        "paid"
    ).length;

  const activeOrders =
    orderList.filter(
      (order) =>
        ![
          "cancelled",
          "refunded",
          "completed",
        ].includes(
          order.status
        )
    ).length;

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          My Port Petals
        </p>

        <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
              Orders
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Review purchases, payment
              status, fulfillment details,
              and rewards used on your
              orders.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-2xl border border-[#284239]/10 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Orders
              </p>

              <p className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                {orderList.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[#284239]/10 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Paid
              </p>

              <p className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                {paidOrders}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AccountNavigation />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        {activeOrders > 0 && (
          <section className="mb-6 rounded-[2rem] bg-[#153f32] p-6 text-white shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                  Current Orders
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  {activeOrders}{" "}
                  {activeOrders === 1
                    ? "order is"
                    : "orders are"}{" "}
                  currently active
                </h2>
              </div>

              <p className="text-sm text-white/70">
                Status updates appear here
                automatically.
              </p>
            </div>
          </section>
        )}

        {orderList.length > 0 ? (
          <div className="space-y-4">
            {orderList.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  className="rounded-[2rem] border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:border-[#e76d61]/20 hover:shadow-md sm:p-7"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClasses(
                            order
                              .payment_status
                          )}`}
                        >
                          {statusLabel(
                            order
                              .payment_status
                          )}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClasses(
                            order.status
                          )}`}
                        >
                          {statusLabel(
                            order.status
                          )}
                        </span>
                      </div>

                      <h2 className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
                        {
                          order.order_number
                        }
                      </h2>

                      <p className="mt-1 text-sm text-[#607068]">
                        {formatDate(
                          order.created_at
                        )}
                        {" · "}
                        <span className="capitalize">
                          {
                            order.fulfillment_type
                          }
                        </span>
                      </p>

                      {order.requested_fulfillment_date && (
                        <p className="mt-2 text-sm text-[#718078]">
                          Requested
                          fulfillment:{" "}
                          <span className="font-semibold text-[#284239]">
                            {
                              order.requested_fulfillment_date
                            }
                          </span>
                        </p>
                      )}

                      {order.reward_name && (
                        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#edf3e7] px-3 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#31583b]">
                            Reward
                          </span>

                          <span className="text-sm font-semibold text-[#153f32]">
                            {
                              order.reward_name
                            }
                          </span>

                          {order.reward_code && (
                            <span className="font-mono text-xs text-[#607068]">
                              {
                                order.reward_code
                              }
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-6 border-t border-[#284239]/10 pt-5 lg:border-0 lg:pt-0">
                      <div className="lg:text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                          Total
                        </p>

                        <p className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                          {formatPrice(
                            Number(
                              order.total
                            )
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#153f32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#224f41]"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e7] text-2xl text-[#31583b]">
              ◫
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#153f32]">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607068]">
              Orders placed while signed
              into your Port Petals account
              will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#153f32] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Continue Shopping
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
