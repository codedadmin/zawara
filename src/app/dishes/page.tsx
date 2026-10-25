import type { Metadata } from "next";
import { DishBoard } from "@/components/dishes/DishBoard";
import { PageHeader, PageShell } from "@/components/layout/PageShell";
import { FridayDate } from "@/components/rsvp/FridayDate";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Dishes" };

export default function DishesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={<FridayDate />}
        title="Dishes"
        action={
          <ButtonLink href="/" variant="secondary" size="md">
            Back
          </ButtonLink>
        }
      />
      <DishBoard />
    </PageShell>
  );
}
