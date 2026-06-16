# Architecture

## Stack

- **Next.js 16** with App Router, React 19, TypeScript 5.9
- **PostgreSQL** via Prisma 7 (`@prisma/adapter-pg`)
- **Zod 4** for validation
- **JWT** (`jsonwebtoken`) for auth tokens
- **MessageCentral API** for SMS delivery
- **Google Maps Places API** for address autocomplete

## Monorepo

Turborepo with shared packages:

| Package | Purpose |
|---------|---------|
| `@repo/ui` | Shared React components |
| `@repo/eslint-config` | Shared ESLint config |
| `@repo/typescript-config` | Shared TS config |

## Directory Layout

```
app/
├── api/v1/auth/
│   ├── register/      POST  — create user + OTP
│   ├── resend-otp/    POST  — delete old OTPs, create new one
│   ├── verify/        POST  — validate OTP, upgrade status, issue JWT
│   └── profile/       POST  — stub
├── api/v1/address/
│   └── autocomplete/  GET   — Google Maps place autocomplete
├── constant/          OTP expiry & length
├── lib/               api-handler, env, error-handler, jwt, otp, prisma, sms
├── schema/            Zod schemas
└── generated/prisma/  Auto-generated Prisma client (committed)
```

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| phoneNumber | String | Unique, includes country code (e.g. `919876543210`) |
| email | String? | Unique |
| profileStatus | Enum | `REGISTERED` → `VERIFIED` → `PROFILE_COMPLETED` → `SUSPENDED` |

### Otp

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| code | String | 6-digit numeric |
| expiresAt | DateTime | 5 minutes from creation |
| userId | UUID | FK → User |

### Location

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| label | String | Display name |
| placeId | String | Google Maps Place ID |
| address | String | Full address |
| latitude | Float | — |
| longitude | Float | — |

## Auth Flow

```
Register ──→ User(REGISTERED) + Otp created
                  │
                  ▼
Resend-OTP ──→ Old OTPs deleted, new Otp created
                  │
                  ▼
Verify ──→ Otp validated & deleted, User → VERIFIED, JWT issued
                  │
                  ▼
Profile ──→ (JWT auth) User name + Location created, User → PROFILE_COMPLETED
```

## Key Patterns

- **`apiHandler`** — every route is wrapped with this HOF. It catches `AppError` subclasses → structured JSON errors, `ZodError` → 422, and unknown errors → 500.
- **Error hierarchy** — `AppError` (base) → `BadRequestError` (400), `NotFoundError` (404), `UnauthorizedError` (401), `ForbiddenError` (403), `InternalServerError` (500), `RateLimitError` (429).
- **Prisma singleton** — cached on `globalThis` for hot-reload safety.
- **Zod-first** — every external input validated with Zod (request bodies, env vars).
- **Generated Prisma client** — output to `app/generated/prisma/` so it's committed and importable as a local module.
