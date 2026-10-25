import type { Rsvp, RsvpInput, WeekKey } from "@/lib/rsvp/types";

/**
 * Storage contract for RSVPs. The API routes only talk to this interface,
 * so swapping the JSON file for Postgres, Supabase, etc. means writing one
 * new implementation and changing `getRsvpRepository()`, nothing else.
 */
export interface RsvpRepository {
  listByWeek(week: WeekKey): Promise<Rsvp[]>;
  /** Creates or replaces this person's answer for the week. */
  upsert(week: WeekKey, input: RsvpInput): Promise<Rsvp>;
}
