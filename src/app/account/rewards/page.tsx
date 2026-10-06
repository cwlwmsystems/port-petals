import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AccountNavigation from "@/components/account/AccountNavigation";
import RedeemRewardButton from "@/components/RedeemRewardButton";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Petals & Rewards",
  description:
    "View your Port Petals balance, rewards, wallet, perks, and activity.",
};

type RewardsPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

type RewardsTab =
  | "overview"
  | "redeem"
  | "wallet"
  | "activity";

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

function rewardTypeLabel(
  type: string
) {
  switch (type) {
    case "free_gift":
      return "Free Gift";

    case "percent_discount":
      return "Percentage Reward";

    case "fixed_discount":
      return "Discount Reward";

    case "special_perk":
      return "Special Perk";

    default:
      return "Reward";
  }
}

function rewardStatusLabel(
  status: string
) {
  switch (status) {
    case "issued":
      return "Available";

    case "reserved":
      return "Reserved";

    case "redeemed":
      return "Used";

    case "expired":
      return "Expired";

    case "cancelled":
      return "Cancelled";

    case "requested":
      return "Processing";

    default:
      return status;
  }
}

function rewardStatusClasses(
  status: string
) {
  switch (status) {
    case "issued":
      return "bg-[#edf3e7] text-[#31583b]";

    case "reserved":
      return "bg-[#fff4df] text-[#7b5b1d]";

    case "redeemed":
      return "bg-[#f1ede7] text-[#665d55]";

    case "expired":
    case "cancelled":
      return "bg-[#f4eeee] text-[#7b6666]";

    default:
      return "bg-[#f7f1e8] text-[#607068]";
  }
}

function transactionLabel(
  type: string,
  amount: number
) {
  switch (type) {
    case "earned":
      return "Petals Earned";

    case "redeemed":
      return "Reward Redeemed";

    case "bonus":
      return "Bonus Petals";

    case "adjustment":
      return amount >= 0
        ? "Petals Added"
        : "Petals Adjustment";

    case "reversal":
      return "Petals Reversed";

    case "expired":
      return "Petals Expired";

    default:
      return "Petals Activity";
  }
}

function getRelatedReward(
  customerRewards:
    | {
        name?: string | null;
      }
    | {
        name?: string | null;
      }[]
    | null
) {
  if (
    Array.isArray(
      customerRewards
    )
  ) {
    return (
      customerRewards[0] ??
      null
    );
  }

  return customerRewards;
}

