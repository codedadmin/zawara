# Lunch at Grandma's

Plan the Friday zawra: who's coming and what everyone is bringing.

```bash
npm install
npm run dev     # http://localhost:3000
```

## Structure

```
src/
├── app/                      Routes (Next.js App Router)
│   ├── page.tsx              Home: counter, RSVP form, guest list
│   ├── dishes/page.tsx       Dishes: searchable grid
│   ├── api/rsvps/route.ts    GET (list a week) / PUT (save an answer)
│   ├── layout.tsx            Fonts, metadata, <RsvpProvider>
│   ├── loading.tsx           Route-level loading skeleton
│   ├── error.tsx             Route-level error boundary with retry
│   ├── global-error.tsx      Last-resort error boundary
│   └── not-found.tsx
├── components/
│   ├── ui/                   Generic, reusable: Button, TextField, ChoiceGroup,
│   │                         StatusMessage, Badge, EmptyState, ErrorState, SkeletonList
│   ├── layout/               PageShell, PageHeader, Section
│   ├── rsvp/                 RsvpPlanner, RsvpForm, GuestList, AttendanceCounter, FridayDate
│   └── dishes/               DishBoard, DishCard
├── hooks/                    useRsvpForm (form state + submit), useFridayWeek
├── providers/RsvpProvider    Shared RSVP data, loading/error status, save()
├── lib/                      Framework-free logic, shared by client and server
│   ├── friday.ts             "Next Friday" date maths
│   └── rsvp/                 types, validation, selectors, api-client, subscribe
└── server/rsvp/              Storage: RsvpRepository interface + JSON file implementation
```

### Data flow

`RsvpProvider` (in the root layout) subscribes to the current week via
`subscribeToRsvps`, which polls `/api/rsvps` every 5 seconds while the tab is
visible. Every page reads from it with `useRsvps()`, so both pages share one
copy of the data. It exposes:

- `status`: `"loading"` → `"ready"`, or `"error"` if the first load fails
- `error`: also set when a later refresh fails while older data stays on screen
- `retry()` and `save(input)`

Validation lives in `lib/rsvp/validation.ts` and runs on both the client and
the API route, so the rules can't drift apart.

### Changing the storage

RSVPs are stored in `.data/rsvps.json`, or in the file named by `RSVP_DATA_FILE`.
That works locally and on a single long-running server, **but not on
serverless hosts like Vercel or Netlify**, where the disk gets wiped.

To use a real database, implement `RsvpRepository` (`src/server/rsvp/repository.ts`)
and return it from `getRsvpRepository()` (`src/server/rsvp/index.ts`). Nothing
else changes. For instant updates instead of polling, change only
`src/lib/rsvp/subscribe.ts`.
