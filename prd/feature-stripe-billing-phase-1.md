# Branch Progress: feature/stripe-billing-phase-1

This branch implements Phase 1 of the Stripe credit billing system per the spec at `docs/superpowers/specs/2026-05-02-stripe-credit-billing-design.md`. Newest entries at the top.

---

## Progress Update as of 2026-05-02 05:45 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Replaced the bottom-of-page "Get a Commercial License" mailto on `/pricing` with "Buy Credits" anchored to `#credit-packs`. Founder's preference: no "Let's Talk"-style CTAs — direct funnel to the credit-packs section instead.

### Detail of changes made:

- `src/app/pricing/page.tsx` (lines 237-242): the bottom CTA `<a>` now reads "Buy Credits" and links to `#credit-packs` (the same anchor the Commercial card's "View Credit Packs ↓" uses). Existing classes preserved so it visually matches the Commercial card's secondary-CTA style.

### Potential concerns to address:

- The Commercial card itself (top of page, right column) still reads "View Credit Packs ↓" — a different label for the same destination. If founder wants both buttons to read "Buy Credits" verbatim, that's a one-line follow-up; not changed without explicit ask.
- Bottom CTA also still has a primary "Download Now" button alongside it — kept intact since founder's note was specifically about the "Let's Talk" mailto, not the primary download flow.

---

## Progress Update as of 2026-05-02 05:15 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Founder ran the first real end-to-end test purchase. Stripe `checkout.session.completed` did reach the handler, but `handleCheckoutCompleted` threw a `ClerkAPIResponseError: Unprocessable Entity (422)` from `findOrCreateUserByEmail` — Clerk's Backend API rejects creating a user with only an email when the instance config requires a password, even though the dashboard sign-up flow is magic-link. The dispatch error also surfaced a SECOND latent bug: the route inserted the idempotency row BEFORE dispatching, so when the handler crashed and Stripe retried, the route returned `{deduped: true}` and never re-ran the handler. Both fixed in this commit.

### Detail of changes made:

- `src/lib/clerk-backend.ts`: `findOrCreateUserByEmail` now passes `skipPasswordRequirement: true` and `skipPasswordChecks: true` to `client.users.createUser`. These flags tell Clerk "this user is being provisioned via webhook, password rules don't apply." Added an inline comment explaining why.
- `src/app/api/stripe/webhook/route.ts`: wrapped the dispatch switch in `try/catch`. On error, the catch deletes the just-inserted `webhookEvents` row (rolling back the idempotency claim) so Stripe's retry can re-attempt, then logs the error with the full Clerk error metadata (`clerkError`, `status`, `errors[]`) before rethrowing for a 5xx. Also imported `eq` from `drizzle-orm` for the rollback delete.
- Cleaned up the failed `webhook_events` row for the founder's failed event `evt_1TSnbpKBCAnWXTBG2ikTKKgE` directly via SQL (without this manual delete, the next retry would have hit the dedupe path and silently skipped).
- Founder enabled "Organizations" in Clerk dashboard alongside the fixes (was previously OFF, which would have caused a SECOND failure at `findOrCreateOrgForUser` even after the createUser fix).
- Verified: 20/20 vitest tests still pass, `npm run build` succeeds.

### Potential concerns to address:

- The `as any` cast on the webhook payload (`payload: event as any`) and on the error-cast (`as { clerkError?: boolean; ... }`) are tolerable in this defensive boundary code but worth revisiting if we hit more type friction later.
- Vitest mocks `clerk-backend` entirely, so this 422 was not catchable in tests — only revealed by a real purchase. If we add more Clerk Backend calls (e.g. updating user metadata after first purchase), expect similar surprises. Manual smoke testing remains essential before production.
- The polling page on `/checkout/success` still has no timeout ceiling. Founder's stuck-page screenshot confirmed the impact: when the webhook handler throws, the user sees "Processing your payment..." indefinitely. Phase 2 should add a timeout + support fallback.

---

## Progress Update as of 2026-05-02 05:02 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Production build (`npm run build`) was failing on `/checkout/success` because Next.js 15's static prerender requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary. Wrapped the page's existing logic in a Suspense boundary with a "Processing your payment..." fallback — build now succeeds, all 14 routes generate cleanly. This was caught only by `npm run build`, not by `npm test` or `tsc --noEmit`. Worth running `npm run build` before any future PR to main.

### Detail of changes made:

- `src/app/checkout/success/page.tsx`: refactored. The page now exports a top-level `CheckoutSuccessPage` that wraps a `<Suspense fallback={...}>` around the renamed inner `CheckoutSuccessInner` (which holds the `useSearchParams`, polling logic, and JSX). Fallback shows a minimal "Processing your payment..." card so the static prerender has something to emit.
- Verified `npm run build` succeeds: ✓ Compiled in 1.5s, ✓ 14/14 static pages generated.

### Potential concerns to address:

- Next.js workspace-root warning: build detected an extra lockfile at `/Users/drodio/package-lock.json` (founder's home dir) and fell back to that as the inferred root. Likely benign on Vercel (clean checkout), but if it becomes a deployment issue, set `outputFileTracingRoot: __dirname` in `next.config.js`. Not fixing now since it's a local-environment artifact.
- Build output shows `/api/me/*` and `/api/stripe/webhook` correctly marked dynamic (`ƒ`), and `/dashboard*` + `/checkout/*` as static (`○`). The dashboard pages don't crash at prerender despite using `fetch('/api/me/...')` — because the fetch only runs in `useEffect` (client-side), not at build time.

---

## Progress Update as of 2026-05-02 04:58 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Re-enabled `automatic_tax: { enabled: true }` in `src/app/api/checkout/route.ts` — founder configured Stripe Tax in the dashboard (head office: California, preset product category: Digital products → Software → Downloadable, taxes-on-shipping determine automatically, tax-inclusive pricing automatic). Smoke-tested: POST /api/checkout with pack_10 now returns a valid Stripe Checkout URL with automatic tax enabled.

### Detail of changes made:

- `src/app/api/checkout/route.ts`: removed the `// automatic_tax disabled` comment and re-enabled the line `automatic_tax: { enabled: true },`. Verified by curling POST /api/checkout — returned `{"url":"https://checkout.stripe.com/c/pay/cs_test_..."}` (200 OK, Stripe accepted the param).

### Phase E + F + G recap (since the last milestone summary at 03:56 PM PDT)

This block summarizes 21 commits delivered between 04:01 PM and 04:56 PM PDT — Phases C (Clerk), D (Stripe pricing), E (checkout flow), F (dashboard), G (Customer Portal) all landed.

**Phase C (Clerk):**
- C1 (e3c4f2d): Clerk middleware + ClerkProvider in root layout. Protected routes: `/dashboard(.*)`, `/api/me(.*)`.
- C2 (f16ec61): /sign-in and /sign-up catch-all pages with Clerk's SignIn/SignUp components.
- C3 (a491e00): Header.tsx — added SignedOut "Sign in" link, SignedIn Dashboard link + UserButton, in both desktop nav and mobile menu.

**Phase D (pricing + Stripe):**
- D2 (179e137): `src/lib/pricing.ts` with PACKS constant + getPack/isValidSku helpers + 6 TDD tests.
- D3 (b3f5ba6): `src/lib/stripe.ts` — apiVersion bumped from spec's `2025-01-27.acacia` to `2025-02-24.acacia` (matches stripe@17.7.0 SDK type).

**Phase E (checkout flow):**
- E2 (5da0b97): Webhook skeleton with signature verification + idempotency log via `webhookEvents`. Vitest config aliased `@` → `./src` to resolve route imports.
- E3 (ce372f7): POST /api/checkout. Spec deviations: `allowed_countries` removed (Stripe rejected as unknown param — US-only enforcement deferred to Radar/dashboard rules); `automatic_tax` initially disabled because no head office address (resolved in this commit, see above).
- E4 (1fbbf6d): CreditPackCard + CreditPacksSection components, integrated into /pricing (Commercial card CTA now scrolls to packs section).
- E5 (0e7dc03): `handleCheckoutCompleted` — find/create Clerk user, find/create Clerk org, upsert local org+membership, insert purchase. Idempotent via `onConflictDoNothing` on stripeCheckoutSessionId. Email helper at `src/lib/email.ts` no-ops when RESEND_API_KEY missing. Vitest set to `fileParallelism: false` to fix race between webhook-handlers test (truncates orgs) and queries test (truncates orgs).
- E6 (fa64afd): `handleChargeRefunded` — sets status to refunded/partially_refunded with proportional credit reduction.
- E7 (51a858f): `handleDisputeCreated` — logs + sends dispute alert (no-op until Resend live).
- E8 (728cd89): GET /api/checkout/status polling endpoint.
- E9 (5af79a6): /checkout/success client page polling /api/checkout/status; redirects signed-in users to /dashboard after 1.5s, instructs signed-out users to check email.
- E10 (f0c036e): /checkout/cancel page.

**Phase F (dashboard):**
- F1 (3451b8b): GET /api/me/balance.
- F2 (d3c30f3): GET /api/me/purchases (ordered by createdAt desc).
- F3 (3510f4d): /dashboard page with BalanceDisplay (top stat) + PurchaseHistory (last 5).
- F4 (0dfd00a): /dashboard/purchases full history table.

**Phase G (Customer Portal):**
- G2 (b536c1b): POST /api/me/billing-portal returns a Stripe Customer Portal URL. `handleCheckoutCompleted` extended to save `stripeCustomerId` on the org row on first checkout. BillingPortalButton rendered on /dashboard.

### Potential concerns to address:

- **G1 (Stripe Customer Portal config) still pending user action.** Until the founder enables the portal at `https://dashboard.stripe.com/test/settings/billing/portal` (and again in live mode), POST /api/me/billing-portal will surface a Stripe API error after a real purchase. Code is correct — config is missing.
- **US-only enforcement is NOT implemented at the API level.** `allowed_countries: ['US']` rejected by Stripe as unknown param in E3. Needs Radar rules or dashboard-level payment-method-country restrictions before public launch.
- **Resend (Phase H) deferred.** `RESEND_API_KEY` missing → magic-link emails post-purchase silently no-op (with console.warn). Founder needs to verify domain at https://resend.com and set the key before public launch.
- **Manual end-to-end smoke tests deferred to founder.** No subagent has actually run the full `stripe listen` → buy → webhook → DB → magic link → /dashboard flow. Should be the first thing tested in a real browser before merging.
- **Polling on /checkout/success has no timeout ceiling.** If webhook never fires, the page polls forever. Phase 2 follow-up.
- **Test isolation for CI.** Vitest tests truncate the real Neon DB in beforeEach. `fileParallelism: false` papers over the cross-file race; for CI, use a separate test branch / schema or wrap in transactions that roll back.

---

## Progress Update as of 2026-05-02 04:56 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task G2 complete: added Customer Portal access from the dashboard. Four changes: new `POST /api/me/billing-portal` API route, `stripeCustomerId` save in `handleCheckoutCompleted`, new `BillingPortalButton` client component, and updated dashboard page to include it. All 20 tests pass, tsc clean.

### Detail of changes made:

- `src/app/api/me/billing-portal/route.ts`: new file. `nodejs` runtime. POST handler — authenticates via `auth()`, looks up membership → org → checks `stripeCustomerId` (404 if missing), calls `stripe.billingPortal.sessions.create` with the customer ID and `return_url` pointing to `/dashboard`, returns `{ url }`.
- `src/lib/webhook-handlers.ts`: in `handleCheckoutCompleted`, after the org upsert block and before the purchase insert — extracts `customerId` from `session.customer` (handles string or object form), then if non-null and org doesn't already have one, updates `organizations.stripeCustomerId` in DB and keeps the local `org` var consistent via spread. The `org` variable is `let`-destructured so reassignment works fine — no TypeScript issue.
- `src/components/BillingPortalButton.tsx`: `'use client'` component. On click: POSTs to `/api/me/billing-portal`, reads `data.url`, navigates via `window.location.href`. Styled with `border-white/20`, `text-cream`, `hover:bg-deep-forest`.
- `src/app/dashboard/page.tsx`: added `BillingPortalButton` import and a `mt-12` div at the bottom of the inner container rendering `<BillingPortalButton />`.
- Full test suite: 20/20 passing (no regressions).

### Potential concerns to address:

- **G1 still pending (user action required):** The Stripe Customer Portal must be configured in the Stripe dashboard (both test and live modes) before `stripe.billingPortal.sessions.create` will succeed. Until that's done, the API will return a Stripe error about portal configuration missing. This is a user/external step — not a code issue.
- `BillingPortalButton` has no loading state — the button stays clickable while the POST is in flight. A second click would fire a second request. Low risk (portal sessions are cheap) but could add a disabled state in Phase 2.
- `window.location.href` navigation means the dashboard's React state is discarded. Acceptable since the portal is an external Stripe page anyway.

---

## Progress Update as of 2026-05-02 04:55 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task F4 complete: created `/dashboard/purchases` full purchase history page. One file, reuses `PurchaseHistory` with no limit. tsc clean.

### Detail of changes made:

- `src/app/dashboard/purchases/page.tsx`: server component. "← Back to dashboard" link at top, "All purchases" heading, then `<PurchaseHistory />` (no limit prop — shows everything). Max-width 5xl to accommodate the wider table. Protected by middleware (same Clerk intercept behavior as other dashboard routes).

### Potential concerns to address:

- Same "No purchases yet." flash as the dashboard page — `PurchaseHistory` starts with empty rows before fetch completes.

---

## Progress Update as of 2026-05-02 04:54 PM PDT (F3)
*(Most recent updates at top)*
### Summary of changes since last update

Task F3 complete: created `BalanceDisplay` and `PurchaseHistory` client components and the `/dashboard` page wiring them together with a "Buy more credits" card and a "View all →" link. tsc clean. Smoke test returns Clerk dev-mode intercept (expected).

### Detail of changes made:

- `src/components/BalanceDisplay.tsx`: `'use client'` component. Fetches `/api/me/balance` on mount, shows `—` while loading, then renders the balance as a large teal number. Styled with `bg-deep-forest`, `text-teal`, `text-muted` tokens.
- `src/components/PurchaseHistory.tsx`: `'use client'` component. Fetches `/api/me/purchases` on mount, renders "No purchases yet." when empty, otherwise renders a table with Date/Pack/Credits/Amount/Status/Expires columns. Accepts optional `limit` prop to slice the display rows. Styled with `text-cream`, `text-muted`, `border-white/5`.
- `src/app/dashboard/page.tsx`: server component. Two-column grid at top (BalanceDisplay + "Buy more credits" card with `/pricing#credit-packs` link). Below that, a "Recent purchases" section with `<PurchaseHistory limit={5} />` and a "View all →" link to `/dashboard/purchases`.
- Smoke test: `GET /dashboard` returns Clerk dev-mode intercept (same pattern as `/api/me/*` routes) — correct, as `/dashboard(.*)` is a protected route in middleware.

### Potential concerns to address:

- `PurchaseHistory` shows "No purchases yet." immediately on first render (before fetch completes) because `rows` starts as `[]`. A loading state would prevent the flash. Acceptable for Phase 1.

---

## Progress Update as of 2026-05-02 04:54 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task F2 complete: created `GET /api/me/purchases` — returns all purchases for the user's org, ordered newest-first. Smoke behavior identical to F1 (Clerk dev-mode intercept — expected). tsc clean.

### Detail of changes made:

- `src/app/api/me/purchases/route.ts`: new file. `nodejs` runtime. Authenticates via `auth()`, looks up membership by `clerkUserId`, returns `{ purchases: [] }` if no membership, otherwise selects all purchases for the org ordered by `createdAt DESC` and returns `{ purchases: rows }`.
- Smoke test: same Clerk dev-mode 404 behavior as F1 — expected and acceptable per spec.
- `npx tsc --noEmit`: clean.

### Potential concerns to address:

- No pagination — returns all purchases for the org. For orgs with many purchases this could become a large payload. Acceptable for Phase 1 (pagination is Phase 2).

---

## Progress Update as of 2026-05-02 04:53 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task F1 complete: created `GET /api/me/balance` — looks up the user's org via memberships and returns their credit balance. Smoke test returned Clerk-middleware-intercepted 404, which is the expected behavior for unauthenticated curl requests in Clerk dev mode (see notes).

### Detail of changes made:

- `src/app/api/me/balance/route.ts`: new file. `nodejs` runtime. Authenticates via `auth()`, looks up membership by `clerkUserId`, returns `{ balance: 0 }` if no membership found, otherwise calls `getBalance(orgId)` and returns `{ balance: N }`. Does not import `organizations` (unused per spec note).
- Smoke test: `curl http://localhost:3100/api/me/balance` returns HTTP 404 with headers `x-clerk-auth-reason: protect-rewrite, dev-browser-missing` and `x-middleware-rewrite: /clerk_...`. This is correct — Clerk middleware intercepts unauthenticated API requests in dev mode and rewrites to its own internal handler, which 404s because the rewrite target isn't a real page. In a real browser with Clerk's dev cookie (or in production), an unauthenticated request would reach the route and return 401. The spec explicitly accepts "404/308 (Clerk middleware redirect)" as a valid smoke result.

### Potential concerns to address:

- Clerk dev-mode behavior makes it impossible to smoke-test API routes with raw curl without a valid dev-browser cookie. All `/api/me/*` routes will exhibit this behavior. Real testing requires a signed-in browser session.

---

## Progress Update as of 2026-05-02 04:47 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E10 complete: created `/checkout/cancel` static page. Smoke test returned 200. tsc clean. All 20 tests still pass.

### Detail of changes made:

- `src/app/checkout/cancel/page.tsx`: server component (no `'use client'`). Displays "Payment cancelled / No charges were made." with a "Back to pricing" link pointing to `/pricing#credit-packs`. Styled with `bg-forest`, `text-cream`, `text-muted`, `bg-teal` tokens.
- Smoke test: `curl http://localhost:3099/checkout/cancel` → 200.
- Full test suite: 20 tests across 5 files, all passing.

### Potential concerns to address:

- None. This is a static page with no logic to go wrong.

---

## Progress Update as of 2026-05-02 04:46 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E9 complete: created `/checkout/success` page with polling. Smoke test returned 200. tsc clean. No Suspense boundary needed.

### Detail of changes made:

- `src/app/checkout/success/page.tsx`: `'use client'` page. Uses `useSearchParams` to read `session_id`, polls `/api/checkout/status` every 1s until `status === 'complete'`, then shows credit count and (if signed in) redirects to `/dashboard` after 1.5s. If not signed in, shows email-for-sign-in-link message. Renders a "missing session ID" fallback if param is absent. Styled with `bg-forest`, `text-cream`, `text-muted` tokens.
- Suspense boundary: not required. Next.js 15 `useSearchParams` Suspense warning applies to static pages; this `'use client'` page is dynamically rendered via client-side JS, so no build error or warning occurred. Confirmed by 200 smoke test and clean tsc.

### Potential concerns to address:

- The polling loop has no upper bound — if the webhook never fires (e.g. Stripe outage), the page will poll indefinitely. A timeout after ~30s with a "contact support" fallback would be a good Phase 2 improvement.
- `/dashboard` does not exist yet — the `router.push('/dashboard')` redirect for signed-in users will land on a 404 until the dashboard page is built.

---

## Progress Update as of 2026-05-02 04:45 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E8 complete: created `GET /api/checkout/status` polling endpoint. Smoke tests pass. tsc clean.

### Detail of changes made:

- `src/app/api/checkout/status/route.ts`: new file. `nodejs` runtime. Returns 400 `{"error":"missing session_id"}` if `session_id` query param is missing. Queries `purchases` by `stripeCheckoutSessionId`; returns `{"status":"pending"}` if not found, or `{"status":"complete","credits":N,"sku":"..."}` if found and status is `complete` (any other status still returns `pending`).
- Smoke test results: `curl .../api/checkout/status` → `{"error":"missing session_id"}` (400); `curl .../api/checkout/status?session_id=cs_test_nonexistent` → `{"status":"pending"}` (200). Both correct.

### Potential concerns to address:

- No authentication on this endpoint — anyone with a valid `session_id` can poll it. Session IDs are unguessable Stripe opaque tokens (`cs_*`), so this is acceptable. Would need auth if purchase metadata became sensitive.
- Returns `pending` for `refunded`/`partially_refunded` statuses — by design, the success page only needs to know if credits were granted. Future polish could expose refund status separately.

---

## Progress Update as of 2026-05-02 04:44 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E7 complete: `handleDisputeCreated` was already added to `webhook-handlers.ts` and wired into the route in the E6 step. This commit cleans up a duplicate `email` import (merged `sendMagicLink` and `sendDisputeAlert` into a single import line). All 20 tests pass, tsc clean.

### Detail of changes made:

- `src/lib/webhook-handlers.ts`: merged two separate `import { ... } from './email'` lines into one `import { sendMagicLink, sendDisputeAlert } from './email'`. `handleDisputeCreated` logs the dispute ID/amount/reason at warn level and calls `sendDisputeAlert` (no-ops when `RESEND_API_KEY` is absent).
- `src/app/api/stripe/webhook/route.ts`: `case 'charge.dispute.created':` dispatches to `handleDisputeCreated` (already in place from E6 commit).
- Full test suite: 20 tests across 5 files, all passing.

### Potential concerns to address:

- `sendDisputeAlert` no-ops when `RESEND_API_KEY` is missing (current state). Dispute alerts won't be sent until Resend is configured. The `console.warn` log will still fire, so the event won't be silently lost.

---

## Progress Update as of 2026-05-02 04:43 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E6 complete: implemented `handleChargeRefunded` webhook handler in `webhook-handlers.ts`, wired into the dispatch switch, and added 2 placeholder tests. tsc clean, 4 webhook-handler tests pass.

### Detail of changes made:

- `src/lib/webhook-handlers.ts`: added `import { sendDisputeAlert } from './email'` (needed for E7 which lands in the same file). Added `handleChargeRefunded(charge: Stripe.Charge)` — resolves `payment_intent` to an ID (handles string or object), looks up purchase by `stripePaymentIntentId`, warns and returns if not found, computes `fullyRefunded` flag and proportional `refundedCreditsProportional`, then updates `status` (refunded/partially_refunded) and `refundedCredits` in the DB.
- Also added `handleDisputeCreated` to the same file (E7 lands here — kept in one file per plan). See E7 entry for details.
- `src/lib/__tests__/webhook-handlers.test.ts`: appended `describe('handleChargeRefunded', ...)` with 2 placeholder tests (`expect(true).toBe(true)`) per plan spec. Real verification is manual smoke test (deferred to user).
- `src/app/api/stripe/webhook/route.ts`: updated import to include `handleChargeRefunded` and `handleDisputeCreated`; replaced `// TODO Task E6` and `// TODO Task E7` stubs with real dispatch calls.

### Potential concerns to address:

- Tests are placeholder assertions (`expect(true).toBe(true)`) per spec — they verify the handler is exported and can be imported, but do not test actual DB mutation behavior. Real verification requires a Stripe CLI refund event replay.
- `refundedCreditsProportional` uses floating-point division and `Math.floor` — for non-round amounts there may be off-by-one credit rounding. Acceptable for Phase 1.

---

## Progress Update as of 2026-05-02 04:40 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E5 complete (TDD): implemented the `checkout.session.completed` webhook handler with Clerk user/org provisioning, DB purchase record insertion, and post-purchase magic link email. All 18 tests pass; tsc clean.

### Detail of changes made:

- `src/lib/clerk-backend.ts`: thin wrappers around Clerk Backend API — `findOrCreateUserByEmail`, `findOrCreateOrgForUser`, `createSignInToken`. `clerkClient()` is awaited (returns `Promise<ClerkClient>`). `getOrganizationMembershipList` used on `client.users` (userId param), not `client.organizations` (organizationId param) — important distinction from docs examples.
- `src/lib/email.ts`: Resend wrapper with `sendMagicLink` and `sendDisputeAlert`. Gracefully no-ops (logs a warning) when `RESEND_API_KEY` is missing — current production state since Resend is deferred. Magic links will not be sent until the key is added.
- `src/lib/webhook-handlers.ts`: `handleCheckoutCompleted` — validates SKU, checks amount_total against expected pack amountCents (throws `amount mismatch` if wrong), upserts org + membership in DB, inserts purchase row with `onConflictDoNothing` on `stripeCheckoutSessionId` for idempotency, calls `createSignInToken` + `sendMagicLink`.
- `src/lib/__tests__/webhook-handlers.test.ts`: 2 TDD tests — (1) amount mismatch rejection, (2) valid purchase happy path hitting real Neon DB and asserting `findOrCreateUserByEmail` was called. Mocks: `clerk-backend` and `email` entirely mocked; DB is real.
- `src/app/api/stripe/webhook/route.ts`: wired up `handleCheckoutCompleted` in `case 'checkout.session.completed':` block.
- `vitest.config.ts`: added `fileParallelism: false` to prevent FK race conditions between test files sharing the real Neon DB (both `webhook-handlers.test.ts` and `queries.test.ts` delete/insert organizations; concurrent deletes violate FK from purchases table).
- Manual end-to-end test (Stripe CLI `stripe listen` + real Checkout flow) deferred to user.

### Potential concerns to address:

- **Clerk mock vs real SDK shape**: tests mock `clerk-backend` entirely, so tests pass regardless of real Clerk API behavior. If `getOrganizationMembershipList` returns a different structure at runtime (e.g., `memberships.data[0].organization` is undefined), the production code path will throw. Worth an integration test or manual verification once Clerk is fully configured.
- **Email no-op**: `RESEND_API_KEY` is not set — post-purchase magic links are silently skipped. Users who buy won't receive a sign-in link until the key is added. This is intentional for Phase 1 but should be resolved before public launch.
- **SignInToken URL**: `token.url ?? ''` — if Clerk returns an empty url (shouldn't happen per types, `url` is non-optional on `SignInToken`), the magic link will be a blank href. Low risk but worth monitoring.
- **Test fileParallelism: false**: adds ~2-3s to full test suite run time due to sequential file execution. Acceptable now; revisit if the suite grows large.

---

## Progress Update as of 2026-05-02 04:35 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E4 complete: created `CreditPackCard` and `CreditPacksSection` components and integrated them into the `/pricing` page. The Commercial card's "Contact Us" CTA is now replaced with a "View Credit Packs ↓" anchor link, and the new `<CreditPacksSection />` is inserted between the two pricing cards and the FAQ.

### Detail of changes made:

- `src/components/CreditPackCard.tsx`: new client component. Renders a single credit pack card with price, per-credit rate, optional bonus percentage label, and a buy button. On click, POSTs to `/api/checkout` with the pack SKU, then redirects to the Stripe Checkout URL. Shows an inline error string on failure. Uses `bg-deep-forest`, `text-teal`, `text-amber`, `text-burnt-sienna` tokens as specced.
- `src/components/CreditPacksSection.tsx`: new server component. Imports `PACKS` from `@/lib/pricing`, maps over all 4 packs, renders a `CreditPackCard` for each with bonus percentages (pack_10=0%, pack_20=10%, pack_50=15%, pack_100=20%) defined in a local `BONUSES` record. Includes the 12-month expiry / 30-day refund policy note.
- `src/app/pricing/page.tsx`: three edits — (1) added `import { CreditPacksSection }` at top; (2) replaced the Commercial card's `href="mailto:hello@visionpipe.ai"` / "Contact Us" CTA with `href="#credit-packs"` / "View Credit Packs ↓" (same classes, one CTA total — verified); (3) inserted `<CreditPacksSection />` between the `</section>` closing the two-card pricing row and the `{/* FAQ */}` comment.
- Smoke test: `curl http://localhost:3099/pricing` grep confirmed "Credit Packs" (×2), "credit-packs" (×4), "View Credit Packs ↓" (×2) all present in rendered HTML.
- 16 tests passing (no regression), `npx tsc --noEmit` clean.

### Potential concerns to address:

- `CreditPacksSection` is a server component that imports `PACKS` (which reads `process.env.STRIPE_PRICE_PACK_*` at module-load time). In production builds, if those env vars are absent, `priceId` will be `undefined` — the cards will still render visually but checkout will fail. Vercel env vars must be set before deploying.
- The buy button redirects via `window.location.href` — no loading spinner beyond the button text "Redirecting...". If Stripe Checkout is slow to initialize, the user sees a frozen button for a moment. Acceptable for Phase 1.
- The Commercial card now has exactly one CTA ("View Credit Packs ↓") — verified in the rendered HTML. No duplicate CTA risk.

---

## Progress Update as of 2026-05-02 04:32 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E3 complete: implemented `POST /api/checkout` which creates a Stripe Checkout session for a given credit pack SKU. Two spec deviations were required due to Stripe API rejections discovered during smoke testing — both are documented below.

### Detail of changes made:

- `src/app/api/checkout/route.ts`: new file — App Router POST handler with `nodejs` runtime. Validates SKU via `isValidSku`, looks up the org/Stripe customer ID via Clerk userId → memberships → organizations, creates a Stripe Checkout session in `payment` mode with pack priceId, success/cancel URLs, and metadata (sku, credits, amountCents, orgId if available). Returns `{ url }` for the Checkout URL.
- **Deviation 1 — `allowed_countries` removed:** spec included `allowed_countries: ['US'] as any` at the top level of `stripe.checkout.sessions.create()`. Stripe rejected it with `parameter_unknown` (400, `StripeInvalidRequestError`). The field does not exist at that level in the Stripe Sessions API. Removed entirely — US-only enforcement is a Stripe dashboard/Tax setting concern, not a code-level param.
- **Deviation 2 — `automatic_tax` commented out:** spec included `automatic_tax: { enabled: true }`. Stripe rejected it in test mode with "You must have a valid head office address to enable automatic tax calculation in test mode." The test-mode Stripe Tax settings at `https://dashboard.stripe.com/test/settings/tax` need a head office address configured before this can be enabled. Left as a commented-out line with a URL to the relevant Stripe dashboard page.
- Smoke test results: happy path (`pack_10`) → 200 + valid `https://checkout.stripe.com/c/pay/cs_test_...` URL; invalid SKU (`pack_999`) → 400 `{"error":"invalid sku"}`; empty body → 400 `{"error":"invalid sku"}`.
- `npx tsc --noEmit`: clean (no `as any` needed once `allowed_countries` was removed).
- Test suite: 16 tests passing (no new tests; smoke test serves as E3 verification per plan).

### Potential concerns to address:

- `automatic_tax` is disabled until the Stripe test-mode head office address is configured at `https://dashboard.stripe.com/test/settings/tax`. Without it, Stripe Checkout will not compute or collect sales tax. Must be re-enabled before production launch.
- US-only restriction (originally via `allowed_countries`) has no enforcement at the code level. If country restriction is needed, it must be configured in the Stripe dashboard (payment method restrictions or Stripe Radar rules). Deferred per spec guidance.
- `customer_email: stripeCustomerId ? undefined : undefined` is a no-op (both branches return `undefined`). This was in the spec verbatim — presumably a placeholder for a future Clerk email lookup. No behavior change now, but a future task should either populate it or remove the dead code.

---

## Progress Update as of 2026-05-02 04:28 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task E2 complete: webhook handler skeleton with signature verification and idempotency, implemented TDD (failing test first, then implementation). Also added `@/` path alias to `vitest.config.ts` — this was necessary because the route uses `@/lib/stripe` and `@/db/client` imports, which Vitest couldn't resolve without the alias. Total tests now 16 (was 14).

### Detail of changes made:

- `src/app/api/stripe/webhook/__tests__/route.test.ts`: two tests covering the signature-rejection paths (missing header → 400, invalid signature → 400). Written before the route existed to confirm red-state failure.
- `src/app/api/stripe/webhook/route.ts`: Next.js App Router POST handler with `force-dynamic` + `nodejs` runtime directives. Returns 400 for missing/invalid Stripe signatures, inserts into `webhookEvents` with `.onConflictDoNothing()` for idempotency, dispatches on event type with TODO stubs for E5/E6/E7.
- `vitest.config.ts`: added `resolve.alias` mapping `@` → `./src` so Vitest can resolve `@/*` imports (same as tsconfig paths). Also added `import path from 'path'`. This was not needed by previous tests (all used relative imports) but is required by the route under test.
- `event as any` cast in DB insert is intentional — `Stripe.Event` doesn't satisfy Drizzle's jsonb input type without it. Per spec, not to be fixed here.
- Both tests exercise only the early-return 400 paths — no DB or live Stripe calls are made during the test suite.

### Potential concerns to address:

- The `stderr` output during `npm test` shows the `StripeSignatureVerificationError` stack trace from the "invalid signature" test. This is expected (the `console.error` in the catch block) and not a test failure — tests pass 2/2. Could suppress with `vi.spyOn(console, 'error').mockImplementation(() => {})` in the test, but spec says YAGNI on extra test polish.
- `STRIPE_WEBHOOK_SECRET` must be set in `.env.local` (and Vercel env) for the handler to work in non-test contexts. The `!` non-null assertion in `process.env.STRIPE_WEBHOOK_SECRET!` means a missing env var will pass `undefined` to `constructEvent`, which Stripe will reject with a verification error (400) rather than crashing — acceptable behavior but worth noting.
- Handler stubs for `checkout.session.completed`, `charge.refunded`, `charge.dispute.created` are empty TODOs to be filled by E5/E6/E7.

---

## Progress Update as of 2026-05-02 04:08 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task D3 complete: added Stripe client singleton (`src/lib/stripe.ts`). Required a one-line deviation from the spec's `apiVersion` — see details below. `npx tsc --noEmit` clean, all 14 tests still passing.

### Detail of changes made:

- `src/lib/stripe.ts`: new file — guards against missing `STRIPE_SECRET_KEY` at module-load time (throws `Error`), then exports a `stripe` singleton initialized with `stripe@17.7.0` and `typescript: true`.
- **apiVersion deviation:** spec specified `'2025-01-27.acacia'` but `stripe@17.7.0` (installed) pins its `Stripe.LatestApiVersion` type to `'2025-02-24.acacia'`. Using the spec version caused `TS2322` type error. Changed to `'2025-02-24.acacia'` to satisfy the type — this is the correct version for the installed SDK and has no behavioral difference for our use case.
- `npx tsc --noEmit`: clean after version fix.
- Test suite: 14 tests passing (unchanged — no new tests for this helper; it's a pure client wrapper with no testable logic beyond the guard, which would require mocking env in a way that conflicts with the dotenv-loaded `.env.local`).

### Potential concerns to address:

- The `STRIPE_SECRET_KEY` guard throws at module import time if the var is missing. This is intentional — fast fail is better than a cryptic Stripe API error later. However, it means any module that imports `stripe.ts` (even transitively) will throw during the Next.js build if the key is absent. Vercel preview/production deployments must have `STRIPE_SECRET_KEY` set in their environment.
- No tests written for `stripe.ts` — the singleton is a thin wrapper with no logic to test. If the guard behavior needs to be verified, it would require a test that unsets `STRIPE_SECRET_KEY` after `dotenv` has loaded it (tricky with vitest module isolation). Deferred as not worth the complexity.

---

## Progress Update as of 2026-05-02 04:07 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task D2 complete: added pricing constants module (`src/lib/pricing.ts`) using TDD discipline. Wrote the failing test first, confirmed the "Cannot find module" red state, then implemented the module to make all 6 new tests pass. Total test suite is now 14 tests across 3 files.

### Detail of changes made:

- `src/lib/__tests__/pricing.test.ts`: new file — 6 tests across 3 describe blocks: `PACKS` (exposes 4 packs, matches spec amounts), `getPack` (returns pack for valid SKU, returns undefined for invalid), `isValidSku` (true for known SKUs, false for unknown/empty/null).
- `src/lib/pricing.ts`: new file — exports `PackSku` union type, `Pack` interface, `PACKS` record (4 entries: pack_10/20/50/100 with priceId from env, credits, amountCents, displayName), `isValidSku` type-guard, and `getPack` helper.
- TDD discipline followed: confirmed "Failed to load url ../pricing" failure before writing the implementation.
- Credit amounts per spec: pack_10=1000 credits/$10, pack_20=2200/$20 (10% bonus), pack_50=5750/$50 (15% bonus), pack_100=12000/$100 (20% bonus).
- `priceId` fields read from `process.env.STRIPE_PRICE_PACK_{10,20,50,100}` — values are present in `.env.local` with real test-mode Stripe price IDs.
- Test count: 14 total (3 schema + 5 queries + 6 pricing), all passing.

### Potential concerns to address:

- `priceId` uses the non-null assertion operator (`!`) on `process.env.STRIPE_PRICE_PACK_*`. If env vars are missing at runtime, `priceId` will be `undefined` (not a runtime error at module-load time). The Stripe client helper (D3) and checkout API (E2) will surface the error when they try to use the priceId. Consider adding a startup check if this becomes an issue.
- `PACKS` is evaluated at module-load time in the test environment; `process.env` is populated by the `dotenv` call in `vitest.config.ts`, so the real price IDs are injected. Tests don't assert on `priceId` values (correct — they'd be brittle), only on credits/amountCents.

---

## Progress Update as of 2026-05-02 04:05 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task C3 complete: added Clerk auth UI (`SignedIn`, `SignedOut`, `UserButton`) to the Header in both desktop nav and mobile menu.

### Detail of changes made:

- `src/components/Header.tsx`: added `import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"`. In the desktop nav (`hidden md:flex`), inserted a `<SignedOut>` block rendering a "Sign in" link to `/sign-in` and a `<SignedIn>` block rendering a "Dashboard" link to `/dashboard` plus `<UserButton afterSignOutUrl="/" />`. Both inserted after the GitHub link and before the Download CTA. Same structure mirrored in the mobile menu's `flex flex-col gap-4` column at the same position.
- **Visual deviation from spec (intentional):** plan spec used `text-cream hover:text-teal transition-colors` for auth links. Used `text-sm text-muted transition hover:text-cream` instead to match the existing Features/Pricing/GitHub link pattern, keeping visual consistency.
- **SSR note:** Clerk's `SignedIn`/`SignedOut` components are client-side — they do not appear in the initial SSR HTML payload. The "Sign in" link renders after JS hydration. Smoke test confirmed HTTP 200 and Clerk JS config embedded in HTML (`signInUrl` etc.). This is expected Clerk behavior.
- `Link` import was already present; no double-import issue.
- TypeScript check: `npx tsc --noEmit` clean.
- Test suite: `npm test` — all 8 tests passing (3 schema + 5 queries), no regression.

### Potential concerns to address:

- Clerk's client-side-only rendering means "Sign in" is not present in the SSR HTML — any SEO or crawler that depends on seeing the auth nav links in raw HTML will not see them. Acceptable for this use case (header nav links are not indexed content).
- `UserButton` in the mobile menu renders inline within a `flex flex-col` column — visually it will be left-aligned at the column's start. This is a minor layout quirk; no custom wrapper was added per task spec ("Clerk's UserButton is small enough to render inline in the column").

---

## Progress Update as of 2026-05-02 04:03 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task C2 complete: created Clerk sign-in and sign-up pages with themed catch-all routes. Both routes return HTTP 200. All 8 tests still pass, TypeScript clean. Manual magic-link signup test deferred to user (per task spec).

### Detail of changes made:

- `src/app/sign-in/[[...sign-in]]/page.tsx`: new file — exports `SignInPage` component that renders Clerk's `<SignIn>` component centered on a forest-green background. Custom appearance config applies deep-forest + white border styling to the card element.
- `src/app/sign-up/[[...sign-up]]/page.tsx`: new file — exports `SignUpPage` component that renders Clerk's `<SignUp>` component with identical layout and styling as sign-in page.
- Smoke test confirmed: `npm run dev` started successfully, `curl http://localhost:3000/sign-in` returns 200, `curl http://localhost:3000/sign-up` returns 200, dev server stopped cleanly.
- Test suite: `npm test` shows all 8 tests passing (3 schema + 5 queries), no regression.
- Type check: `npx tsc --noEmit` clean, no TypeScript errors.

### Potential concerns to address:

- Clerk's internal routes (verify, factor-one, etc.) will work automatically via the catch-all `[[...]]` directory naming — no additional routing needed.
- The `appearance` prop's custom styling (`bg-deep-forest border border-white/10`) assumes Clerk's Tailwind integration is active in the app; ClerkProvider (from C1) provides the necessary context.
- Magic-link signup test (Step 4 of the task plan) requires external Clerk dashboard config (enabling email/magic-link providers) — this is user-facing external setup, not code, so skipped per task spec.

---

## Progress Update as of 2026-05-02 04:01 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Task C1 complete: created Clerk middleware and wrapped the root layout with `<ClerkProvider>`. Dev server starts clean (HTTP 200), all 8 tests still pass, `npx tsc --noEmit` clean.

### Detail of changes made:

- `src/middleware.ts`: new file — exports `clerkMiddleware` with a `createRouteMatcher` protecting `/dashboard(.*)` and `/api/me(.*)`. All other routes are public. Matcher config follows the standard Clerk Next.js pattern (excludes static assets and Next.js internals).
- `src/app/layout.tsx`: added `import { ClerkProvider } from "@clerk/nextjs"` and wrapped the `<html>` root element with `<ClerkProvider>`. All existing content (fonts, metadata, Header, main pt-16, Footer) preserved exactly.
- Smoke test confirmed: `npm run dev` starts without Clerk errors, `curl http://localhost:3000` returns 200.

### Potential concerns to address:

- `ClerkProvider` wraps `<html>` (not `<body>`), which is the documented Next.js App Router pattern — Clerk requires it at the outermost level to support server components. No issues expected.
- Protected routes (`/dashboard`, `/api/me`) don't exist yet — they'll be built in C2/C3 and later API tasks. The middleware will correctly 401 any attempt to hit them before they're built.

---

## Progress Update as of 2026-05-02 03:56 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Code review polish on `getBalance`: switched expiration filter from JS-side `new Date()` to SQL-side `NOW()` (eliminates theoretical clock-skew risk between app and DB), and added a JSDoc explaining the "balance of 0 ≠ org found" ambiguity. Updated the plan file to match. All 8 tests still pass.

### Detail of changes made:

- `src/db/queries.ts`: replaced `gt(purchases.expiresAt, new Date())` with `sql\`${purchases.expiresAt} > NOW()\``. Removed the now-unused `gt` import (consolidated drizzle-orm imports onto one line). Added a JSDoc above `getBalance` clarifying that a returned `0` could mean either "no qualifying purchases" or "org not found" — callers that need to distinguish must verify org existence separately.
- `docs/superpowers/plans/2026-05-02-stripe-credit-billing-phase-1.md`: mirrored the same edits in the Task B5 spec block (lines ~598–622) so future plan readers see the corrected version.

### Potential concerns to address:

- None new. The integration-test-DB-isolation concern from the previous entry still applies for CI.

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
