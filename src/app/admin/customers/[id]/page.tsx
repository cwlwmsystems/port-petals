import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CustomerActions from "./CustomerActions";

type Props = {
  params: Promise<{
    id: string;
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

function formatDateTime(
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
      hour: "numeric",
      minute: "2-digit",
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

function consentState({
  consent,
  unsubscribedAt,
}: {
  consent: boolean;
  unsubscribedAt:
    | string
    | null;
}) {
  if (unsubscribedAt) {
    return {
      label:
        "Unsubscribed",
      classes:
        "bg-[#f8e1dc] text-[#a7473f]",
    };
  }

  if (consent) {
    return {
      label:
        "Subscribed",
      classes:
        "bg-[#e6f2e3] text-[#31583b]",
    };
  }

  return {
    label:
      "Not Subscribed",
    classes:
      "bg-[#edf1f6] text-[#607068]",
  };
}

function consentEventLabel(
  channel: string,
  action: string
) {
  const channelLabel =
    channel === "sms"
      ? "SMS"
      : "Email";

  return `${channelLabel} ${
    action === "opted_in"
      ? "Opt-In"
      : "Opt-Out"
  }`;
}

export default async function AdminCustomerDetailPage({
  params,
}: Props) {
  const {
    id,
  } = await params;

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

  const {
    data: contact,
    error: contactError,
  } =
    await supabase
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
        email_consent_at,
        email_consent_source,
        email_unsubscribed_at,
        sms_marketing_consent,
        sms_consent_at,
        sms_consent_source,
        sms_unsubscribed_at,
        created_at,
        updated_at
      `)
      .eq("id", id)
      .maybeSingle();

  if (contactError) {
    throw new Error(
      contactError.message
    );
  }

  if (!contact) {
    notFound();
  }

  const [
    interestsResult,
    consentEventsResult,
    ordersResult,
  ] = await Promise.all([
    supabase
      .from(
        "marketing_contact_interests"
      )
      .select(`
        interest,
        source,
        created_at
      `)
      .eq(
        "contact_id",
        contact.id
      )
      .order(
        "interest",
        {
          ascending: true,
        }
      ),

    supabase
      .from(
        "marketing_consent_events"
      )
      .select(`
        id,
        channel,
        action,
        source,
        occurred_at,
        metadata
      `)
      .eq(
        "contact_id",
        contact.id
      )
      .order(
        "occurred_at",
        {
          ascending: false,
        }
      ),

    contact.email
      ? supabase
          .from("orders")
          .select(`
            id,
            order_number,
            status,
            payment_status,
            total,
            fulfillment_type,
            requested_fulfillment_date,
            created_at,
            paid_at
          `)
          .ilike(
            "customer_email",
            contact.email
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);

  if (
    interestsResult.error
  ) {
    throw new Error(
      interestsResult
        .error.message
    );
  }

  if (
    consentEventsResult.error
  ) {
    throw new Error(
      consentEventsResult
        .error.message
    );
  }

  if (
    ordersResult.error
  ) {
    throw new Error(
      ordersResult
        .error.message
    );
  }

  const interests =
    interestsResult.data ??
    [];

  const consentEvents =
    consentEventsResult.data ??
    [];

  const orders =
    ordersResult.data ??
    [];

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "paid"
    );

  const emailState =
    consentState({
      consent:
        contact.email_marketing_consent,

      unsubscribedAt:
        contact.email_unsubscribed_at,
    });

  const smsState =
    consentState({
      consent:
        contact.sms_marketing_consent,

      unsubscribedAt:
        contact.sms_unsubscribed_at,
    });

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin/customers"
              className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
            >
              ← Back to Customers
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Customer CRM
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              {displayName(
                contact.first_name,
                contact.last_name,
                contact.email,
                contact.phone
              )}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  contact.contact_type ===
                  "customer"
                    ? "bg-[#e6f2e3] text-[#31583b]"
                    : "bg-[#f4ead8] text-[#775d2f]"
                }`}
              >
                {contact.contact_type ===
                "customer"
                  ? "Customer"
                  : "Prospect"}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${emailState.classes}`}
              >
                Email:{" "}
                {
                  emailState.label
                }
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${smsState.classes}`}
              >
                SMS:{" "}
                {
                  smsState.label
                }
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 text-sm font-semibold text-[#284239]"
              >
                Email Customer
              </a>
            )}

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 text-sm font-semibold text-[#284239]"
              >
                Call Customer
              </a>
            )}
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Paid Orders
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {
                contact.order_count
              }
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Lifetime Value
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {formatMoney(
                contact.lifetime_value
              )}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              First Order
            </p>

            <p className="mt-3 font-semibold text-[#153f32]">
              {formatDateTime(
                contact.first_order_at
              )}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Last Order
            </p>

            <p className="mt-3 font-semibold text-[#153f32]">
              {formatDateTime(
                contact.last_order_at
              )}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Contact Information
              </h2>

              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                    Email
                  </dt>

                  <dd className="mt-1 break-all text-[#284239]">
                    {contact.email ??
                      "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                    Phone
                  </dt>

                  <dd className="mt-1 text-[#284239]">
                    {contact.phone ??
                      "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                    Source
                  </dt>

                  <dd className="mt-1 text-[#284239]">
                    {contact.source ??
                      "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718078]">
                    CRM Created
                  </dt>

                  <dd className="mt-1 text-[#284239]">
                    {formatDateTime(
                      contact.created_at
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-6 py-5">
                <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Order History
                </h2>

                <p className="mt-1 text-sm text-[#718078]">
                  {
                    paidOrders.length
                  }{" "}
                  paid{" "}
                  {paidOrders.length ===
                  1
                    ? "order"
                    : "orders"}
                </p>
              </div>

              {orders.length ===
              0 ? (
                <div className="p-6 text-sm text-[#718078]">
                  No matching orders found.
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
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[#153f32]">
                              {
                                order.order_number
                              }
                            </p>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                order.payment_status ===
                                "paid"
                                  ? "bg-[#e6f2e3] text-[#31583b]"
                                  : "bg-[#f4ead8] text-[#775d2f]"
                              }`}
                            >
                              {
                                order.payment_status
                              }
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-[#607068]">
                            {order.fulfillment_type ===
                            "delivery"
                              ? "Delivery"
                              : "Pickup"}{" "}
                            ·{" "}
                            {
                              order.status
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#718078]">
                            Created{" "}
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

                          <p className="mt-2 text-sm font-semibold text-[#e76d61]">
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

          <aside className="space-y-6">
            <CustomerActions
              contactId={
                contact.id
              }
              firstName={
                contact.first_name
              }
              lastName={
                contact.last_name
              }
              email={
                contact.email
              }
              phone={
                contact.phone
              }
              currentInterests={
                interests.map(
                  (interest) =>
                    interest.interest
                )
              }
              emailSubscribed={
                Boolean(
                  contact.email_marketing_consent &&
                  !contact.email_unsubscribed_at
                )
              }
              smsSubscribed={
                Boolean(
                  contact.sms_marketing_consent &&
                  !contact.sms_unsubscribed_at
                )
              }
            />

            <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Marketing Consent
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#153f32]">
                      Email
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${emailState.classes}`}
                    >
                      {
                        emailState.label
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#718078]">
                    Consent:{" "}
                    {formatDateTime(
                      contact.email_consent_at
                    )}
                  </p>

                  <p className="text-xs leading-5 text-[#718078]">
                    Source:{" "}
                    {contact.email_consent_source ??
                      "—"}
                  </p>

                  {contact.email_unsubscribed_at && (
                    <p className="text-xs leading-5 text-[#a7473f]">
                      Unsubscribed:{" "}
                      {formatDateTime(
                        contact.email_unsubscribed_at
                      )}
                    </p>
                  )}
                </div>

                <div className="border-t border-[#284239]/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#153f32]">
                      SMS
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${smsState.classes}`}
                    >
                      {
                        smsState.label
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#718078]">
                    Consent:{" "}
                    {formatDateTime(
                      contact.sms_consent_at
                    )}
                  </p>

                  <p className="text-xs leading-5 text-[#718078]">
                    Source:{" "}
                    {contact.sms_consent_source ??
                      "—"}
                  </p>

                  {contact.sms_unsubscribed_at && (
                    <p className="text-xs leading-5 text-[#a7473f]">
                      Unsubscribed:{" "}
                      {formatDateTime(
                        contact.sms_unsubscribed_at
                      )}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Interests
              </h2>

              {interests.length ===
              0 ? (
                <p className="mt-4 text-sm text-[#718078]">
                  No interests assigned yet.
                </p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map(
                    (interest) => (
                      <span
                        key={
                          interest.interest
                        }
                        className="rounded-full bg-[#e6f2e3] px-3 py-1.5 text-xs font-semibold text-[#31583b]"
                      >
                        {
                          interest.interest
                        }
                      </span>
                    )
                  )}
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
              <div className="border-b border-[#284239]/10 px-6 py-5">
                <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                  Consent History
                </h2>
              </div>

              {consentEvents.length ===
              0 ? (
                <div className="p-6 text-sm text-[#718078]">
                  No consent events recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#284239]/10">
                  {consentEvents.map(
                    (event) => (
                      <div
                        key={
                          event.id
                        }
                        className="p-5"
                      >
                        <p className="font-semibold text-[#153f32]">
                          {consentEventLabel(
                            event.channel,
                            event.action
                          )}
                        </p>

                        <p className="mt-1 text-xs text-[#607068]">
                          {formatDateTime(
                            event.occurred_at
                          )}
                        </p>

                        <p className="mt-1 text-xs text-[#718078]">
                          Source:{" "}
                          {event.source ??
                            "—"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
