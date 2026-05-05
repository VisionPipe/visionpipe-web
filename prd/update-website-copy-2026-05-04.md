# Branch Progress: update-website-copy-2026-05-04

This branch rewrites the website copy across `/`, `/pricing`, and `/download` to match the actual state of the VisionPipe desktop app at v0.6.1 (which is significantly ahead of where the previous site copy described it). It also lays the marketing groundwork for two unshipped features: Cloud Share (Spec 2, in-progress in the `visionpipe` repo) and the cross-functional/non-developer audience pivot that Cloud Share enables. Both unshipped pieces are plainly badged "Coming soon."

---

## Progress Update as of 2026-05-05 19:35 UTC

### Summary of changes since last update
Moved this progress doc from `prd/branch commit updates/update-website-copy-2026-05-04.md` to `prd/update-website-copy-2026-05-04.md` to match the actual repo convention (the existing `prd/` directory already has `prd/main.md`, `prd/PRD.md`, `prd/feature-stripe-billing-phase-1.md`, and `prd/feature-website-updates.md` at the top level). The original CLAUDE.md instruction pointed at a nested `prd/branch commit updates/` folder that doesn't exist in this repo; the post-commit hook surfaced the mismatch.

### Detail of changes made:
- `git mv "prd/branch commit updates/update-website-copy-2026-05-04.md" prd/update-website-copy-2026-05-04.md` — single rename, no content change.
- Removed the now-empty `prd/branch commit updates/` directory.
- Prepended this entry to keep the progress log convention satisfied for the rename commit itself.

