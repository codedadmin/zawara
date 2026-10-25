"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import "./globals.css";

/** Last-resort fallback when the root layout itself fails. Must render its own <html>/<body>. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ padding: 24, display: "grid", gap: 16, justifyItems: "start" }}>
        <h1>Something went wrong</h1>
        <p>The page couldn&apos;t load. Please try again.</p>
        <button type="button" onClick={retry} style={{ font: "inherit", padding: "12px 20px" }}>
          Try again
        </button>
      </body>
    </html>
  );
}
