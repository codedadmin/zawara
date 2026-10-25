import type { NextRequest } from "next/server";
import { isWeekKey, validateRsvpInput } from "@/lib/rsvp/validation";
import { getRsvpRepository } from "@/server/rsvp";

const jsonError = (error: string, status: number) => Response.json({ error }, { status });

/** GET /api/rsvps?week=YYYY-MM-DD → { rsvps } */
export async function GET(request: NextRequest) {
  const week = request.nextUrl.searchParams.get("week");
  if (!isWeekKey(week)) return jsonError("Missing or invalid week.", 400);

  try {
    const rsvps = await getRsvpRepository().listByWeek(week);
    return Response.json({ rsvps });
  } catch (err) {
    console.error("Failed to load RSVPs", err);
    return jsonError("Couldn't load the list. Please try again.", 500);
  }
}

/** PUT /api/rsvps { week, name, coming, dish } → { rsvp }. Saving the same name again updates it. */
export async function PUT(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid request.", 400);
  if (!isWeekKey(body.week)) return jsonError("Missing or invalid week.", 400);

  const result = validateRsvpInput(body);
  if (!result.ok) return jsonError(result.error, 422);

  try {
    const rsvp = await getRsvpRepository().upsert(body.week, result.value);
    return Response.json({ rsvp });
  } catch (err) {
    console.error("Failed to save RSVP", err);
    return jsonError("That didn't save. Please try again.", 500);
  }
}