### Potential concerns to address:
- **`CLAUDE.md` is out of sync with actual repo convention.** It instructs progress logs to live at `prd/branch commit updates/<branch>.md`, but the on-disk reality (and the hook's expectation) is `prd/<branch>.md`. Worth a separate small PR to fix the CLAUDE.md so the next branch doesn't make the same mistake. Not done in this commit to keep the rename atomic.

---

## Progress Update as of 2026-05-04 19:30 UTC

### Summary of changes since last update

Initial commit on this branch — full copy rewrite of the homepage, pricing FAQ fixes, a one-line download-page tweak, and three new shared components (`ComingSoon`, `MarkdownExample`, `WaitlistForm`). The strategic shift is from "single-shot screenshot tool for developers" to "narrated-session brief for cross-functional teams." The design spec lives at `docs/superpowers/specs/2026-05-04-website-copy-update-design.md` and was written before any code changes — read it for the full rationale, source-of-truth verification table, and section-by-section mapping.

### Detail of changes made

**New components (`src/components/`):**
- `ComingSoon.tsx` — single component with three visual variants (`section` pill, `card` corner badge, `inline` text tag). Uses the existing amber palette token so it pops against the teal/cream design system without introducing new colors.
- `MarkdownExample.tsx` — client component for the rendered `transcript.md` showcase in the new "Not a Screenshot. A Brief." section. Window-chrome styling with traffic-light dots, monospace `<pre>` body, and a copy-to-clipboard button. Single-purpose; not used by `CopyBlock` because that's line-based and this needs preformatted multi-line display.
- `WaitlistForm.tsx` — single-input email form for the Cloud Share waitlist on the homepage. **Stub implementation: submits via `mailto:hello@visionpipe.ai`.** A proper `POST /api/waitlist` route writing to a Drizzle `waitlist` table is a planned follow-up — see "Open follow-ups" below.

**Homepage rewrite (`src/app/page.tsx`):** Full rewrite from ~700 lines to a similar size, restructured as:
1. Hero — body line now signals sessions + markdown brief delivery; tagline mentions cross-functional use as Coming Soon; "Windows coming soon" line replaced with "Apple Silicon today. Windows on the roadmap."
2. Pain section — single "Loop You're Stuck In" expanded to three loops (single-shot, multi-step workflow, non-developer pain).
3. Solution section — body now describes session capture + Copy & Send + markdown brief; workflow comparison's right column shows the new flow.
4. **NEW: "Not a Screenshot. A Brief."** — section showcasing the markdown bundle output via `<MarkdownExample>`. This is the single highest-leverage new section per the design spec — it shows rather than tells.
5. How It Works — replaced the v0.1-era 5-step single-shot flow with the actual 6-step session flow (hotkey → first capture → narrate → next capture → closing note → Copy & Send).
6. Multi-Modal Annotation — three cards reworked: "Speak It" rewritten for continuous on-device transcription via Apple Speech (NOT Whisper, NOT cloud Deepgram — verified in `src-tauri/src/speech.rs`); "Type It" replaced with "Caption It" (per-screenshot inline caption is what actually ships, per `ScreenshotCard.tsx`); "Draw It" kept with prominent "Coming soon" badge (per the `2026-05-04-credit-pricing-redesign.md` spec, drawing was removed in `da1c132` and is returning with the annotation rebuild).
7. **NEW: "Give Your Developers Vision" (Coming Soon)** — three persona cards (PM, Designer, QA/CS) describing the cross-functional pivot. This is the strategic centerpiece of the new positioning.
8. **NEW: "Share It. Ship It." (Coming Soon)** — Cloud Share preview with three-step visual flow, technical credibility footer (Cloudflare R2, `share.visionpipe.app`, 50 credits per upload), and the `<WaitlistForm>`.
9. Rich Metadata — unchanged, tables align with the desktop README.
10. Competitive Comparison — added two columns ("Markdown Deliverable" and "Team Sharing" with a `soon` tag); changed Vision|Pipe's "Annotate at Capture" subtext to "Voice + caption" (drawing soon); renamed Zight row to "Loom / Zight / CleanShot X" so Loom shows up explicitly.
11. Tech Stack — replaced the "Whisper" card with an "Apple Speech" card (matches actual implementation in `src-tauri/src/speech.rs` and `speech_bridge.m`).
12. Open Source — unchanged.
13. Final CTA — headline changed to "Stop Pasting Screenshots. Start Delivering Briefs." (from the other AI's tagline bank); body and Windows-roadmap framing updated.
14. Feature List — split into "Shipping today" (14 items) and "Coming soon" (4 items, each with inline `soon` tag). Adds previously-missing shipped features: multi-screenshot sessions, real-time on-device transcription, per-segment re-record, two view modes, markdown brief output, HistoryHub, editable captions, scrolling capture, configurable hotkeys, local-first persistence in `~/Pictures/VisionPipe/`. Coming-soon list: Cloud session sharing, Drawing & annotation, On-device WhisperKit (opt-in alternative), Windows support.

**Pricing page (`src/app/pricing/page.tsx`):**
- Hero: added subhead "1 credit = $0.01. Pay only for what you actually send."
- Free tier card: added "Local-only use is always free — no account, no credits required" as the leading bullet.
- Commercial tier card: full reframe — old generic "Buy Credits" copy replaced with concrete `$0.01 / credit` headline, the new pay-as-you-go pricing model, and an inline 4-row worked-examples table from the redesign spec (1 screenshot=$0.01 → 1 screenshot+2min audio=$0.12). Footnote mentions the 10-second free audio tier and on-device transcription.
- FAQ: three answers replaced (commercial license, "Do I need an account?", platforms) and one new entry added ("How does Cloud Share work?" with Coming Soon badge and waitlist link). The "Do I need an account?" answer no longer claims "no cloud dependency" — that was wrong even before Cloud Share, since it implied the (now-Apple-Speech) transcription was offline-only when the upcoming Cloud Share feature breaks the no-cloud premise.
- Bottom CTA: copy adjusted to "Local-only use is always free. Cloud Share (coming soon) is opt-in."

**Download page (`src/app/download/page.tsx`):** Two single-line edits:
- Tagline: removed "no cloud dependency" claim (becomes wrong with Cloud Share); replaced with on-device transcription privacy framing.
- Footer note: "Windows support coming soon" → "Apple Silicon today. Windows on the roadmap."

**Design spec (`docs/superpowers/specs/2026-05-04-website-copy-update-design.md`):** ~480-line spec written before any code changed. Captures the source-of-truth verification table (where the README itself was stale), the strategic positioning shift, every section change with old/new copy and rationale, the visual treatment system for "Coming soon" (three variants), open implementation decisions (waitlist backend, etc.), and a manual verification checklist.

### Verification performed

- `npx tsc --noEmit` — clean.
- `npm install` — ran (12 vulnerabilities reported, all in pre-existing deps; not related to this branch).
- `npm run dev` — server boots; all three pages return HTTP 200.
- Curled `/`, `/pricing`, `/download`. Confirmed via `grep` on the rendered HTML:
  - All five new section headlines render ("Not a Screenshot. A Brief.", "Give Your Developers Vision", "Share It. Ship It.", "One Session. Complete Brief.", "Captures What You Mean…").
  - `Coming soon` badges appear 10 times across the homepage.
  - "Apple Speech" replaces all prior "on-device Whisper" mentions.
  - Markdown example renders ("Vision|Pipe Session", "Auth failure on production", "Token generation logic", "Closing Narration" all present).
  - Pricing page: "1 credit = $0.01", "Pay-as-you-go credits", "Local-only use is always free", "Cloud Share" all present.
  - Download page: "Apple Silicon today" and on-device privacy framing both present.
- `npm run build` — **NOT run successfully**. Build pre-flight requires real Stripe and Clerk env vars (Clerk in particular validates publishable-key format); a stub `.env.local` was created (gitignored, will not be committed) to get dev-server validation working, but production build still fails on Clerk's runtime validation. This is a pre-existing state of the repo and not caused by this branch — but means production build verification did not happen here. Recommend confirming `npm run build` passes in CI or with real `.env.local` values before deploy.

### Implementation decisions made unilaterally (per "use your judgment" direction)

1. **Waitlist form is a `mailto:` stub.** The clean implementation is `POST /api/waitlist` writing to a new Drizzle `waitlist` table; that's a separate ~30-min PR. Shipping the visible UX now so the section is reviewable; the form can be swapped in place without changing surrounding markup.
2. **Three `ComingSoon` visual variants** (section pill, card badge, inline tag) instead of one. The spec called for differential prominence; one component covers all three by prop.
3. **`MarkdownExample` is a new component** rather than reusing `CopyBlock`. `CopyBlock` is line-based with shell-prompt styling; the markdown brief needs preformatted multi-line display with a different visual treatment (file-tab chrome).
4. **Persona cards reuse the existing 3-up grid pattern** from the metadata section for visual consistency.
5. **Renamed Zight competitor row** to "Loom / Zight / CleanShot X" to surface Loom explicitly (it's the most relevant comparison for the new team-sharing pitch).
6. **Final CTA headline** changed to "Stop Pasting Screenshots. Start Delivering Briefs." — drawn from the other AI's tagline bank; previous "Stop Describing. Start Showing." was good but the new framing is on-message with the brief positioning.

### Open follow-ups

1. **Wire the waitlist form to a real backend.** New Drizzle table (`waitlist`: id, email, feature, createdAt), new API route (`POST /api/waitlist`), update `WaitlistForm.tsx` to fetch instead of `mailto:`. Estimated ~30 min given existing infra (Drizzle, Resend, Neon already wired). Optionally trigger a Resend confirmation email.
2. **Confirm `npm run build` with real env.** As noted under verification, prod build needs validated Clerk + Stripe env vars; this branch's TypeScript and dev server are both clean, but I couldn't validate the production build path.
3. **Replace the `Screenshot or GIF goes here` placeholders** in the How It Works section. They were placeholders before this branch and they remain placeholders — not in scope here, but they're the most obvious visual gap on the page. Real screenshots/GIFs of the actual session UI would substantially raise the page's polish.
4. **Update the README in the visionpipe repo.** Per the source-of-truth table in the design spec, the README's "v0.2 (current): cloud Deepgram" framing is itself stale — actual current behavior is Apple Speech on-device. This isn't a website concern but it's the upstream source of the misleading info that drove the previous site copy.

### Potential concerns to address

- **Brand-promise tension is now explicit.** The site previously said "no cloud dependency"; that's been reframed everywhere as "local stays local; Cloud Share is opt-in." This is honest going forward, but anyone reading the README or older Twitter/X posts might find the older framing and be confused. Consistency across surfaces (README, social, app onboarding) is worth a sweep.
- **"Coming soon" is heavy on the page right now.** Five spots: Draw It card, Give Your Developers Vision section, Share It. Ship It. section, the Cloud Share FAQ, and four feature-list items. If Cloud Share slips, the page will look like a roadmap and not a product. The spec notes this risk; if Cloud Share isn't shipping in <60 days, recommend pulling the persona section back to a smaller teaser.
- **Pricing page worked-examples table assumes the new credit model is shipped.** Per `feature/credits-rebased` in the desktop repo, the pricing redesign is *approved design only* — implementation plan still pending. If users buy credits and the in-app deduction logic still uses the old per-pixel model (or no deduction at all), there's a mismatch between what the website promises and what the app enforces. The website's claims are forward-looking, but technically inaccurate until the desktop side ships. Worth coordinating.
- **`Header.tsx` is unchanged.** Existing nav already routes to `/pricing` and `/download` correctly; no change needed for this copy update. But if the cross-functional pivot becomes the primary positioning, the header might want a "For Teams" or similar nav item later.
- **Footer.tsx unchanged.** Same rationale.
- **The placeholder boxes** in How It Works that say "Screenshot or GIF goes here" are still placeholders. Marking this here so it's not forgotten.
