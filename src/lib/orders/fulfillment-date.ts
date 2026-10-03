export function getEasternDateKey(
  date = new Date()
) {
  const parts =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) =>
        ["year", "month", "day"].includes(
          part.type
        )
      )
      .map((part) => [
        part.type,
        part.value,
      ])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function addDaysToDateKey(
  dateKey: string,
  days: number
) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day, 12)
  );

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return date
    .toISOString()
    .slice(0, 10);
}

export function getEarliestFulfillmentDate(
  leadTimeDays: number,
  now = new Date()
) {
  const today = getEasternDateKey(now);

  const normalizedLeadTime =
    Number.isFinite(leadTimeDays)
      ? Math.max(
          0,
          Math.floor(leadTimeDays)
        )
      : 0;

  // A 3-day lead time means the NEXT
  // 3 calendar dates are blocked.
  //
  // Example:
  // Ordered Oct 2
  // Oct 3, 4, 5 blocked
  // Oct 6 first available
  const daysToAdd =
    normalizedLeadTime > 0
      ? normalizedLeadTime + 1
      : 0;

  return addDaysToDateKey(
    today,
    daysToAdd
  );
}
