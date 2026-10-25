"use client";

import { cx } from "@/lib/cx";
import { summarizeAttendance } from "@/lib/rsvp/selectors";
import { useRsvps } from "@/providers/RsvpProvider";
import styles from "./AttendanceCounter.module.css";

/** The big "N people coming" banner. */
export function AttendanceCounter() {
  const { rsvps, status, error } = useRsvps();
  const { coming, notComing, total } = summarizeAttendance(rsvps);
  const n = coming.length;

  let sub: string;
  if (status === "loading") sub = "Loading the list…";
  else if (status === "error") sub = "Couldn't load the list.";
  else if (error) sub = "The list stopped updating. Trying again…";
  else if (notComing.length) sub = `${notComing.length} can't make it this week`;
  else sub = total ? "Everyone who answered is coming" : "Waiting for the first answer";

  return (
    <section
      className={cx(styles.counter, status === "loading" && styles.loading)}
      aria-live="polite"
      aria-busy={status === "loading"}
    >
      <span key={n} className={styles.num}>
        {n}
      </span>
      <span className={styles.label}>{n === 1 ? "person coming" : "people coming"}</span>
      <span className={cx(styles.sub, (status === "error" || error) && styles.subError)}>{sub}</span>
    </section>
  );
}
