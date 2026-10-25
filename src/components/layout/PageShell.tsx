import type { ReactNode } from "react";
import styles from "./PageShell.module.css";

/** One centred column with safe-area padding. Every page uses this. */
export function PageShell({ children }: { children: ReactNode }) {
  return <main className={styles.shell}>{children}</main>;
}

/** Eyebrow + title on the left, an optional action (e.g. a nav button) on the right. */
export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={styles.topbar}>
      <header className={styles.titles}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1>{title}</h1>
      </header>
      {action}
    </div>
  );
}

/** A titled block of content with an optional hint aligned to the right. */
export function Section({
  title,
  hint,
  children,
}: {
  title: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
        {hint && <span className={styles.sectionHint}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}
