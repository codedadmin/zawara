"use client";

import { Badge, EmptyState, ErrorState, SkeletonList } from "@/components/ui/feedback";
import { cx } from "@/lib/cx";
import { orderedGuests } from "@/lib/rsvp/selectors";
import type { Rsvp } from "@/lib/rsvp/types";
import { useRsvps } from "@/providers/RsvpProvider";
import styles from "./GuestList.module.css";

/** Who's coming, with loading, error and empty states. Tapping a guest edits their answer. */
export function GuestList({ onSelect }: { onSelect: (rsvp: Rsvp) => void }) {
  const { rsvps, status, error, retry } = useRsvps();

  if (status === "loading") return <SkeletonList label="Loading the guest list…" />;
  if (status === "error") {
    return <ErrorState title="Couldn't load the guest list" message={error} onRetry={retry} />;
  }
  if (rsvps.length === 0) {
    return <EmptyState>Nobody has answered yet. Add your name above and you&apos;ll be first on the list.</EmptyState>;
  }

  return (
    <ul className={styles.list}>
      {orderedGuests(rsvps).map((rsvp) => (
        <GuestListItem key={rsvp.id} rsvp={rsvp} onSelect={onSelect} />
      ))}
    </ul>
  );
}

function GuestListItem({ rsvp, onSelect }: { rsvp: Rsvp; onSelect: (rsvp: Rsvp) => void }) {
  const badge = rsvp.coming ? "Coming" : "Not coming";
  const detail = rsvp.coming ? (rsvp.dish ? `Bringing ${rsvp.dish}` : "No dish yet") : "Maybe next Friday";

  return (
    <li className={cx(!rsvp.coming && styles.off)}>
      <button
        type="button"
        className={styles.item}
        onClick={() => onSelect(rsvp)}
        aria-label={`${rsvp.name}, ${badge}${rsvp.coming && rsvp.dish ? `, bringing ${rsvp.dish}` : ""}. Tap to change.`}
      >
        <span className={styles.who} dir="auto">
          {rsvp.name}
        </span>
        <span className={styles.badge}>
          <Badge tone={rsvp.coming ? "yes" : "no"}>{badge}</Badge>
        </span>
        <span className={styles.dish} dir="auto">
          {detail}
        </span>
      </button>
    </li>
  );
}
