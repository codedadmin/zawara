import { PageHeader, PageShell } from "@/components/layout/PageShell";
import { FridayDate } from "@/components/rsvp/FridayDate";
import { RsvpPlanner } from "@/components/rsvp/RsvpPlanner";
import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={<FridayDate />}
        title="Lunch at Grandma's"
        action={
          <ButtonLink href="/dishes" variant="secondary" size="md">
            Dishes
          </ButtonLink>
        }
      />
      <RsvpPlanner />
    </PageShell>
  );
}
