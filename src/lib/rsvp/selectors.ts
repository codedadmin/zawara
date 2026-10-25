import type { Rsvp } from "./types";

const byName = (a: Rsvp, b: Rsvp) => a.name.localeCompare(b.name);
const byDish = (a: Rsvp, b: Rsvp) => a.dish.localeCompare(b.dish);

export type AttendanceSummary = {
  coming: Rsvp[];
  notComing: Rsvp[];
  total: number;
};

/** Splits answers into coming / not coming, each sorted by name. */
export function summarizeAttendance(rsvps: Rsvp[]): AttendanceSummary {
  return {
    coming: rsvps.filter((r) => r.coming).sort(byName),
    notComing: rsvps.filter((r) => !r.coming).sort(byName),
    total: rsvps.length,
  };
}

/** The guest list order: everyone coming first, then everyone who can't make it. */
export function orderedGuests(rsvps: Rsvp[]): Rsvp[] {
  const { coming, notComing } = summarizeAttendance(rsvps);
  return [...coming, ...notComing];
}

/** Dishes from people who are coming, sorted by dish. */
export function dishesFrom(rsvps: Rsvp[]): Rsvp[] {
  return rsvps.filter((r) => r.coming && r.dish).sort(byDish);
}

export function filterDishes(dishes: Rsvp[], query: string): Rsvp[] {
  const q = query.trim().toLowerCase();
  return q ? dishes.filter((r) => r.dish.toLowerCase().includes(q)) : dishes;
}
