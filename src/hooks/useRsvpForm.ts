"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/rsvp/api-client";
import type { Rsvp, RsvpInput } from "@/lib/rsvp/types";
import { validateRsvpInput } from "@/lib/rsvp/validation";
import { useRsvps } from "@/providers/RsvpProvider";

export type FormStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export type SubmitResult = { ok: true } | { ok: false; field?: keyof RsvpInput };

const EMPTY: RsvpInput = { name: "", coming: true, dish: "" };
const IDLE: FormStatus = { kind: "idle" };

/** All RSVP form state and behaviour, kept out of the presentational form. */
export function useRsvpForm() {
  const { save } = useRsvps();
  const [values, setValues] = useState<RsvpInput>(EMPTY);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>(IDLE);

  const setField = useCallback(<K extends keyof RsvpInput>(field: K, value: RsvpInput[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const startEditing = useCallback((rsvp: Rsvp) => {
    setValues({ name: rsvp.name, coming: rsvp.coming, dish: rsvp.dish });
    setEditingName(rsvp.name);
    setStatus(IDLE);
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY);
    setEditingName(null);
  }, []);

  const startOver = useCallback(() => {
    reset();
    setStatus(IDLE);
  }, [reset]);

  const submit = useCallback(async (): Promise<SubmitResult> => {
    const result = validateRsvpInput(values);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.error });
      return { ok: false, field: result.field };
    }

    setStatus({ kind: "saving" });
    try {
      const { name, coming } = await save(result.value);
      setStatus({
        kind: "success",
        message: coming ? `Saved. See you Friday, ${name}!` : `Saved. We'll miss you, ${name}.`,
      });
      reset();
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof ApiError && err.status !== 0 && err.status < 500
          ? err.message
          : "That didn't save. Check your connection and tap Save again.";
      setStatus({ kind: "error", message });
      return { ok: false };
    }
  }, [values, save, reset]);

  return { values, setField, editingName, status, startEditing, startOver, submit };
}
