import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./TextField.module.css";

export type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: ReactNode;
  /** Small muted text after the label, e.g. "(optional)". */
  hint?: ReactNode;
  /** Pick the background that contrasts with the container. */
  tone?: "onSurface" | "onPage";
};

export function TextField({
  label,
  hint,
  tone = "onSurface",
  className,
  type = "text",
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label} {hint && <span className={styles.hint}>{hint}</span>}
      </label>
      <input id={id} type={type} dir="auto" className={cx(styles.input, styles[tone])} {...inputProps} />
    </div>
  );
}
