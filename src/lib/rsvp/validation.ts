import type { RsvpInput, WeekKey } from "./types";

/** Shared by the form inputs (maxLength) and the API (server-side checks). */
export const RSVP_LIMITS = { name: 40, dish: 60 } as const;

const WEEK_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Trim and collapse inner whitespace: "  Sara   Ali " → "Sara Ali". */
export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/** Same person regardless of casing or spacing → same id. */
export function rsvpIdFor(name: string): string {
  return normalizeText(name).toLowerCase();
}

export function isWeekKey(value: unknown): value is WeekKey {
  return typeof value === "string" && WEEK_KEY_PATTERN.test(value);
}

export type ValidationResult =
  | { ok: true; value: RsvpInput }
  | { ok: false; field: keyof RsvpInput; error: string };

/** Validates untrusted input (form state or a request body) into a clean RsvpInput. */
export function validateRsvpInput(raw: unknown): ValidationResult {
  const data = (raw ?? {}) as Record<string, unknown>;
  const name = typeof data.name === "string" ? normalizeText(data.name) : "";
  const coming = data.coming === true;
  const dish = coming && typeof data.dish === "string" ? normalizeText(data.dish) : "";

  if (!name) return { ok: false, field: "name", error: "Please write your name first." };
  if (name.length > RSVP_LIMITS.name) {
    return { ok: false, field: "name", error: `Names can be up to ${RSVP_LIMITS.name} letters.` };
  }
  if (dish.length > RSVP_LIMITS.dish) {
    return { ok: false, field: "dish", error: `Dish names can be up to ${RSVP_LIMITS.dish} letters.` };
  }
  return { ok: true, value: { name, coming, dish } };
}
