import Link from "next/link";
import { redirect } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{
    search?: string;
    account?: string;
    segment?: string;
  }>;
};

type CustomerRow = {
  key: string;

  email: string | null;
  phone: string | null;
  name: string;

  crmId: string | null;
  crmType: string | null;

  userId: string | null;
  hasAccount: boolean;
  accountCreatedAt: string | null;

  orderCount: number;
  paidOrderCount: number;
  lifetimeValue: number;

  petalsBalance: number;
  availableRewards: number;
  reservedRewards: number;
  wishlistCount: number;

  referralCode: string | null;

  emailMarketingConsent: boolean;
  smsMarketingConsent: boolean;

  lastOrderAt: string | null;
};

function normalizeEmail(
  value: string | null | undefined
) {
  return (
    value
      ?.trim()
      .toLowerCase() ??
    ""
  );
}

function displayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback:
    | string
    | null
    | undefined
) {
  const name = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    fallback ||
    "Unnamed Customer"
  );
}

function formatMoney(
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
  value: string | null
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
      timeZone:
        "America/New_York",
    }
  ).format(
    new Date(value)
  );
}

async function requireAdmin() {
  const sessionClient =
    await createClient();

  const {
    data: claimsData,
  } =
    await sessionClient.auth.getClaims();

  const authUserId =
    claimsData?.claims?.sub;

  if (!authUserId) {
    redirect("/admin/login");
  }

  const {
    data: adminUser,
  } =
    await sessionClient
      .from("admin_users")
      .select(
        "id, auth_user_id"
      )
      .eq(
        "auth_user_id",
        authUserId
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
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
        `Unable to load registered customer accounts: ${error.message}`
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

export default async function AdminCustomersPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const search =
    params.search
      ?.trim()
      .toLowerCase() ??
    "";

  const accountFilter =
    params.account?.trim() ??
    "";

  const segment =
    params.segment?.trim() ??
    "";

  const admin =
    await requireAdmin();

  const authUsers =
    await loadAuthUsers(
      admin
    );

  const [
    adminUsersResult,
    contactsResult,
    profilesResult,
    balancesResult,
    redemptionsResult,
    wishlistResult,
    referralProfilesResult,
    ordersResult,
  ] =
    await Promise.all([
      admin
        .from("admin_users")
        .select(
          "auth_user_id"
        )
        .eq(
          "active",
          true
        ),

      admin
        .from(
          "marketing_contacts"
        )
        .select(`
          id,
          email,
          phone,
          first_name,
          last_name,
          contact_type,
          order_count,
          lifetime_value,
          last_order_at,
          email_marketing_consent,
          email_unsubscribed_at,
          sms_marketing_consent,
          sms_unsubscribed_at
        `),

      admin
        .from(
          "customer_profiles"
        )
        .select(`
          user_id,
          full_name,
          phone
        `),

      admin
        .from(
          "customer_petals_balances"
        )
        .select(`
          user_id,
          petals_balance
        `),

      admin
        .from(
          "customer_reward_redemptions"
        )
        .select(`
          user_id,
          status
        `),

      admin
        .from(
          "customer_wishlist_items"
        )
        .select(`
          user_id,
          product_id
        `),

      admin
        .from(
          "customer_referral_profiles"
        )
        .select(`
          user_id,
          referral_code
        `),

      admin
        .from("orders")
        .select(`
          id,
          customer_user_id,
          customer_email,
          customer_name,
          customer_phone,
          payment_status,
          total,
          created_at
        `),
    ]);

  const results = [
    adminUsersResult,
    contactsResult,
    profilesResult,
    balancesResult,
    redemptionsResult,
    wishlistResult,
    referralProfilesResult,
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

  const adminUserIds =
    new Set(
      (
        adminUsersResult.data ??
        []
      )
        .map(
          (row) =>
            row.auth_user_id
        )
        .filter(Boolean)
    );

  const customerAuthUsers =
    authUsers.filter(
      (user) =>
        !adminUserIds.has(
          user.id
        )
    );

  const profiles =
    new Map(
      (
        profilesResult.data ??
        []
      ).map(
        (row) => [
          row.user_id,
          row,
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

  const accountByEmail =
    new Map<
      string,
      (typeof customerAuthUsers)[number]
    >();

  for (
    const user
    of customerAuthUsers
  ) {
    const email =
      normalizeEmail(
        user.email
      );

    if (email) {
      accountByEmail.set(
        email,
        user
      );
    }
  }

  const crmByEmail =
    new Map<
      string,
      NonNullable<
        typeof contactsResult.data
      >[number]
    >();

  for (
    const contact
    of contactsResult.data ??
    []
  ) {
    const email =
      normalizeEmail(
        contact.email
      );

    if (email) {
      crmByEmail.set(
        email,
        contact
      );
    }
  }

  const orderStatsByUser =
    new Map<
      string,
      {
        total: number;
        paid: number;
        value: number;
        lastOrderAt: string | null;
      }
    >();

  const guestStatsByEmail =
    new Map<
      string,
      {
        total: number;
        paid: number;
        value: number;
        lastOrderAt: string | null;
        name: string | null;
        phone: string | null;
      }
    >();

  for (
    const order
    of ordersResult.data ??
    []
  ) {
    if (
      order.customer_user_id
    ) {
      const current =
        orderStatsByUser.get(
          order.customer_user_id
        ) ?? {
          total: 0,
          paid: 0,
          value: 0,
          lastOrderAt: null,
        };

      current.total += 1;

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

      if (
        !current.lastOrderAt ||
        new Date(
          order.created_at
        ).getTime() >
          new Date(
            current.lastOrderAt
          ).getTime()
      ) {
        current.lastOrderAt =
          order.created_at;
      }

      orderStatsByUser.set(
        order.customer_user_id,
        current
      );

      continue;
    }

    const email =
      normalizeEmail(
        order.customer_email
      );

    if (!email) {
      continue;
    }

    const current =
      guestStatsByEmail.get(
        email
      ) ?? {
        total: 0,
        paid: 0,
        value: 0,
        lastOrderAt: null,
        name:
          order.customer_name ??
          null,
        phone:
          order.customer_phone ??
          null,
      };

    current.total += 1;

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

    if (
      !current.lastOrderAt ||
      new Date(
        order.created_at
      ).getTime() >
        new Date(
          current.lastOrderAt
        ).getTime()
    ) {
      current.lastOrderAt =
        order.created_at;
    }

    guestStatsByEmail.set(
      email,
      current
    );
  }

  const rows =
    new Map<
      string,
      CustomerRow
    >();

  /*
   * 1. Registered site accounts.
   *
   * These are customers even if they
   * have never ordered.
   */
  for (
    const user
    of customerAuthUsers
  ) {
    const email =
      normalizeEmail(
        user.email
      );

    const profile =
      profiles.get(
        user.id
      );

    const crm =
      email
        ? crmByEmail.get(
            email
          )
        : undefined;

    const orderStats =
      orderStatsByUser.get(
        user.id
      ) ?? {
        total: 0,
        paid: 0,
        value: 0,
        lastOrderAt: null,
      };

    const rewards =
      rewardCounts.get(
        user.id
      ) ?? {
        available: 0,
        reserved: 0,
      };

    const key =
      email ||
      `account:${user.id}`;

    rows.set(
      key,
      {
        key,

        email:
          user.email ??
          crm?.email ??
          null,

        phone:
          profile?.phone ??
          crm?.phone ??
          null,

        name:
          profile?.full_name ||
          displayName(
            crm?.first_name,
            crm?.last_name,
            user.email
          ),

        crmId:
          crm?.id ??
          null,

        crmType:
          crm?.contact_type ??
          null,

        userId:
          user.id,

        hasAccount:
          true,

        accountCreatedAt:
          user.created_at,

        orderCount:
          Math.max(
            Number(
              crm?.order_count ??
                0
            ),
            orderStats.total
          ),

        paidOrderCount:
          orderStats.paid,

        lifetimeValue:
          Math.max(
            Number(
              crm?.lifetime_value ??
                0
            ),
            orderStats.value
          ),

        petalsBalance:
          balances.get(
            user.id
          ) ?? 0,

        availableRewards:
          rewards.available,

        reservedRewards:
          rewards.reserved,

        wishlistCount:
          wishlistCounts.get(
            user.id
          ) ?? 0,

        referralCode:
          referralProfiles.get(
            user.id
          ) ?? null,

        emailMarketingConsent:
          Boolean(
            crm?.email_marketing_consent &&
            !crm?.email_unsubscribed_at
          ),

        smsMarketingConsent:
          Boolean(
            crm?.sms_marketing_consent &&
            !crm?.sms_unsubscribed_at
          ),

        lastOrderAt:
          orderStats.lastOrderAt ??
          crm?.last_order_at ??
          null,
      }
    );
  }

  /*
   * 2. CRM contacts that do not have
   * a registered site account.
   */
  for (
    const contact
    of contactsResult.data ??
    []
  ) {
    const email =
      normalizeEmail(
        contact.email
      );

    const key =
      email ||
      `crm:${contact.id}`;

    if (
      rows.has(key)
    ) {
      continue;
    }

    const guest =
      email
        ? guestStatsByEmail.get(
            email
          )
        : undefined;

    rows.set(
      key,
      {
        key,

        email:
          contact.email,

        phone:
          contact.phone ??
          guest?.phone ??
          null,

        name:
          displayName(
            contact.first_name,
            contact.last_name,
            contact.email ??
              contact.phone
          ),

        crmId:
          contact.id,

        crmType:
          contact.contact_type,

        userId:
          null,

        hasAccount:
          false,

        accountCreatedAt:
          null,

        orderCount:
          Math.max(
            Number(
              contact.order_count ??
                0
            ),
            guest?.total ??
              0
          ),

        paidOrderCount:
          guest?.paid ??
          Number(
            contact.order_count ??
              0
          ),

        lifetimeValue:
          Math.max(
            Number(
              contact.lifetime_value ??
                0
            ),
            guest?.value ??
              0
          ),

        petalsBalance:
          0,

        availableRewards:
          0,

        reservedRewards:
          0,

        wishlistCount:
          0,

        referralCode:
          null,

        emailMarketingConsent:
          Boolean(
            contact.email_marketing_consent &&
            !contact.email_unsubscribed_at
          ),

        smsMarketingConsent:
          Boolean(
            contact.sms_marketing_consent &&
            !contact.sms_unsubscribed_at
          ),

        lastOrderAt:
          guest?.lastOrderAt ??
          contact.last_order_at ??
          null,
      }
    );
  }

  /*
   * 3. Guest-order customers that
   * somehow do not yet have a CRM
   * contact.
   */
  for (
    const [
      email,
      guest,
    ]
    of guestStatsByEmail
  ) {
    if (
      rows.has(email)
    ) {
      continue;
    }

    rows.set(
      email,
      {
        key:
          `guest:${email}`,

        email,

        phone:
          guest.phone,

        name:
          guest.name ||
          email,

        crmId:
          null,

        crmType:
          "customer",

        userId:
          null,

        hasAccount:
          false,

        accountCreatedAt:
          null,

        orderCount:
          guest.total,

        paidOrderCount:
          guest.paid,

        lifetimeValue:
          guest.value,

        petalsBalance:
          0,

        availableRewards:
          0,

        reservedRewards:
          0,

        wishlistCount:
          0,

        referralCode:
          null,

        emailMarketingConsent:
          false,

        smsMarketingConsent:
          false,

        lastOrderAt:
          guest.lastOrderAt,
      }
    );
  }

  let customers =
    Array.from(
      rows.values()
    );

  if (search) {
    customers =
      customers.filter(
        (row) => {
          const haystack =
            [
              row.name,
              row.email,
              row.phone,
              row.referralCode,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return haystack.includes(
            search
          );
        }
      );
  }

  if (
    accountFilter ===
    "yes"
  ) {
    customers =
      customers.filter(
        (row) =>
          row.hasAccount
      );
  }

  if (
    accountFilter ===
    "no"
  ) {
    customers =
      customers.filter(
        (row) =>
          !row.hasAccount
      );
  }

  if (
    segment ===
    "no-orders"
  ) {
    customers =
      customers.filter(
        (row) =>
          row.orderCount ===
          0
      );
  }

  if (
    segment ===
    "first-time"
  ) {
    customers =
      customers.filter(
        (row) =>
          row.paidOrderCount ===
          1
      );
  }

  if (
    segment ===
    "repeat"
  ) {
    customers =
      customers.filter(
        (row) =>
          row.paidOrderCount >=
          2
      );
  }

  if (
    segment ===
    "prospect"
  ) {
    customers =
      customers.filter(
        (row) =>
          row.crmType ===
          "prospect" &&
          row.orderCount ===
          0
      );
  }

  customers.sort(
    (a, b) => {
      const aDate =
        a.lastOrderAt ??
        a.accountCreatedAt ??
        "";

      const bDate =
        b.lastOrderAt ??
        b.accountCreatedAt ??
        "";

      return (
        new Date(
          bDate || 0
        ).getTime() -
        new Date(
          aDate || 0
        ).getTime()
      );
    }
  );

  const allRows =
    Array.from(
      rows.values()
    );

  const accountCount =
    allRows.filter(
      (row) =>
        row.hasAccount
    ).length;

  const purchaserCount =
    allRows.filter(
      (row) =>
        row.paidOrderCount >
        0
    ).length;

  const accountNoOrderCount =
    allRows.filter(
      (row) =>
        row.hasAccount &&
        row.orderCount ===
          0
    ).length;

  const guestCustomerCount =
    allRows.filter(
      (row) =>
        !row.hasAccount &&
        row.orderCount >
          0
    ).length;

  const outstandingPetals =
    allRows.reduce(
      (
        total,
        row
      ) =>
        total +
        row.petalsBalance,
      0
    );

  const hasFilters =
    Boolean(
      search ||
      accountFilter ||
      segment
    );

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Customer Management"
          title="Customers"
          description="A unified view of registered accounts, purchasers, guest customers, loyalty activity, and CRM records."
          actions={
            <>
              <Link
                href="/admin/customers/accounts"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Site Accounts
              </Link>

              <Link
                href="/admin/customers/crm"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#284239] px-4 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
              >
                CRM & Marketing
              </Link>
            </>
          }
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#284239]/10 sm:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Total Customers
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  allRows.length
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Site Accounts
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  accountCount
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Purchasers
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  purchaserCount
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Account / No Orders
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  accountNoOrderCount
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Guest Customers
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {
                  guestCustomerCount
                }
              </p>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                Petals Outstanding
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                {outstandingPetals.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-sm sm:p-5">
          <form
            method="GET"
            className="grid gap-3 lg:grid-cols-[minmax(280px,1.4fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)_auto]"
          >
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                Search
              </span>

              <input
                type="search"
                name="search"
                defaultValue={
                  search
                }
                placeholder="Name, email, phone, referral code..."
                className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                Account Status
              </span>

              <select
                name="account"
                defaultValue={
                  accountFilter
                }
                className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
              >
                <option value="">
                  All
                </option>

                <option value="yes">
                  Has Site Account
                </option>

                <option value="no">
                  No Site Account
                </option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                Customer Segment
              </span>

              <select
                name="segment"
                defaultValue={
                  segment
                }
                className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
              >
                <option value="">
                  All Customers
                </option>

                <option value="no-orders">
                  No Orders Yet
                </option>

                <option value="first-time">
                  First-Time Customer
                </option>

                <option value="repeat">
                  Repeat Customer
                </option>

                <option value="prospect">
                  Prospect
                </option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              {hasFilters && (
                <Link
                  href="/admin/customers"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#607068]"
                >
                  Clear
                </Link>
              )}

              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
              >
                Apply
              </button>
            </div>
          </form>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-sm">
          <div className="border-b border-[#284239]/10 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                  Customer Directory
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  {
                    customers.length
                  }{" "}
                  matching{" "}
                  {customers.length ===
                  1
                    ? "customer"
                    : "customers"}
                </p>
              </div>

              <p className="text-xs text-[#718078]">
                Account holders are included even with zero purchases.
              </p>
            </div>
          </div>

          {customers.length ===
          0 ? (
            <div className="p-8 text-center text-sm text-[#718078]">
              No customers match these filters.
            </div>
          ) : (
            <div className="divide-y divide-[#284239]/10">
              {customers.map(
                (customer) => {
                  const href =
                    customer.userId
                      ? `/admin/customers/accounts/${customer.userId}`
                      : customer.crmId
                        ? `/admin/customers/${customer.crmId}`
                        : null;

                  const content = (
                    <div className="grid gap-4 p-5 lg:grid-cols-[minmax(240px,1.5fr)_repeat(5,minmax(90px,0.55fr))_auto] lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-[#153f32]">
                            {
                              customer.name
                            }
                          </p>

                          {customer.hasAccount ? (
                            <span className="rounded-full bg-[#e6f2e3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#31583b]">
                              Site Account
                            </span>
                          ) : customer.orderCount >
                            0 ? (
                            <span className="rounded-full bg-[#f4ead8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#775d2f]">
                              Guest Customer
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#edf1f6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#536578]">
                              Prospect
                            </span>
                          )}

                          {customer.hasAccount &&
                            customer.orderCount ===
                              0 && (
                              <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7b5b1d]">
                                No Orders Yet
                              </span>
                            )}
                        </div>

                        <p className="mt-1 break-all text-sm text-[#607068]">
                          {customer.email ??
                            "No email"}
                        </p>

                        {customer.phone && (
                          <p className="mt-1 text-xs text-[#718078]">
                            {
                              customer.phone
                            }
                          </p>
                        )}

                        <p className="mt-2 text-xs text-[#718078]">
                          {customer.hasAccount
                            ? `Account created ${formatDate(
                                customer.accountCreatedAt
                              )}`
                            : customer.lastOrderAt
                              ? `Last order ${formatDate(
                                  customer.lastOrderAt
                                )}`
                              : "No account activity"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                          Paid Orders
                        </p>

                        <p className="mt-1 font-semibold text-[#153f32]">
                          {
                            customer.paidOrderCount
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                          Lifetime
                        </p>

                        <p className="mt-1 font-semibold text-[#153f32]">
                          {formatMoney(
                            customer.lifetimeValue
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                          Petals
                        </p>

                        <p className="mt-1 font-semibold text-[#153f32]">
                          {customer.hasAccount
                            ? customer.petalsBalance.toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                          Rewards
                        </p>

                        <p className="mt-1 font-semibold text-[#153f32]">
                          {customer.hasAccount
                            ? customer.availableRewards
                            : "—"}
                        </p>

                        {customer.reservedRewards >
                          0 && (
                          <p className="text-xs text-[#7b5b1d]">
                            {
                              customer.reservedRewards
                            }{" "}
                            reserved
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#718078]">
                          Wishlist
                        </p>

                        <p className="mt-1 font-semibold text-[#153f32]">
                          {customer.hasAccount
                            ? customer.wishlistCount
                            : "—"}
                        </p>
                      </div>

                      {href ? (
                        <span className="text-sm font-semibold text-[#e76d61]">
                          View →
                        </span>
                      ) : (
                        <span className="text-xs text-[#718078]">
                          —
                        </span>
                      )}
                    </div>
                  );

                  if (!href) {
                    return (
                      <div
                        key={
                          customer.key
                        }
                      >
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={
                        customer.key
                      }
                      href={
                        href
                      }
                      className="block transition hover:bg-[#faf7f1]"
                    >
                      {
                        content
                      }
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
