"use client";

import type { FormEvent, Ref, RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup, type Choice } from "@/components/ui/ChoiceGroup";
import { StatusMessage } from "@/components/ui/feedback";
import { TextField } from "@/components/ui/TextField";
import type { FormStatus, SubmitResult } from "@/hooks/useRsvpForm";
import type { RsvpInput } from "@/lib/rsvp/types";
import { RSVP_LIMITS } from "@/lib/rsvp/validation";
import styles from "./RsvpForm.module.css";

type Attendance = "yes" | "no";

const ATTENDANCE_OPTIONS: Choice<Attendance>[] = [
  { value: "yes", label: "Coming", tone: "yes" },
  { value: "no", label: "Not coming", tone: "no" },
];

const STATUS_KIND = { idle: "info", saving: "info", success: "success", error: "error" } as const;

export type RsvpFormProps = {
  values: RsvpInput;
  status: FormStatus;
  /** Name of the person being edited, or null for a new answer. */
  editingName: string | null;
  onFieldChange: <K extends keyof RsvpInput>(field: K, value: RsvpInput[K]) => void;
  onSubmit: () => Promise<SubmitResult>;
  onStartOver: () => void;
  ref?: Ref<HTMLFormElement>;
  nameInputRef?: RefObject<HTMLInputElement | null>;
};

/** Presentational RSVP form. State lives in useRsvpForm. */
export function RsvpForm({
  values,
  status,
  editingName,
  onFieldChange,
  onSubmit,
  onStartOver,
  ref,
  nameInputRef,
}: RsvpFormProps) {
  const saving = status.kind === "saving";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await onSubmit();
    if (!result.ok && result.field === "name") nameInputRef?.current?.focus();
  }

  function handleStartOver() {
    onStartOver();
    nameInputRef?.current?.focus();
  }

  return (
    <form ref={ref} className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={saving}>
      <h2>{editingName ? `Change ${editingName}'s answer` : "Are you coming?"}</h2>

      <TextField
        ref={nameInputRef}
        label="Your name"
        name="name"
        autoComplete="given-name"
        placeholder="e.g. Sara"
        maxLength={RSVP_LIMITS.name}
        value={values.name}
        onChange={(e) => onFieldChange("name", e.target.value)}
      />

      <ChoiceGroup
        legend="This Friday I am…"
        name="coming"
        options={ATTENDANCE_OPTIONS}
        value={values.coming ? "yes" : "no"}
        onChange={(v) => onFieldChange("coming", v === "yes")}
      />

      <TextField
        label="Dish I'll bring"
        hint="(optional)"
        name="dish"
        placeholder="e.g. Machboos, salad, dessert"
        maxLength={RSVP_LIMITS.dish}
        value={values.dish}
        disabled={!values.coming}
        onChange={(e) => onFieldChange("dish", e.target.value)}
      />

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : editingName ? "Save changes" : "Save my answer"}
      </Button>

      <StatusMessage kind={STATUS_KIND[status.kind]}>
        {status.kind === "saving" ? "Saving…" : "message" in status ? status.message : null}
      </StatusMessage>

      {editingName && (
        <Button variant="link" className={styles.startOver} onClick={handleStartOver}>
          Start over with a different name
        </Button>
      )}
    </form>
  );
}
