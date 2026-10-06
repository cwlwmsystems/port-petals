import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Orders",
  description:
    "View your Port Petals order history.",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AccountOrdersPage() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/account/login");
  }

  const { data: orders, error } =
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
      .eq("customer_user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      "Unable to load your orders."
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div>
          <Link
            href="/account"
            className="text-sm font-semibold text-[#36594c] underline underline-offset-4"
          >
            ← Back to My Account
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            My Port Petals
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Order History
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
            Review your recent Port Petals purchases,
            payment status, and fulfillment details.
          </p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                      {formatDate(
                        order.created_at
                      )}
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                      {order.order_number}
                    </h2>

                    <p className="mt-2 text-sm capitalize text-[#607068]">
                      {order.fulfillment_type}
                      {" • "}
                      {order.payment_status}
                      {" • "}
                      {order.status}
                    </p>

                    {order.requested_fulfillment_date && (
                      <p className="mt-1 text-sm text-[#718078]">
                        Requested date:{" "}
                        {order.requested_fulfillment_date}
                      </p>
                    )}

                    {order.reward_name && (
                      <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl bg-[#edf3e7] px-3 py-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#31583b]">
                          Petals Reward
                        </span>

                        <span className="text-sm font-semibold text-[#153f32]">
                          {order.reward_name}
                        </span>

                        {order.reward_code && (
                          <span className="font-mono text-xs text-[#607068]">
                            {order.reward_code}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <strong className="text-xl text-[#153f32]">
                      {formatPrice(
                        Number(order.total)
                      )}
                    </strong>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e76d61] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d85b50]"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-[#284239]/10 bg-white p-7 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              No linked orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607068]">
              Orders placed while signed in will appear
              here. Support for securely linking eligible
              previous purchases will be added separately.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
