/** One person's answer for one Friday. */
export type Rsvp = {
  /** Stable id derived from the normalised name, so saving again updates the same answer. */
  id: string;
  name: string;
  coming: boolean;
  /** Empty string when they aren't bringing anything (or aren't coming). */
  dish: string;
  updatedAt: string;
};

/** What a person submits through the form. */
export type RsvpInput = Pick<Rsvp, "name" | "coming" | "dish">;

/** A Friday, as YYYY-MM-DD in the visitor's local time. */
export type WeekKey = string;

export type LoadStatus = "loading" | "ready" | "error";
