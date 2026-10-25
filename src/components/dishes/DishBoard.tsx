"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState, ErrorState, SkeletonList } from "@/components/ui/feedback";
import { TextField } from "@/components/ui/TextField";
import { dishesFrom, filterDishes } from "@/lib/rsvp/selectors";
import { useRsvps } from "@/providers/RsvpProvider";
import { DishCard } from "./DishCard";
import styles from "./DishBoard.module.css";

/** Searchable grid of every dish someone who's coming is bringing. */
export function DishBoard() {
  const { rsvps, status, error, retry } = useRsvps();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const all = useMemo(() => dishesFrom(rsvps), [rsvps]);
  const shown = useMemo(() => filterDishes(all, deferredQuery), [all, deferredQuery]);

  return (
    <>
      <TextField
        type="search"
        tone="onPage"
        label="Search dishes"
        placeholder="e.g. salad"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {status === "loading" ? (
        <SkeletonList label="Loading dishes…" />
      ) : status === "error" ? (
        <ErrorState title="Couldn't load the dishes" message={error} onRetry={retry} />
      ) : shown.length === 0 ? (
        <EmptyState>
          {all.length
            ? `No dish matches “${query.trim()}”.`
            : "No dishes yet. When someone adds a dish on the home page, it shows up here."}
        </EmptyState>
      ) : (
        <ul className={styles.grid}>
          {shown.map((r) => (
            <li key={r.id}>
              <DishCard dish={r.dish} broughtBy={r.name} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
