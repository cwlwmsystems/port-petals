import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  redirect,
} from "next/navigation";
import {
  createClient,
} from "@/lib/supabase/server";
import ReferralShareCard from "@/components/ReferralShareCard";

export const metadata: Metadata = {
  title:
    "Referrals",
  description:
    "Share Port Petals with friends and track your referral rewards.",
};

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
  ).format(
    new Date(value)
  );
}

function statusLabel(
  status: string
) {
  switch (status) {
    case "pending":
      return "Waiting for Purchase";

    case "completed":
      return "Qualified";

    case "rewarded":
      return "Reward Earned";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function statusClasses(
  status: string
) {
  switch (status) {
    case "pending":
      return "bg-[#fff4df] text-[#7b5b1d]";

    case "completed":
      return "bg-[#edf3e7] text-[#31583b]";

    case "rewarded":
      return "bg-[#e9f3ec] text-[#28563e]";

    case "cancelled":
      return "bg-[#f4eeee] text-[#7b6666]";

    default:
      return "bg-[#f7f1e8] text-[#607068]";
  }
}

export default async function ReferralsPage() {
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
    referralsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "customer_referral_profiles"
        )
        .select(`
          referral_code,
          created_at
        `)
        .eq(
          "user_id",
          userId
        )
        .maybeSingle(),

      supabase
        .from(
          "customer_referrals"
        )
        .select(`
          id,
          status,
          reward_percent,
          created_at,
          completed_at,
          rewarded_at,
          qualifying_order_id
        `)
        .eq(
          "referrer_user_id",
          userId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),
    ]);

  if (
    profileResult.error ||
    !profileResult.data
  ) {
    throw new Error(
      "Unable to load your referral code."
    );
  }

  if (
    referralsResult.error
  ) {
    throw new Error(
      "Unable to load your referrals."
    );
  }

  const referralCode =
    profileResult.data
      .referral_code;

  const referrals =
    referralsResult.data ??
    [];

  const pendingCount =
    referrals.filter(
      (referral) =>
        referral.status ===
        "pending"
    ).length;

  const qualifiedCount =
    referrals.filter(
      (referral) =>
        referral.status ===
          "completed" ||
        referral.status ===
          "rewarded"
    ).length;

  const rewardedCount =
    referrals.filter(
      (referral) =>
        referral.status ===
        "rewarded"
    ).length;

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
            Share Port Petals
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Referrals
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
            Invite friends to discover Port Petals.
            When an eligible referred customer
            completes their qualifying purchase,
            you&apos;ll unlock your referral reward.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-5">
            <ReferralShareCard
              referralCode={
                referralCode
              }
            />

            <section className="rounded-3xl bg-[#153f32] p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4b0a8]">
                Referral Reward
              </p>

              <p className="mt-3 font-serif text-4xl font-semibold">
                20% Off
              </p>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Earn 20% off your next eligible
                Port Petals order after a
                successful referral qualifies.
              </p>

              <p className="mt-4 text-xs leading-5 text-white/60">
                Referral rewards are issued
                securely to your account after
                the referred customer completes
                a qualifying paid order.
              </p>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                  Pending
                </p>

                <p className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-sm text-[#607068]">
                  Waiting to qualify
                </p>
              </div>

              <div className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                  Qualified
                </p>

                <p className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  {qualifiedCount}
                </p>

                <p className="mt-1 text-sm text-[#607068]">
                  Successful referrals
                </p>
              </div>

              <div className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                  Rewards
                </p>

                <p className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  {rewardedCount}
                </p>

                <p className="mt-1 text-sm text-[#607068]">
                  Referral perks earned
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Referral Activity
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Friends You&apos;ve Referred
              </h2>

              {referrals.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {referrals.map(
                    (
                      referral,
                      index
                    ) => (
                      <article
                        key={
                          referral.id
                        }
                        className="rounded-2xl border border-[#284239]/10 bg-[#fffdf9] p-5"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              Referral{" "}
                              {referrals.length -
                                index}
                            </p>

                            <p className="mt-1 text-sm text-[#607068]">
                              Started{" "}
                              {formatDate(
                                referral.created_at
                              )}
                            </p>

                            {referral.completed_at && (
                              <p className="mt-1 text-xs text-[#718078]">
                                Qualified{" "}
                                {formatDate(
                                  referral.completed_at
                                )}
                              </p>
                            )}
                          </div>

                          <div className="sm:text-right">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                                referral.status
                              )}`}
                            >
                              {statusLabel(
                                referral.status
                              )}
                            </span>

                            <p className="mt-2 text-xs text-[#718078]">
                              {Number(
                                referral.reward_percent
                              ).toLocaleString(
                                "en-US",
                                {
                                  maximumFractionDigits:
                                    0,
                                }
                              )}
                              % referral reward
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#faf7f1] p-6">
                  <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                    No referrals yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Share your personal link.
                    Referral activity will appear
                    here once friends use it and
                    create eligible Port Petals
                    accounts and orders.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                How It Works
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Share. Shop. Earn.
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#faf7f1] p-4">
                  <p className="font-serif text-2xl font-semibold text-[#e76d61]">
                    1
                  </p>

                  <p className="mt-2 font-semibold text-[#153f32]">
                    Share your link
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Send your personal Port Petals
                    referral link to a friend.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf7f1] p-4">
                  <p className="font-serif text-2xl font-semibold text-[#e76d61]">
                    2
                  </p>

                  <p className="mt-2 font-semibold text-[#153f32]">
                    They shop
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    Their referral is linked to
                    their eligible Port Petals
                    purchase.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf7f1] p-4">
                  <p className="font-serif text-2xl font-semibold text-[#e76d61]">
                    3
                  </p>

                  <p className="mt-2 font-semibold text-[#153f32]">
                    You earn
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#607068]">
                    After their qualifying order
                    is paid, your referral reward
                    becomes eligible.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
