"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/PageShell";
import { useRsvpForm } from "@/hooks/useRsvpForm";
import type { Rsvp } from "@/lib/rsvp/types";
import { AttendanceCounter } from "./AttendanceCounter";
import { GuestList } from "./GuestList";
import { RsvpForm } from "./RsvpForm";

/** Home page body: counter, form and guest list, wired together. */
export function RsvpPlanner() {
  const form = useRsvpForm();
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function editGuest(rsvp: Rsvp) {
    form.startEditing(rsvp);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    nameInputRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <AttendanceCounter />
      <RsvpForm
        ref={formRef}
        nameInputRef={nameInputRef}
        values={form.values}
        status={form.status}
        editingName={form.editingName}
        onFieldChange={form.setField}
        onSubmit={form.submit}
        onStartOver={form.startOver}
      />
      <Section title="Who's coming" hint="Tap a name to change it">
        <GuestList onSelect={editGuest} />
      </Section>
    </>
  );
}
