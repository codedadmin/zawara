import path from "node:path";
import { createFileRsvpRepository } from "./file-repository";
import type { RsvpRepository } from "./repository";

export type { RsvpRepository } from "./repository";

let repository: RsvpRepository | undefined;

/** The single place that decides where RSVPs are stored. */
export function getRsvpRepository(): RsvpRepository {
  repository ??= createFileRsvpRepository(
    process.env.RSVP_DATA_FILE ?? path.join(process.cwd(), ".data", "rsvps.json"),
  );
  return repository;
}