export default async function RewardsPage({
  searchParams,
}: RewardsPageProps) {
  const params =
    await searchParams;

  const requestedTab =
    params.tab ?? "overview";

  const activeTab: RewardsTab =
    [
      "overview",
      "redeem",
      "wallet",
      "activity",
    ].includes(
      requestedTab
    )
      ? requestedTab as RewardsTab
      : "overview";

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

  /*
   * Birthday Bloom eligibility check.
   *
   * The database function is idempotent:
   * - no birthday = no issuance
   * - wrong month = no issuance
   * - one reward max per year
   */
  const {
    error: birthdayBloomError,
  } =
    await supabase.rpc(
      "claim_my_birthday_bloom"
    );

  if (
    birthdayBloomError
  ) {
    console.warn(
      "Unable to check Birthday Bloom eligibility:",
      birthdayBloomError
    );
  }

  const [
    profileResult,
    balanceResult,
    rewardsResult,
    transactionsResult,
    redemptionsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "customer_profiles"
        )
        .select(`
          birthday_month,
          birthday_day
        `)
        .eq(
          "user_id",
          userId
        )
        .maybeSingle(),

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
          "customer_rewards"
        )
        .select(`
          id,
          name,
          description,
          petals_cost,
          reward_type,
          discount_value,
          active,
          redeemable,
          sort_order
        `)
        .eq(
          "active",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        )
        .order(
          "petals_cost",
          {
            ascending: true,
          }
        ),

      supabase
        .from(
          "customer_petals_transactions"
        )
        .select(`
          id,
          amount,
          transaction_type,
          description,
          created_at
        `)
        .eq(
          "user_id",
          userId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(50),

      supabase
        .from(
          "customer_reward_redemptions"
        )
        .select(`
          id,
          petals_cost,
          status,
          redemption_code,
          created_at,
          issued_at,
          redeemed_at,
          cancelled_at,
          expires_at,
          order_id,
          customer_rewards (
            name
          )
        `)
        .eq(
          "user_id",
          userId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(100),
    ]);

  if (
    profileResult.error ||
    balanceResult.error ||
    rewardsResult.error ||
    transactionsResult.error ||
    redemptionsResult.error
  ) {
    throw new Error(
      "Unable to load your Petals account."
    );
  }

  const profile =
    profileResult.data;

  const balance =
    Number(
      balanceResult.data
        ?.petals_balance ?? 0
    );

  const rewards =
    rewardsResult.data ??
    [];

  const transactions =
    transactionsResult.data ??
    [];

  const redemptions =
    redemptionsResult.data ??
    [];

  /*
   * Reward catalog.
   *
   * Birthday Bloom is not part of
   * the spend-Petals catalog because
   * it is automatically issued.
   */
  const catalogRewards =
    rewards.filter(
      (reward) =>
        reward.redeemable
    );

  const availableCatalogRewards =
    catalogRewards.filter(
      (reward) =>
        balance >=
        Number(
          reward.petals_cost
        )
    );

  const upcomingCatalogRewards =
    catalogRewards.filter(
      (reward) =>
        balance <
        Number(
          reward.petals_cost
        )
    );

  /*
   * Issued/reserved rewards are the
   * customer's actual reward wallet.
   */
  const walletRewards =
    redemptions.filter(
      (redemption) =>
        [
          "issued",
          "reserved",
        ].includes(
          redemption.status
        )
    );

  const walletHistory =
    redemptions.filter(
      (redemption) =>
        ![
          "issued",
          "reserved",
        ].includes(
          redemption.status
        )
    );

  /*
   * Next Petals threshold.
   */
  const nextReward =
    catalogRewards.find(
      (reward) =>
        Number(
          reward.petals_cost
        ) > balance
    ) ?? null;

  const previousThreshold =
    catalogRewards
      .filter(
        (reward) =>
          Number(
            reward.petals_cost
          ) <= balance
      )
      .reduce(
        (
          highest,
          reward
        ) =>
          Math.max(
            highest,
            Number(
              reward.petals_cost
            )
          ),
        0
      );

  const nextThreshold =
    nextReward
      ? Number(
          nextReward.petals_cost
        )
      : balance;

  const progressRange =
    Math.max(
      nextThreshold -
      previousThreshold,
      1
    );

  const progressValue =
    nextReward
      ? Math.min(
          100,
          Math.max(
            0,
            (
              (
                balance -
                previousThreshold
              ) /
              progressRange
            ) *
              100
          )
        )
      : 100;

  const petalsToNext =
    nextReward
      ? Math.max(
          0,
          Number(
            nextReward.petals_cost
          ) -
          balance
        )
      : 0;

  /*
   * Birthday Bloom status.
   */
  const birthdayMonth =
    profile
      ?.birthday_month
      ? Number(
          profile
            .birthday_month
        )
      : null;

  const birthdayDay =
    profile
      ?.birthday_day
      ? Number(
          profile
            .birthday_day
        )
      : null;

  const birthdayMonths = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentEasternMonth =
    Number(
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            "America/New_York",
          month: "numeric",
        }
      ).format(
        new Date()
      )
    );

  const birthdayBloom =
    redemptions.find(
      (redemption) => {
        const reward =
          getRelatedReward(
            redemption
              .customer_rewards
          );

        return (
          reward?.name ===
          "Birthday Bloom"
        );
      }
    ) ?? null;

  let birthdayBadge =
    "Birthday Perk";

  let birthdayDescription =
    "Add your birthday to unlock your annual Birthday Bloom.";

  if (
    birthdayMonth &&
    birthdayDay
  ) {
    birthdayBadge =
      birthdayMonths[
        birthdayMonth
      ];

    birthdayDescription =
      `Your Birthday Bloom returns during ${birthdayMonths[birthdayMonth]}.`;
  }

  if (
    birthdayMonth ===
      currentEasternMonth &&
    birthdayBloom?.status ===
      "issued"
  ) {
    birthdayBadge =
      "Ready";

    birthdayDescription =
      "Your Birthday Bloom is ready in your reward wallet.";
  }

  if (
    birthdayBloom?.status ===
      "reserved"
  ) {
    birthdayBadge =
      "Reserved";

    birthdayDescription =
      "Your Birthday Bloom is reserved for your current order.";
  }

  if (
    birthdayBloom?.status ===
      "redeemed"
  ) {
    birthdayBadge =
      "Enjoyed";

    birthdayDescription =
      "You enjoyed your Birthday Bloom this year.";
  }

  if (
    birthdayBloom?.status ===
      "expired"
  ) {
    birthdayBadge =
      "Expired";

    birthdayDescription =
      "This year's Birthday Bloom has expired.";
  }

  const tabs: Array<{
    id: RewardsTab;
    label: string;
    count?: number;
  }> = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "redeem",
      label: "Redeem",
      count:
        availableCatalogRewards
          .length,
    },
    {
      id: "wallet",
      label: "Wallet",
      count:
        walletRewards.length,
    },
    {
      id: "activity",
      label: "Activity",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* ===============================================
          PAGE HEADER
      =============================================== */}

      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          My Port Petals
        </p>

        <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
              Petals & Rewards
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Earn Petals, redeem rewards,
              manage your wallet, and review
              your reward activity.
            </p>
          </div>

          <div className="rounded-2xl bg-[#153f32] px-5 py-4 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4b0a8]">
              Your Balance
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <strong className="font-serif text-3xl">
                {balance.toLocaleString()}
              </strong>

              <span className="text-sm text-white/70">
                Petals
              </span>
            </div>
          </div>
        </div>
      </section>

      <AccountNavigation />

      {/* ===============================================
          REWARDS TAB BAR
      =============================================== */}

      <section className="mx-auto max-w-6xl px-4 pt-7 sm:px-8 lg:px-10">
        <div className="overflow-x-auto">
          <nav
            aria-label="Rewards navigation"
            className="flex min-w-max gap-2 rounded-2xl border border-[#284239]/10 bg-white p-1.5 shadow-sm"
          >
            {tabs.map(
              (tab) => {
                const active =
                  activeTab ===
                  tab.id;

                const href =
                  tab.id ===
                    "overview"
                    ? "/account/rewards"
                    : `/account/rewards?tab=${tab.id}`;

                return (
                  <Link
                    key={
                      tab.id
                    }
                    href={href}
                    aria-current={
                      active
                        ? "page"
                        : undefined
                    }
                    className={[
                      "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e76d61]/40 focus-visible:ring-offset-2",
                      active
                        ? "bg-[#153f32] text-white"
                        : "text-[#536860] hover:bg-[#f7f1e8] hover:text-[#153f32]",
                    ].join(
                      " "
                    )}
                  >
                    {tab.label}

                    {typeof tab.count ===
                      "number" &&
                      tab.count > 0 && (
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[11px]",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-[#edf3e7] text-[#31583b]",
                          ].join(
                            " "
                          )}
                        >
                          {
                            tab.count
                          }
                        </span>
                      )}
                  </Link>
                );
              }
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-8 lg:px-10">
        {/* =============================================
            OVERVIEW
        ============================================= */}

        {activeTab ===
          "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                      Petals Progress
                    </p>

                    <h2 className="mt-2 font-serif text-2xl font-semibold text-[#153f32] sm:text-3xl">
                      {nextReward
                        ? "Your next reward"
                        : "Your reward garden is open"}
                    </h2>
                  </div>

                  <Link
                    href="/account/rewards?tab=redeem"
                    className="text-sm font-semibold text-[#31583b] underline decoration-[#e76d61]/30 underline-offset-4"
                  >
                    View rewards
                  </Link>
                </div>

                {nextReward ? (
                  <>
                    <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="font-serif text-2xl font-semibold text-[#153f32]">
                          {
                            nextReward.name
                          }
                        </p>

                        <p className="mt-1 text-sm text-[#607068]">
                          {
                            nextReward.petals_cost
                          }{" "}
                          Petals
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-[#31583b]">
                        {petalsToNext.toLocaleString()}{" "}
                        Petals to go
                      </p>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#edf0ea]">
                      <div
                        className="h-full rounded-full bg-[#e76d61]"
                        style={{
                          width:
                            `${progressValue}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-[#718078]">
                      <span>
                        {balance.toLocaleString()}
                      </span>

                      <span>
                        {Number(
                          nextReward
                            .petals_cost
                        ).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 rounded-2xl bg-[#edf3e7] p-5">
                    <p className="font-semibold text-[#153f32]">
                      You have enough Petals
                      for every currently
                      available reward.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-[2rem] bg-[#153f32] p-6 text-white shadow-sm sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                  Reward Wallet
                </p>

                <p className="mt-3 font-serif text-5xl font-semibold">
                  {
                    walletRewards.length
                  }
                </p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  {walletRewards.length ===
                  1
                    ? "reward ready or reserved."
                    : "rewards ready or reserved."}
                </p>

                <Link
                  href="/account/rewards?tab=wallet"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#153f32]"
                >
                  Open Wallet
                </Link>
              </section>
            </div>

            <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                  Your Perks
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  More ways to enjoy Port Petals
                </h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl bg-[#edf3e7] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#153f32]">
                        Birthday Bloom
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#607068]">
                        {
                          birthdayDescription
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#31583b]">
                      {
                        birthdayBadge
                      }
                    </span>
                  </div>

                  <Link
                    href={
                      birthdayBloom
                        ?.status ===
                        "issued"
                        ? "/account/rewards?tab=wallet"
                        : "/account/profile"
                    }
                    className="mt-4 inline-flex text-sm font-semibold text-[#31583b] underline underline-offset-4"
                  >
                    {birthdayBloom
                      ?.status ===
                      "issued"
                      ? "View reward"
                      : "Manage birthday"}
                  </Link>
                </article>

                <Link
                  href="/account/referrals"
                  className="rounded-2xl bg-[#faf7f1] p-5 transition hover:bg-[#f4efe6]"
                >
                  <p className="font-semibold text-[#153f32]">
                    Refer a Friend
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Earn 20% off your next
                    eligible order after a
                    successful referral.
                  </p>

                  <p className="mt-4 text-sm font-semibold text-[#31583b]">
                    View referrals →
                  </p>
                </Link>

                <article className="rounded-2xl bg-[#faf7f1] p-5">
                  <p className="font-semibold text-[#153f32]">
                    Seasonal Bonuses
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Special promotions may
                    bring extra Petals and
                    customer rewards.
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718078]">
                    Coming Soon
                  </span>
                </article>
              </div>
            </section>

            {availableCatalogRewards.length >
              0 && (
              <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                      Available Now
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                      You can redeem these now
                    </h2>
                  </div>

                  <Link
                    href="/account/rewards?tab=redeem"
                    className="shrink-0 text-sm font-semibold text-[#31583b] underline underline-offset-4"
                  >
                    See all
                  </Link>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableCatalogRewards
                    .slice(
                      0,
                      3
                    )
                    .map(
                      (
                        reward
                      ) => (
                        <article
                          key={
                            reward.id
                          }
                          className="rounded-2xl bg-[#faf7f1] p-5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                            {rewardTypeLabel(
                              reward
                                .reward_type
                            )}
                          </p>

                          <h3 className="mt-2 font-serif text-xl font-semibold text-[#153f32]">
                            {
                              reward.name
                            }
                          </h3>

                          <p className="mt-3 text-sm font-semibold text-[#31583b]">
                            {Number(
                              reward
                                .petals_cost
                            ).toLocaleString()}{" "}
                            Petals
                          </p>
                        </article>
                      )
                    )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* =============================================
            REDEEM
        ============================================= */}

        {activeTab ===
          "redeem" && (
          <div className="space-y-7">
            <section>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                  Reward Garden
                </p>

                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#153f32]">
                  Redeem your Petals
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607068]">
                  Choose a reward below.
                  Once redeemed, it moves
                  into your wallet until
                  you use it on an eligible
                  order.
                </p>
              </div>
            </section>

            {availableCatalogRewards.length >
              0 && (
              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#31583b]">
                      Available Now
                    </p>

                    <h3 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                      Ready to redeem
                    </h3>
                  </div>

                  <span className="text-sm font-semibold text-[#607068]">
                    {
                      availableCatalogRewards.length
                    }{" "}
                    available
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {availableCatalogRewards.map(
                    (
                      reward
                    ) => (
                      <article
                        key={
                          reward.id
                        }
                        className="flex flex-col rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                              {rewardTypeLabel(
                                reward
                                  .reward_type
                              )}
                            </p>

                            <h3 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                              {
                                reward.name
                              }
                            </h3>
                          </div>

                          <span className="shrink-0 rounded-full bg-[#edf3e7] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
                            {Number(
                              reward
                                .petals_cost
                            ).toLocaleString()}
                          </span>
                        </div>

                        {reward.description && (
                          <p className="mt-4 flex-1 text-sm leading-6 text-[#607068]">
                            {
                              reward.description
                            }
                          </p>
                        )}

                        <RedeemRewardButton
                          rewardId={
                            reward.id
                          }
                          rewardName={
                            reward.name
                          }
                          petalsCost={
                            Number(
                              reward
                                .petals_cost
                            )
                          }
                          affordable
                        />
                      </article>
                    )
                  )}
                </div>
              </section>
            )}

            {upcomingCatalogRewards.length >
              0 && (
              <section>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">
                    Keep Growing
                  </p>

                  <h3 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                    Almost there
                  </h3>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {upcomingCatalogRewards.map(
                    (
                      reward
                    ) => {
                      const needed =
                        Math.max(
                          0,
                          Number(
                            reward
                              .petals_cost
                          ) -
                          balance
                        );

                      return (
                        <article
                          key={
                            reward.id
                          }
                          className="rounded-3xl border border-[#284239]/10 bg-white/60 p-5"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                            {rewardTypeLabel(
                              reward
                                .reward_type
                            )}
                          </p>

                          <h3 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                            {
                              reward.name
                            }
                          </h3>

                          {reward.description && (
                            <p className="mt-3 text-sm leading-6 text-[#607068]">
                              {
                                reward.description
                              }
                            </p>
                          )}

                          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#284239]/10 pt-4">
                            <strong className="text-sm text-[#153f32]">
                              {Number(
                                reward
                                  .petals_cost
                              ).toLocaleString()}{" "}
                              Petals
                            </strong>

                            <span className="text-xs font-semibold text-[#718078]">
                              {needed.toLocaleString()}{" "}
                              to go
                            </span>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* =============================================
            WALLET
        ============================================= */}

        {activeTab ===
          "wallet" && (
          <div className="space-y-7">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Reward Wallet
              </p>

              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#153f32]">
                Your rewards
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607068]">
                Rewards you have already
                redeemed with Petals or
                received as a special perk.
              </p>
            </section>

            {walletRewards.length >
              0 ? (
              <section>
                <div className="grid gap-4 md:grid-cols-2">
                  {walletRewards.map(
                    (
                      redemption
                    ) => {
                      const reward =
                        getRelatedReward(
                          redemption
                            .customer_rewards
                        );

                      return (
                        <article
                          key={
                            redemption.id
                          }
                          className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                                Reward
                              </p>

                              <h3 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                                {reward
                                  ?.name ??
                                  "Port Petals Reward"}
                              </h3>
                            </div>

                            <span
                              className={[
                                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                                rewardStatusClasses(
                                  redemption
                                    .status
                                ),
                              ].join(
                                " "
                              )}
                            >
                              {rewardStatusLabel(
                                redemption
                                  .status
                              )}
                            </span>
                          </div>

                          {redemption
                            .redemption_code && (
                            <div className="mt-5 rounded-2xl bg-[#faf7f1] p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                                Reward Code
                              </p>

                              <p className="mt-1 font-mono text-sm font-semibold text-[#153f32]">
                                {
                                  redemption
                                    .redemption_code
                                }
                              </p>
                            </div>
                          )}

                          <div className="mt-4 space-y-2 text-sm text-[#607068]">
                            <p>
                              Redeemed for:{" "}
                              <strong className="text-[#284239]">
                                {Number(
                                  redemption
                                    .petals_cost
                                ).toLocaleString()}{" "}
                                Petals
                              </strong>
                            </p>

                            {redemption
                              .expires_at && (
                              <p>
                                Expires:{" "}
                                <strong className="text-[#284239]">
                                  {formatDate(
                                    redemption
                                      .expires_at
                                  )}
                                </strong>
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </section>
            ) : (
              <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-8 text-center shadow-sm">
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Your wallet is empty
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607068]">
                  Redeem Petals for a
                  reward and it will appear
                  here until you use it.
                </p>

                <Link
                  href="/account/rewards?tab=redeem"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#153f32] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Browse Rewards
                </Link>
              </section>
            )}

            {walletHistory.length >
              0 && (
              <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-7">
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Previous Rewards
                </h3>

                <div className="mt-4 divide-y divide-[#284239]/10">
                  {walletHistory.map(
                    (
                      redemption
                    ) => {
                      const reward =
                        getRelatedReward(
                          redemption
                            .customer_rewards
                        );

                      return (
                        <div
                          key={
                            redemption.id
                          }
                          className="flex items-center justify-between gap-4 py-4 first:pt-0"
                        >
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {reward
                                ?.name ??
                                "Port Petals Reward"}
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              {formatDate(
                                redemption
                                  .created_at
                              )}
                            </p>
                          </div>

                          <span
                            className={[
                              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
                              rewardStatusClasses(
                                redemption
                                  .status
                              ),
                            ].join(
                              " "
                            )}
                          >
                            {rewardStatusLabel(
                              redemption
                                .status
                            )}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* =============================================
            ACTIVITY
        ============================================= */}

        {activeTab ===
          "activity" && (
          <div className="space-y-6">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Petals History
              </p>

              <h2 className="mt-1 font-serif text-3xl font-semibold text-[#153f32]">
                Account activity
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#607068]">
                A detailed record of Petals
                earned, redeemed, adjusted,
                and reversed.
              </p>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-[#284239]/10 bg-white shadow-sm">
              {transactions.length >
                0 ? (
                <div className="divide-y divide-[#284239]/10">
                  {transactions.map(
                    (
                      transaction
                    ) => {
                      const amount =
                        Number(
                          transaction
                            .amount
                        );

                      return (
                        <div
                          key={
                            transaction.id
                          }
                          className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                        >
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {transactionLabel(
                                transaction
                                  .transaction_type,
                                amount
                              )}
                            </p>

                            {transaction.description && (
                              <p className="mt-1 text-sm text-[#607068]">
                                {
                                  transaction.description
                                }
                              </p>
                            )}

                            <p className="mt-1 text-xs text-[#718078]">
                              {formatDate(
                                transaction
                                  .created_at
                              )}
                            </p>
                          </div>

                          <strong
                            className={[
                              "text-lg",
                              amount >= 0
                                ? "text-[#31583b]"
                                : "text-[#a7473f]",
                            ].join(
                              " "
                            )}
                          >
                            {amount >=
                            0
                              ? "+"
                              : ""}
                            {amount.toLocaleString()}{" "}
                            Petals
                          </strong>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                    No Petals activity yet
                  </h3>

                  <p className="mt-3 text-sm text-[#607068]">
                    Your earning and reward
                    history will appear here.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
