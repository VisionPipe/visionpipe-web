# VisionPipe — Stripe Credit Billing (Phase 1) — Design Spec

**Date:** 2026-05-02
**Repo:** `visionpipe-web`
**Status:** Brainstormed and approved by founder. Ready for implementation planning.

## Overview

Wire up the marketing website to sell credit packs via Stripe. Buyers get an account, see their balance, and have credits ready in their org for the future desktop integration. The desktop app's local credit counter is unchanged in this phase — it will be wired to this backend in Phase 2.

## Phasing decisions

- **Phase 1 (this spec)**: Web-side full vertical. Account system, database, Stripe Checkout, magic-link auth, buyer dashboard. Credits are recorded but not yet spent (desktop app is unchanged).
- **Phase 1.5 (next spec, after Phase 1 ships)**: Team purchasing — domain auto-join, allowlist mode, multi-member orgs, invitations. Pure additive work; data model is already org-first so no schema migrations.
- **Phase 2 (later spec)**: Desktop app authentication and credit consumption. The desktop app authenticates against the backend, fetches balance, deducts on capture/transcription, syncs back.

## Pricing model

Four one-time credit packs (no subscriptions in Phase 1):

| Pack | Price | Credits | Effective $/credit | Bonus vs base |
|------|-------|---------|--------------------|----------------|
| 1 | $10 | 1,000 | $0.0100 | 0% (base) |
| 2 | $20 | 2,200 | $0.00909 | 10% |
| 3 | $50 | 5,750 | $0.00870 | 15% |
| 4 | $100 | 12,000 | $0.00833 | 20% |

- **Expiry:** 12 months from purchase date. Computed at query time via `expires_at > NOW()`; no cron job needed in Phase 1.
- **Refunds:** 30-day refund on unused credits, manual via Stripe Dashboard. Webhook handles the balance update automatically.
- **Tax/regions:** Stripe Tax enabled for calculation; checkout restricted to `allowed_countries: ['US']` for Phase 1 launch (no VAT registrations needed). International expansion deferred.

## Section 1 — System architecture

A single Next.js 15 app on Vercel, talking to four external services. No backend repo, no monorepo, no separate dashboard app.

```
┌─────────────────────────────────────────────────────────────┐
│  visionpipe-web  (Next.js 15, App Router, Vercel)           │
│                                                              │
│  Pages:                          API routes:                │
│  ─ /              (marketing)    ─ /api/checkout            │
│  ─ /pricing       (existing,     ─ /api/stripe/webhook      │
│      updated)                    ─ /api/me/balance          │
│  ─ /sign-in/up    (Clerk UI)     ─ /api/me/purchases        │
│  ─ /dashboard     (NEW)          ─ /api/me/billing-portal   │
│  ─ /dashboard/                   ─ /api/checkout/status     │
│      purchases    (NEW)                                     │
│  ─ /checkout/success (NEW)                                  │
│  ─ /checkout/cancel  (NEW)                                  │
└──┬──────────┬──────────────┬──────────────┬─────────────────┘
   │          │              │              │
   ▼          ▼              ▼              ▼
┌──────┐  ┌──────────┐   ┌──────────┐    ┌────────┐
│Clerk │  │  Stripe  │   │   Neon   │    │ Resend │
│ Auth │  │ Checkout │   │ Postgres │    │ Email  │
│ Orgs │  │ Webhooks │   │          │    └────────┘
└──────┘  │ Tax      │   │ Tables:  │
          │ Customer │   │ orgs,    │
          │ Portal   │   │ memberships,
          └──────────┘   │ purchases,
                         │ webhook_events │
                         └──────────┘
```

### Boundaries & responsibilities

- **Clerk** owns user identity, sessions, magic-link delivery for auth, sign-in UI components, and Organizations primitives. We never store passwords or session tokens.
- **Stripe** owns payment processing, tax calculation, refund mechanics, hosted Checkout UI, receipts/PDFs. We never touch card numbers.
- **Neon** owns org/membership records, purchase records, expiry timestamps, webhook idempotency log. Source of truth for "how many credits does org X have right now."
- **Resend** owns transactional email beyond Clerk's auth emails (Phase 1: dispute notifications to founder; Phase 2: low-balance warnings to users).
- **Our app** owns business logic — translating Stripe webhooks into purchase records, computing balance, gating dashboard reads by Clerk session, success-page polling.

