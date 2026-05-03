# Branch Progress: main

This document tracks progress on the `main` branch of the VisionPipe website. It is updated with each commit and serves as a context handoff for any future LLM picking up this work. Newest entries at the top.

---

## Progress Update as of 2026-05-02 08:02 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

**Production cutover complete.** `feature/stripe-billing-phase-1` was fast-forwarded into main earlier this evening (43 commits → main at `b595234`), then a flurry of infrastructure-only changes (no code) brought the site live on `visionpipe.ai` with **live-mode Stripe taking real money**. End-to-end smoke test landed: a real $10 purchase from `drodio@gmail.com` flowed through Stripe Checkout → live webhook → DB row → Clerk user creation → org/membership row, all clean. This commit captures what changed in the runtime environment, why, and what to watch for next session — none of which is in Git so the only record is here.

The cutover took longer than expected because of two non-obvious gotchas, both now fixed and worth flagging for the next person.

### Detail of changes made:

**Vercel project + env vars.** Linked this repo to `drodio1s-projects/visionpipe-web`, populated env vars in three scopes:
- **Development** (local + `vercel env pull`): test-mode Stripe, dev Clerk keys, current Neon DB, current Resend key, `NEXT_PUBLIC_APP_URL=https://visionpipe.ai`.
- **Preview** (branch-scoped to `feature/stripe-billing-phase-1`): same as Development. Note: in non-interactive mode the CLI requires explicit branch scoping for Preview env vars — "all preview branches" syntax is finicky. Other branches won't pick these up. Worth scripting for future preview branches.
- **Production**: live-mode Stripe (live `pk_live_…`/`sk_live_…`, 4 live `STRIPE_PRICE_PACK_*` IDs, real `STRIPE_WEBHOOK_SECRET`), **production-instance** Clerk keys (different from dev), current Neon DB, current Resend key, `NEXT_PUBLIC_APP_URL=https://visionpipe.ai`.

**Domain.** `visionpipe.ai` (apex + `www`) was already attached to the project. DNS is at Cloudflare (`erin.ns.cloudflare.com`, `patrick.ns.cloudflare.com`) with A/CNAME records pointing at Vercel. **Currently the apex 307-redirects to www** — that's the Vercel default and it's the inverse of what we'd recommended (apex-canonical, www → apex) earlier. We did NOT flip it during the cutover; it's a polish item.

**Clerk: dev → production instance.** The original plan was to *reuse* the Clerk dev instance (`integral-walrus-29.clerk.accounts.dev`) for the cutover to avoid migrating the one user record (`user_3DBxA28WnNiOmaFars4ciH8gDEm` for `drodio@gmail.com`) that was tied to dev. That plan **broke immediately on first live transaction**: Clerk dev instances refuse to recognize sign-ins for emails that haven't been pre-provisioned through dev mode, regardless of webhook-driven user creation. So we switched mid-cutover to a fresh Clerk **Production** instance for `visionpipe.ai`. New keys in Vercel Production scope (`pk_live_Y2xlcmsudmlzaW9ucGlwZS5haSQ` decoded = `clerk.visionpipe.ai`, plus matching `sk_live_…`). Five Clerk-required CNAMEs added to Cloudflare via API, all DNS-only (NOT proxied — that's critical, the orange cloud breaks Clerk verification):
- `accounts.visionpipe.ai` → `accounts.clerk.services`
- `clerk.visionpipe.ai` → `frontend-api.clerk.services`
- `clk._domainkey.visionpipe.ai` → `dkim1.0ejg2nnp5ewz.clerk.services`
- `clk2._domainkey.visionpipe.ai` → `dkim2.0ejg2nnp5ewz.clerk.services`
- `clkmail.visionpipe.ai` → `mail.0ejg2nnp5ewz.clerk.services`

