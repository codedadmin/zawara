"use client";

import { useSyncExternalStore } from "react";
import { nextFriday, toWeekKey } from "@/lib/friday";
import type { WeekKey } from "@/lib/rsvp/types";

const noopSubscribe = () => () => {};

/**
 * The coming Friday in the visitor's own timezone.
 * Returns null during server render (the server doesn't know the visitor's
 * timezone), which avoids a hydration mismatch.
 */
export function useFridayWeek(): WeekKey | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => toWeekKey(nextFriday()),
    () => null,
  );
}
