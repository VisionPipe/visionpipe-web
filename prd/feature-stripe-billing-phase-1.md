# Branch Progress: feature/stripe-billing-phase-1

This branch implements Phase 1 of the Stripe credit billing system per the spec at `docs/superpowers/specs/2026-05-02-stripe-credit-billing-design.md`. Newest entries at the top.

---

## Progress Update as of 2026-05-02 03:42 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Defined the Drizzle ORM schema (TDD) for all four core tables: `organizations`, `memberships`, `purchases`, and `webhook_events`. Added Vitest config and test scripts; wrote failing tests first, then implemented the schema to make them pass.

### Detail of changes made:

- Created `src/db/__tests__/schema.test.ts` — 3 tests verifying exports and key column presence; ran against non-existent schema first to confirm red state
- Created `vitest.config.ts` with `environment: 'node'` and `globals: false`
- Added `"test": "vitest run"` and `"test:watch": "vitest"` scripts to `package.json`
- Created `src/db/schema.ts` with four Drizzle `pgTable` exports:
  - `organizations`: `id`, `clerkOrgId` (unique), `stripeCustomerId` (unique), `type` (personal/team check), `name`, `createdAt`
  - `memberships`: `id`, `orgId` (FK → organizations, cascade delete), `clerkUserId`, `role` (owner/admin/member check), `joinedAt`; unique index on (orgId, clerkUserId)
  - `purchases`: `id`, `orgId` (FK → organizations), `stripeCheckoutSessionId`, `stripePaymentIntentId`, `sku`, `creditsPurchased`, `amountCents`, `currency`, `status` (pending/complete/refunded/partially_refunded check), `refundedCredits`, `expiresAt`, `createdAt`, `completedAt`
  - `webhookEvents`: `id`, `stripeEventId` (unique), `eventType`, `payload` (jsonb), `processedAt`
- All 3 tests pass: `vitest run` exits 0

### Potential concerns to address:

- The CJS build deprecation warning from Vite is cosmetic — vitest 2.x still supports it, no action needed until vitest 3.x.
- `check()` constraints are defined in schema but Drizzle doesn't enforce them in TypeScript — only at the DB level after migration. Column types are `text`, so invalid values won't be caught without the DB constraint being applied.
- B4 (drizzle-kit generate + migrate) is needed before any runtime code can rely on these tables existing in Neon.

---

## Progress Update as of 2026-05-02 03:40 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Configured Drizzle Kit with PostgreSQL dialect pointing to Neon database. Created `drizzle.config.ts` and installed `dotenv` dev dependency to support the drizzle CLI reading `.env.local` at runtime.

### Detail of changes made:

- Created `drizzle.config.ts` at repo root with schema path `./src/db/schema.ts`, output dir `./drizzle`, PostgreSQL dialect, and `DATABASE_URL` from environment
- Installed `dotenv@11.0.0` as dev dependency (2 packages added; no vulnerabilities introduced)
- Config is ready for Step B3 (schema definition) — schema file does not yet exist but config correctly points to where it will be created

### Potential concerns to address:

- None at this stage. Config is correct and minimal; will be fully validated once `src/db/schema.ts` is created and migrations are generated in B3-B4.

---

## Progress Update as of 2026-05-02 02:46 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Created `.env.example` with all placeholder environment variables needed for Phase 1 (Clerk, Neon, Stripe, Resend, App URL). Created `.env.local` as an empty copy of the template — it is gitignored and will NOT be committed. The founder must paste real values from each service's dashboard before running the app locally.

### Detail of changes made:

- Created `.env.example` (tracked) with placeholder vars for: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PACK_10/20/50/100`, `RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`
- Created `.env.local` (gitignored, NOT committed) as a blank-values copy of `.env.example` — confirmed ignored by `.gitignore` line 22 rule `.env*.local`

### Potential concerns to address:

- Real values must be filled in `.env.local` after external setup tasks complete: Clerk (B1), Neon (D1), Stripe (H1), Resend (E1). App will not start until at minimum `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL` are set.
- Stripe price IDs (`STRIPE_PRICE_PACK_*`) will only be known after creating products in the Stripe dashboard (task H1) — leave blank until then.

---

## Progress Update as of 2026-05-02 02:45 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Installed all runtime and dev dependencies needed for Phase 1 billing: Clerk for auth, Stripe for payments, Drizzle ORM + Neon for the database, Resend for transactional email, drizzle-kit for migrations, Vitest for tests, and @types/node for TypeScript compatibility.

### Detail of changes made:

- Installed runtime: @clerk/nextjs@6.39.3, stripe@17.7.0, drizzle-orm@0.36.4, @neondatabase/serverless@0.10.4, resend@4.8.0
- Installed dev: drizzle-kit@0.30.6, vitest@2.1.9, @types/node@22.19.17
- All versions satisfy the spec'd caret ranges; no divergences

### Potential concerns to address:

- `npm audit` reports 11 moderate + 1 high vulnerability (present before and after install — no net increase from our deps). Should be reviewed before production launch but does not block development.
- Clerk SDK is at v6 which uses the new async `auth()` pattern; webhook handler in the plan uses `await auth()` correctly so no API mismatch expected.
- Two deprecated transitive deps from drizzle-kit (`@esbuild-kit/esm-loader`, `@esbuild-kit/core-utils`) — dev-only, no runtime impact.

---

## Progress Update as of 2026-05-02 02:40 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Branch created. Ready to begin implementation.

### Detail of changes made:

- Branched from `main` at commit 3df17b0
- Created this progress log

### Potential concerns to address:

- None at branch creation.

---
