import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{
    month?: string;
  }>;
};

type CalendarEventType =
  | "production_start"
  | "production"
  | "pickup"
  | "delivery"
  | "wedding"
  | "consultation"
  | "follow_up";

type CalendarEvent = {
  id: string;
  dateKey: string;
  timeLabel: string | null;
  title: string;
  subtitle: string | null;
  href: string;
  type: CalendarEventType;
};

const activeWeddingStatuses = [
  "new",
  "contacted",
  "consultation_scheduled",
  "quote_sent",
  "booked",
];

function getEasternDateParts(
  value: Date
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(value);

  const record =
    Object.fromEntries(
      parts
        .filter((part) =>
          [
            "year",
            "month",
            "day",
          ].includes(part.type)
        )
        .map((part) => [
          part.type,
          part.value,
        ])
    );

  return {
    year: record.year,
    month: record.month,
    day: record.day,
  };
}

function getEasternDateKey(
  value: Date
) {
  const parts =
    getEasternDateParts(value);

  return (
    `${parts.year}-` +
    `${parts.month}-` +
    `${parts.day}`
  );
}

function getEasternMonthKey(
  value: Date
) {
  const parts =
    getEasternDateParts(value);

  return (
    `${parts.year}-` +
    `${parts.month}`
  );
}

function addCalendarDays(
  dateKey: string,
  days: number
) {
  const [
    year,
    month,
    day,
  ] = dateKey
    .split("-")
    .map(Number);

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12
      )
    );

  date.setUTCDate(
    date.getUTCDate() +
      days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

function getEasternTimeLabel(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function parseMonth(
  value: string | undefined,
  fallback: string
) {
  if (
    value &&
    /^\d{4}-\d{2}$/.test(value)
  ) {
    const [
      yearText,
      monthText,
    ] = value.split("-");

    const year =
      Number(yearText);

    const month =
      Number(monthText);

    if (
      year >= 2020 &&
      year <= 2100 &&
      month >= 1 &&
      month <= 12
    ) {
      return {
        year,
        month,
        key: value,
      };
    }
  }

  const [
    yearText,
    monthText,
  ] = fallback.split("-");

  return {
    year:
      Number(yearText),
    month:
      Number(monthText),
    key: fallback,
  };
}

function monthKey(
  year: number,
  month: number
) {
  return (
    `${year}-` +
    `${String(month).padStart(
      2,
      "0"
    )}`
  );
}

function shiftMonth(
  year: number,
  month: number,
  amount: number
) {
  const date =
    new Date(
      Date.UTC(
        year,
        month - 1 + amount,
        1
      )
    );

  return monthKey(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1
  );
}

function getMonthName(
  year: number,
  month: number
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      Date.UTC(
        year,
        month - 1,
        1
      )
    )
  );
}

