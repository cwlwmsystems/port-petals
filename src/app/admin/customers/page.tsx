import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type Props = {
  searchParams: Promise<{
    search?: string;
    type?: string;
    email?: string;
    sms?: string;
    interest?: string;
    segment?: string;
  }>;
};

function formatMoney(
  value:
    | number
    | string
    | null
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

function displayName(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
  phone: string | null
) {
  const name =
    [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

  return (
    name ||
    email ||
    phone ||
    "Unnamed Contact"
  );
}

function typeClasses(
  type: string
) {
  switch (type) {
    case "customer":
      return "bg-[#e6f2e3] text-[#31583b]";

    case "prospect":
      return "bg-[#f4ead8] text-[#775d2f]";

    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function consentClasses(
  enabled: boolean
) {
  return enabled
    ? "bg-[#e6f2e3] text-[#31583b]"
    : "bg-[#edf1f6] text-[#607068]";
}

export default async function AdminCustomersPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const search =
    params.search?.trim() ??
    "";

  const type =
    params.type?.trim() ??
    "";

  const email =
    params.email?.trim() ??
    "";

  const sms =
    params.sms?.trim() ??
    "";

  const interest =
    params.interest?.trim() ??
    "";

  const segment =
    params.segment?.trim() ??
    "";

  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const {
    data: adminUser,
  } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  const [
    totalResult,
    customerResult,
    prospectResult,
    emailSubscriberResult,
    smsSubscriberResult,
  ] = await Promise.all([
    supabase
      .from(
        "marketing_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from(
        "marketing_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "contact_type",
        "customer"
      ),

    supabase
      .from(
        "marketing_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "contact_type",
        "prospect"
      ),

    supabase
      .from(
        "marketing_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "email_marketing_consent",
        true
      )
      .is(
        "email_unsubscribed_at",
        null
      ),

    supabase
      .from(
        "marketing_contacts"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "sms_marketing_consent",
        true
      )
      .is(
        "sms_unsubscribed_at",
        null
      ),
  ]);

  let interestContactIds:
    string[] | null = null;

  if (interest) {
    const allowedInterests =
      new Set([
        "flowers",
        "gifts-decor",
        "apparel",
        "gator-gear",
        "seasonal",
        "weddings-events",
      ]);

    if (
      allowedInterests.has(
        interest
      )
    ) {
      const {
        data: interestRows,
        error: interestError,
      } =
        await supabase
          .from(
            "marketing_contact_interests"
          )
          .select(
            "contact_id"
          )
          .eq(
            "interest",
            interest
          );

      if (interestError) {
        throw new Error(
          interestError.message
        );
      }

      interestContactIds =
        Array.from(
          new Set(
            (
              interestRows ??
              []
            ).map(
              (row) =>
                row.contact_id
            )
          )
        );
    }
  }

  let query =
    supabase
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
        source,
        first_order_at,
        last_order_at,
        order_count,
        lifetime_value,
        email_marketing_consent,
        email_unsubscribed_at,
        sms_marketing_consent,
        sms_unsubscribed_at,
        created_at,
        updated_at
      `)
      .order(
        "last_order_at",
        {
          ascending: false,
          nullsFirst: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (search) {
    const safeSearch =
      search.replace(
        /[,()]/g,
        " "
      );

    query =
      query.or(
        `first_name.ilike.%${safeSearch}%,last_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
      );
  }

  if (
    type === "customer" ||
    type === "prospect"
  ) {
    query =
      query.eq(
        "contact_type",
        type
      );
  }

  if (email === "yes") {
    query =
      query
        .eq(
          "email_marketing_consent",
          true
        )
        .is(
          "email_unsubscribed_at",
          null
        );
  }

  if (email === "no") {
    query =
      query.eq(
        "email_marketing_consent",
        false
      );
  }

  if (sms === "yes") {
    query =
      query
        .eq(
          "sms_marketing_consent",
          true
        )
        .is(
          "sms_unsubscribed_at",
          null
        );
  }

  if (sms === "no") {
    query =
      query.eq(
        "sms_marketing_consent",
        false
      );
  }

  if (
    interestContactIds !==
    null
  ) {
    if (
      interestContactIds.length ===
      0
    ) {
      query =
        query.eq(
          "id",
          "00000000-0000-0000-0000-000000000000"
        );
    } else {
      query =
        query.in(
          "id",
          interestContactIds
        );
    }
  }

  if (
    segment ===
    "no-purchases"
  ) {
    query =
      query.eq(
        "order_count",
        0
      );
  }

  if (
    segment ===
    "first-time"
  ) {
    query =
      query.eq(
        "order_count",
        1
      );
  }

  if (
    segment ===
    "repeat"
  ) {
    query =
      query.gte(
        "order_count",
        2
      );
  }

  const {
    data: contacts,
    error,
  } = await query;

  if (error) {
    throw new Error(
      error.message
    );
  }

  const filteredContacts =
    contacts ?? [];

  const emailEligibleCount =
    filteredContacts.filter(
      (contact) =>
        Boolean(
          contact.email &&
          contact.email_marketing_consent &&
          !contact.email_unsubscribed_at
        )
    ).length;

  const smsEligibleCount =
    filteredContacts.filter(
      (contact) =>
        Boolean(
          contact.phone &&
          contact.sms_marketing_consent &&
          !contact.sms_unsubscribed_at
        )
    ).length;

  const exportParams =
    new URLSearchParams();

  if (search) {
    exportParams.set(
      "search",
      search
    );
  }

  if (type) {
    exportParams.set(
      "type",
      type
    );
  }

  if (email) {
    exportParams.set(
      "email",
      email
    );
  }

  if (sms) {
    exportParams.set(
      "sms",
      sms
    );
  }

  if (interest) {
    exportParams.set(
      "interest",
      interest
    );
  }

  if (segment) {
    exportParams.set(
      "segment",
      segment
    );
  }

  const baseExportQuery =
    exportParams.toString();

  function exportHref(
    channel:
      | "all"
      | "email"
      | "sms"
  ) {
    const params =
      new URLSearchParams(
        baseExportQuery
      );

    params.set(
      "channel",
      channel
    );

    return `/api/admin/customers/export?${params.toString()}`;
  }

  const hasFilters =
    Boolean(
      search ||
      type ||
      email ||
      sms ||
      interest ||
      segment
    );

  const summaryCards = [
    {
      label:
        "Total Contacts",
      value:
        totalResult.count ??
        0,
    },
    {
      label:
        "Customers",
      value:
        customerResult.count ??
        0,
    },
    {
      label:
        "Prospects",
      value:
        prospectResult.count ??
        0,
    },
    {
      label:
        "Email Subscribers",
      value:
        emailSubscriberResult.count ??
        0,
    },
    {
      label:
        "SMS Subscribers",
      value:
        smsSubscriberResult.count ??
        0,
    },
  ];

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Customer CRM"
          title="Customers"
          description="Customer and prospect records, purchase history, lifetime value, segmentation, and marketing consent."
        />

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#284239]/10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
            {summaryCards.map(
              (card) => (
                <div
                  key={
                    card.label
                  }
                  className="px-4 py-4 sm:px-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    {
                      card.label
                    }
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#153f32]">
                    {
                      card.value
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#284239]/10 bg-white p-4 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-5">
          <form
            method="GET"
            className="space-y-4"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.5fr)_repeat(2,minmax(150px,0.75fr))]">
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
                  placeholder="Name, email, phone..."
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                  Contact Type
                </span>

                <select
                  name="type"
                  defaultValue={
                    type
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All
                  </option>

                  <option value="customer">
                    Customers
                  </option>

                  <option value="prospect">
                    Prospects
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                  Purchase Segment
                </span>

                <select
                  name="segment"
                  defaultValue={
                    segment
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Contacts
                  </option>

                  <option value="no-purchases">
                    No Purchases
                  </option>

                  <option value="first-time">
                    First-Time Customer
                  </option>

                  <option value="repeat">
                    Repeat Customer
                  </option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(150px,1fr))_auto]">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                  Email Marketing
                </span>

                <select
                  name="email"
                  defaultValue={
                    email
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All
                  </option>

                  <option value="yes">
                    Subscribed
                  </option>

                  <option value="no">
                    Not Subscribed
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                  SMS Marketing
                </span>

                <select
                  name="sms"
                  defaultValue={
                    sms
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All
                  </option>

                  <option value="yes">
                    Subscribed
                  </option>

                  <option value="no">
                    Not Subscribed
                  </option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]">
                  Interest
                </span>

                <select
                  name="interest"
                  defaultValue={
                    interest
                  }
                  className="min-h-11 rounded-lg border border-[#284239]/15 bg-white px-3.5 text-sm outline-none transition focus:border-[#e76d61]"
                >
                  <option value="">
                    All Interests
                  </option>

                  <option value="flowers">
                    Flowers
                  </option>

                  <option value="gifts-decor">
                    Gifts & Decor
                  </option>

                  <option value="apparel">
                    Apparel
                  </option>

                  <option value="gator-gear">
                    Gator Gear
                  </option>

                  <option value="seasonal">
                    Seasonal
                  </option>

                  <option value="weddings-events">
                    Weddings & Events
                  </option>
                </select>
              </label>

              <div className="flex items-end justify-end gap-2">
                {hasFilters && (
                  <Link
                    href="/admin/customers"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-4 text-sm font-semibold text-[#607068] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                  >
                    Clear
                  </Link>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="mt-4 rounded-2xl border border-[#284239]/10 bg-white px-4 py-4 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                  Current Audience
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#153f32]">
                  {
                    filteredContacts.length
                  }
                </p>

                <p className="text-xs text-[#718078]">
                  Matching
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#31583b]">
                  {
                    emailEligibleCount
                  }
                </p>

                <p className="text-xs text-[#718078]">
                  Email Eligible
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#365b7a]">
                  {
                    smsEligibleCount
                  }
                </p>

                <p className="text-xs text-[#718078]">
                  SMS Eligible
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <a
                href={exportHref(
                  "all"
                )}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#284239]/15 bg-white px-3.5 text-xs font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Export Segment
              </a>

              <a
                href={exportHref(
                  "email"
                )}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#31583b] px-3.5 text-xs font-semibold text-white transition hover:bg-[#284b32]"
              >
                Export Email
              </a>

              <a
                href={exportHref(
                  "sms"
                )}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#284239] px-3.5 text-xs font-semibold text-white transition hover:bg-[#1d332b]"
              >
                Export SMS
              </a>
            </div>
          </div>

          {filteredContacts.length > 0 &&
            emailEligibleCount === 0 &&
            smsEligibleCount === 0 && (
              <p className="mt-3 border-t border-[#284239]/10 pt-3 text-xs leading-5 text-[#775d2f]">
                No matching contacts currently have active email or SMS
                marketing consent.
              </p>
            )}
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
          <div className="flex flex-col gap-2 border-b border-[#284239]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Contact Directory
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                {
                  contacts?.length ??
                  0
                }{" "}
                shown
              </p>
            </div>
          </div>

          {!contacts ||
          contacts.length ===
            0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-[#153f32]">
                No contacts found.
              </p>

              <p className="mt-2 text-sm text-[#607068]">
                Contacts will appear here
                as customers check out or
                explicitly subscribe.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f5f7f4] text-[11px] uppercase tracking-[0.12em] text-[#607068]">
                    <tr>
                      <th className="px-6 py-4">
                        Contact
                      </th>

                      <th className="px-6 py-4">
                        Type
                      </th>

                      <th className="px-6 py-4">
                        Orders
                      </th>

                      <th className="px-6 py-4">
                        Lifetime Value
                      </th>

                      <th className="px-6 py-4">
                        Marketing
                      </th>

                      <th className="px-6 py-4">
                        Last Order
                      </th>

                      <th className="px-6 py-4 text-right">
                        View
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#284239]/10">
                    {contacts.map(
                      (contact) => {
                        const emailSubscribed =
                          contact.email_marketing_consent &&
                          !contact.email_unsubscribed_at;

                        const smsSubscribed =
                          contact.sms_marketing_consent &&
                          !contact.sms_unsubscribed_at;

                        return (
                          <tr
                            key={
                              contact.id
                            }
                            className="transition hover:bg-[#faf7f1]"
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold text-[#153f32]">
                                {displayName(
                                  contact.first_name,
                                  contact.last_name,
                                  contact.email,
                                  contact.phone
                                )}
                              </p>

                              {contact.email && (
                                <p className="mt-1 text-xs text-[#607068]">
                                  {
                                    contact.email
                                  }
                                </p>
                              )}

                              {contact.phone && (
                                <p className="mt-1 text-xs text-[#607068]">
                                  {
                                    contact.phone
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeClasses(
                                  contact.contact_type
                                )}`}
                              >
                                {contact.contact_type ===
                                "customer"
                                  ? "Customer"
                                  : "Prospect"}
                              </span>
                            </td>

                            <td className="px-6 py-4 font-semibold text-[#153f32]">
                              {
                                contact.order_count
                              }
                            </td>

                            <td className="px-6 py-4 font-semibold text-[#153f32]">
                              {formatMoney(
                                contact.lifetime_value
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${consentClasses(
                                    emailSubscribed
                                  )}`}
                                >
                                  Email{" "}
                                  {emailSubscribed
                                    ? "✓"
                                    : "—"}
                                </span>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${consentClasses(
                                    smsSubscribed
                                  )}`}
                                >
                                  SMS{" "}
                                  {smsSubscribed
                                    ? "✓"
                                    : "—"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-[#607068]">
                              {formatDate(
                                contact.last_order_at
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/admin/customers/${contact.id}`}
                                className="font-semibold text-[#e76d61]"
                              >
                                Open →
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}
              <div className="divide-y divide-[#284239]/10 lg:hidden">
                {contacts.map(
                  (contact) => {
                    const emailSubscribed =
                      contact.email_marketing_consent &&
                      !contact.email_unsubscribed_at;

                    const smsSubscribed =
                      contact.sms_marketing_consent &&
                      !contact.sms_unsubscribed_at;

                    return (
                      <Link
                        key={
                          contact.id
                        }
                        href={`/admin/customers/${contact.id}`}
                        className="block p-5 transition hover:bg-[#faf7f1]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#153f32]">
                              {displayName(
                                contact.first_name,
                                contact.last_name,
                                contact.email,
                                contact.phone
                              )}
                            </p>

                            {contact.email && (
                              <p className="mt-1 break-all text-sm text-[#607068]">
                                {
                                  contact.email
                                }
                              </p>
                            )}

                            {contact.phone && (
                              <p className="mt-1 text-sm text-[#607068]">
                                {
                                  contact.phone
                                }
                              </p>
                            )}
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${typeClasses(
                              contact.contact_type
                            )}`}
                          >
                            {contact.contact_type ===
                            "customer"
                              ? "Customer"
                              : "Prospect"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-[#faf7f1] p-3">
                            <p className="text-xs text-[#718078]">
                              Orders
                            </p>

                            <p className="mt-1 font-semibold text-[#153f32]">
                              {
                                contact.order_count
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#faf7f1] p-3">
                            <p className="text-xs text-[#718078]">
                              Lifetime Value
                            </p>

                            <p className="mt-1 font-semibold text-[#153f32]">
                              {formatMoney(
                                contact.lifetime_value
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${consentClasses(
                              emailSubscribed
                            )}`}
                          >
                            Email{" "}
                            {emailSubscribed
                              ? "Subscribed"
                              : "Not subscribed"}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${consentClasses(
                              smsSubscribed
                            )}`}
                          >
                            SMS{" "}
                            {smsSubscribed
                              ? "Subscribed"
                              : "Not subscribed"}
                          </span>
                        </div>

                        <p className="mt-4 text-xs text-[#718078]">
                          Last order:{" "}
                          {formatDate(
                            contact.last_order_at
                          )}
                        </p>
                      </Link>
                    );
                  }
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
