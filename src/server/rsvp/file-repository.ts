import { promises as fs } from "node:fs";
import path from "node:path";
import type { Rsvp, WeekKey } from "@/lib/rsvp/types";
import { rsvpIdFor } from "@/lib/rsvp/validation";
import type { RsvpRepository } from "./repository";

/** { "2026-10-23": { "sara": { ...rsvp } } } */
type Store = Record<WeekKey, Record<string, Rsvp>>;

/**
 * Keeps RSVPs in a local JSON file. Good for development and a single
 * long-running server; not for serverless hosts, whose disk is ephemeral.
 */
export function createFileRsvpRepository(filePath: string): RsvpRepository {
  // Serialises writes so two saves at once can't overwrite each other.
  let queue: Promise<unknown> = Promise.resolve();

  async function read(): Promise<Store> {
    try {
      return JSON.parse(await fs.readFile(filePath, "utf8")) as Store;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
      throw err;
    }
  }

  async function write(store: Store): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Write-then-rename so a crash mid-write never leaves a half-written file.
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(store, null, 2));
    await fs.rename(tmp, filePath);
  }

  return {
    async listByWeek(week) {
      await queue;
      const store = await read();
      return Object.values(store[week] ?? {});
    },

    upsert(week, input) {
      const task = queue.then(async () => {
        const store = await read();
        const rsvp: Rsvp = { id: rsvpIdFor(input.name), ...input, updatedAt: new Date().toISOString() };
        store[week] = { ...store[week], [rsvp.id]: rsvp };
        await write(store);
        return rsvp;
      });
      queue = task.catch(() => {});
      return task;
    },
  };
}
