# Branch Progress: feature/stripe-billing-phase-1

This branch implements Phase 1 of the Stripe credit billing system per the spec at `docs/superpowers/specs/2026-05-02-stripe-credit-billing-design.md`. Newest entries at the top.

---

## Progress Update as of 2026-05-02 03:52 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task B5 complete: added the Drizzle DB client (`src/db/client.ts`), implemented `getBalance` query (`src/db/queries.ts`), and wrote 5 integration tests using TDD discipline. Also extended `vitest.config.ts` to load `.env.local` so `DATABASE_URL` is available during test runs. All 8 tests pass (3 schema + 5 query).

### Detail of changes made:

- `src/db/client.ts`: new file — creates the Neon HTTP client and Drizzle instance with schema. Exported as `db` for use by all query modules.
- `src/db/queries.ts`: new file — exports `getBalance(orgId: number): Promise<number>`. Uses a single SQL `SUM(credits_purchased - refunded_credits)` aggregation with filters: status IN ('complete', 'partially_refunded') AND expires_at > NOW(). Returns 0 for orgs with no qualifying purchases.
- `src/db/__tests__/queries.test.ts`: new file — 5 integration tests verifying: zero balance for no purchases, correct sum for complete purchases, correct subtraction of refunded credits, exclusion of expired purchases, exclusion of pending purchases. Each test uses a fresh org created in `beforeEach` (full delete + re-insert).
- `vitest.config.ts`: added `import { config } from 'dotenv'; config({ path: '.env.local' });` at top-level so `DATABASE_URL` is injected before Vitest resolves modules. Verified via the `injected env (12) from .env.local` message in test output.
- TDD discipline followed: confirmed `Cannot find module '../queries'` failure before writing `queries.ts`.

### Potential concerns to address:

- Integration tests hit the real Neon database. The `beforeEach` deletes ALL purchases and organizations before each test, which is fine now (only test data exists) but would be destructive if run against a production DB. Consider separate test DB or schema isolation for CI when real data exists.
- The `dotenv` import in `vitest.config.ts` is evaluated at config-load time (before tests run), which is the correct behavior — but it relies on `dotenv` being installed. It is (checked `package.json`), but if removed, the config will silently fail to inject env vars.
- The Vite CJS deprecation warning (`The CJS build of Vite's Node API is deprecated`) appears in test output. This is a cosmetic Vitest/Vite version mismatch and does not affect test correctness. Can be suppressed by migrating `vitest.config.ts` to ESM if desired.

---

## Progress Update as of 2026-05-02 03:49 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Quality-of-life follow-up to B4: made `drizzle.config.ts` read `.env.local` automatically, and added `tsconfig.tsbuildinfo` to `.gitignore`. Now `npx drizzle-kit migrate`/`generate` work with no extra env wiring.

### Detail of changes made:

- `drizzle.config.ts`: replaced `import 'dotenv/config'` (which only reads `.env`) with `import { config } from 'dotenv'; config({ path: '.env.local' });`. Verified by running `npx drizzle-kit migrate` — output shows `injected env (12) from .env.local` and migration applied successfully (no-op since already applied).
- `.gitignore`: added `tsconfig.tsbuildinfo` (a TypeScript incremental-build artifact that was showing up untracked after running `npx tsc --noEmit`).

### Potential concerns to address:

- None. Resolves the concern raised in the previous entry about needing to pass `DATABASE_URL` explicitly when running drizzle-kit.

---

## Progress Update as of 2026-05-02 03:48 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Fixed a bug in the schema where FK columns (`orgId` in `memberships` and `purchases`) were incorrectly typed as `bigserial` instead of `bigint`. `bigserial` creates an auto-incrementing sequence which is wrong for FK columns — only PK columns should be `bigserial`. The schema was corrected, the plan file updated to match, a fresh migration was generated and applied to Neon, and the DB was verified.

### Detail of changes made:

- `src/db/schema.ts`: Added `bigint` to the `drizzle-orm/pg-core` import. Changed `orgId` in `memberships` from `bigserial` to `bigint` (keeping `.notNull().references(() => organizations.id, { onDelete: 'cascade' })`). Changed `orgId` in `purchases` from `bigserial` to `bigint` (keeping `.notNull().references(() => organizations.id)`). PK `id` columns remain `bigserial` as correct.
- Deleted stale broken migration `drizzle/0000_loose_betty_ross.sql` and `drizzle/meta/` directory.
- Ran `npx drizzle-kit generate` — produced `drizzle/0000_fat_omega_red.sql` with correct `bigint NOT NULL` for both FK columns (not `bigserial`).
- Ran `npx drizzle-kit migrate` with `DATABASE_URL` from `.env.local` — migration applied successfully to Neon. Note: `drizzle.config.ts` uses `dotenv/config` which reads `.env` not `.env.local`, so `DATABASE_URL` must be passed explicitly in the env when running drizzle-kit commands.
- `docs/superpowers/plans/2026-05-02-stripe-credit-billing-phase-1.md` updated: changed `bigserial('org_id'...)` to `bigint('org_id'...)` in both `memberships` and `purchases`, and added `bigint` to the import line.
- DB verified: tables `memberships, organizations, purchases, webhook_events` confirmed present. Sequences are exactly the 4 PK sequences (`memberships_id_seq`, `organizations_id_seq`, `purchases_id_seq`, `webhook_events_id_seq`) — no spurious FK sequences.
- 3 schema tests still pass after the fix.

### Potential concerns to address:

- `drizzle.config.ts` uses `dotenv/config` which only reads `.env`, not `.env.local`. Any developer or CI script running `drizzle-kit` commands must manually set `DATABASE_URL` in the environment. Consider documenting this or switching to a custom dotenv setup that reads `.env.local`.
- The `__drizzle_migrations` table does not appear in `information_schema.tables` (likely because Drizzle creates it in a different schema or with different permissions). This is normal Drizzle behavior but worth knowing.

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
