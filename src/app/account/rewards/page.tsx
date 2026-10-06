import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RedeemRewardButton from "@/components/RedeemRewardButton";

export const metadata: Metadata = {
  title: "Petals & Rewards",
  description:
    "View your Port Petals balance, rewards, and activity.",
};

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
      return "Reserved for Order";

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

export default async function RewardsPage() {
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
    balanceResult,
    rewardsResult,
    transactionsResult,
    redemptionsResult,
  ] = await Promise.all([
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
      .limit(20),

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
      .limit(50),
  ]);

  if (
    balanceResult.error ||
    rewardsResult.error ||
    transactionsResult.error ||
    redemptionsResult.error
  ) {
    throw new Error(
      "Unable to load your Petals account."
    );
  }

  const balance =
    Number(
      balanceResult.data
        ?.petals_balance ?? 0
    );

  const rewards =
    rewardsResult.data ?? [];

  const transactions =
    transactionsResult.data ?? [];

  const redemptions =
    redemptionsResult.data ?? [];

  const availableRewards =
    redemptions.filter(
      (redemption) =>
        redemption.status === "issued"
    );

  const reservedRewards =
    redemptions.filter(
      (redemption) =>
        redemption.status === "reserved"
    );

  const usedRewards =
    redemptions.filter(
      (redemption) =>
        redemption.status === "redeemed"
    );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/account"
          className="text-sm font-semibold text-[#36594c] underline underline-offset-4"
        >
          ← Back to My Account
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            My Port Petals
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Petals & Rewards
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
            Earn Petals as you shop
            and enjoy special Port Petals
            rewards, gifts, and surprises.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-5">
            <section className="rounded-3xl bg-[#153f32] p-7 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                Your Balance
              </p>

              <div className="mt-3 flex items-end gap-3">
                <p className="font-serif text-6xl font-semibold">
                  {balance.toLocaleString()}
                </p>

                <p className="pb-2 text-sm font-semibold text-white/75">
                  Petals
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/75">
                Your balance is calculated
                from your full Petals activity
                history.
              </p>
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                How It Works
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
                Grow your Petals
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-6 text-[#607068]">
                <p>
                  Shop with your Port Petals
                  account to earn Petals on
                  eligible purchases.
                </p>

                <p>
                  Special occasions,
                  milestones, and promotions
                  may bring bonus Petals too.
                </p>

                <p>
                  Redeem Petals for eligible
                  gifts and rewards once you
                  have enough.
                </p>
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                  Reward Garden
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  Available Rewards
                </h2>
              </div>

              {rewards.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {rewards.map(
                    (reward) => {
                      const affordable =
                        balance >=
                        reward.petals_cost;

                      return (
                        <article
                          key={
                            reward.id
                          }
                          className="rounded-2xl border border-[#284239]/10 bg-[#fffdf9] p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                                {rewardTypeLabel(
                                  reward.reward_type
                                )}
                              </p>

                              <h3 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                                {
                                  reward.name
                                }
                              </h3>
                            </div>

                            <span className="shrink-0 rounded-full bg-[#edf3e7] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
                              {
                                reward.petals_cost
                              }{" "}
                              Petals
                            </span>
                          </div>

                          {reward.description && (
                            <p className="mt-3 text-sm leading-6 text-[#607068]">
                              {
                                reward.description
                              }
                            </p>
                          )}

                          <div className="mt-5 border-t border-[#284239]/10 pt-4">
                            <p
                              className={`text-sm font-semibold ${
                                affordable
                                  ? "text-[#31583b]"
                                  : "text-[#718078]"
                              }`}
                            >
                              {affordable
                                ? "You have enough Petals for this reward."
                                : `${
                                    reward.petals_cost -
                                    balance
                                  } more Petals needed.`}
                            </p>

                            <RedeemRewardButton
                              rewardId={reward.id}
                              rewardName={reward.name}
                              petalsCost={reward.petals_cost}
                              affordable={affordable}
                            />
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#faf7f1] p-6">
                  <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                    Rewards are growing
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    New Petals rewards will
                    appear here as Port Petals
                    adds them.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                    My Rewards
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                    Reward Wallet
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#607068]">
                    Keep track of rewards that are ready to use,
                    reserved for an order, or already enjoyed.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#edf3e7] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
                    {availableRewards.length} Available
                  </span>

                  <span className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-semibold text-[#7b5b1d]">
                    {reservedRewards.length} Reserved
                  </span>

                  <span className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold text-[#665d55]">
                    {usedRewards.length} Used
                  </span>
                </div>
              </div>

              {redemptions.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {redemptions.map(
                    (redemption) => {
                      const relatedReward =
                        Array.isArray(
                          redemption.customer_rewards
                        )
                          ? redemption.customer_rewards[0]
                          : redemption.customer_rewards;

                      return (
                        <article
                          key={redemption.id}
                          className="rounded-2xl border border-[#284239]/10 bg-[#fffdf9] p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                                  {relatedReward?.name ??
                                    "Port Petals Reward"}
                                </h3>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${rewardStatusClasses(
                                    redemption.status
                                  )}`}
                                >
                                  {rewardStatusLabel(
                                    redemption.status
                                  )}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-[#607068]">
                                Redeemed for{" "}
                                {redemption.petals_cost} Petals
                                {" • "}
                                {formatDate(
                                  redemption.created_at
                                )}
                              </p>

                              {redemption.status ===
                                "issued" && (
                                <p className="mt-2 text-sm leading-6 text-[#31583b]">
                                  Ready to use on an eligible Port Petals order.
                                </p>
                              )}

                              {redemption.status ===
                                "reserved" && (
                                <p className="mt-2 text-sm leading-6 text-[#7b5b1d]">
                                  This reward is currently reserved for an order awaiting completion.
                                </p>
                              )}

                              {redemption.status ===
                                "redeemed" &&
                                redemption.redeemed_at && (
                                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                                    Used{" "}
                                    {formatDate(
                                      redemption.redeemed_at
                                    )}
                                  </p>
                                )}

                              {redemption.expires_at && (
                                <p className="mt-2 text-xs text-[#718078]">
                                  Expires{" "}
                                  {formatDate(
                                    redemption.expires_at
                                  )}
                                </p>
                              )}
                            </div>

                            <div className="shrink-0 sm:text-right">
                              {redemption.redemption_code && (
                                <div className="rounded-xl bg-[#faf7f1] px-4 py-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#718078]">
                                    Reward Code
                                  </p>

                                  <p className="mt-1 font-mono text-sm font-semibold text-[#153f32]">
                                    {redemption.redemption_code}
                                  </p>
                                </div>
                              )}

                              {redemption.order_id && (
                                <Link
                                  href={`/account/orders/${redemption.order_id}`}
                                  className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#284239]/15 px-4 py-2 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40"
                                >
                                  View Order
                                </Link>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-[#faf7f1] p-6">
                  <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                    Your reward wallet is empty
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Redeemed rewards will appear here with their
                    status and reward code.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Activity
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Petals History
              </h2>

              {transactions.length > 0 ? (
                <div className="mt-5 divide-y divide-[#284239]/10">
                  {transactions.map(
                    (transaction) => {
                      const amount =
                        Number(
                          transaction.amount
                        );

                      return (
                        <div
                          key={
                            transaction.id
                          }
                          className="flex items-center justify-between gap-5 py-4 first:pt-0"
                        >
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {transaction.description ||
                                transactionLabel(
                                  transaction.transaction_type,
                                  amount
                                )}
                            </p>

                            <p className="mt-1 text-sm text-[#718078]">
                              {formatDate(
                                transaction.created_at
                              )}
                            </p>
                          </div>

                          <p
                            className={`shrink-0 font-semibold ${
                              amount > 0
                                ? "text-[#31583b]"
                                : "text-[#a7473f]"
                            }`}
                          >
                            {amount > 0
                              ? "+"
                              : ""}
                            {amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#faf7f1] p-6">
                  <p className="font-semibold text-[#153f32]">
                    No Petals activity yet.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Your earned Petals,
                    bonuses, and rewards will
                    appear here.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
