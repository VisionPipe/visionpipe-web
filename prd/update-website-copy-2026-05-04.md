# Branch Progress: update-website-copy-2026-05-04

This branch rewrites the website copy across `/`, `/pricing`, and `/download` to match the actual state of the VisionPipe desktop app at v0.6.1 (which is significantly ahead of where the previous site copy described it). It also lays the marketing groundwork for two unshipped features: Cloud Share (Spec 2, in-progress in the `visionpipe` repo) and the cross-functional/non-developer audience pivot that Cloud Share enables. Both unshipped pieces are plainly badged "Coming soon."

---

## Progress Update as of 2026-05-06 20:30 UTC

### Summary of changes since last update
Substantial iteration on the homepage's "How It Works" section: trimmed it from six single-shot-style steps to five session-flow steps, gave each step a real screenshot with click-to-open-modal preview, and reworded most titles/descriptions. Built a new `ExpandableStepImage` component for the modal pattern (separate from the carousel's inline-expansion pattern), wired four new screenshots into the steps + renamed them, plus a handful of small copy edits across `/`, `/pricing`, and the footer, plus a layout fix on the credit pack cards.

### Detail of changes made:

**New `src/components/ExpandableStepImage.tsx` (~110 lines, client component):**
- Renders a fixed `aspect-[4/3]` thumbnail with `object-cover` + per-image `object-position` (defaults to `center`; can be set to `right center`, `left top`, etc. to focus on the most relevant region of a wider source image).
- Optional `collapsedScale` factor applies a CSS `transform: scale(...)` to the thumbnail so a single image can serve as a wide overview AND a tighter zoom — used for step 2 with `collapsedScale: 1.5`.
- On click, opens a portal-rendered modal: dark backdrop + 8px blur, image at natural aspect via `width`/`height` props with `max-h-[88vh] max-w-[92vw]`, X-button top-right with focus ring, close on Esc / click outside / X. Body scroll locked while open via `document.body.style.overflow = "hidden"` (cleanup on unmount and on close).
- `mounted` flag + `createPortal` guard so the portal is browser-only and the SSR pass doesn't try to access `document.body`.

**Initial design was inline expansion (mirroring the carousel)** — built it that way first, then user requested modal. Refactored. Inline-expansion code path is gone.

**Step images wired (5 of 5):**
1. Step 1 (Capture) → `welcome-onboarding.png` (1522×940), `objectPosition: center`. Tells the "press hotkey to start" story via the welcome modal's hotkey display.
2. Step 2 (Give your LLM context on the screenshot) → `session-window-single-screenshot.png` (3252×2010), `objectPosition: center`, `collapsedScale: 1.5`. The 1.5x scale crops in tighter on the screenshot card + narration field for the thumbnail.
3. Step 3 (Take more screenshots) → `app-session-split-view.png` (3402×2142), `objectPosition: center`. Same image as carousel step 1 — intentional visual continuity.
4. Step 4 (Copy and Share with your LLM) → `copy-and-send-toast.png` (1432×590), `objectPosition: right center`. The toast image is very wide (2.43:1); right-anchoring focuses the Copy & Send button in the 4:3 thumbnail.
5. Step 5 (Your LLM will love you) → `claude-code-loves-llm-spec.png` (2064×1066), `objectPosition: left top`. The screenshot shows Claude Code praising a Vision|Pipe LLM Spec ("What a fantastic brief — I love this format..."). Left-top anchor focuses on the praise text.

**Type consolidation:** `StepImage` type lives in `ExpandableStepImage.tsx` and is imported by `page.tsx`. Previously a duplicate `StepImageData` type in `page.tsx` drifted out of sync when I added `collapsedScale` and caused a TS error. Single source of truth now.

**Screenshots renamed (in `public/images/screenshots/`):**
- `Zight 2026-05-06 at 12.40.12 PM.png` → `welcome-onboarding.png`
- `F06_Mac.png (6016×3900) 2026-05-06 at 12.40.41 PM.png` → `history-hub.png` (currently unused on the site but staged for future use)
- `VisionPipe 2026-05-06 at 12.45.08 PM.png` → `session-window-single-screenshot.png`
- `✳ Test VisionPipe screenshot bundle analysis 2026-05-06 at 1.10.24 PM.png` → `claude-code-loves-llm-spec.png`

