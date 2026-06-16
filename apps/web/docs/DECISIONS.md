# Decisions

Logged decisions are design choices, rationale, and rejected alternatives worth preserving.

---

### 1. Single `phoneNumber` string over `countryCode` + `number`

**Context:** The original schema stored `countryCode` and `number` as separate fields with a composite unique constraint.

**Decision:** Collapsed into a single `phoneNumber` column (e.g. `919876543210`).

**Rationale:**
- Most users are from India (+91), so the abstraction provided little value
- Simplifies queries, validation, and API surface
- The country code prefix can always be parsed back out if needed

**Rejected:** Keeping `countryCode` as a separate column with a default of `"91"` — this still clutters every query and schema.

---

### 2. Prisma client generated to `app/generated/prisma/` instead of default `node_modules`

**Context:** Prisma by default generates the client into `node_modules/.prisma/`, making it invisible in the repo.

**Decision:** Set `output = "../app/generated/prisma"` in the schema generator block.

**Rationale:**
- Generated files are committed to the repo (no `prisma generate` needed on clone)
- Imports are explicit: `from "../generated/prisma/client"` instead of magic `from "@prisma/client"`
- Works better with monorepo tooling — the generated path is stable regardless of package manager hoisting

---

### 3. `apiHandler` wrapper over Next.js middleware

**Context:** App Router route handlers need consistent error handling.

**Decision:** A higher-order function `apiHandler` that wraps each route instead of using Next.js `middleware.ts`.

**Rationale:**
- `middleware.ts` runs at the Edge Runtime which has limited Node.js APIs
- Route-level wrapping gives access to the full Node.js runtime (Prisma, JWT, etc.)
- The wrapper is ~50 lines and is only imported where needed

---

### 4. Hardcoded OTP during development

**Context:** SMS delivery costs money and the provider integration is not final.

**Decision:** OTP is hardcoded to `"123456"` in `register` and `resend-otp` routes. The `generateOtp()` utility exists but is unused. SMS sending is commented out.

**Rationale:**
- Avoids SMS costs during development
- Tests are deterministic — always know the OTP
- The integration point is clearly marked with a "Fix this later" comment

**Planned:** Wire `generateOtp()` → `sendSMS()` in a single future PR.

---

### 5. JWT over session-based auth

**Context:** Mobile/API-first app needs stateless auth.

**Decision:** JWT access tokens (15m) with refresh tokens (7d).

**Rationale:**
- No server-side session store needed
- Works naturally with mobile clients
- Tokens carry `userId` and `phoneNumber` in payload

**Rejected:** Session-based with cookies — adds complexity for mobile clients.

---

### 6. Zod over class-validator or custom validation

**Context:** Need to validate request bodies and environment variables.

**Decision:** Zod 4 for all validation.

**Rationale:**
- TypeScript-first with automatic type inference
- Works well in both Edge and Node.js runtimes
- Single validation lib for everything (env, request body, future form schemas)
- Composable — schemas can extend other schemas

---

### 7. PostgreSQL with Prisma adapter over ORM-less queries

**Context:** Need a relational database for the auth + location domain.

**Decision:** PostgreSQL via Prisma with `@prisma/adapter-pg`.

**Rationale:**
- Type-safe queries with full autocomplete
- Migrations as code
- Prisma Studio for ad-hoc data inspection
- The adapter pattern uses the native `pg` driver directly (no Prisma Engine binary needed on some targets)

---

### 8. Profile lifecycle as an enum on User

**Context:** Users progress through states: registered → verified → completed profile.

**Decision:** Single `ProfileStatus` enum on the `User` model.

**Rationale:**
- Avoids a separate `UserState` table for what is fundamentally a linear state machine
- The enum is checked/updated in transactions — no race conditions
- Easy to add forbidden transitions later (e.g. can't go BACK from VERIFIED to REGISTERED)

**Rejected:** Separate `UserSession` or `UserState` table — over-engineering for 4 states.

---

### 9. Server-side placeId validation via Google Maps API before storing

**Context:** The profile route accepts a placeId from the client (selected via autocomplete). This placeId could be spoofed or invalid.

**Decision:** Before storing a `Location` record, the server calls `placeDetails` from the Google Maps API to fetch the canonical address and coordinates. If the placeId doesn't return valid data, the request is rejected.

**Rationale:**
- Prevents garbage data in the Location table
- The canonical address and coordinates come from Google, not the client — the client only sends the `placeId`
- Lat/lng are computed server-side, so a malicious client can't inject arbitrary coordinates

**Rejected:** Trusting the client to send `placeId` without server-side verification — a client could send a made-up placeId and inject arbitrary lat/lng.
