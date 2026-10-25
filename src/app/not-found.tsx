import { PageHeader, PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";

export default function NotFound() {
  return (
    <PageShell>
      <PageHeader title="Page not found" />
      <EmptyState>There&apos;s nothing here. Grandma&apos;s lunch is on the home page.</EmptyState>
      <ButtonLink href="/">Go to the home page</ButtonLink>
    </PageShell>
  );
}
