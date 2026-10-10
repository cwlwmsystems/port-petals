"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

type CalendarEventType =
  | "production_start"
  | "production"
  | "pickup"
  | "delivery"
  | "wedding"
  | "consultation"
  | "follow_up"
  | "manual_work";

type CalendarEvent = {
  id: string;
  dateKey: string;
  timeLabel: string | null;
  title: string;
  subtitle: string | null;
  href: string;
  type: CalendarEventType;
};

type CalendarDay = {
  dateKey: string;
  day: number;
  inMonth: boolean;
  events: CalendarEvent[];
};

export type ProductionSpan = {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  customerName: string | null;
  href: string;
  sourceType: "order" | "manual";
  status: string | null;
  fulfillmentType: string | null;
  dueTime: string | null;
  source: string | null;
  workType: string | null;
  notes: string | null;
};

type Props = {
  calendarDays: CalendarDay[];
  productionSpans: ProductionSpan[];
  todayKey: string;
};

function eventClasses(
  type: CalendarEventType
) {
  switch (type) {
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

    case "manual_work":
      return "border-[#e76d61]/20 bg-[#fff0ed] text-[#9b463e]";

    default:
      return "border-[#775d2f]/15 bg-[#f4ead8] text-[#775d2f]";
  }
}

function eventLabel(
  type: CalendarEventType
) {
  switch (type) {
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

    case "manual_work":
      return "Manual Work";

    case "production_start":
      return "Production Start";

    case "production":
      return "In Production";
  }
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${value}T12:00:00Z`
    )
  );
}

function formatTime(
  value: string | null
) {
  if (!value) {
    return null;
  }

  const [
    hourText,
    minuteText,
  ] =
    value
      .slice(0, 5)
      .split(":");

  let hour =
    Number(hourText);

  const minute =
    minuteText ?? "00";

  const suffix =
    hour >= 12
      ? "PM"
      : "AM";

  hour =
    hour % 12 || 12;

  return `${hour}:${minute} ${suffix}`;
}

function prettyValue(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function clampDate(
  value: string,
  minimum: string,
  maximum: string
) {
  if (value < minimum) {
    return minimum;
  }

  if (value > maximum) {
    return maximum;
  }

  return value;
}

export default function ProductionCalendarGrid({
  calendarDays,
  productionSpans,
  todayKey,
}: Props) {
  const [
    selectedSpan,
    setSelectedSpan,
  ] =
    useState<
      ProductionSpan | null
    >(null);

  const weeks =
    useMemo(
      () =>
        Array.from(
          {
            length: 6,
          },
          (_, weekIndex) =>
            calendarDays.slice(
              weekIndex * 7,
              weekIndex * 7 + 7
            )
        ),
      [calendarDays]
    );

  return (
    <>
      <section className="mt-5 hidden overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)] lg:block">
        <div className="grid grid-cols-7 border-b border-[#284239]/10 bg-[#f5f7f4]">
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

        {weeks.map(
          (
            week,
            weekIndex
          ) => {
            const weekStart =
              week[0]
                ?.dateKey;

            const weekEnd =
              week[6]
                ?.dateKey;

            if (
              !weekStart ||
              !weekEnd
            ) {
              return null;
            }

            const spans =
              productionSpans
                .filter(
                  (span) =>
                    span.startDate <=
                      weekEnd &&
                    span.endDate >=
                      weekStart
                )
                .map(
                  (span) => {
                    const visibleStart =
                      clampDate(
                        span.startDate,
                        weekStart,
                        weekEnd
                      );

                    const visibleEnd =
                      clampDate(
                        span.endDate,
                        weekStart,
                        weekEnd
                      );

                    const startColumn =
                      week.findIndex(
                        (day) =>
                          day.dateKey ===
                          visibleStart
                      ) + 1;

                    const endColumn =
                      week.findIndex(
                        (day) =>
                          day.dateKey ===
                          visibleEnd
                      ) + 2;

                    return {
                      ...span,
                      startColumn,
                      endColumn,
                      continuesBefore:
                        span.startDate <
                        weekStart,
                      continuesAfter:
                        span.endDate >
                        weekEnd,
                    };
                  }
                );

            return (
              <div
                key={
                  weekIndex
                }
                className="border-b border-[#284239]/10 last:border-b-0"
              >
                <div className="grid grid-cols-7">
                  {week.map(
                    (day) => (
                      <div
                        key={
                          day.dateKey
                        }
                        className={`border-r border-[#284239]/10 px-2 pt-2 ${
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
                            {
                              day.day
                            }
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {spans.length >
                  0 && (
                  <div className="grid grid-cols-7 gap-y-1 border-x-0 border-[#284239]/10 px-1.5 py-1.5">
                    {spans.map(
                      (
                        span,
                        index
                      ) => (
                        <button
                          key={`${span.id}-${weekIndex}`}
                          type="button"
                          onClick={() =>
                            setSelectedSpan(
                              span
                            )
                          }
                          style={{
                            gridColumn:
                              `${span.startColumn} / ${span.endColumn}`,
                            gridRow:
                              index +
                              1,
                          }}
                          className={`group flex min-h-6 items-stretch overflow-hidden border text-left text-[11px] font-semibold leading-5 shadow-sm transition hover:-translate-y-px hover:shadow ${
                            span.sourceType ===
                            "manual"
                              ? "border-[#e76d61]/25"
                              : "border-[#775d2f]/20"
                          } ${
                            span.continuesBefore
                              ? "rounded-l-sm"
                              : "rounded-l-full"
                          } ${
                            span.continuesAfter
                              ? "rounded-r-sm"
                              : "rounded-r-full"
                          }`}
                          title={
                            span.title
                          }
                        >
                          <span
                            className={`flex min-w-0 flex-1 items-center px-2 ${
                              span.sourceType ===
                              "manual"
                                ? "bg-[#fff0ed] text-[#98463e]"
                                : "bg-[#f4ead8] text-[#775d2f]"
                            }`}
                          >
                            <span className="truncate">
                              {span.sourceType ===
                              "manual"
                                ? "Manual · "
                                : ""}
                              {
                                span.title
                              }
                            </span>
                          </span>

                          {!span.continuesAfter && (
                            <span
                              className={`flex shrink-0 items-center px-2 text-[10px] font-bold uppercase tracking-[0.05em] text-white ${
                                span.fulfillmentType ===
                                "pickup"
                                  ? "bg-[#31583b]"
                                  : span.fulfillmentType ===
                                      "delivery"
                                    ? "bg-[#365b7a]"
                                    : "bg-[#718078]"
                              }`}
                            >
                              {span.fulfillmentType ===
                              "pickup"
                                ? "Pickup"
                                : span.fulfillmentType ===
                                    "delivery"
                                  ? "Delivery"
                                  : "Due"}
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}

                <div className="grid grid-cols-7">
                  {week.map(
                    (day) => {
                      const spanHrefs =
                        new Set(
                          productionSpans.map(
                            (span) =>
                              span.href
                          )
                        );

                      const singleDayEvents =
                        day.events.filter(
                          (
                            event
                          ) => {
                            if (
                              [
                                "production_start",
                                "production",
                                "manual_work",
                              ].includes(
                                event.type
                              )
                            ) {
                              return false;
                            }

                            if (
                              (
                                event.type ===
                                  "pickup" ||
                                event.type ===
                                  "delivery"
                              ) &&
                              spanHrefs.has(
                                event.href
                              )
                            ) {
                              return false;
                            }

                            return true;
                          }
                        );

                      return (
                        <div
                          key={`${day.dateKey}-events`}
                          className={`min-h-24 border-r border-[#284239]/10 p-2 ${
                            day.inMonth
                              ? "bg-white"
                              : "bg-[#faf7f1]/70"
                          }`}
                        >
                          <div className="space-y-1.5">
                            {singleDayEvents
                              .slice(
                                0,
                                4
                              )
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

                            {singleDayEvents.length >
                              4 && (
                              <p className="px-1 text-[11px] font-semibold text-[#607068]">
                                +
                                {singleDayEvents.length -
                                  4}{" "}
                                more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          }
        )}
      </section>

      {selectedSpan && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#153f32]/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedSpan(
                null
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="production-work-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl"
          >
            <div className="border-b border-[#284239]/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                    {selectedSpan.sourceType ===
                    "manual"
                      ? "Manual Work"
                      : "Website Order"}
                  </p>

                  <h2
                    id="production-work-title"
                    className="mt-1 font-serif text-2xl font-semibold text-[#153f32]"
                  >
                    {
                      selectedSpan.title
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSpan(
                      null
                    )
                  }
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#284239]/10 text-xl text-[#607068] transition hover:bg-[#f5f7f4]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Customer
                  </p>

                  <p className="mt-1 font-medium text-[#153f32]">
                    {selectedSpan.customerName ??
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Status
                  </p>

                  <p className="mt-1 font-medium text-[#153f32]">
                    {prettyValue(
                      selectedSpan.status
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Production
                  </p>

                  <p className="mt-1 font-medium text-[#153f32]">
                    {formatDate(
                      selectedSpan.startDate
                    )}{" "}
                    →{" "}
                    {formatDate(
                      selectedSpan.endDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Fulfillment
                  </p>

                  <p className="mt-1 font-medium text-[#153f32]">
                    {prettyValue(
                      selectedSpan.fulfillmentType
                    )}
                    {selectedSpan.dueTime
                      ? ` · ${formatTime(
                          selectedSpan.dueTime
                        )}`
                      : ""}
                  </p>
                </div>

                {selectedSpan.sourceType ===
                  "manual" && (
                  <>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                        Source
                      </p>

                      <p className="mt-1 font-medium text-[#153f32]">
                        {prettyValue(
                          selectedSpan.source
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                        Work Type
                      </p>

                      <p className="mt-1 font-medium text-[#153f32]">
                        {prettyValue(
                          selectedSpan.workType
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {selectedSpan.notes && (
                <div className="rounded-xl bg-[#f7f1e8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
                    Notes
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#284239]">
                    {
                      selectedSpan.notes
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#284239]/10 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setSelectedSpan(
                    null
                  )
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#284239]/15 bg-white px-5 text-sm font-semibold text-[#284239] transition hover:bg-[#f5f7f4]"
              >
                Close
              </button>

              <Link
                href={
                  selectedSpan.href
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
              >
                {selectedSpan.sourceType ===
                "manual"
                  ? "Edit Work"
                  : "View Order"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
