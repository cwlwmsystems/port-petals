import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AccountLogoutButton from "@/components/AccountLogoutButton";
import AccountNavigation from "@/components/account/AccountNavigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Manage your Port Petals orders, rewards, wishlist, referrals, and profile.",
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default async function AccountPage() {
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

  const [
    profileResult,
    ordersResult,
    petalsResult,
    issuedRewardsResult,
  ] = await Promise.all([
    supabase
      .from(
        "customer_profiles"
      )
      .select(`
        full_name,
        phone,
        birthday_month,
        birthday_day
      `)
      .eq(
        "user_id",
        userId
      )
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
      )
      .limit(5),

    supabase
      .from(
        "customer_petals_balances"
      )
      .select(
        "petals_balance"
      )
      .eq(
        "user_id",
        userId
      )
      .maybeSingle(),

    supabase
      .from(
        "customer_reward_redemptions"
      )
      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )
      .eq(
        "user_id",
        userId
      )
      .eq(
        "status",
        "issued"
      ),
  ]);

  if (
    profileResult.error ||
    ordersResult.error ||
    petalsResult.error ||
    issuedRewardsResult.error
  ) {
    throw new Error(
      "Unable to load your Port Petals account."
    );
  }

  const profile =
    profileResult.data;

  const orders =
    ordersResult.data ?? [];

  const petalsBalance =
    Number(
      petalsResult.data
        ?.petals_balance ?? 0
    );

  const availableRewards =
    issuedRewardsResult.count ??
    0;

  const displayName =
    profile?.full_name
      ?.trim()
      .split(/\s+/)[0] ||
    "there";

  const hasBirthday =
    Boolean(
      profile?.birthday_month &&
      profile?.birthday_day
    );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* ===================================================
          ACCOUNT HERO
      =================================================== */}

      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              My Port Petals
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-[#153f32] sm:text-5xl">
              Hi, {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Your orders, rewards,
              favorites, referrals, and
              account details are all in
              one place.
            </p>
          </div>

          <AccountLogoutButton />
        </div>
      </section>

      <AccountNavigation />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        {/* =================================================
            ACCOUNT SUMMARY
        ================================================= */}

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-[2rem] bg-[#153f32] p-6 text-white shadow-sm sm:p-8">
            <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b0a8]">
                  Petals Balance
                </p>

                <div className="mt-3 flex items-end gap-3">
                  <p className="font-serif text-5xl font-semibold sm:text-6xl">
                    {petalsBalance.toLocaleString()}
                  </p>

                  <span className="pb-1.5 text-sm font-semibold text-white/70">
                    Petals
                  </span>
                </div>

                <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
                  Earn 1 Petal for every
                  whole eligible dollar
                  spent and turn your
                  balance into Port Petals
                  rewards.
                </p>
              </div>

              <Link
                href="/account/rewards?tab=redeem"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#153f32] transition hover:bg-[#f7f1e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b0a8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#153f32]"
              >
                View Rewards →
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Reward Wallet
            </p>

            <div className="mt-3 flex items-end gap-2">
              <p className="font-serif text-4xl font-semibold text-[#153f32]">
                {availableRewards}
              </p>

              <p className="pb-1 text-sm font-semibold text-[#607068]">
                available
              </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              Issued rewards ready to use
              on eligible purchases.
            </p>

            <Link
              href="/account/rewards?tab=wallet"
              className="mt-5 inline-flex rounded-sm text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61]/40"
            >
              Open reward wallet
            </Link>
          </section>
        </div>

        {/* =================================================
            PRIMARY DESTINATIONS
        ================================================= */}

        <section className="mt-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Your Account
            </p>

            <h2 className="mt-1 font-serif text-3xl font-semibold text-[#153f32]">
              Everything in one place
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/account/orders"
              className="group rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e7] text-lg text-[#31583b]">
                  ◫
                </span>

                <span className="text-[#718078] transition group-hover:translate-x-0.5 group-hover:text-[#e76d61]">
                  →
                </span>
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#153f32]">
                Orders
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                View purchases, payment
                status, and fulfillment
                details.
              </p>
            </Link>

            <Link
              href="/account/rewards?tab=redeem"
              className="group rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0ec] text-lg text-[#b95249]">
                  ✦
                </span>

                <span className="text-[#718078] transition group-hover:translate-x-0.5 group-hover:text-[#e76d61]">
                  →
                </span>
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#153f32]">
                Rewards
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Redeem Petals, manage your
                wallet, and view special
                perks.
              </p>
            </Link>

            <Link
              href="/account/wishlist"
              className="group rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#faf0f1] text-lg text-[#a74f59]">
                  ♡
                </span>

                <span className="text-[#718078] transition group-hover:translate-x-0.5 group-hover:text-[#e76d61]">
                  →
                </span>
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#153f32]">
                Wishlist
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Keep favorite flowers,
                gifts, apparel, and ideas
                together.
              </p>
            </Link>

            <Link
              href="/account/profile"
              className="group rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2eee7] text-lg text-[#685f55]">
                  ○
                </span>

                <span className="text-[#718078] transition group-hover:translate-x-0.5 group-hover:text-[#e76d61]">
                  →
                </span>
              </div>

              <h3 className="mt-5 font-serif text-xl font-semibold text-[#153f32]">
                Profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Manage your contact
                information and birthday.
              </p>
            </Link>
          </div>
        </section>

        {/* =================================================
            ORDERS + PERKS
        ================================================= */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
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
                className="shrink-0 text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4"
              >
                View all
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="mt-5 divide-y divide-[#284239]/10">
                {orders.map(
                  (order) => (
                    <div
                      key={order.id}
                      className="grid gap-4 py-5 first:pt-0 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="font-semibold text-[#153f32] hover:underline"
                        >
                          {order.order_number}
                        </Link>

                        <p className="mt-1 text-sm text-[#607068]">
                          {formatDate(
                            order.created_at
                          )}
                          {" · "}
                          <span className="capitalize">
                            {order.fulfillment_type}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="sm:text-right">
                          <p className="font-semibold text-[#153f32]">
                            {formatPrice(
                              Number(
                                order.total
                              )
                            )}
                          </p>

                          <div className="mt-1 flex flex-wrap gap-2 sm:justify-end">
                            <span className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665d55]">
                              {statusLabel(
                                order.payment_status
                              )}
                            </span>

                            <span className="rounded-full bg-[#edf3e7] px-2.5 py-1 text-[11px] font-semibold text-[#31583b]">
                              {statusLabel(
                                order.status
                              )}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#284239]/15 px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#153f32] hover:bg-[#faf7f1]"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-[#faf7f1] p-5">
                <p className="font-semibold text-[#153f32]">
                  No linked orders yet
                </p>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  Orders placed while signed
                  in will appear here.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Your Perks
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                More ways to enjoy Port Petals
              </h2>

              <div className="mt-5 space-y-3">
                <Link
                  href={
                    hasBirthday
                      ? "/account/rewards?tab=wallet"
                      : "/account/profile"
                  }
                  className="block rounded-2xl bg-[#edf3e7] p-4 transition hover:bg-[#e5eedf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31583b]/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#153f32]">
                        Birthday Bloom
                      </p>

                      <p className="mt-1 text-sm leading-5 text-[#607068]">
                        {hasBirthday
                          ? "Your birthday is saved for your annual Birthday Bloom."
                          : "Add your birthday to unlock your annual Birthday Bloom."}
                      </p>
                    </div>

                    <span className="text-[#31583b]">
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/account/referrals"
                  className="block rounded-2xl bg-[#faf7f1] p-4 transition hover:bg-[#f4efe6]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#153f32]">
                        Refer a Friend
                      </p>

                      <p className="mt-1 text-sm leading-5 text-[#607068]">
                        Earn 20% off after an
                        eligible successful
                        referral.
                      </p>
                    </div>

                    <span className="text-[#31583b]">
                      →
                    </span>
                  </div>
                </Link>

                <Link
                  href="/account/rewards?tab=redeem"
                  className="block rounded-2xl bg-[#faf7f1] p-4 transition hover:bg-[#f4efe6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61]/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#153f32]">
                        Petals Rewards
                      </p>

                      <p className="mt-1 text-sm leading-5 text-[#607068]">
                        {availableRewards > 0
                          ? `${availableRewards} reward${availableRewards === 1 ? "" : "s"} ready in your wallet.`
                          : "Keep earning Petals toward your next reward."}
                      </p>
                    </div>

                    <span className="text-[#31583b]">
                      →
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#284239]/10 bg-[#fffdf9] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Account Details
              </p>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Keep your profile current so
                your account, birthday perks,
                and order details stay up to
                date.
              </p>

              <Link
                href="/account/profile"
                className="mt-4 inline-flex text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4"
              >
                Manage profile
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
