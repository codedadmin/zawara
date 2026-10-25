"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFridayWeek } from "@/hooks/useFridayWeek";
import { ApiError, saveRsvp } from "@/lib/rsvp/api-client";
import { subscribeToRsvps, type RsvpSubscription } from "@/lib/rsvp/subscribe";
import type { LoadStatus, Rsvp, RsvpInput, WeekKey } from "@/lib/rsvp/types";

/** How often to pull fresh answers from other family members. */
const POLL_INTERVAL_MS = 5000;

type RsvpContextValue = {
  week: WeekKey | null;
  rsvps: Rsvp[];
  /** "loading" until the first fetch, "error" only if we have nothing to show. */
  status: LoadStatus;
  /** Set when the latest fetch failed, even if older data is still on screen. */
  error: string | null;
  retry: () => void;
  save: (input: RsvpInput) => Promise<Rsvp>;
};

const RsvpContext = createContext<RsvpContextValue | null>(null);

const messageFor = (err: unknown) =>
  err instanceof ApiError ? err.message : "Something went wrong loading the list.";

/**
 * Single source of truth for this Friday's answers, shared by every page so
 * navigating between Home and Dishes doesn't refetch or lose state.
 */
export function RsvpProvider({ children }: { children: ReactNode }) {
  const week = useFridayWeek();
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const subscription = useRef<RsvpSubscription | null>(null);

  useEffect(() => {
    if (!week) return;
    const sub = subscribeToRsvps(week, {
      intervalMs: POLL_INTERVAL_MS,
      onData(data) {
        setRsvps(data);
        setStatus("ready");
        setError(null);
      },
      onError(err) {
        setError(messageFor(err));
        // Keep showing stale data if we have it; only fail hard on first load.
        setStatus((prev) => (prev === "loading" ? "error" : prev));
      },
    });
    subscription.current = sub;
    return () => {
      sub.unsubscribe();
      subscription.current = null;
    };
  }, [week]);

  const retry = useCallback(() => {
    setStatus((prev) => (prev === "error" ? "loading" : prev));
    subscription.current?.refresh();
  }, []);

  const save = useCallback(
    async (input: RsvpInput) => {
      if (!week) throw new ApiError("Still getting ready. Try again in a moment.", 0);
      const saved = await saveRsvp(week, input);
      // Show the change right away instead of waiting for the next poll.
      setRsvps((prev) => [...prev.filter((r) => r.id !== saved.id), saved]);
      return saved;
    },
    [week],
  );

  const value = useMemo(
    () => ({ week, rsvps, status, error, retry, save }),
    [week, rsvps, status, error, retry, save],
  );

  return <RsvpContext value={value}>{children}</RsvpContext>;
}

export function useRsvps(): RsvpContextValue {
  const ctx = use(RsvpContext);
  if (!ctx) throw new Error("useRsvps must be used inside <RsvpProvider>.");
  return ctx;
}
