import { fetchRsvps, isAbortError } from "./api-client";
import type { Rsvp, WeekKey } from "./types";

export type RsvpSubscription = {
  /** Fetch now instead of waiting for the next tick. */
  refresh: () => void;
  unsubscribe: () => void;
};

type Options = {
  onData: (rsvps: Rsvp[]) => void;
  onError: (err: unknown) => void;
  intervalMs?: number;
};

/**
 * Live view of a week's answers. Today it polls while the tab is visible;
 * swapping in websockets or a realtime database only changes this function.
 */
export function subscribeToRsvps(
  week: WeekKey,
  { onData, onError, intervalMs = 5000 }: Options,
): RsvpSubscription {
  const controller = new AbortController();

  const refresh = () => {
    fetchRsvps(week, controller.signal).then(onData, (err) => {
      if (!isAbortError(err)) onError(err);
    });
  };
  const refreshIfVisible = () => {
    if (document.visibilityState === "visible") refresh();
  };

  refresh();
  const timer = setInterval(refreshIfVisible, intervalMs);
  document.addEventListener("visibilitychange", refreshIfVisible);

  return {
    refresh,
    unsubscribe() {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    },
  };
}
