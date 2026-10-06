import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    }
  ).format(new Date(value));
}

function formatMoney(
  value:
    | number
    | string
    | null
    | undefined
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(
    Number(value ?? 0)
  );
}

function rewardStatusClasses(
  status: string
) {
  switch (status) {
    case "issued":
      return "bg-[#e6f2e3] text-[#31583b]";

    case "reserved":
      return "bg-[#fff4df] text-[#7b5b1d]";

    case "redeemed":
      return "bg-[#edf1f6] text-[#536578]";

    case "cancelled":
    case "expired":
      return "bg-[#f4eeee] text-[#7b6666]";

    default:
      return "bg-[#edf1f6] text-[#607068]";
  }
}

async function requireAdmin() {
  const sessionClient =
    await createClient();

  const {
    data: claimsData,
  } =
    await sessionClient.auth.getClaims();

  const adminAuthUserId =
    claimsData?.claims?.sub;

  if (
    !adminAuthUserId
  ) {
    redirect(
      "/admin/login"
    );
  }

  const {
    data: adminUser,
  } =
    await sessionClient
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        adminAuthUserId
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (!adminUser) {
    redirect(
      "/admin/login"
    );
  }

  return createAdminClient();
}

export default async function CustomerAccountDetailPage({
  params,
}: Props) {
  const {
    userId,
  } =
    await params;

  const admin =
    await requireAdmin();

  const {
    data: authResult,
    error: authError,
  } =
    await admin.auth.admin.getUserById(
      userId
    );

  if (
    authError ||
    !authResult.user
  ) {
    notFound();
  }

  const authUser =
    authResult.user;

  const {
    data: adminRow,
  } =
    await admin
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (adminRow) {
    notFound();
  }

  const [
    profileResult,
    balanceResult,
    transactionsResult,
    redemptionsResult,
    referralProfileResult,
    referralsResult,
    wishlistResult,
    ordersResult,
    crmContactResult,
  ] =
    await Promise.all([
      admin
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

      admin
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

      admin
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

      admin
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
          expires_at,
          order_id,
          customer_rewards (
            name,
            reward_type
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

      admin
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

      admin
        .from(
          "customer_referrals"
        )
        .select(`
          id,
          status,
          reward_percent,
          created_at,
          completed_at,
          rewarded_at
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

      admin
        .from(
          "customer_wishlist_items"
        )
        .select(
          "*",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "user_id",
          userId
        ),

      admin
        .from("orders")
        .select(`
          id,
          order_number,
          status,
          payment_status,
          total,
          fulfillment_type,
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
        .limit(50),

      authUser.email
        ? admin
            .from(
              "marketing_contacts"
            )
            .select(`
              id,
              contact_type
            `)
            .eq(
              "email",
              authUser.email.toLowerCase()
            )
            .maybeSingle()
        : Promise.resolve({
            data: null,
            error: null,
          }),
    ]);

  const queryResults = [
    profileResult,
    balanceResult,
    transactionsResult,
    redemptionsResult,
    referralProfileResult,
    referralsResult,
    wishlistResult,
    ordersResult,
    crmContactResult,
  ];

  const queryError =
    queryResults.find(
      (result) =>
        result.error
    )?.error;

  if (queryError) {
    throw new Error(
      queryError.message
    );
  }

  const profile =
    profileResult.data;

  const balance =
    Number(
      balanceResult.data
        ?.petals_balance ??
        0
    );

  const transactions =
    transactionsResult.data ??
    [];

  const redemptions =
    redemptionsResult.data ??
    [];

  const referrals =
    referralsResult.data ??
    [];

  const orders =
    ordersResult.data ??
    [];

  const availableRewards =
    redemptions.filter(
      (reward) =>
        reward.status ===
        "issued"
    );

  const reservedRewards =
    redemptions.filter(
      (reward) =>
        reward.status ===
        "reserved"
    );

  const lifetimeAdded =
    transactions
      .filter(
        (transaction) =>
          Number(
            transaction.amount
          ) > 0
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          Number(
            transaction.amount
          ),
        0
      );

  const lifetimeRemoved =
    Math.abs(
      transactions
        .filter(
          (transaction) =>
            Number(
              transaction.amount
            ) < 0
        )
        .reduce(
          (
            total,
            transaction
          ) =>
            total +
            Number(
              transaction.amount
            ),
          0
        )
    );

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "paid"
    );

  const lifetimeValue =
    paidOrders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order.total ?? 0
        ),
      0
    );

  const successfulReferrals =
    referrals.filter(
      (referral) =>
        referral.status ===
          "completed" ||
        referral.status ===
          "rewarded"
    ).length;

  const birthday =
    profile
      ?.birthday_month &&
    profile?.birthday_day
      ? `${profile.birthday_month}/${profile.birthday_day}`
      : "Not provided";

  const accountName =
    profile?.full_name ||
    authUser.email ||
    "Customer Account";

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Customer Account"
          title={
            accountName
          }
          description="Registered account, loyalty, rewards, referrals, wishlist, and purchase activity."
          backHref="/admin/customers/accounts"
          backLabel="Back to Site Accounts"
          actions={
            <>
              <span className="rounded-full bg-[#e6f2e3] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
                Active Account
              </span>

              {crmContactResult
                .data && (
                <Link
                  href={`/admin/customers/${crmContactResult.data.id}`}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Open CRM Record
                </Link>
              )}
            </>
          }
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#284239]/10 sm:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Petals Balance
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {balance.toLocaleString()}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Available Rewards
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  availableRewards.length
                }
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Reserved
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  reservedRewards.length
                }
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Paid Orders
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  paidOrders.length
                }
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Lifetime Value
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {formatMoney(
                  lifetimeValue
                )}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Wishlist
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {wishlistResult.count ??
                  0}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                Customer Account
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                Account Details
              </h2>

              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Email
                  </dt>

                  <dd className="mt-1 break-all">
                    {authUser.email ??
                      "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Phone
                  </dt>

                  <dd className="mt-1">
                    {profile?.phone ??
                      "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Account Created
                  </dt>

                  <dd className="mt-1">
                    {formatDateTime(
                      authUser.created_at
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Email Confirmed
                  </dt>

                  <dd className="mt-1">
                    {formatDateTime(
                      authUser.email_confirmed_at
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Birthday
                  </dt>

                  <dd className="mt-1">
                    {birthday}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Referral Code
                  </dt>

                  <dd className="mt-1 font-mono text-sm font-semibold">
                    {referralProfileResult
                      .data
                      ?.referral_code ??
                      "—"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-5 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                  Reward Wallet
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                  Rewards
                </h2>
              </div>

              {redemptions.length ===
              0 ? (
                <div className="p-6 text-sm text-[#718078]">
                  No rewards issued yet.
                </div>
              ) : (
                <div className="divide-y divide-[#284239]/10">
                  {redemptions.map(
                    (
                      redemption
                    ) => {
                      const relation =
                        Array.isArray(
                          redemption.customer_rewards
                        )
                          ? redemption
                              .customer_rewards[0]
                          : redemption.customer_rewards;

                      return (
                        <div
                          key={
                            redemption.id
                          }
                          className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]"
                        >
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {relation
                                ?.name ??
                                "Port Petals Reward"}
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              Issued{" "}
                              {formatDateTime(
                                redemption
                                  .issued_at ??
                                  redemption
                                    .created_at
                              )}
                            </p>

                            {redemption.redemption_code && (
                              <p className="mt-2 font-mono text-xs text-[#607068]">
                                {
                                  redemption.redemption_code
                                }
                              </p>
                            )}
                          </div>

                          <div className="sm:text-right">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${rewardStatusClasses(
                                redemption.status
                              )}`}
                            >
                              {
                                redemption.status
                              }
                            </span>

                            <p className="mt-2 text-xs text-[#718078]">
                              {Number(
                                redemption.petals_cost
                              ).toLocaleString()}{" "}
                              Petals
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-5 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                  Petals Activity
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                  Loyalty History
                </h2>
              </div>

              {transactions.length ===
              0 ? (
                <div className="p-6 text-sm text-[#718078]">
                  No Petals activity yet.
                </div>
              ) : (
                <div className="divide-y divide-[#284239]/10">
                  {transactions.map(
                    (
                      transaction
                    ) => {
                      const amount =
                        Number(
                          transaction.amount
                        );

                      return (
                        <div
                          key={
                            transaction.id
                          }
                          className="flex items-center justify-between gap-4 p-5"
                        >
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {transaction.description ||
                                transaction.transaction_type}
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              {formatDateTime(
                                transaction.created_at
                              )}
                            </p>
                          </div>

                          <strong
                            className={
                              amount >= 0
                                ? "text-[#31583b]"
                                : "text-[#a7473f]"
                            }
                          >
                            {amount >=
                            0
                              ? "+"
                              : ""}
                            {amount.toLocaleString()}
                          </strong>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-5 py-4 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                  Orders
                </p>

                <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                  Linked Purchases
                </h2>
              </div>

              {orders.length ===
              0 ? (
                <div className="p-6 text-sm text-[#718078]">
                  No orders linked to this account.
                </div>
              ) : (
                <div className="divide-y divide-[#284239]/10">
                  {orders.map(
                    (order) => (
                      <Link
                        key={
                          order.id
                        }
                        href={`/admin/orders/${order.id}`}
                        className="grid gap-3 p-5 transition hover:bg-[#faf7f1] sm:grid-cols-[1fr_auto]"
                      >
                        <div>
                          <p className="font-semibold text-[#153f32]">
                            {
                              order.order_number
                            }
                          </p>

                          <p className="mt-1 text-sm capitalize text-[#607068]">
                            {
                              order.fulfillment_type
                            }
                            {" · "}
                            {
                              order.payment_status
                            }
                            {" · "}
                            {
                              order.status
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#718078]">
                            {formatDateTime(
                              order.created_at
                            )}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-semibold text-[#153f32]">
                            {formatMoney(
                              order.total
                            )}
                          </p>

                          <p className="mt-2 text-xs font-semibold text-[#e76d61]">
                            Open →
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl bg-[#153f32] p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4b0a8]">
                Petals
              </p>

              <p className="mt-2 font-serif text-4xl font-semibold">
                {balance.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-white/70">
                Current balance
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="text-xl font-semibold">
                    {lifetimeAdded.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Total added
                  </p>
                </div>

                <div>
                  <p className="text-xl font-semibold">
                    {lifetimeRemoved.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Total removed
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                Referrals
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                Referral Activity
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-[#153f32]">
                    {
                      referrals.length
                    }
                  </p>

                  <p className="text-xs text-[#718078]">
                    Total
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-[#153f32]">
                    {
                      successfulReferrals
                    }
                  </p>

                  <p className="text-xs text-[#718078]">
                    Qualified
                  </p>
                </div>
              </div>

              {referrals.length >
                0 && (
                <div className="mt-5 space-y-3 border-t border-[#284239]/10 pt-4">
                  {referrals
                    .slice(
                      0,
                      5
                    )
                    .map(
                      (
                        referral
                      ) => (
                        <div
                          key={
                            referral.id
                          }
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm capitalize text-[#607068]">
                            {
                              referral.status
                            }
                          </span>

                          <span className="text-xs text-[#718078]">
                            {formatDateTime(
                              referral.created_at
                            )}
                          </span>
                        </div>
                      )
                    )}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                Birthday Bloom
              </p>

              <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                {
                  birthday
                }
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Birthday Bloom is issued automatically during the customer&apos;s birthday month when an eligible birthday is saved.
              </p>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                Account ID
              </p>

              <p className="mt-2 break-all font-mono text-xs leading-5 text-[#607068]">
                {userId}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