The DB still has dead rows from the dev-Clerk era (`organizations` rows 164/165 with `clerk_user_id=user_3DBxA28…` from the dev instance — those user IDs don't resolve in the prod instance and the rows are now orphaned). Not removed; harmless. The first live purchase created clean rows: org `id=178`, membership `id=20`, purchase `id=146`, Clerk user `user_3DCDDvVgpnUqtHnGPYNomxMPqK8`.

**Stripe live webhook + the 307 bug.** Created live webhook `we_1TSpgEKBCAnWXTBGdeKR7ye0` subscribed to 4 events (`checkout.session.completed`, `charge.refunded`, `charge.dispute.created`, `payment_intent.payment_failed`). Two old vestigial webhooks pointing at `https://api.visionpipe.ai/stripe/webhook` (a non-existent subdomain) were deleted to prevent duplicate-fire warning emails. The webhook signing secret was captured and put into Vercel Production (`STRIPE_WEBHOOK_SECRET=whsec_…`).

**The 307 bug:** First two live test purchases (one of which was refunded) sat indefinitely on `Processing your payment…` because **Stripe webhook delivery does not follow redirects**. The webhook was registered against `https://visionpipe.ai/api/stripe/webhook` (apex), but apex 307s → www, and Stripe treats the 307 as a non-2xx and queues the event for retry forever. **Fix:** updated the webhook endpoint URL to `https://www.visionpipe.ai/api/stripe/webhook` via Stripe API. Manually resent the queued events; the third real $10 purchase from `drodio@gmail.com` then completed end-to-end.

**Stripe Tax / Customer Portal (live mode).** Confirmed configured. Tax: `status=active`, head office set (San Francisco CA), 0 active registrations — meaning $0 tax is calculated for any buyer. That's correct legal posture until economic nexus is crossed in any state. Customer Portal: `bpc_1TSpbeKBCAnWXTBGukjzhjQq` with `customer_update`, `invoice_history`, `payment_method_update` enabled and `is_default=true` (no code change needed; our code uses default config).

**Other infra**: cleaned up the `.env.local` mess from earlier in the day (Vercel CLI's `vercel link` overwrote a hand-populated file, forcing us to re-collect all secrets from each provider's dashboard — see `~/.claude/projects/-Users-drodio-Projects-visionpipe-web/memory/feedback_vercel_env_local_clobber.md` for the postmortem). Added `.backup-*` to `.gitignore` so the recovery backups can't accidentally be committed.

### Potential concerns to address:

- **Apex/www redirect direction is reversed from convention.** Currently `visionpipe.ai → www.visionpipe.ai`. This is what bit us with the Stripe webhook (apex POSTs got 307'd). Stripe is now correctly pointed at `www`, but ANY future external integration registered against the apex URL will hit the same 307 problem. Recommend flipping in Vercel project Domains → set `visionpipe.ai` as primary so www → apex (the convention used by stripe.com / vercel.com / linear.app). Not blocking; would need a webhook URL update again.
- **Cloudflare API token from this session is in chat history.** Scoped to `Zone:DNS:Edit` for `visionpipe.ai` only, so blast radius is limited, but should be rotated/deleted at My Profile → API Tokens → Cloudflare.
- **Resend domain `visionpipe.ai` verification status unconfirmed.** User said DNS is set up, but our send-only restricted Resend API key can't query domain status. If Stripe receipts / Clerk magic links don't deliver in production, check the Resend dashboard. Not blocking the purchase flow itself (Stripe sends its own receipts directly).
- **One queued live event still pending delivery** (`evt_1TSpoKKBCAnWXTBGwosFcPTr` for `drodio@storytell.ai`, the refunded purchase). It'll either auto-retry to the new www URL (and create an orphan org/membership/purchase row for that email), or Stripe will give up and disable retries after ~3 days. Either is fine since the user refunded; just be aware a stray row may appear in the DB if it eventually lands.
- **Vestigial dev-Clerk DB rows** (organizations 164/165 with `clerk_user_id=user_3DBxA28…` from the dev instance). Won't resolve to a real prod-Clerk user, can be ignored or `DELETE FROM` cleaned up later. Not in any path that breaks live flow.
- **`/dashboard` returns 404 to anonymous visitors** because `src/middleware.ts` calls `auth.protect()` which is Clerk's "404-on-unauth" default. UX could be improved with `auth.protect({ unauthenticatedUrl: '/sign-in' })`. Polish item.
- **Vercel Preview env vars are scoped to one branch** (`feature/stripe-billing-phase-1`). When other branches are worked on, those env vars won't apply unless re-added. Worth a one-off script before doing a branch-heavy iteration.

---

## Progress Update as of 2026-05-02 02:36 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Wrote the implementation plan for Phase 1 Stripe credit billing. The plan is committed at `docs/superpowers/plans/2026-05-02-stripe-credit-billing-phase-1.md` and breaks the spec into ~30 atomic tasks across 9 phases (branch+deps, database, Clerk, pricing/Stripe, checkout, dashboard, customer portal, Resend, pre-launch). Plan assumes implementation happens on a new branch `feature/stripe-billing-phase-1` with its own progress log at `prd/feature-stripe-billing-phase-1.md` (per the CLAUDE.md branch-name convention), and merges back to main as a squash commit when complete.

### Detail of changes made:

- **Created `docs/superpowers/plans/2026-05-02-stripe-credit-billing-phase-1.md`** — full bite-sized implementation plan with code blocks for every step, exact file paths, and TDD discipline (write-failing-test → run → implement → verify → commit) for each unit of work.
- **Plan structure:**
  - Phase A: branch + dependencies (Clerk, Stripe, Drizzle, Neon HTTP driver, Resend, Vitest)
  - Phase B: Neon setup, Drizzle config, schema (4 tables), migration, getBalance query
  - Phase C: Clerk middleware + ClerkProvider + sign-in/sign-up pages + Header auth UI
  - Phase D: Stripe Products in dashboard, pricing constants module, Stripe client helper
  - Phase E: webhook handler skeleton, POST /api/checkout, credit pack components on /pricing, then 3 webhook handlers (checkout.session.completed, charge.refunded, charge.dispute.created), plus /api/checkout/status polling endpoint and /checkout/success + /checkout/cancel pages
  - Phase F: GET /api/me/balance, GET /api/me/purchases, dashboard page, full purchase history page
  - Phase G: Stripe Customer Portal config + POST /api/me/billing-portal + dashboard button
  - Phase H: Resend domain verification + magic link delivery test
  - Phase I: production setup checklist (Vercel domain, Clerk prod instance, Stripe live mode, Neon prod DB, Vercel env vars, smoke test) + squash-merge to main
- **Self-review run:** spec coverage verified (all 9 sections mapped to tasks), placeholder scan clean (the 3 TODO markers in the webhook route are intentional — they get replaced in subsequent tasks), type consistency checked (function/method/field names match across tasks).
- **Estimated effort:** 1.5–2 weeks part-time, faster full-time.
- **Files created this commit:**
  - `docs/superpowers/plans/2026-05-02-stripe-credit-billing-phase-1.md` — the plan
- **Files modified this commit:**
  - `prd/main.md` — this entry

### Potential concerns to address:

- **Plan assumes a feature branch but it doesn't exist yet.** Task A1 creates `feature/stripe-billing-phase-1` as the very first step. Until that branch is cut, no implementation should happen.
- **The plan asks the founder to do several manual external steps** that can't be automated by an agent: creating Neon project, creating Stripe Products in test and live modes, setting up Resend domain DNS verification, configuring Clerk allowed origins, creating webhook endpoints, copying secret keys into `.env.local`. These are flagged inline in their respective tasks but the founder should expect to do them.
- **Stripe SDK API version pinning** — the plan pins to `2025-01-27.acacia`. Whoever executes this should check the current Stripe Node SDK README and use whatever version it documents at execution time.
- **Clerk SDK method names** — `signInTokens.createSignInToken`, `users.getUserList`, `users.getOrganizationMembershipList` reflect the SDK API as of plan-write time. The Clerk SDK occasionally renames things; executor should sanity-check against current docs.
- **Test coverage in the plan is uneven.** Strong TDD coverage on `getBalance`, pricing constants, and webhook signature verification. Webhook handler bodies have placeholder DB-backed test stubs that the executor should flesh out (or rely on manual smoke tests).
- **`public/downloads/` DMGs** still in working tree, untouched. Plan does not address them.

---

## Progress Update as of 2026-05-02 02:22 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Brainstormed and wrote the full design spec for **Phase 1 of Stripe credit billing** on the website. The spec is committed at `docs/superpowers/specs/2026-05-02-stripe-credit-billing-design.md` and is the authoritative input for the implementation plan that will follow. Phase 1 = web-side full vertical (account system, database, Stripe Checkout, magic-link auth, buyer dashboard) — the desktop app stays on its local credit counter and gets wired to the backend in Phase 2. No code yet; this commit is design only.

### Detail of changes made:

- **Decisions reached during brainstorm** (full reasoning in spec):
  - **Phasing:** Phase 1 = web-side only. Phase 1.5 = team purchasing additive (no schema migration). Phase 2 = desktop integration.
  - **Pricing model:** 4 one-time credit packs. $10/1,000 (base), $20/2,200 (10% bonus), $50/5,750 (15% bonus), $100/12,000 (20% bonus). 12-month expiry from purchase.
  - **Auth:** Hybrid (Stripe-first for new buyers with magic-link email post-payment; logged-in users skip the magic-link round-trip).
  - **Identity model:** Org-first from day 1 — every signup auto-creates a single-user Clerk Organization. Phase 1.5 adds invitations/multi-member orgs without schema migration.
  - **Tech stack:** Clerk (auth + organizations) + Neon Postgres + Stripe + Resend, all inside the existing Next.js 15 app at `visionpipe-web` (no separate repo).
  - **Stripe shape:** 4 Products created in Stripe Dashboard, Price IDs in env vars; `allowed_countries: ['US']` for Phase 1 (no VAT registrations needed); Stripe Tax on; Customer Portal enabled for invoice/receipt access.
  - **Refunds:** 30-day, manual via Stripe Dashboard; `charge.refunded` webhook updates balance automatically.
- **Data model:** 4 tables — `organizations`, `memberships`, `purchases`, `webhook_events`. Bucket-per-purchase (each purchase has its own `expires_at`); balance computed live from `SUM(credits_purchased - refunded_credits) WHERE expires_at > NOW()`. No `balance` column, no ledger, no cron for expiry.
- **API surface:** 6 routes (`/api/checkout`, `/api/stripe/webhook`, `/api/checkout/status`, `/api/me/balance`, `/api/me/purchases`, `/api/me/billing-portal`).
- **Page additions/changes:** `/pricing` modified (keeps two-card framing, adds 4 pack cards in a section below); 5 new pages (`/sign-in`, `/sign-up`, `/dashboard`, `/dashboard/purchases`, `/checkout/success`, `/checkout/cancel`); header gets `<UserButton />` for logged-in users.
- **Webhook events subscribed:** `checkout.session.completed`, `charge.refunded`, `charge.dispute.created`, `payment_intent.payment_failed`. Idempotency via `webhook_events` table + `UNIQUE` constraint on `stripe_payment_intent_id`.
- **Spec self-review:** Ran inline checks — no placeholders/TBDs/contradictions, 443 lines, scoped for a single implementation plan. Open items deferred to "during implementation" (specific pack-card copy, polling interval, etc.) are listed explicitly at the end of the spec.
- **Clerk dev instance configured** by founder during the brainstorm. Publishable key shared in chat; secret key correctly held back. Frontend API URL: `https://integral-walrus-29.clerk.accounts.dev`. JWKS URL captured for Phase 2 desktop JWT verification.
- **Files created this commit:**
  - `docs/superpowers/specs/2026-05-02-stripe-credit-billing-design.md` — the spec
- **Files modified this commit:**
  - `prd/main.md` — this entry

### Potential concerns to address:

- **Spec awaiting founder review.** Per the brainstorming workflow, the founder should re-read the committed spec before implementation begins. The next step (after this commit) is the `superpowers:writing-plans` skill to produce a concrete implementation plan, but that should not start until the spec is sign-off-final.
- **Live PostToolUse hook test.** This commit is the first since the founder was advised to run `/hooks` to reload `.claude/settings.json`. If the hook fires, I should see a system-reminder injected after the `git commit` Bash call. If not, the founder will still need to run `/hooks` (or restart the session).
- **Tax registrations not in scope.** Phase 1 launches US-only. International expansion (EU VAT via OSS, Canada GST, etc.) is non-trivial — needs a tax accountant or a service like Quaderno. Worth a separate decision before any international marketing push.
- **Domain `visionpipe.ai`** assumed available and pointable at Vercel. If it isn't actually registered or there's a different production domain in mind, the launch checklist (Appendix B of the spec) needs adjustment.
- **No code yet.** The spec is comprehensive but everything from `npm install` to the database schema is still ahead. The implementation plan will sequence this; rough estimate is 1–2 weeks of focused work for a competent dev to get to the launch checklist.
- **Open questions deferred but worth surfacing** before implementation begins: whether to include a "Most popular" badge on a specific pack card; whether to send a Resend purchase-confirmation in addition to Stripe's auto-receipt (current default: no); polling interval on `/checkout/success` (current default: 1s).

---

## Progress Update as of 2026-05-02 12:47 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Added the third automation layer for the per-commit progress-log workflow: a tracked `.claude/settings.json` with a `PostToolUse` hook scoped to `Bash(git commit *)` that injects a reminder back into the Claude context after every commit. This is the first commit committing under the new workflow, so it also brings in the `CLAUDE.md`, `prd/PRD.md`, and `prd/main.md` files from the earlier setup turn. Pushed to `origin/main`.

### Detail of changes made:

- **Created `.claude/settings.json`** (tracked, project-scoped). Contains a single `PostToolUse` hook with `matcher: "Bash"`, `if: "Bash(git commit *)"`, and a bash command that prints `{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"..."}}` with the current branch name interpolated. The reminder tells future Claude sessions to either confirm they updated the log alongside the commit, or write a follow-up entry in a NEW commit if they forgot (no amending).
- **Validation done before committing:** Pipe-tested the raw command (produced valid JSON), then ran `jq -e '.hooks.PostToolUse[] | select(.matcher == "Bash") | .hooks[] | select(.type == "command") | .command' .claude/settings.json` — exit 0, command printed back. Schema is well-formed.
- **`.gitignore` split confirmed:** `~/.config/git/ignore` (global) ignores `**/.claude/settings.local.json`, so `settings.local.json` (personal, holds the `Skill(update-config)` permission grant) stays out of git. `settings.json` (team-shared hook config) is tracked.
- **First commit using the new workflow:** Also commits `CLAUDE.md` (per-commit workflow rules + project context) and `prd/` (PRD.md as the authoritative product spec; main.md as this branch progress log), all created in the earlier setup turn.
- **Not in this commit (intentionally):** `.git/hooks/pre-commit` lives in `.git/`, which is never tracked. It's a local-only backstop that warns if `prd/<branch>.md` isn't staged. Documented in CLAUDE.md so future contributors can recreate it after a clone.

### Potential concerns to address:

- **Live hook test pending.** This commit is the first that should trigger the new `.claude/settings.json` hook. If the watcher didn't pick up `.claude/settings.json` (created mid-session), the hook won't fire and the user will need to run `/hooks` once to reload. The `.claude/` directory had `settings.local.json` at session start, so the watcher should be live — but unverified until this commit actually runs.
- **Pre-commit hook may also fire.** The `.git/hooks/pre-commit` warning hook runs on every commit. Since `prd/main.md` IS staged this time, it should stay quiet. If it warns anyway, the staged-files check in the hook script may need debugging.
- **Push may fail on auth.** `git push` requires write access to `VisionPipe/visionpipe-web` on GitHub. If it fails, the commit still lands locally and we can retry the push separately.

---

## Progress Update as of 2026-05-02 12:04 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Established the documentation and process scaffolding for this repo: created a `prd/` folder mirroring the visionpipe desktop app's pattern (`prd/PRD.md` for product requirements, `prd/main.md` for branch progress logs), captured the as-built state of the marketing site, wrote a project-level `CLAUDE.md` to enforce the progress-log workflow on every commit going forward, and added a `.git/hooks/pre-commit` reminder that warns when committing without updating the progress file.

### Detail of changes made:

- **Created `prd/PRD.md`**: Product requirements document for the VisionPipe marketing site. Covers overview, problem, solution, goals (primary: drive installs; secondary: recruit OSS contributors), audience, brand/design tokens, page-by-page section breakdown, content sources, and out-of-scope items. Sourced content from the existing design spec at `docs/superpowers/specs/2026-04-12-visionpipe-website-design.md` and the visionpipe desktop repo's `PRD.md`.
- **Created `prd/main.md`** (this file): Branch progress log following the format defined in `CLAUDE.md`. Replaces an earlier draft I'd named `initial-build-out.md` after I noticed the convention is to name the file after the current branch.
- **Created `CLAUDE.md`** at project root: Encodes the per-commit progress-log workflow as standing instructions for any future Claude Code session in this project. Includes the exact entry format, branch-name file convention, and a checklist to run before every commit.
- **Created `.git/hooks/pre-commit`**: Bash hook that warns (but does not block) when `prd/<branch>.md` is missing from the staged changes. This is a belt-and-suspenders reminder for both human and LLM committers. The hook is local-only (lives in `.git/hooks/`, not tracked) — if the repo is re-cloned, the hook will need to be recreated.
- **As-built state of the site (no code changes this session):** Site shipped via single commit `e6b2f06 Initial Vision|Pipe website` on 2026-04-13 and has been quiet for ~3 weeks. Landing page (`src/app/page.tsx`, 697 lines) has 11 sections — meets/exceeds the 9-section design spec. Pricing page (`src/app/pricing/page.tsx`, 245 lines) has hero + two-card tier layout + FAQ + final CTA. Components built: `Header.tsx`, `Footer.tsx`, `CopyBlock.tsx`, `VPName.tsx`. Components from the spec that appear to be inlined into `page.tsx` rather than extracted: `ComparisonTable`, `MetadataShowcase`, `PricingCard`. Working tree clean on `main`.

### Potential concerns to address:

- **Pre-commit hook is local-only.** It lives in `.git/hooks/pre-commit` and won't survive a re-clone. If we want it tracked across machines, we'd need to move it to a tracked path like `.githooks/pre-commit` and configure `core.hooksPath` — but that's a `git config` change, which I avoided this session per the system safety protocol. Worth revisiting if more contributors join.
- **3-week gap of silence** between the initial commit (2026-04-13) and now (2026-05-02). Either the site is "done for now" or it stalled. Worth confirming the user's intent for next steps before adding new feature work.
- **Spec drift risk.** The original design spec at `docs/superpowers/specs/2026-04-12-visionpipe-website-design.md` may now disagree with the actual built code. The new `prd/PRD.md` is intended to be the authoritative source going forward; the old spec should be reconciled or marked as historical.
- **Inlined components in `page.tsx`.** At 697 lines, the landing page is getting unwieldy. If `ComparisonTable`/`MetadataShowcase`/`PricingCard` need any reuse or further iteration, extracting them into `src/components/` will help maintainability.
- **No analytics, SEO polish, screenshots/GIFs, or demo video** — all of these were called out as future work in the design spec and are still missing. None are blocking the site from being live.
- **No deployment confirmation.** Unclear whether the site is live on Vercel and what the production URL is. Worth verifying.

---