### Why this shape

- **Single Next.js app:** Dashboard surface is small (~3 pages), API surface is small (~6 routes). Splitting introduces deploy coordination cost for no benefit.
- **Bucket-per-purchase, not flat ledger:** Each purchase is its own bucket with its own `expires_at`. Balance = sum of unexpired non-refunded buckets. Simpler than a ledger when expiry semantics apply per bucket.
- **Clerk Organizations from day 1:** Every signup auto-creates a Clerk Org (initially single-user). Phase 1.5 turns on invite UI and adds members; zero schema migration.
- **No per-credit ledger or balance column:** Balance is computed live from `purchases`. Avoids cache-invalidation concerns and gives a free audit trail.

## Section 2 — Data model

```sql
-- One row per organization. In Phase 1, every signup auto-creates an
-- Org with the signing-up user as the sole owner.
CREATE TABLE organizations (
  id                  BIGSERIAL PRIMARY KEY,
  clerk_org_id        TEXT UNIQUE NOT NULL,
  stripe_customer_id  TEXT UNIQUE,
  type                TEXT NOT NULL DEFAULT 'personal'
                        CHECK (type IN ('personal','team')),
  name                TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per (user, org). Phase 1: always exactly one row per user, role='owner'.
CREATE TABLE memberships (
  id              BIGSERIAL PRIMARY KEY,
  org_id          BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  clerk_user_id   TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'owner'
                    CHECK (role IN ('owner','admin','member')),
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, clerk_user_id)
);
CREATE INDEX idx_memberships_user ON memberships(clerk_user_id);

-- One row per Stripe Checkout completion. Bucket-based: each purchase
-- has its own expiry. Refunds tracked via refunded_credits column.
CREATE TABLE purchases (
  id                          BIGSERIAL PRIMARY KEY,
  org_id                      BIGINT NOT NULL REFERENCES organizations(id),
  stripe_checkout_session_id  TEXT UNIQUE,
  stripe_payment_intent_id    TEXT UNIQUE,
  sku                         TEXT NOT NULL,
  credits_purchased           INT NOT NULL,
  amount_cents                INT NOT NULL,
  currency                    TEXT NOT NULL DEFAULT 'usd',
  status                      TEXT NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','complete','refunded','partially_refunded')),
  refunded_credits            INT NOT NULL DEFAULT 0,
  expires_at                  TIMESTAMPTZ NOT NULL,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at                TIMESTAMPTZ
);
CREATE INDEX idx_purchases_org_active ON purchases(org_id)
  WHERE status IN ('complete','partially_refunded');

-- Append-only log of every Stripe webhook we processed, for idempotency.
CREATE TABLE webhook_events (
  id                  BIGSERIAL PRIMARY KEY,
  stripe_event_id     TEXT UNIQUE NOT NULL,
  event_type          TEXT NOT NULL,
  payload             JSONB NOT NULL,
  processed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Phase 2 only — sketch:
-- CREATE TABLE consumption_log (
--   id              BIGSERIAL PRIMARY KEY,
--   org_id          BIGINT NOT NULL REFERENCES organizations(id),
--   purchase_id     BIGINT NOT NULL REFERENCES purchases(id),  -- bucket FIFO
--   amount          INT NOT NULL,
--   capture_id      TEXT,
--   reason          TEXT NOT NULL,
--   created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
```

### Balance computation

```sql
SELECT COALESCE(SUM(credits_purchased - refunded_credits), 0) AS balance
FROM purchases
WHERE org_id = $1
  AND status IN ('complete','partially_refunded')
  AND expires_at > NOW();
```

In Phase 2, this query grows one `LEFT JOIN consumption_log` to subtract spent credits per bucket. No restructuring.

## Section 3 — Auth & checkout flow

### Flow A — Logged-out buyer (most common Phase 1 path)

