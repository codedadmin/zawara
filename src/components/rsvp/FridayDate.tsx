"use client";

import { useFridayWeek } from "@/hooks/useFridayWeek";
import { formatFriday } from "@/lib/friday";

/** "Friday, 24 October", falling back to "This Friday" until the client knows its timezone. */
export function FridayDate() {
  const week = useFridayWeek();
  return <>{week ? formatFriday(week) : "This Friday"}</>;
}
