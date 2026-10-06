import Link from "next/link";
import { redirect } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{
    search?: string;
  }>;
};

function formatDate(
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
      timeZone: "America/New_York",
    }
  ).format(new Date(value));
}

async function requireAdmin() {
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
      "/admin/login"
    );
  }

  const {
    data: adminUser,
  } =
    await supabase
      .from("admin_users")
      .select(
        "id, auth_user_id"
      )
      .eq(
        "auth_user_id",
        userId
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

async function loadAuthUsers(
  admin: ReturnType<
    typeof createAdminClient
  >
) {
  const users = [];
  const perPage = 1000;

  for (
    let page = 1;
    page <= 20;
    page += 1
  ) {
    const {
      data,
      error,
    } =
      await admin.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw new Error(
        `Unable to load customer accounts: ${error.message}`
      );
    }

    users.push(
      ...data.users
    );

    if (
      data.users.length <
      perPage
    ) {
      break;
    }
  }

  return users;
}

export default async function CustomerAccountsPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const search =
    params.search
      ?.trim()
      .toLowerCase() ??
    "";

  const admin =
    await requireAdmin();

  const authUsers =
    await loadAuthUsers(
      admin
    );

  const {
    data: adminRows,
    error: adminRowsError,
  } =
    await admin
      .from("admin_users")
      .select(
        "auth_user_id"
      )
      .eq(
        "active",
        true
      );

  if (adminRowsError) {
    throw new Error(
      adminRowsError.message
    );
  }

  const adminUserIds =
    new Set(
      (adminRows ?? [])
        .map(
          (row) =>
            row.auth_user_id
        )
        .filter(Boolean)
    );

  const customerUsers =
    authUsers.filter(
      (user) =>
        !adminUserIds.has(
          user.id
        )
    );

  const userIds =
    customerUsers.map(
      (user) => user.id
    );

  if (
    userIds.length === 0
  ) {
    return (
      <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <AdminPageHeader
            eyebrow="Customer CRM"
            title="Site Accounts"
            description="Registered customer accounts, Petals balances, rewards, referrals, and account activity."
            backHref="/admin/customers"
            backLabel="Back to Customers"
          />

          <section className="mt-5 rounded-2xl border border-[#284239]/10 bg-white p-8 text-center shadow-sm">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              No customer accounts yet
            </h2>

            <p className="mt-2 text-sm text-[#718078]">
              Registered Port Petals customer accounts will appear here.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const [
    profilesResult,
    balancesResult,
    redemptionsResult,
    referralProfilesResult,
    referralsResult,
    wishlistResult,
    ordersResult,
  ] =
    await Promise.all([
      admin
        .from(
          "customer_profiles"
        )
        .select(`
          user_id,
          full_name,
          phone,
          birthday_month,
          birthday_day
        `)
        .in(
          "user_id",
          userIds
        ),

      admin
        .from(
          "customer_petals_balances"
        )
        .select(`
          user_id,
          petals_balance
        `)
        .in(
          "user_id",
          userIds
        ),

      admin
        .from(
          "customer_reward_redemptions"
        )
        .select(`
          id,
          user_id,
          status
        `)
        .in(
          "user_id",
          userIds
        ),

      admin
        .from(
          "customer_referral_profiles"
        )
        .select(`
          user_id,
          referral_code
        `)
        .in(
          "user_id",
          userIds
        ),

      admin
        .from(
          "customer_referrals"
        )
        .select(`
          id,
          referrer_user_id,
          status
        `)
        .in(
          "referrer_user_id",
          userIds
        ),

      admin
        .from(
          "customer_wishlist_items"
        )
        .select(`
          user_id,
          product_id
        `)
        .in(
          "user_id",
          userIds
        ),

      admin
        .from(
          "orders"
        )
        .select(`
          id,
          customer_user_id,
          payment_status,
          total
        `)
        .in(
          "customer_user_id",
          userIds
        ),
    ]);

  const results = [
    profilesResult,
    balancesResult,
    redemptionsResult,
    referralProfilesResult,
    referralsResult,
    wishlistResult,
    ordersResult,
  ];

  const firstError =
    results.find(
      (result) =>
        result.error
    )?.error;

  if (firstError) {
    throw new Error(
      firstError.message
    );
  }

  const profiles =
    new Map(
      (
        profilesResult.data ??
        []
      ).map(
        (profile) => [
          profile.user_id,
          profile,
        ]
      )
    );

  const balances =
    new Map(
      (
        balancesResult.data ??
        []
      ).map(
        (row) => [
          row.user_id,
          Number(
            row.petals_balance ??
              0
          ),
        ]
      )
    );

  const referralProfiles =
    new Map(
      (
        referralProfilesResult.data ??
        []
      ).map(
        (row) => [
          row.user_id,
          row.referral_code,
        ]
      )
    );

  const rewardCounts =
    new Map<
      string,
      {
        available: number;
        reserved: number;
      }
    >();

  for (
    const redemption
    of redemptionsResult.data ??
    []
  ) {
    const current =
      rewardCounts.get(
        redemption.user_id
      ) ?? {
        available: 0,
        reserved: 0,
      };

    if (
      redemption.status ===
      "issued"
    ) {
      current.available += 1;
    }

    if (
      redemption.status ===
      "reserved"
    ) {
      current.reserved += 1;
    }

    rewardCounts.set(
      redemption.user_id,
      current
    );
  }

  const referralCounts =
    new Map<string, number>();

  for (
    const referral
    of referralsResult.data ??
    []
  ) {
    referralCounts.set(
      referral.referrer_user_id,
      (
        referralCounts.get(
          referral.referrer_user_id
        ) ?? 0
      ) + 1
    );
  }

  const wishlistCounts =
    new Map<string, number>();

  for (
    const item
    of wishlistResult.data ??
    []
  ) {
    wishlistCounts.set(
      item.user_id,
      (
        wishlistCounts.get(
          item.user_id
        ) ?? 0
      ) + 1
    );
  }

  const orderStats =
    new Map<
      string,
      {
        count: number;
        paid: number;
        value: number;
      }
    >();

  for (
    const order
    of ordersResult.data ??
    []
  ) {
    if (
      !order.customer_user_id
    ) {
      continue;
    }

    const current =
      orderStats.get(
        order.customer_user_id
      ) ?? {
        count: 0,
        paid: 0,
        value: 0,
      };

    current.count += 1;

    if (
      order.payment_status ===
      "paid"
    ) {
      current.paid += 1;
      current.value +=
        Number(
          order.total ?? 0
        );
    }

    orderStats.set(
      order.customer_user_id,
      current
    );
  }

  const rows =
    customerUsers
      .map(
        (user) => {
          const profile =
            profiles.get(
              user.id
            );

          const rewards =
            rewardCounts.get(
              user.id
            ) ?? {
              available: 0,
              reserved: 0,
            };

          const orders =
            orderStats.get(
              user.id
            ) ?? {
              count: 0,
              paid: 0,
              value: 0,
            };

          return {
            user,
            profile,
            petals:
              balances.get(
                user.id
              ) ?? 0,
            rewards,
            referralCode:
              referralProfiles.get(
                user.id
              ) ?? null,
            referrals:
              referralCounts.get(
                user.id
              ) ?? 0,
            wishlist:
              wishlistCounts.get(
                user.id
              ) ?? 0,
            orders,
          };
        }
      )
      .filter(
        (row) => {
          if (!search) {
            return true;
          }

          const haystack =
            [
              row.user.email,
              row.profile
                ?.full_name,
              row.profile?.phone,
              row.referralCode,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return haystack.includes(
            search
          );
        }
      )
      .sort(
        (a, b) =>
          new Date(
            b.user.created_at
          ).getTime() -
          new Date(
            a.user.created_at
          ).getTime()
      );

  const totalPetals =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        row.petals,
      0
    );

  const availableRewards =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        row.rewards
          .available,
      0
    );

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Customer CRM"
          title="Site Accounts"
          description="Registered Port Petals customer accounts, Petals balances, reward wallets, referrals, wishlists, and linked orders."
          backHref="/admin/customers"
          backLabel="Back to Customers"
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#284239]/10 sm:grid-cols-3 lg:grid-cols-4 lg:divide-y-0">
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Accounts
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  rows.length
                }
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Petals Outstanding
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {totalPetals.toLocaleString()}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Available Rewards
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  availableRewards
                }
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                With Referrals
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  rows.filter(
                    (row) =>
                      row.referrals >
                      0
                  ).length
                }
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-5">
          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="search"
              name="search"
              defaultValue={
                search
              }
              placeholder="Search name, email, phone, referral code..."
              className="min-h-11 flex-1 rounded-lg border border-[#284239]/15 px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
            />

            {search && (
              <Link
                href="/admin/customers/accounts"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#284239]/15 px-4 text-sm font-semibold text-[#607068]"
              >
                Clear
              </Link>
            )}

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#284239] px-5 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#718078]">
              No matching customer accounts.
            </div>
          ) : (
            <div className="divide-y divide-[#284239]/10">
              {rows.map(
                (row) => (
                  <Link
                    key={
                      row.user.id
                    }
                    href={`/admin/customers/accounts/${row.user.id}`}
                    className="grid gap-4 p-5 transition hover:bg-[#faf7f1] lg:grid-cols-[minmax(220px,1.3fr)_repeat(5,minmax(100px,0.6fr))_auto] lg:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#153f32]">
                          {row.profile
                            ?.full_name ||
                            row.user.email ||
                            "Customer"}
                        </p>

                        <span className="rounded-full bg-[#e6f2e3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#31583b]">
                          Account
                        </span>
                      </div>

                      <p className="mt-1 break-all text-sm text-[#607068]">
                        {row.user.email ??
                          "No email"}
                      </p>

                      <p className="mt-1 text-xs text-[#718078]">
                        Joined{" "}
                        {formatDate(
                          row.user
                            .created_at
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                        Petals
                      </p>

                      <p className="mt-1 font-semibold text-[#153f32]">
                        {row.petals.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                        Rewards
                      </p>

                      <p className="mt-1 font-semibold text-[#153f32]">
                        {
                          row.rewards
                            .available
                        }
                      </p>

                      {row.rewards
                        .reserved >
                        0 && (
                        <p className="text-xs text-[#7b5b1d]">
                          {
                            row.rewards
                              .reserved
                          }{" "}
                          reserved
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                        Orders
                      </p>

                      <p className="mt-1 font-semibold text-[#153f32]">
                        {
                          row.orders
                            .paid
                        }{" "}
                        paid
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                        Referrals
                      </p>

                      <p className="mt-1 font-semibold text-[#153f32]">
                        {
                          row.referrals
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                        Wishlist
                      </p>

                      <p className="mt-1 font-semibold text-[#153f32]">
                        {
                          row.wishlist
                        }
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-[#e76d61]">
                      View →
                    </span>
                  </Link>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