1. User visits `/pricing`, scrolls to credit packs section, clicks Buy on a pack
2. Frontend POSTs `/api/checkout` with `{ sku }`
3. Backend validates SKU, creates Stripe Checkout session in `payment` mode with metadata `{ sku, credits, amount_cents }`
4. Frontend redirects to Stripe-hosted checkout URL
5. Stripe collects email, payment, billing address; computes tax
6. User pays
7. Stripe redirects user to `/checkout/success?session_id=X`
8. Asynchronously, Stripe POSTs to `/api/stripe/webhook`
9. Webhook handler:
   - Verifies signature against `STRIPE_WEBHOOK_SECRET`
   - Dedupes via `webhook_events` table (returns early if already processed)
   - Verifies `amount_total === expected amountCents` for the SKU (anti-tamper)
   - Looks up Clerk user by email; if not found, creates Clerk user
   - Creates Clerk Organization (named after email or "Personal"), creates row in `organizations` and `memberships`
   - Inserts row in `purchases` with `status='complete'`, `expires_at = NOW() + INTERVAL '12 months'`
   - If new user: generates Clerk sign-in token via Backend API, sends magic-link email via Clerk's built-in delivery (or Resend if customizing later)
   - Records `stripe_event_id` in `webhook_events`
10. `/checkout/success` page polls `/api/checkout/status?session_id=X` until purchase row appears, then shows "Payment received! Check your email for your sign-in link."
11. User clicks magic link in email → signs in → lands on `/dashboard` showing balance + purchase history

### Flow B — Logged-in buyer

Same as A, except `/api/checkout` already knows the org from the Clerk session and includes `org_id` in Stripe metadata. Webhook skips user/org creation. `success_url` redirects to `/dashboard` directly. No email needed.

### Flow C — Logged-out user just signing in (no purchase)

`/sign-in` → Clerk `<SignIn />` → magic link → `/dashboard`. Almost no app code needed.

### Webhook idempotency

```sql
INSERT INTO webhook_events (stripe_event_id, event_type, payload)
VALUES ($1, $2, $3)
ON CONFLICT (stripe_event_id) DO NOTHING
RETURNING id;
```

If `RETURNING` produces no row, the event was already processed — skip and return 200 OK to Stripe. Combined with the `UNIQUE` constraint on `purchases.stripe_payment_intent_id`, double-firing is safe.

### Edge cases handled in Phase 1

- **Email typo at checkout** → magic link goes to wrong address. Recovery: customer emails support; founder uses Stripe + Clerk dashboards to fix manually.
- **Webhook failure** → Stripe retries automatically with exponential backoff for up to 3 days. Idempotent handler tolerates retries.
- **User pays, never clicks magic link** → org/purchase exist; user can sign in any time later via `/sign-in` (Clerk emails fresh magic link); credits are waiting.
- **Card declined** → Stripe handles entirely on hosted page; we receive nothing until success.

### Edge cases NOT handled in Phase 1

- **Disputes/chargebacks** — webhook logs and emails founder; no automated balance freeze
- **Failed magic-link delivery (bounce)** — no automated detection; founder monitors Clerk + Resend dashboards
- **Multiple emails on one Clerk account** — Clerk supports it; we use the primary email only

## Section 4 — Stripe integration details

### Products & prices in the dashboard

Create 4 Products manually in Stripe (test mode and live mode separately), each with one one-time Price:

| Product | Price | Code label |
|---|---|---|
| VisionPipe Credits — Pack 1,000 | $10.00 USD | `pack_10` |
| VisionPipe Credits — Pack 2,200 | $20.00 USD | `pack_20` |
| VisionPipe Credits — Pack 5,750 | $50.00 USD | `pack_50` |
| VisionPipe Credits — Pack 12,000 | $100.00 USD | `pack_100` |

Code reference (`src/lib/pricing.ts`):

