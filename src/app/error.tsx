"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { PageHeader, PageShell } from "@/components/layout/PageShell";
import { ErrorState } from "@/components/ui/feedback";

/** Catches unexpected render errors in any page and offers a retry. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <PageHeader title="Lunch at Grandma's" />
      <ErrorState
        title="Something went wrong"
        message="This page hit a problem. Try again, and if it keeps happening, reload the page."
        onRetry={retry}
      />
    </PageShell>
  );
}
