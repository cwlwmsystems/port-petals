import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AdminWeddingsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  consultation_scheduled: "Consultation Scheduled",
  quote_sent: "Quote Sent",
  booked: "Booked",
  declined: "Declined",
  completed: "Completed",
};

function statusClasses(status: string) {
  switch (status) {
    case "new":
      return "bg-[#fff0d9] text-[#7a5725]";
    case "contacted":
      return "bg-[#e6edf7] text-[#365b7a]";
    case "consultation_scheduled":
      return "bg-[#e8e3f4] text-[#5f4f7d]";
    case "quote_sent":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "booked":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "declined":
      return "bg-[#f8e1dc] text-[#a7473f]";
    case "completed":
      return "bg-[#e5ebe7] text-[#3f584b]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(
    new Date(`${value}T12:00:00Z`)
  );
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

function displayName(
  contactName: string,
  partnerName: string | null
) {
  if (!partnerName) {
    return contactName;
  }

  return `${contactName} & ${partnerName}`;
}

export default async function AdminWeddingsPage({
  searchParams,
}: AdminWeddingsPageProps) {
  const params = await searchParams;

  const search =
    params.search?.trim() ?? "";

  const status =
    params.status?.trim() ?? "";

  const supabase =
    await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } =
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

  const now =
    new Date().toISOString();

  const [
    newCountResult,
    activeCountResult,
    bookedCountResult,
    followUpCountResult,
  ] = await Promise.all([
    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "new"),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in("status", [
        "new",
        "contacted",
        "consultation_scheduled",
        "quote_sent",
      ]),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "booked"),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .lte(
        "follow_up_at",
        now
      )
      .in("status", [
        "new",
        "contacted",
        "consultation_scheduled",
        "quote_sent",
        "booked",
      ]),
  ]);

  let query = supabase
    .from("wedding_inquiries")
    .select(`
      id,
      inquiry_number,
      status,
      contact_name,
      partner_name,
      email,
      phone,
      wedding_date,
      budget_range,
      quote_status,
      follow_up_at,
      consultation_at,
      created_at
    `)
    .order("wedding_date", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (search) {
    query = query.or(
      `inquiry_number.ilike.%${search}%,contact_name.ilike.%${search}%,partner_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  if (status) {
    query = query.eq(
      "status",
      status
    );
  }

  const {
    data: inquiries,
    error,
  } = await query;

  if (error) {
    throw new Error(
      error.message
    );
  }

  const hasFilters =
    Boolean(search || status);

  const summaryCards = [
    {
      label: "New Leads",
      value:
        newCountResult.count ??
        0,
    },
    {
      label: "Active Leads",
      value:
        activeCountResult.count ??
        0,
    },
    {
      label: "Booked",
      value:
        bookedCountResult.count ??
        0,
    },
    {
      label: "Follow-Ups Due",
      value:
        followUpCountResult.count ??
        0,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
            Port Petals Admin
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
            Wedding Leads
          </h1>

          <p className="mt-3 max-w-2xl text-[#607068]">
            Manage wedding inquiries,
            consultations, quotes,
            follow-ups, and booked
            events.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(
            (card) => (
              <div
                key={card.label}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-[#607068]">
                  {card.label}
                </p>

                <p className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
                  {card.value}
                </p>
              </div>
            )
          )}
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
          <form
            method="GET"
            className="grid gap-4 md:grid-cols-[1fr_260px_auto]"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Search Wedding Leads
              </span>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Inquiry #, name, email, phone..."
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Lead Status
              </span>

              <select
                name="status"
                defaultValue={
                  status
                }
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              >
                <option value="">
                  All Statuses
                </option>

                {Object.entries(
                  statusLabels
                ).map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#284239] px-5 py-3 font-semibold text-white transition hover:bg-[#1d332b]"
              >
                Apply
              </button>

              {hasFilters && (
                <Link
                  href="/admin/weddings"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 px-4 py-3 text-sm font-semibold transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
          {!inquiries ||
          inquiries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                No wedding leads found
              </h2>

              <p className="mt-2 text-[#607068]">
                {hasFilters
                  ? "Try changing or clearing the current filters."
                  : "New wedding inquiries will appear here automatically."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-[#284239]/10 bg-[#faf7f1] text-xs uppercase tracking-[0.12em] text-[#607068]">
                    <tr>
                      <th className="px-6 py-4">
                        Inquiry
                      </th>

                      <th className="px-6 py-4">
                        Couple / Contact
                      </th>

                      <th className="px-6 py-4">
                        Wedding
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Budget
                      </th>

                      <th className="px-6 py-4">
                        Follow-Up
                      </th>

                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#284239]/10">
                    {inquiries.map(
                      (
                        inquiry
                      ) => (
                        <tr
                          key={
                            inquiry.id
                          }
                          className="transition hover:bg-[#faf7f1]"
                        >
                          <td className="px-6 py-5">
                            <p className="font-semibold text-[#153f32]">
                              {
                                inquiry.inquiry_number
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#718078]">
                              Received{" "}
                              {formatDateTime(
                                inquiry.created_at
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-medium">
                              {displayName(
                                inquiry.contact_name,
                                inquiry.partner_name
                              )}
                            </p>

                            <p className="mt-1 text-sm text-[#607068]">
                              {
                                inquiry.email
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-medium text-[#153f32]">
                              {formatDate(
                                inquiry.wedding_date
                              )}
                            </p>

                            {inquiry.consultation_at && (
                              <p className="mt-1 text-xs text-[#718078]">
                                Consultation:{" "}
                                {formatDateTime(
                                  inquiry.consultation_at
                                )}
                              </p>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                                inquiry.status
                              )}`}
                            >
                              {statusLabels[
                                inquiry
                                  .status
                              ] ??
                                inquiry.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm">
                            {inquiry.budget_range ??
                              "—"}
                          </td>

                          <td className="px-6 py-5 text-sm">
                            {formatDateTime(
                              inquiry.follow_up_at
                            )}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              href={`/admin/weddings/${inquiry.id}`}
                              className="font-semibold text-[#e76d61] transition hover:text-[#c95349]"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#284239]/10 lg:hidden">
                {inquiries.map(
                  (inquiry) => (
                    <Link
                      key={
                        inquiry.id
                      }
                      href={`/admin/weddings/${inquiry.id}`}
                      className="block p-5 transition hover:bg-[#faf7f1]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#153f32]">
                            {
                              inquiry.inquiry_number
                            }
                          </p>

                          <p className="mt-1 text-sm text-[#607068]">
                            {displayName(
                              inquiry.contact_name,
                              inquiry.partner_name
                            )}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                            inquiry.status
                          )}`}
                        >
                          {statusLabels[
                            inquiry.status
                          ] ??
                            inquiry.status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-[#607068]">
                        <p>
                          Wedding:{" "}
                          <strong className="text-[#284239]">
                            {formatDate(
                              inquiry.wedding_date
                            )}
                          </strong>
                        </p>

                        <p>
                          Budget:{" "}
                          {inquiry.budget_range ??
                            "—"}
                        </p>

                        <p>
                          Follow-up:{" "}
                          {formatDateTime(
                            inquiry.follow_up_at
                          )}
                        </p>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
