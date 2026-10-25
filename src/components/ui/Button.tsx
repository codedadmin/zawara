import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "link";
type Size = "md" | "lg";

type StyleProps = { variant?: Variant; size?: Size };

const classesFor = ({ variant = "primary", size = "lg" }: StyleProps, className?: string) =>
  cx(styles.button, styles[variant], variant !== "link" && styles[size], className);

export type ButtonProps = ComponentProps<"button"> & StyleProps;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={classesFor({ variant, size }, className)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & StyleProps;

/** Looks like a Button, navigates like a link. */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={classesFor({ variant, size }, className)} {...props} />;
}
