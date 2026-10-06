import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountLogoutButton from "@/components/AccountLogoutButton";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your Port Petals account, orders, saved items, Petals, and rewards.",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(value));
}

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/account/login");
  }

  const [
    profileResult,
    ordersResult,
    petalsResult,
  ] = await Promise.all([
    supabase
      .from("customer_profiles")
      .select(`
        full_name,
        phone,
        birthday_month,
        birthday_day
      `)
      .eq("user_id", userId)
      .maybeSingle(),

    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        fulfillment_type,
        total,
        reward_name,
        created_at
      `)
      .eq("customer_user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("customer_petals_balances")
      .select("petals_balance")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const profile =
    profileResult.data;

  const orders =
    ordersResult.data ?? [];

  const petalsBalance =
    Number(
      petalsResult.data?.petals_balance ?? 0
    );

  const displayName =
    profile?.full_name?.trim() ||
    "there";

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              My Port Petals
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
              Welcome, {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Keep track of orders, save favorites,
              earn Petals, and enjoy rewards made
              just for Port Petals customers.
            </p>
          </div>

          <AccountLogoutButton />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/account/orders"
            className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/25 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
              Orders
            </p>

            <h2 className="mt-2 font-serif text-xl font-semibold text-[#153f32]">
              Order History
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607068]">
              View purchases, payment details,
              and order status.
            </p>
          </Link>

          <Link
            href="/account/wishlist"
            className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/25 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
              Saved
            </p>

            <h2 className="mt-2 font-serif text-xl font-semibold text-[#153f32]">
              Wishlist
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607068]">
              Keep products you love in one
              convenient place.
            </p>
          </Link>

          <Link
            href="/account/rewards"
            className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/25 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
              Petals
            </p>

            <h2 className="mt-2 font-serif text-xl font-semibold text-[#153f32]">
              Rewards
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607068]">
              Earn Petals and turn them into
              future surprises and rewards.
            </p>
          </Link>

          <Link
            href="/account/referrals"
            className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/25 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
              Share
            </p>

            <h2 className="mt-2 font-serif text-xl font-semibold text-[#153f32]">
              Referrals
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#607068]">
              Invite friends and unlock special
              Port Petals perks.
            </p>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                  Recent Activity
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  Recent Orders
                </h2>
              </div>

              <Link
                href="/account/orders"
                className="text-sm font-semibold text-[#36594c] underline decoration-[#e76d61]/30 underline-offset-4"
              >
                View all
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="mt-5 divide-y divide-[#284239]/10">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#153f32]">
                        {order.order_number}
                      </p>

                      <p className="mt-1 text-sm text-[#607068]">
                        {formatDate(
                          order.created_at
                        )}{" "}
                        •{" "}
                        <span className="capitalize">
                          {
                            order.fulfillment_type
                          }
                        </span>
                      </p>

                      {order.reward_name && (
                        <p className="mt-1 text-xs font-semibold text-[#31583b]">
                          Petals Reward:{" "}
                          {order.reward_name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-right">
                        <p className="font-semibold text-[#153f32]">
                          {formatPrice(
                            Number(order.total)
                          )}
                        </p>

                        <p className="mt-1 text-xs capitalize text-[#718078]">
                          {order.payment_status}
                        </p>
                      </div>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#284239]/15 px-4 py-2 text-sm font-semibold text-[#284239]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[#faf7f1] p-5">
                <p className="font-semibold text-[#153f32]">
                  No linked orders yet.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  Orders placed while signed in
                  will appear here. We&apos;ll also
                  add support for securely linking
                  eligible previous purchases.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#284239]/10 bg-[#153f32] p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                Your Petals
              </p>

              <p className="mt-3 font-serif text-5xl font-semibold">
                {petalsBalance.toLocaleString()}
              </p>

              <p className="mt-2 text-sm leading-6 text-white/75">
                Earn Petals through eligible
                purchases, bonuses, and special
                Port Petals moments.
              </p>

              <Link
                href="/account/rewards"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#153f32]"
              >
                Explore Rewards
              </Link>
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Profile
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Your Details
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Add your birthday and keep your
                contact information current for
                future Port Petals surprises.
              </p>

              <Link
                href="/account/profile"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 px-5 py-2.5 text-sm font-semibold text-[#284239]"
              >
                Manage Profile
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