function formatAgendaDate(
  dateKey: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${dateKey}T12:00:00Z`
    )
  );
}

function eventClasses(
  type: CalendarEventType
) {
  switch (type) {
    case "production_start":
      return "border-[#775d2f]/20 bg-[#fff0d9] text-[#7a5725]";

    case "production":
      return "border-[#775d2f]/15 bg-[#f4ead8] text-[#775d2f]";

    case "pickup":
      return "border-[#31583b]/15 bg-[#e6f2e3] text-[#31583b]";

    case "delivery":
      return "border-[#365b7a]/15 bg-[#e6edf7] text-[#365b7a]";

    case "wedding":
      return "border-[#a7473f]/15 bg-[#f8e1dc] text-[#8f3f38]";

    case "consultation":
      return "border-[#5f4f7d]/15 bg-[#eee9f7] text-[#5f4f7d]";

    case "follow_up":
      return "border-[#775d2f]/15 bg-[#f4ead8] text-[#775d2f]";
  }
}

function eventLabel(
  type: CalendarEventType
) {
  switch (type) {
    case "production_start":
      return "Production Start";

    case "production":
      return "In Production";

    case "pickup":
      return "Pickup";

    case "delivery":
      return "Delivery";

    case "wedding":
      return "Wedding";

    case "consultation":
      return "Consultation";

    case "follow_up":
      return "Follow-Up";
  }
}

export default async function ProductionCalendarPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const now =
    new Date();

  const todayKey =
    getEasternDateKey(now);

  const currentMonthKey =
    getEasternMonthKey(now);

  const selected =
    parseMonth(
      params.month,
      currentMonthKey
    );

  const firstDate =
    `${selected.key}-01`;

  const lastDay =
    new Date(
      Date.UTC(
        selected.year,
        selected.month,
        0
      )
    ).getUTCDate();

  const lastDate =
    `${selected.key}-${String(
      lastDay
    ).padStart(2, "0")}`;

  // Pull orders far enough back that an order fulfilled
  // near the beginning of this month can still show its
  // production window in the selected month.
  const orderQueryStart =
    addCalendarDays(
      firstDate,
      -31
    );

  const previousMonth =
    shiftMonth(
      selected.year,
      selected.month,
      -1
    );

  const nextMonth =
    shiftMonth(
      selected.year,
      selected.month,
      1
    );

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

  const [
    ordersResult,
    weddingsResult,
    activeWeddingActivityResult,
    overdueFollowUpsResult,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        fulfillment_type,
        requested_fulfillment_date,
        required_lead_time_days,
        status
      `)
      .gte(
        "requested_fulfillment_date",
        orderQueryStart
      )
      .lte(
        "requested_fulfillment_date",
        lastDate
      )
      .in("status", [
        "paid",
        "preparing",
        "ready",
        "out_for_delivery",
        "completed",
      ])
      .order(
        "requested_fulfillment_date",
        {
          ascending: true,
        }
      ),

    supabase
      .from("wedding_inquiries")
      .select(`
        id,
        inquiry_number,
        contact_name,
        partner_name,
        wedding_date,
        status
      `)
      .eq("status", "booked")
      .gte(
        "wedding_date",
        firstDate
      )
      .lte(
        "wedding_date",
        lastDate
      )
      .order(
        "wedding_date",
        {
          ascending: true,
        }
      ),

    supabase
      .from("wedding_inquiries")
      .select(`
        id,
        inquiry_number,
        contact_name,
        partner_name,
        status,
        consultation_at,
        follow_up_at
      `)
      .in(
        "status",
        activeWeddingStatuses
      ),

    supabase
      .from("wedding_inquiries")
      .select(`
        id,
        inquiry_number,
        contact_name,
        partner_name,
        follow_up_at
      `)
      .lt(
        "follow_up_at",
        now.toISOString()
      )
      .in(
        "status",
        activeWeddingStatuses
      )
      .order(
        "follow_up_at",
        {
          ascending: true,
        }
      ),
  ]);

  if (ordersResult.error) {
    throw new Error(
      ordersResult.error.message
    );
  }

  if (weddingsResult.error) {
    throw new Error(
      weddingsResult.error.message
    );
  }

  if (
    activeWeddingActivityResult.error
  ) {
    throw new Error(
      activeWeddingActivityResult
        .error.message
    );
  }

  if (
    overdueFollowUpsResult.error
  ) {
    throw new Error(
      overdueFollowUpsResult
        .error.message
    );
  }

  const events:
    CalendarEvent[] = [];

  for (
    const order of
      ordersResult.data ?? []
  ) {
    if (
      !order.requested_fulfillment_date
    ) {
      continue;
    }

    const fulfillmentDate =
      order.requested_fulfillment_date;

    const leadTimeDays =
      Math.max(
        0,
        Number(
          order.required_lead_time_days ??
            0
        )
      );

    // Fulfillment event.
    if (
      fulfillmentDate >= firstDate &&
      fulfillmentDate <= lastDate
    ) {
      events.push({
        id:
          `order-${order.id}`,
        dateKey:
          fulfillmentDate,
        timeLabel: null,
        title:
          order.order_number,
        subtitle:
          order.customer_name,
        href:
          `/admin/orders/${order.id}`,
        type:
          order.fulfillment_type ===
          "delivery"
            ? "delivery"
            : "pickup",
      });
    }

    // Production window:
    //
    // A 3-day lead time due Oct 10 produces:
    // Oct 7 = Production Start
    // Oct 8 = In Production
    // Oct 9 = In Production
    // Oct 10 = Fulfillment
    //
    // This mirrors the site's existing calendar-day
    // lead-time semantics.
    if (
      leadTimeDays > 0
    ) {
      const productionStart =
        addCalendarDays(
          fulfillmentDate,
          -leadTimeDays
        );

      for (
        let offset = 0;
        offset <
        leadTimeDays;
        offset += 1
      ) {
        const productionDate =
          addCalendarDays(
            productionStart,
            offset
          );

        if (
          productionDate <
            firstDate ||
          productionDate >
            lastDate
        ) {
          continue;
        }

        events.push({
          id:
            `production-${order.id}-${productionDate}`,
          dateKey:
            productionDate,
          timeLabel: null,
          title:
            order.order_number,
          subtitle:
            order.customer_name,
          href:
            `/admin/orders/${order.id}`,
          type:
            offset === 0
              ? "production_start"
              : "production",
        });
      }
    }
  }

  for (
    const wedding of
      weddingsResult.data ?? []
  ) {
    const couple =
      wedding.partner_name
        ? `${wedding.contact_name} & ${wedding.partner_name}`
        : wedding.contact_name;

    events.push({
      id:
        `wedding-${wedding.id}`,
      dateKey:
        wedding.wedding_date,
      timeLabel: null,
      title:
        wedding.inquiry_number,
      subtitle: couple,
      href:
        `/admin/weddings/${wedding.id}`,
      type: "wedding",
    });
  }

  for (
    const inquiry of
      activeWeddingActivityResult.data ??
      []
  ) {
    const couple =
      inquiry.partner_name
        ? `${inquiry.contact_name} & ${inquiry.partner_name}`
        : inquiry.contact_name;

    if (
      inquiry.consultation_at
    ) {
      const dateKey =
        getEasternDateKey(
          new Date(
            inquiry.consultation_at
          )
        );

      if (
        dateKey >= firstDate &&
        dateKey <= lastDate
      ) {
        events.push({
          id:
            `consultation-${inquiry.id}`,
          dateKey,
          timeLabel:
            getEasternTimeLabel(
              inquiry.consultation_at
            ),
          title:
            inquiry.inquiry_number,
          subtitle: couple,
          href:
            `/admin/weddings/${inquiry.id}`,
          type:
            "consultation",
        });
      }
    }

    if (
      inquiry.follow_up_at
    ) {
      const dateKey =
        getEasternDateKey(
          new Date(
            inquiry.follow_up_at
          )
        );

      if (
        dateKey >= firstDate &&
        dateKey <= lastDate
      ) {
        events.push({
          id:
            `followup-${inquiry.id}`,
          dateKey,
          timeLabel:
            getEasternTimeLabel(
              inquiry.follow_up_at
            ),
          title:
            inquiry.inquiry_number,
          subtitle: couple,
          href:
            `/admin/weddings/${inquiry.id}`,
          type:
            "follow_up",
        });
      }
    }
  }

  events.sort(
    (a, b) => {
      const dateCompare =
        a.dateKey.localeCompare(
          b.dateKey
        );

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (
        a.timeLabel ?? ""
      ).localeCompare(
        b.timeLabel ?? ""
      );
    }
  );

  const eventsByDate =
    new Map<
      string,
      CalendarEvent[]
    >();

  for (
    const event of events
  ) {
    const existing =
      eventsByDate.get(
        event.dateKey
      ) ?? [];

    existing.push(event);

    eventsByDate.set(
      event.dateKey,
      existing
    );
  }

  const firstWeekday =
    new Date(
      Date.UTC(
        selected.year,
        selected.month - 1,
        1
      )
    ).getUTCDay();

  const gridStart =
    new Date(
      Date.UTC(
        selected.year,
        selected.month - 1,
        1 - firstWeekday
      )
    );

  const calendarDays =
    Array.from(
      {
        length: 42,
      },
      (_, index) => {
        const date =
          new Date(
            gridStart.getTime() +
              index *
                24 *
                60 *
                60 *
                1000
          );

        const dateKey =
          date
            .toISOString()
            .slice(0, 10);

        return {
          dateKey,
          day:
            date.getUTCDate(),
          inMonth:
            date.getUTCMonth() +
              1 ===
            selected.month,
          events:
            eventsByDate.get(
              dateKey
            ) ?? [],
        };
      }
    );

  const agendaDates =
    Array.from(
      eventsByDate.keys()
    ).sort();

  const overdueFollowUps =
    overdueFollowUpsResult.data ??
    [];

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-8 text-[#284239] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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
              Production Calendar
            </h1>

            <p className="mt-3 max-w-2xl text-[#607068]">
              Orders, deliveries,
              wedding events,
              consultations, and
              follow-ups in one
              operational calendar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/calendar?month=${previousMonth}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-4 text-sm font-semibold transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              ← Previous
            </Link>

            <Link
              href="/admin/calendar"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
            >
              Today
            </Link>

            <Link
              href={`/admin/calendar?month=${nextMonth}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-4 text-sm font-semibold transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Next →
            </Link>
          </div>
        </div>

        <section className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Calendar Month
            </p>

            <h2 className="mt-1 font-serif text-3xl font-semibold text-[#153f32]">
              {getMonthName(
                selected.year,
                selected.month
              )}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              [
                "production_start",
                "Production Start",
              ],
              [
                "production",
                "In Production",
              ],
              [
                "pickup",
                "Pickup",
              ],
              [
                "delivery",
                "Delivery",
              ],
              [
                "wedding",
                "Wedding",
              ],
              [
                "consultation",
                "Consultation",
              ],
              [
                "follow_up",
                "Follow-Up",
              ],
            ].map(
              ([
                type,
                label,
              ]) => (
                <span
                  key={type}
                  className={`rounded-full border px-3 py-1.5 ${eventClasses(
                    type as CalendarEventType
                  )}`}
                >
                  {label}
                </span>
              )
            )}
          </div>
        </section>

        {overdueFollowUps.length >
          0 && (
          <section className="mt-6 rounded-[1.5rem] border border-[#a7473f]/20 bg-[#fff0ed] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a7473f]">
                  Needs Attention
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#7e332e]">
                  {
                    overdueFollowUps.length
                  }{" "}
                  overdue wedding{" "}
                  {overdueFollowUps.length ===
                  1
                    ? "follow-up"
                    : "follow-ups"}
                </h2>
              </div>

              <Link
                href="/admin/weddings"
                className="text-sm font-semibold text-[#a7473f]"
              >
                Manage leads →
              </Link>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {overdueFollowUps
                .slice(0, 6)
                .map(
                  (
                    inquiry
                  ) => (
                    <Link
                      key={
                        inquiry.id
                      }
                      href={`/admin/weddings/${inquiry.id}`}
                      className="rounded-xl bg-white p-4 transition hover:-translate-y-0.5"
                    >
                      <p className="font-semibold text-[#153f32]">
                        {
                          inquiry.inquiry_number
                        }
                      </p>

                      <p className="mt-1 text-sm text-[#607068]">
                        {
                          inquiry.contact_name
                        }
                        {inquiry.partner_name
                          ? ` & ${inquiry.partner_name}`
                          : ""}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-[#a7473f]">
                        Due{" "}
                        {getEasternTimeLabel(
                          inquiry.follow_up_at
                        )}{" "}
                        ·{" "}
                        {formatAgendaDate(
                          getEasternDateKey(
                            new Date(
                              inquiry.follow_up_at
                            )
                          )
                        )}
                      </p>
                    </Link>
                  )
                )}
            </div>
          </section>
        )}

        {/* DESKTOP / TABLET MONTH GRID */}
        <section className="mt-6 hidden overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm md:block">
          <div className="grid grid-cols-7 border-b border-[#284239]/10 bg-[#faf7f1]">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map(
              (day) => (
                <div
                  key={day}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#607068]"
                >
                  {day}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map(
              (day) => (
                <div
                  key={
                    day.dateKey
                  }
                  className={`min-h-40 border-b border-r border-[#284239]/10 p-2 xl:min-h-44 ${
                    day.inMonth
                      ? "bg-white"
                      : "bg-[#faf7f1]/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        day.dateKey ===
                        todayKey
                          ? "bg-[#e76d61] text-white"
                          : day.inMonth
                            ? "text-[#153f32]"
                            : "text-[#9aa59f]"
                      }`}
                    >
                      {day.day}
                    </span>

                    {day.events.length >
                      0 && (
                      <span className="text-xs font-semibold text-[#718078]">
                        {
                          day.events
                            .length
                        }
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {day.events
                      .slice(0, 4)
                      .map(
                        (
                          event
                        ) => (
                          <Link
                            key={
                              event.id
                            }
                            href={
                              event.href
                            }
                            className={`block rounded-lg border px-2 py-1.5 text-[11px] leading-4 transition hover:-translate-y-px ${eventClasses(
                              event.type
                            )}`}
                          >
                            <p className="font-semibold">
                              {event.timeLabel
                                ? `${event.timeLabel} · `
                                : ""}
                              {eventLabel(
                                event.type
                              )}
                            </p>

                            <p className="truncate font-medium">
                              {
                                event.title
                              }
                            </p>

                            {event.subtitle && (
                              <p className="truncate opacity-80">
                                {
                                  event.subtitle
                                }
                              </p>
                            )}
                          </Link>
                        )
                      )}

                    {day.events.length >
                      4 && (
                      <p className="px-1 text-[11px] font-semibold text-[#607068]">
                        +
                        {day.events
                          .length -
                          4}{" "}
                        more
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* MOBILE AGENDA */}
        <section className="mt-6 md:hidden">
          {agendaDates.length ===
          0 ? (
            <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-8 text-center shadow-sm">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                No scheduled work
              </h2>

              <p className="mt-2 text-sm text-[#607068]">
                There are no
                production or wedding
                events scheduled for
                this month.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agendaDates.map(
                (dateKey) => {
                  const dayEvents =
                    eventsByDate.get(
                      dateKey
                    ) ?? [];

                  return (
                    <section
                      key={
                        dateKey
                      }
                      className="overflow-hidden rounded-[1.5rem] border border-[#284239]/10 bg-white shadow-sm"
                    >
                      <div className="border-b border-[#284239]/10 bg-[#faf7f1] px-5 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                            {formatAgendaDate(
                              dateKey
                            )}
                          </h2>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#607068]">
                            {
                              dayEvents.length
                            }
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-[#284239]/10">
                        {dayEvents.map(
                          (
                            event
                          ) => (
                            <Link
                              key={
                                event.id
                              }
                              href={
                                event.href
                              }
                              className="block p-5 transition hover:bg-[#faf7f1]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span
                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${eventClasses(
                                      event.type
                                    )}`}
                                  >
                                    {eventLabel(
                                      event.type
                                    )}
                                  </span>

                                  <p className="mt-3 font-semibold text-[#153f32]">
                                    {
                                      event.title
                                    }
                                  </p>

                                  {event.subtitle && (
                                    <p className="mt-1 text-sm text-[#607068]">
                                      {
                                        event.subtitle
                                      }
                                    </p>
                                  )}
                                </div>

                                {event.timeLabel && (
                                  <span className="shrink-0 text-sm font-semibold text-[#607068]">
                                    {
                                      event.timeLabel
                                    }
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        )}
                      </div>
                    </section>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {(
            [
              "production_start",
              "production",
              "pickup",
              "delivery",
              "wedding",
              "consultation",
              "follow_up",
            ] as CalendarEventType[]
          ).map(
            (type) => {
              const count =
                events.filter(
                  (event) =>
                    event.type ===
                    type
                ).length;

              return (
                <div
                  key={type}
                  className={`rounded-[1.25rem] border p-4 ${eventClasses(
                    type
                  )}`}
                >
                  <p className="text-3xl font-semibold">
                    {count}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {eventLabel(
                      type
                    )}
                    {count === 1
                      ? ""
                      : "s"}
                  </p>
                </div>
              );
            }
          )}
        </section>
      </div>
    </main>
  );
}