```ts
export const PACKS = {
  pack_10:  { priceId: process.env.STRIPE_PRICE_PACK_10!,  credits: 1000,  amountCents: 1000 },
  pack_20:  { priceId: process.env.STRIPE_PRICE_PACK_20!,  credits: 2200,  amountCents: 2000 },
  pack_50:  { priceId: process.env.STRIPE_PRICE_PACK_50!,  credits: 5750,  amountCents: 5000 },
  pack_100: { priceId: process.env.STRIPE_PRICE_PACK_100!, credits: 12000, amountCents: 10000 },
} as const;
```

The webhook handler verifies `session.amount_total === PACKS[sku].amountCents` before creating the purchase row.

### Webhook events subscribed

| Event | Phase 1 action |
|---|---|
| `checkout.session.completed` | Primary success handler (see Section 3 step 9) |
| `charge.refunded` | Set `purchases.refunded_credits` and update status |
| `charge.dispute.created` | Log + email founder via Resend; no automated action |
| `payment_intent.payment_failed` | Log only; Stripe shows error on hosted checkout |

### Stripe Tax

- Enabled for tax calculation
- Checkout restricted to `allowed_countries: ['US']` in Phase 1
- No US-state nexus expected at launch (typical thresholds: $100k revenue or 200 transactions per state)
- International expansion (EU VAT via OSS, Canada GST, etc.) deferred to Phase 2 or via MoR if simpler

### Customer Portal

- One button on `/dashboard`: "Manage Billing →"
- Calls `stripe.billingPortal.sessions.create()` with the org's `stripe_customer_id`
- Redirects to Stripe-hosted page where buyer can view receipts/invoices, update billing details
- No subscription management surface (no subscriptions exist in Phase 1)

### Test vs live mode

Per-environment env vars in Vercel: dev and preview use test keys, production uses live keys. Same code path; only the keys differ.

### Local webhook development

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Forwards real test-mode events to local dev server. CLI prints a webhook signing secret to put in `.env.local`.

## Section 5 — Marketing site UX changes

### `/pricing` (existing — modified)

- **Keep** the two-card "Personal & Open Source vs Commercial" framing.
- **Modify** the Commercial card: replace the "Contact Us" CTA with "View Credit Packs ↓" that smooth-scrolls to a new section below.
- **Add** a new section titled "Credit Packs" with 4 cards rendered from the `PACKS` constant. Each card: pack size, price, effective $/credit, "Buy [pack name] →" CTA. CTA POSTs `/api/checkout` with the SKU and redirects to the returned Stripe URL.
- **Add** an FAQ-style note below the packs: "Credits are valid for 12 months from purchase. Refunds available within 30 days on unused credits — email hello@visionpipe.ai."

### `/sign-in` and `/sign-up` (new)

- Both rendered with Clerk's `<SignIn />` and `<SignUp />` components, configured for email + magic link only (no social, no password in Phase 1).
- Layout matches site styling — earthy palette, IBM Plex Sans.

### `/dashboard` (new)

Authenticated route (Clerk middleware redirects to `/sign-in` if not signed in). Shows:
- Current balance (large, prominent)
- "Buy more credits →" link back to `/pricing#credit-packs`
- "Recent purchases" — last 5 from `/api/me/purchases`, with full history at `/dashboard/purchases`
- "Manage Billing →" → Stripe Customer Portal session
- For Phase 1, dashboard is single-user-org-aware; Phase 1.5 adds an org switcher when multiple orgs exist

### `/dashboard/purchases` (new)

Full purchase history: pack, price, credits, purchase date, expires_at, status, "Receipt →" link to Stripe-hosted invoice.

### `/checkout/success?session_id=X` (new)

- Polls `/api/checkout/status?session_id=X` every 1 second
- While pending: shows "Processing your payment..."
- Once complete:
  - **If new user (no Clerk session):** "Payment received! Check your email for your sign-in link."
  - **If existing user:** auto-redirects to `/dashboard` after 1.5s

### `/checkout/cancel` (new)

Minimal page: "Payment cancelled — no charges were made. [Back to pricing]"

### Header (existing — modified)

- Logged out: existing nav + "Sign in" link
- Logged in: existing nav + Clerk's `<UserButton />` (avatar dropdown with sign out)

### Footer (no changes)

## Section 6 — API surface