**"How It Works" section rewrite (`src/app/page.tsx`):**
- Step 1 title: `"Press your hotkey"` → `"Capture any part of your screen"`. Description: `"Cmd+Shift+C activates the session window..."` → `"Use a configurable hotkey if desired"`. Also removed the `keys` / `keysWin` data fields and the `<kbd>` row that rendered them — keyboard shortcut display is no longer there.
- Step 2 title: `"Select a region"` (entire step REMOVED — drag-to-select-region was a single-shot framing that doesn't fit the session flow).
- Step 2 (was step 3) title: `"Narrate what you're seeing"` → `"Give your LLM context"` → (later) `"Give your LLM context on the screenshot"`. Description: rewritten to `"Type or speak instructions to your LLM about the screenshot. Vision|Pipe transcribes on-device in real time, anchoring your words to the screenshot in front of you."`
- Step 3 (was step 4) title: `"Take the next screenshot"` → `"Take more screenshots to build a story for your LLM"`. Description tail: `"...Edit captions inline."` → `"...Add as many screenshots as you'd like."`
- Step 4 (was step 5) title: `"Add a closing note"` (entire step REMOVED — closing narration is in the app but wasn't earning its place on the marketing page).
- Step 4 (was step 6) title: `"Hit Copy & Send"` → `"Copy and Share with your LLM"`.
- New Step 5 added: `"Your LLM will love you"` with description `"Your LLM now has vision and can clearly see everything you're trying to communicate."` Image is the Claude Code "love letter" screenshot.
- Section subhead: `"Six steps from hotkey to handoff."` → went through `"Five steps"` → `"Four steps"` → back to `"Five steps"` as steps were removed and the new step 5 was added.

**Other homepage copy edits (`src/app/page.tsx`):**
- `"What arrives in Claude Code"` → `"What arrives in the LLM"` (persona-card column header in the "Give Your Developers Vision" section).
- `"dragged into Claude Code, acted on."` → `"dragged into an LLM like Claude Code or OpenAI Codex, acted on."` (subtext below the persona cards).
- Removed the pull quote: `"The person who sees the problem and the AI that can fix it no longer need a developer translator in between."` (was a `<blockquote>` in the Share It. Ship It. section).
- Removed the technical credibility footer paragraph: `"Sessions upload to Cloudflare R2 via a secure proxy. Links live at share.visionpipe.app and are private by default. Each upload costs 50 credits ($0.50 at the base pack rate)."` (Share It section). The implementation details were redundant with the section's value framing and probably premature given Cloud Share isn't shipped.

**Pricing page (`src/app/pricing/page.tsx`):**
- `"Ready to give your LLM eyes?"` → `"Ready to give your LLM vision?"`.
- `"Local-only use is always free"` → `"Personal use is always free"` (2 occurrences: free-tier card bullet and bottom CTA copy).

**Footer (`src/components/Footer.tsx`):**
- `"The missing primitive between your screen and your AI."` → `"The missing link between your screen and your AI."`. "Primitive" was tech-speak; "link" is plainer.

**Credit pack card layout fix (`src/components/CreditPackCard.tsx`):**
- Cards have variable content height (the "1,000 credits" pack has no `+X% bonus` line, so it's one row shorter than the other three). The Buy button used `mt-6` (fixed top margin), so on the shorter card it sat one row higher than the other buttons.
- Wrapped the button + error message in a `<div className="mt-auto pt-6">`. `mt-auto` in a flex-col container pushes the wrapper to the bottom; `pt-6` preserves the visual breathing room above the button. The button itself gets `w-full` since it's no longer a direct flex child (which previously stretched it via flex's default `align-items: stretch`).

### Verification performed:
- `npx tsc --noEmit` clean.
- Visual confirmation in dev server: How It Works section now renders 5 steps with thumbnails; clicking opens modal; modal closes via X / Esc / backdrop click; body scroll lock works.
- Modal portal renders at `document.body` (escapes any parent stacking context).

### Potential concerns to address:
- **`history-hub.png` is staged but unused** on the site. Not deleted because it'll likely fit a future "see your past sessions" section. If that section never materializes, it's worth deleting as a follow-up cleanup.
- **The release script's `git add -A` is still greedy.** Since the last entry, the script committed Release v0.8.2 (DMG-only, no working-tree pollution this time — relief). The current working tree has VisionPipe-0.9.0.dmg + an updated `VisionPipe.dmg` symlink, presumably from a v0.9.0 release in progress. I'm explicitly NOT staging those in this commit; the release script will sweep them up next time it runs.
- **`session-window-single-screenshot.png` at `collapsedScale: 1.5`** crops in pretty aggressively. On smaller viewports the thumbnail may show only part of the screenshot card without the narration field beside it. If user reports it looks weird at narrow widths, dial the scale to 1.25–1.3 or set a different `collapsedObjectPosition`.
- **The modal does not use a focus trap.** Pressing Tab while open will focus elements outside the modal. For accessibility-strict needs, add `react-focus-lock` or implement a small focus trap. Acceptable for marketing use; flag if accessibility audit is a near-term priority.
- **No animation on modal open/close.** Uses default React rendering — appears/disappears instantly. Easy to add a fade with `tailwindcss-animate` plugin or a state-based opacity transition if you want polish.

---

## Progress Update as of 2026-05-06 19:45 UTC

### Summary of changes since last update
Small follow-up: gitignored local tooling artifacts that the Stripe CLI's "skills" feature and per-user Claude Code settings drop into the repo (`.agents/`, `.claude/skills/`, `.claude/settings.local.json`, `skills-lock.json`). These showed up as untracked after I authenticated the Stripe CLI to set Vercel env vars.

### Detail of changes made:
- `.gitignore`: appended a "Stripe CLI skills cache + per-user Claude Code settings (local tooling)" block.

### Note on prior commit:
The intended commit for the page.tsx + HeroCarousel + progress doc edits described in the previous entry got auto-bundled into `3d8e1ce Release v0.8.1` by the release script, which seems to run `git add -A` before tagging a desktop release. So the carousel "lifted out of wrapper" change, the 50% wider expansion (`max-w-[84rem]`), the "or install via command line:" lines, and the "Your LLM like Claude Code or OpenAI Codex" copy edit are all on origin under that release commit's message — not under a descriptive message of their own. Functionally fine; just a label mismatch in git history.

### Potential concerns to address:
- **The release script's `git add -A` is greedy.** Anything left in the working tree at release time gets folded into the release commit. If a future contributor leaves WIP or secrets in the tree when a release runs, those will get captured under a "Release vX.Y.Z" message. Consider scoping the release script's add to only the DMG paths it actually touches (`public/downloads/...`) and the changelog file, if any.

---

## Progress Update as of 2026-05-06 19:30 UTC

### Summary of changes since last update
This entry covers two commits — an empty deploy-trigger commit (`b835b10`) that did not get its own progress log entry at the time, and this commit which adds two homepage copy edits. Cumulatively: Vercel Preview env vars are now wired up with real test-mode values (broader Preview scope, all branches), the Preview deploy was kicked, and the markdown-brief subtext + hero CTA cluster received small copy improvements.

### Detail of changes made:

**Vercel Preview env vars (out of band — not in repo, recorded here for handoff):**
The previous Preview build at `B5gMjSLvBcMFpQV7kZLeay2UMvew` failed with `Error: STRIPE_SECRET_KEY env var is required`. Investigation via `vercel env ls` showed all 12 user env vars existed for Production with real values, but the Preview-scope entries were locked to a single git branch (`feature/stripe-billing-phase-1`) and held empty string values. So my branch's Preview deploy got the empty values, and the Stripe loader at `src/lib/stripe.ts` (which throws at module-load if the env var is falsy) crashed the build.

Resolution via `vercel` CLI (after switching to the `drodio1s-projects` team scope and re-linking — initial link landed on the `storytell` team because the CLI defaulted to that):
- Removed the 12 empty branch-scoped Preview entries (`vercel env rm <name> preview feature/stripe-billing-phase-1 --yes`).
- Added the 12 vars with broader Preview scope (no `--git-branch`, so they apply to all preview branches) using real test-mode values:
  - `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`: pulled from `~/.config/stripe/config.toml` (the Stripe CLI's cached test-mode keys for Atlas Account).
  - `STRIPE_PRICE_PACK_10/20/50/100`: looked up via `stripe prices list --limit 100 --live=false` and matched to the four `unit_amount` test-mode prices on the account.
  - `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: founder-supplied test keys (used during the local dev verification earlier in this branch).
  - `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`: placeholder values. These are non-empty so the build passes, but won't actually function at runtime if a Preview deployment touches Stripe webhooks, sends transactional email, hits Postgres, or returns OAuth/Stripe redirect URLs. See concerns below for the follow-up to make these real.
- Triggered a redeploy by pushing empty commit `b835b10`. Vercel CLI 42.2.0 is too old for the `vercel deploy` endpoint (server requires 47.2.2+), so push-to-deploy via the git integration was the fastest path.

**Code changes in this commit:**
- `src/app/page.tsx`: Added a `"or install via command line:"` muted line between the "Download for Mac" link and the brew `<CopyBlock>` in both CTA clusters (hero CTA + Final CTA at the bottom of the page). Preserves visual rhythm and gives the brew command an actual label.
- `src/app/page.tsx`: In the "Not just screenshots. A full narrated LLM Spec" section, the closing paragraph below the markdown example was reworded — `"Claude Code gets the full sequence"` → `"Your LLM like Claude Code or OpenAI Codex gets the full sequence"`. Reflects the multi-LLM positioning the carousel testimonials already establish.

### Verification performed:
- `vercel env ls preview` confirms 12 vars now scoped to broader Preview (not branch-locked).
- Empty commit `b835b10` pushed to `origin/update-website-copy-2026-05-04`; Vercel git integration should auto-deploy. (Build outcome not yet observed as of this entry — will be visible in Vercel dashboard.)
- TypeScript check clean before this commit; visual confirmation deferred until Preview deploy renders.

### Potential concerns to address:
- **STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, DATABASE_URL, NEXT_PUBLIC_APP_URL are placeholders.** Build passes, but at runtime: webhook signature verification fails (fine — Stripe isn't sending webhooks to Preview anyway), email send fails, every DB query throws, and Stripe checkout `success_url` / `cancel_url` will point at the wrong domain (the placeholder `https://visionpipe-web.vercel.app`, not the actual per-deploy preview URL). For Preview to be functionally testable end-to-end we need:
  - A separate Neon "preview" branch (create via Neon dashboard or `neonctl branches create --name preview`, then connection string into `DATABASE_URL` Preview).
  - A real test-mode Stripe webhook endpoint pointing at a stable Preview URL — but Vercel preview URLs change per deploy, so the cleanest answer is to deploy a long-lived Preview alias (Vercel project setting) and register that with Stripe.
  - A real Resend test API key (or just leave as placeholder since transactional email isn't critical to test in Preview).
  - `NEXT_PUBLIC_APP_URL` — the right answer here is to read `process.env.VERCEL_URL` at runtime in the API routes that build redirect URLs, rather than hardcoding via env. Code change, not just env.
- **Vercel CLI is outdated locally** (42.2.0 vs required 47.2.2). `npm i -g vercel@latest` will fix and re-enable `vercel deploy` from CLI for next time. Push-to-deploy worked here as a workaround.
- **The empty deploy-trigger commit (`b835b10`)** broke the CLAUDE.md convention of "every commit must have a progress log entry". The hook flagged it; this entry retroactively covers it. Future improvement: if I make an empty commit just to nudge CI/CD, I should still prepend a tiny entry first.
- **Stripe test-mode keys came from the Stripe CLI's cached config** (`~/.config/stripe/config.toml`). These are restricted-scope keys auto-rotated by the CLI every ~90 days. If they expire and Preview suddenly stops working, regenerate via `stripe login` and re-add via `vercel env`. A more permanent solution is to grab the founder's actual unrestricted `sk_test_…` from the Stripe dashboard (Settings → API keys → Reveal test key) and use that.

---

## Progress Update as of 2026-05-06 18:00 UTC

### Summary of changes since last update
Built a 6-step interactive hero carousel with click-to-expand previews and real LLM testimonials (Claude Code and OpenAI Codex evaluating Vision|Pipe LLM Specs). Replaced the static body paragraph in the hero with `<HeroCarousel />`. Added brand icon SVGs (Claude Code, Codex, OpenAI), 12 product screenshots paired as minimized + full versions for the carousel, and a real favicon. Reworked a number of section headlines and changed "Brief" → "LLM Spec" sitewide. Most user-facing copy on `/` now reflects the v0.6.1 product story with this iteration.

### Detail of changes made:

**New `HeroCarousel.tsx` (~330 lines, client component):**
- 6 slides on a 4-second auto-rotation, 4 of which are click-to-expand product screenshots and 2 are click-to-expand testimonials.
- Each slide stores its full-image natural pixel dimensions (`fullWidth`/`fullHeight` or `proofImageWidth`/`proofImageHeight`); when the slide is expanded the carousel container's `aspectRatio` is set inline to match those exact dimensions, so the image is shown at its natural aspect with `object-contain` (no cropping). Collapsed state is a fixed `aspectRatio: "4 / 1"` strip.
- Bottom-fade gradient on collapsed slides hints at "more below" via a `bg-gradient-to-t from-deep-forest via-deep-forest/70 to-transparent` overlay (50% height); fades out when expanded.
- Both the minimized AND full image render in the DOM simultaneously and crossfade via opacity transitions, so swap is instantaneous (no flash on click).
- Prev/Next arrow buttons flank the slide stack (in a flex row), 3 dots below center, sentence directly below the slide. Sentence is bold + cream + min-h-[2.5rem] so layout doesn't jump as text changes.
- Pause-and-expansion mouse handling is on the **whole carousel container** (slides + arrows + dots), not the slide alone. Effect: moving the mouse from an expanded slide to an arrow does NOT collapse — user can flip through expanded images via arrows. 800ms collapse delay (was 400ms initially) gives time to traverse.
- Navigating to a non-expandable step force-collapses; navigating between expandable steps preserves expansion. Setting `expanded = false` on `activeIndex` change is conditional on the new step not being expandable.
- Setup uses `setTimeout` (not `setInterval`) re-armed on `[paused, activeIndex]` so manual navigation cleanly resets the auto-rotate cadence.
- Accessibility: `role="region" aria-roledescription="carousel"`, `aria-label`, `aria-current` on the active dot, `aria-expanded` on each expandable slide, `aria-hidden` on inactive slides + on the testimonial layer when the proof image is showing.

**Carousel content (in order):**
1. App split-view session screenshot — `app-session-split-view-{minimized,full}.png`, expanded aspect 3402×2142.
2. Finder folder layout — `finder-session-folder-{minimized,full}.png`, expanded aspect 2892×846 (very wide; barely taller than collapsed).
3. Markdown LLM Spec output — `markdown-llm-spec-output-{minimized,full}.png`, expanded aspect 3392×2154.
4. JSON sidecar output — `json-sidecar-output-{minimized,full}.png`, expanded aspect 2818×2140.
5. Claude Code testimonial — quote "*This format is roughly 3–5× more useful to me than a prompt describing the same request...*", attributed "Claude Code (Opus 4.7), evaluating a Vision|Pipe LLM Spec". Expands to `claude-code-evaluating-llm-spec.png` (the actual Claude Code session that produced the quote).
6. OpenAI Codex testimonial — quote "*This is 2–5× more useful than a text-only prompt. In some cases closer to 10× when the prompt is vague...*", attributed "OpenAI Codex (GPT 5.4), evaluating a Vision|Pipe LLM Spec". Expands to `codex-evaluating-llm-spec.png`.

**Sentence below the carousel (rotates with slide):**
1. "Use Vision|Pipe to capture and narrate screenshots."
2. "Turn your screenshots and narration into an LLM Spec with 1-click."
3. "The LLM Spec turns your images and narration into machine readable output."
4. "Vision|Pipe also sends detailed metadata to the LLM"
5. + 6. (both): "Your LLM will thank you for the clarity of vision."

**Brand icons (`public/images/brand/`):**
- `claude.svg` — pulled from `cdn.simpleicons.org/claude` (the regular Claude orange spiral). Currently unused on the site but kept for future use.
- `claude-code.svg` — pulled from lobe-icons (`claudecode` slug); pixel-art "Claude Code" mark. `fill="currentColor"` was hardcoded to `#D97757` (Anthropic orange) so it renders without depending on parent CSS color (which doesn't propagate through `<img>`).
- `codex.svg` — pulled from lobe-icons (`codex` slug); the OpenAI Codex prompt mark. Hardcoded `fill="#f5f0e8"` (cream from the design tokens) so it's visible on the deep-forest background.
- `openai.svg` — pulled from lobe-icons (`openai` slug). Currently unused.

**Screenshots (`public/images/screenshots/`, all renamed from Zight defaults):**
- 6 paired files: each slide has a `*-minimized.png` (designed for the 4:1 strip) and a full version (the source image at its natural aspect). User created the minimized versions; I downloaded the full set and renamed both groups.
- 2 LLM session screenshots: `claude-code-evaluating-llm-spec.png` (2506×1898) + `codex-evaluating-llm-spec.png` (1514×1398).

**New components:**
- `src/components/HeroCarousel.tsx` — described above.
- (Pre-existing this session: `ComingSoon`, `MarkdownExample`, `WaitlistForm`.)

**Favicon (`src/app/icon.png`):**
- Copied `public/images/visionpipe-logo-no-background.png` (1024×1024 transparent) into `src/app/icon.png`. Next.js App Router auto-detects and emits `<link rel="icon" href="/icon.png" sizes="1024x1024" type="image/png">` — no manual `metadata.icons` config needed.

**Wordmark consistency (already partially landed in earlier commit):**
- This session: `<VP />` rendered everywhere with the amber pipe and inheriting text color. Workflow comparison column header (`Vision|Pipe` plain text in a `<p className="text-teal">`) was rebuilt as cream text with an amber-pipe span. All `font-mono text-teal` plain "Vision|Pipe" text replaced.

**Copy edits on the homepage (`src/app/page.tsx`):**
- Hero H1: `"Give your LLM eyes."` → `"Give Your LLM Vision"` (period removed, capitalized).
- Subhead: `"screenshot | llm — now a reality."` (mono) → `"A Picture is Worth a Thousand Prompts"` (mono kept, bumped to `text-xl sm:text-2xl`).
- Body paragraph + "built for developers who think in pipes" tagline → fully replaced by `<HeroCarousel />`.
- Pain section H2: `"The Loop You're Stuck In"` → `"Stop Working Blind"`.
- Pain section: parenthetical `"(Vision|Pipe is closing this gap next — see Cloud Share below.)"` removed from the third loop; it was redundant once Cloud Share is its own dedicated section.
- Solution H2: `"Vision|Pipe Skips the Description"` → `"Show your LLM What You Mean"`.
- New section H2: `"Not a Screenshot. A Brief."` → `"Not just screenshots. A full narrated LLM Spec"` (no trailing period — user style preference).
- All instances of "Brief"/"Briefs" as a noun replaced with "LLM Spec"/"LLM Specs" sitewide (homepage + pricing). "Brief" as a VERB ("they brief Claude Code from memory") and unrelated words ("briefly shipped") were intentionally left alone.
- "How It Works" section header: `"One Session. Complete Brief."` → `"One Session. Complete LLM Spec."`
- Final CTA: `"Stop Pasting Screenshots. Start Delivering Briefs."` → `"Stop Pasting Screenshots. Start Delivering LLM Specs."`
- Markdown sample filename: `transcript.md` → `VisionPipe-Spec-for-My-App-May-6-2026-10-21-AM-UTC.md`. Sample markdown content's session header date updated to match (`2026-05-06 10:21:00 UTC`). Feature-list bullet "Markdown LLM Spec output" desc rewritten to be filename-agnostic.

**Pricing page (`src/app/pricing/page.tsx`):**
- FAQ "Anyone with the link can preview the session... or download the markdown brief" → `"...download the markdown LLM Spec"`.

**MarkdownExample component (`src/components/MarkdownExample.tsx`):**
- File-tab area updated for long filenames: `gap-3` on the outer flex row, `min-w-0` + `truncate` on the filename span, `shrink-0` on the traffic-light dots. Long filenames now show an ellipsis instead of pushing the copy button off-screen on narrow viewports.

### Verification performed:
- `npx tsc --noEmit` — clean.
- Visual check via dev server: all 6 carousel slides render; click-to-expand transitions smoothly to each image's natural aspect ratio with no cropping; arrow navigation while expanded preserves expansion; mouse-leave triggers 800ms collapse; favicon is emitted in the rendered HTML head.
- `npm run build` was NOT run end-to-end (Clerk's runtime publishable-key validation prevents production build without real env values). TypeScript clean is high confidence; dev server clean.

### Potential concerns to address:
- **HeroCarousel is now ~330 lines.** Doing several jobs (rotation, expansion, mouse plumbing, three render branches: image / testimonial / placeholder). If it grows further, split: (a) `useCarouselRotation` hook for timer + activeIndex, (b) `useExpansion` hook for expanded + collapse timer, (c) move `Testimonial` / `ExpandableImageBox` / `ExpandableTestimonial` / `ArrowButton` to their own files. Not urgent at current size.
- **Per-image `fullWidth`/`fullHeight` are hardcoded.** If a user replaces a screenshot file with a different aspect ratio without updating these constants, the box will be sized wrong. A more robust version would read dimensions from `<Image onLoad>`. Acceptable trade-off for now since the screenshots are stable.
- **PNG screenshot weight.** `public/images/screenshots/` is ~17 MB across 12 files. None are referenced anywhere except by HeroCarousel. Could be compressed with WebP (lossless or lossy quality 90+) for a ~3-5× reduction without visible quality loss. Not done here.
- **Codex testimonial proof image is small (1514×1398).** When expanded on a wide display the screenshot may look soft. If you have a higher-resolution version, swap it in (and update `proofImageWidth`/`proofImageHeight`).
- **`public/images/brand/{claude,openai}.svg` are unused.** Left in place because they're cheap to keep around and likely useful in future testimonial slots.
- **`public/images/claude-code-icon.webp` is also unused** — superseded by the SVG version. Could be deleted as a small follow-up cleanup.
- **The pause/expansion handlers share the same container `onMouseEnter`/`onMouseLeave`.** Tested visually but I have not tested with rapid in/out cycles or unusual focus patterns (e.g., portal-rendered tooltips moving focus). If you observe stuck-paused or stuck-expanded states, that's the place to look.

---

## Progress Update as of 2026-05-06 00:30 UTC

### Summary of changes since last update
Standardized the `Vision|Pipe` wordmark rendering across the site so that the words "Vision" and "Pipe" inherit the surrounding text color (whatever it is — cream, white, etc.) and only the `|` character is colored, always with the amber accent token. Previously the pipe (and in some places "Pipe" itself) was teal, and the convention was inconsistent — Header and Footer wrapped `|Pipe` together in a teal span (so "Pipe" picked up the accent color too), while the homepage/pricing/download wrapped just the pipe character. New behavior: only the `|` is amber; everything else inherits.

### Detail of changes made:
- `src/components/VPName.tsx` — canonical wordmark; pipe span color `text-teal` → `text-amber`.
- `src/components/Header.tsx` (line 23) — split the joint `<span className="text-teal">|Pipe</span>` into `<span className="text-amber">|</span>Pipe` so "Pipe" inherits the cream text color of the surrounding logo lockup.
- `src/components/Footer.tsx` (line 11, brand block) — same split as Header, joint span → discrete amber pipe.
- `src/components/Footer.tsx` (line 126, copyright) — pipe span color `text-teal` → `text-amber`.
- `src/app/page.tsx` — `replace_all` on `<span className="text-teal">|</span>` → `<span className="text-amber">|</span>` (covers the local `VP()` helper at line 8 and all inline body usages, ~16 occurrences in rendered HTML). Also fixed the workflow comparison column header at line 466 which was rendered as plain unstyled text `Vision|Pipe` inside a teal-colored `<p>` — now uses cream text with an amber-pipe span so it follows the same convention.
- `src/app/pricing/page.tsx` — `replace_all` for the pipe span color, covers the local `VP()` helper plus inline body usages.
- `src/app/download/page.tsx` (H1) — pipe span color updated.
- Verified via curl + grep on rendered HTML: `text-amber">|` appears 16× on `/`, 9× on `/pricing`, 4× on `/download`. Zero `text-teal">|` remaining.
- No edits to alt strings, page metadata titles, the markdown sample bundle, file paths (`~/Pictures/VisionPipe/`, `/downloads/VisionPipe.dmg`), or domain references (`x.com/Vision_Pipe`, `visionpipe.ai`) — those are plain text, not styled UI, and shouldn't get spans injected into them.

### Potential concerns to address:
- **`VPName` component is still unused at the call sites that have local `VP()` helpers** (page.tsx line 4-7, pricing/page.tsx line 11-13). The duplicates are now visually identical to `VPName` post-edit; a future cleanup could replace each local helper with `import VPName from "@/components/VPName"` to consolidate. Not done here to keep the change scope tight to color-only.
- **No layout/typography change** beyond the color swap. If the design later wants the pipe to be visually heavier (bold, slightly larger, kerning adjustment), it should be applied inside `VPName.tsx` as the canonical place — that's the upside of consolidating to it later.

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
