import { PageShell } from "@/components/layout/PageShell";
import { SkeletonList } from "@/components/ui/feedback";

/** Shown while a route segment is loading. */
export default function Loading() {
  return (
    <PageShell>
      <SkeletonList rows={4} label="Loading the page…" />
    </PageShell>
  );
}