All routes under `src/app/api/`. Auth enforced via Clerk middleware where indicated.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/checkout` | Optional (logged-in skips email collection) | Body `{ sku }`. Validates SKU, creates Stripe Checkout session, returns `{ url }`. |
| `POST` | `/api/stripe/webhook` | Stripe signature | Receives Stripe events. Verifies signature, dispatches by event type, idempotent via `webhook_events`. |
| `GET` | `/api/checkout/status?session_id=X` | None (session_id IS the auth) | Polled by `/checkout/success`. Returns `{ status: 'pending' \| 'complete', orgCreated, magicLinkSent }`. |
| `GET` | `/api/me/balance` | Clerk session required | Returns `{ balance, expiringWithin90Days }`. |
| `GET` | `/api/me/purchases` | Clerk session required | Returns paginated list of purchases for the user's org. |
| `POST` | `/api/me/billing-portal` | Clerk session required | Creates Stripe Customer Portal session, returns `{ url }`. |

Webhook signature verification uses Stripe's `constructEvent` helper with `STRIPE_WEBHOOK_SECRET`. All non-webhook routes use Clerk's `auth()` helper to gate access.

## Section 7 — Edge cases & error handling

### Handled in Phase 1

| Scenario | Handling |
|---|---|
| Webhook delivery retry / duplicate | `webhook_events` dedupe + `UNIQUE` constraint on `stripe_payment_intent_id` |
| User refreshes `/checkout/success` before webhook fires | Polling endpoint shows pending; updates when webhook lands |
| Refund issued by founder via Stripe Dashboard | `charge.refunded` webhook updates `purchases.refunded_credits`; balance recomputes automatically |
| User pays but never clicks magic link | Org/purchase wait in DB; user signs in later via `/sign-in`, fresh magic link from Clerk, balance is there |
| Card declined | Stripe handles on its hosted page; we never receive a webhook for the failed attempt (only `payment_intent.payment_failed` if the user actually attempted to pay) |
| SKU tampering at client | Webhook verifies `amount_total` matches expected `amountCents` for the claimed SKU; mismatch logs and alerts founder |
| User has Clerk account already, pays with same email | Webhook finds existing user, attaches purchase to their existing org, no duplicate user/org created |
| Two simultaneous purchases | Idempotency keys + DB constraints prevent double-recording; both end up in DB as separate rows |

### Not handled in Phase 1 (deferred)

- **Disputes/chargebacks** — log + email founder only; manual response via Stripe Dashboard
- **Magic-link bounce/delivery failure** — no automated detection
- **Multi-email Clerk accounts** — primary email only
- **Refund partial credit consumption** — Phase 2 only (no consumption in Phase 1)
- **Currency other than USD** — checkout restricted to US

## Section 8 — Testing strategy

### Unit tests

- **Pricing math** (`src/lib/pricing.ts`) — verify pack metadata, effective $/credit calculations, refund math
- **Webhook handler dispatch logic** — given a fake event, does it call the right handler?
- **Amount verification** — webhook handler rejects events where `amount_total` doesn't match expected SKU

### Integration tests

- **Webhook handler with Stripe test fixtures** — use `stripe trigger checkout.session.completed` to send realistic events; verify DB rows are created correctly
- **Idempotency** — fire same event twice; verify only one purchase row created
- **Balance API** — seed DB with various purchase states (pending/complete/refunded/expired), assert balance matches expected

### Manual / E2E

- **Full Stripe Checkout flow in test mode** — use Stripe's test card numbers (`4242 4242 4242 4242` for success, `4000 0000 0000 0002` for decline); manually verify success page polling, magic-link email arrives, dashboard shows balance
- **Live mode smoke test** — buy a $10 pack with a real card before launch; verify end-to-end; refund via Stripe Dashboard to test refund path
- **Mobile checkout flow** — Stripe-hosted checkout is mobile-responsive by default, but worth a quick check

### Mock strategy

- Unit tests: mock Stripe SDK and Clerk Backend API
- Integration tests: real Stripe test mode via Stripe CLI; real Clerk dev instance
- E2E: skip Playwright/Cypress in Phase 1 — Stripe Checkout and Clerk are hosted, not testable via standard E2E tools without significant effort

## Section 9 — Phase 2 hooks (intentionally deferred)

The following are out of scope for Phase 1 but the design accommodates them:

- **Desktop app authentication** — Clerk-issued JWTs verified via the JWKS endpoint (`https://integral-walrus-29.clerk.accounts.dev/.well-known/jwks.json`). The desktop app gets a session token via OAuth-like browser flow or device code; backend verifies JWT signature using Clerk's public keys.
- **`consumption_log` table** — sketched in Section 2. Adds FIFO bucket consumption with `purchase_id` reference for proper expiry inheritance.
- **`POST /api/me/consume` endpoint** — desktop app posts capture events with idempotency keys. Server validates available balance, deducts from oldest unexpired bucket, returns new balance.
- **Low-balance email warnings** — when balance falls below threshold (e.g., 100 credits) after a consumption event, queue a Resend email.
- **Team purchasing (Phase 1.5, before Phase 2)** — invitations, allowlist mode, domain auto-join. Pure additive on Clerk Organizations; no schema migration needed.
- **Subscription model** — if metrics support it, add a recurring-billing tier. Stripe Subscriptions API; new `subscriptions` table; balance becomes "subscription baseline + topup buckets."

