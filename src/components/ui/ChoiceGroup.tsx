import { useId } from "react";
import { cx } from "@/lib/cx";
import styles from "./ChoiceGroup.module.css";

export type Choice<T extends string> = {
  value: T;
  label: string;
  /** Colour when selected. */
  tone?: "yes" | "no" | "neutral";
};

export type ChoiceGroupProps<T extends string> = {
  legend: string;
  name: string;
  options: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Big, tappable radio buttons. */
export function ChoiceGroup<T extends string>({ legend, name, options, value, onChange }: ChoiceGroupProps<T>) {
  const baseId = useId();
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => {
          const id = `${baseId}-${option.value}`;
          return (
            <div key={option.value}>
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className={styles.input}
              />
              <label htmlFor={id} className={cx(styles.option, styles[option.tone ?? "neutral"])}>
                <span className={styles.mark} aria-hidden="true" />
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
