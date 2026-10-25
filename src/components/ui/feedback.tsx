import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Button } from "./Button";
import styles from "./feedback.module.css";

/** Live-announced one-line message, e.g. "Saving…" or "Saved!". */
export function StatusMessage({
  kind = "info",
  children,
}: {
  kind?: "info" | "success" | "error";
  children?: ReactNode;
}) {
  return (
    <p role="status" className={cx(styles.status, styles[kind])}>
      {children}
    </p>
  );
}

export function Badge({ tone, children }: { tone: "yes" | "no"; children: ReactNode }) {
  return <span className={cx(styles.badge, styles[tone])}>{children}</span>;
}

/** Dashed placeholder for "nothing here yet". */
export function EmptyState({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

/** Error with an optional "Try again" action. */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className={styles.errorBox}>
      <p className={styles.errorTitle}>{title}</p>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <Button size="md" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/** Placeholder rows while a list loads. */
export function SkeletonList({ rows = 3, label = "Loading…" }: { rows?: number; label?: string }) {
  return (
    <div aria-busy="true">
      <span className="visually-hidden">{label}</span>
      <ul className={styles.skeletonList} aria-hidden="true">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className={styles.skeleton} />
        ))}
      </ul>
    </div>
  );
}