## Appendix A — Environment variables

| Variable | Source | Visibility |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard | Public (exposed to browser) |
| `CLERK_SECRET_KEY` | Clerk dashboard | **Secret** |
| `DATABASE_URL` | Neon dashboard | **Secret** |
| `STRIPE_PUBLISHABLE_KEY` | Stripe dashboard | Public |
| `STRIPE_SECRET_KEY` | Stripe dashboard | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard (after creating webhook endpoint) | **Secret** |
| `STRIPE_PRICE_PACK_10` | Stripe dashboard (after creating Product) | Public-ish (price IDs aren't sensitive) |
| `STRIPE_PRICE_PACK_20` | ditto | ditto |
| `STRIPE_PRICE_PACK_50` | ditto | ditto |
| `STRIPE_PRICE_PACK_100` | ditto | ditto |
| `RESEND_API_KEY` | Resend dashboard | **Secret** |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` dev / `https://visionpipe.ai` prod | Public |

Secret values never go in tracked files. They live in `.env.local` (gitignored) for dev and Vercel project env vars for production.

## Appendix B — Phase 1 launch checklist

- [ ] Domain `visionpipe.ai` pointed at Vercel project
- [ ] Clerk production instance created, allowed origins configured (`https://visionpipe.ai`)
- [ ] Stripe live mode activated, business profile completed, payout method configured
- [ ] Stripe live-mode Products created (4 packs)
- [ ] Stripe webhook endpoint registered for `https://visionpipe.ai/api/stripe/webhook`, signing secret saved
- [ ] Stripe Tax enabled, default tax behavior configured
- [ ] Stripe Checkout `allowed_countries: ['US']`
- [ ] Resend domain verified for `visionpipe.ai`
- [ ] Neon production database created, schema migrated, connection string in Vercel env vars
- [ ] All env vars set in Vercel (production environment)
- [ ] Smoke test in test mode: buy `$10` pack with test card, verify magic link arrives, verify dashboard balance
- [ ] Smoke test in live mode: buy `$10` pack with real card, verify end-to-end, refund via Stripe Dashboard to verify refund path
- [ ] Pricing page `/pricing` updated with 4 credit-pack cards
- [ ] Customer Portal enabled in Stripe settings
- [ ] Founder email `hello@visionpipe.ai` set up to receive support requests

## Open items not blocking implementation

These are minor and can be decided during implementation without re-spec:

- Specific copy on the credit-pack cards (e.g., "Most popular" badge on Pack 50?)
- Exact polling interval on `/checkout/success` (1s default; tune if needed)
- Whether to send a Resend purchase-confirmation in addition to Stripe's auto-receipt (Phase 1 default: Stripe only)
- Specific tax-registration jurisdictions (Phase 1 default: none, US-only checkout)
