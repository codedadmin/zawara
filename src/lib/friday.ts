import type { WeekKey } from "./rsvp/types";

const FRIDAY = 5;
const pad = (n: number) => String(n).padStart(2, "0");

/** The coming Friday (today if it's Friday), at local noon to dodge DST edges. */
export function nextFriday(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + ((FRIDAY - d.getDay() + 7) % 7));
  return d;
}

export function toWeekKey(date: Date): WeekKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromWeekKey(key: WeekKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

/** "Friday, 24 October", or "Today, Friday, 24 October" on the day itself. */
export function formatFriday(key: WeekKey, now: Date = new Date()): string {
  const label = fromWeekKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return key === toWeekKey(now) ? `Today, ${label}` : label;
}
