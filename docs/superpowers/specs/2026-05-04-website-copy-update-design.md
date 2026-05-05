# Website Copy Update — Sessions, Cloud Share, Cross-Functional Audience, New Pricing

**Date:** 2026-05-04
**Branch:** `update-website-copy-2026-05-04`
**Status:** Approved design — implementation pending review

---

## Summary

The current visionpipe-web copy was written against the v0.1.x single-shot model: one screenshot, one annotation, one paste. The product has fundamentally changed. The new story is:

1. **Sessions, not screenshots.** Capture a sequence of screenshots with continuous voice narration; deliver a structured markdown brief that Claude Code (or any LLM) can read and act on directly.
2. **Cross-functional, not solo-developer.** PMs, designers, and QA can capture context; developers and their AI agents act on it. (This part requires Cloud Share, which is in development — framed as "Coming soon.")
3. **Honest pricing.** New per-screenshot + per-audio-second model at 1 credit = $0.01.

This spec covers section-by-section updates across `/`, `/pricing`, and `/download`, plus two new sections on the homepage. Unshipped features (Cloud Share, the cross-functional audience pivot, drawing/annotation, on-device WhisperKit, Windows) are clearly badged "Coming soon" so the site is truthful about today and aspirational about tomorrow.

---

## Source-of-truth corrections

These are the verified facts the new copy must reflect (some of which contradict the current site or the README):

| Topic | Reality (verified in source) | Where verified |
|---|---|---|
| Voice transcription | **On-device, via Apple `SFSpeechRecognizer`** (not Whisper, not Deepgram cloud) | `src-tauri/src/speech.rs`, `speech_bridge.m` |
| Drawing / markup | **Removed** in `da1c132` (May 2 multi-screenshot rewrite); returning with annotation feature | `2026-05-04-credit-pricing-redesign.md` §"Related historical context" |
| Text "annotation" (separate field) | **Removed** with drawing; returning later | same |
| Per-screenshot caption | **Still works** — short editable name per screenshot | `src/components/ScreenshotCard.tsx` |
| Multi-screenshot sessions | Shipped — central feature | `src/state/session-reducer.ts`, `App.tsx` |
| Closing narration | Shipped — final summary field at end of session | `App.tsx` (`closingNarration`, `APPEND_TO_CLOSING_NARRATION`) |
| Per-segment re-record | Shipped | `src/components/ReRecordModal.tsx` |
| Split / Interleaved view modes | Both shipped | `src/components/SplitView.tsx`, `InterleavedView.tsx` |
| HistoryHub | Shipped | `src/components/HistoryHub.tsx` |
| Scrolling capture | Shipped in v0.3.8 | git log `6189b0b` |
| Configurable hotkeys | Shipped via Settings | git log; `SettingsPanel.tsx` |
| Windows | **Not shipped** — roadmap only | README §Roadmap |
| Cloud Share (Spec 2) | **Not shipped — spec only**, no code yet | `prd/branch commit updates/spec-2-cloud-share.md` |
| Pricing | New model: 1 credit = $0.01, per-screenshot + tiered audio | `2026-05-04-credit-pricing-redesign.md` |

---

## Strategic positioning

**Old positioning:** "Lightweight open source utility that captures your screen and pipes it into any LLM. Built for developers."

**New positioning:** "The context transport layer between anyone who sees a problem and the AI that can fix it."

**Two-tier framing the whole site needs to land consistently:**

- **Local stays local.** Capture sessions, transcribe on-device, paste markdown bundles into any LLM. Free. No account.
- **Cloud is opt-in (Coming soon).** Upload a session to a private link; share with anyone. Costs credits. Requires an account.

This framing reconciles the brand promise ("no accounts, no API keys, no cloud") with the new direction (Cloud Share, cross-functional teams) without lying about either.

---

## Section-by-section: `/` (homepage)

### §1. Hero — light edits

**Body line — replace** the current text:
> Vision|Pipe is a lightweight open source utility that captures your screen and pipes it, along with your voice, text, or visual annotations plus rich contextual metadata, directly into any LLM.

**With:**
> Vision|Pipe captures a narrated session of screenshots and delivers a structured markdown brief — ready to paste or drag into Claude Code, GPT, Gemini, or any vision-capable LLM. Developers use it to brief their AI. *(Coming soon: PMs, designers, and QA teams use it to brief their developers.)*

**Tagline line below the body** — keep "Built for developers who think in pipes." (still works for today's audience).

**Windows note** — change "Windows support coming soon" → "Apple Silicon today. Windows on the roadmap."

**Download URLs** — already point at `/downloads/VisionPipe.dmg` (version-agnostic). No change needed.

---

### §2. Pain section — expand from one loop to three

**Current headline:** "The Loop You're Stuck In" — keep.

**Current body** describes only the single-screenshot frustration. Expand to three loops:

**Loop 1 (keep, lightly edited):**
> You're working with an AI and need to show it what's on your screen. You describe it in words. It misunderstands. You describe again. Repeat.

**Loop 2 (NEW — multi-step workflow):**
> Or you need to walk your AI through a workflow that spans five different screens. So you take Screenshot 1. Paste it. Describe what it connects to. Take Screenshot 2. Switch back. Paste again. Re-establish the context you just lost. Repeat.

**Loop 3 (NEW — non-developer pain, marked Coming soon):**
> Or you're not a developer at all. You see exactly what's wrong — but describing a visual problem in a Jira ticket is hopeless. So you schedule a call. The developer takes notes. Some of it gets lost. They brief Claude Code from memory. The fix misses the point. *(VisionPipe is closing this gap next — see Cloud Share below.)*

**Closing line (replace current):**
> The gap between what you see and what your AI understands is costing the whole team — not just the developers.

---

### §3. Solution — minor edits

**Body — replace:**
> Capture the screen. Annotate however feels natural — speak it, type it, or draw it. Paste the full context — image, annotation, and metadata — into your LLM in one action.

**With:**
> Capture a sequence of screens. Narrate as you go — your voice transcribes on-device, anchored to the screenshot you were looking at when you said it. Hit Copy & Send. A structured markdown brief lands on your clipboard, ready for any LLM.

**Workflow comparison** — change the Vision|Pipe column from `Capture + Comment → Paste → Submit` to:
```
Capture(s) + Narrate
       ↓
Copy & Send
       ↓
Paste → done
```

---

### §4. NEW SECTION — "Not a Screenshot. A Brief."

**Place after Solution, before How It Works.**

**Headline:** Not a Screenshot. A Brief.

**Body:**
> Every other tool puts an image on your clipboard.
>
> Vision|Pipe produces a structured markdown document — timestamped, narrated, and organized the same way a senior engineer would hand off a bug report. Claude Code reads it with its native Read tool. No extra prompting. No re-explaining the context you already spoke.

**Below: a rendered example of the actual markdown output.** Use a `<pre>` block styled with the existing forest/code palette:

```markdown
# Vision|Pipe Session — 2026-05-05 14:32:01
Duration: 2m 14s

---

## Screenshot 1 — Chrome · github.com/visionpipe/issues/42
![screenshot](./screenshot-1.png)

**Caption:** Auth failure on production

**Narration:** "The API is returning 403 on this endpoint
even though the token looks valid in the response headers
here. I've been seeing this since the deploy this morning..."

---

## Screenshot 2 — Visual Studio Code · src/auth.ts (line 84)
![screenshot](./screenshot-2.png)

**Caption:** Token generation logic

**Narration:** "...and here's where we generate the token.
The expiry is set to 24 hours. The scope parameter is
hardcoded but I wonder if that's the issue — it was
changed in the last PR."

---

## Closing Narration
"Both screenshots show the same flow. I think the scope
is wrong. Can you check the token generation against the
endpoint's expected claims and propose a fix?"
```

**Subtext below the example:**
> Claude Code gets the full sequence — not a fragment. Your narration travels with the screenshot it describes. The ask is explicit. The AI can act.

---

### §5. How It Works — replace 5 steps with 6-step session flow

**Current headline:** "Five Steps. One Keystroke." → **New:** "One Session. Complete Brief."

**Replace the 5 steps with these 6:**

| # | Title | Copy | Keys |
|---|---|---|---|
| 1 | Press your hotkey | `Cmd+Shift+C` activates the session window. The capture overlay opens. Configurable in Settings. | Cmd+Shift+C / Ctrl+Shift+C |
| 2 | Select a region | Drag to capture the first screenshot. It lands as a card in the session window. | — |
| 3 | Narrate what you're seeing | Speak continuously — Vision\|Pipe transcribes on-device in real time, anchoring your words to the screenshot in front of you. | — |
| 4 | Take the next screenshot | Hit your hotkey again without stopping the session. Each new capture becomes its own card with its own segment of narration. Edit captions inline. | — |
| 5 | Add a closing note | Summarize the ask in the closing narration field. Tell your AI exactly what you want done. | — |
| 6 | Hit Copy & Send | A structured markdown bundle is written to disk and copied to your clipboard. Drag it into Claude Code or paste it anywhere. Your AI has everything — screenshots, transcripts, context, and a clear ask. | — |

(Step 1 is the only one that retains the keys row from the current implementation.)

---

### §6. Multi-Modal Annotation — rework cards

**Section headline (keep):** "Captures What You Mean, Not Just What You See"
**Section subhead (keep):** "Every other screenshot tool captures pixels. Vision|Pipe captures intent."

**Replace the three current cards** with these three:

**Card 1 — Speak It (rewritten):**
- Title: **Speak It**
- Body: "Narrate continuously across the entire session. As you capture each screenshot, Vision|Pipe transcribes your voice in real time — anchoring your words to the screenshot you were looking at the moment you said them. No editing. No re-typing. Your intent is preserved, sequenced, and delivered with the images it describes."
- Subnote: "Transcription runs on-device via Apple Speech. No audio leaves your machine."
- Example: *"This dropdown is rendering below the viewport on Safari — why?"*

**Card 2 — Caption It (replaces "Type It"):**
- Title: **Caption It**
- Body: "Each screenshot gets a short editable caption — a name that anchors it in your bundle and gives your AI an instant index of what each frame contains."
- Example: *"Token generation logic — line 84"*

**Card 3 — Draw It (with prominent "Coming soon" badge):**
- Title: **Draw It** *(Coming soon)*
- Body: "Circle the problem. Highlight the element. Draw an arrow. A lightweight markup layer is in development — it briefly shipped earlier and is being rebuilt as part of the annotation system."
- (No example.)

**Bottom callout** — replace "All three, combined" with:
> **Voice + caption today. Drawing returning soon.** Your narration travels with the screenshot it describes; your captions name each one; the full bundle is one paste away.

---

### §7. NEW SECTION — "Give Your Developers Vision" *(Coming soon)*

**Place after the Multi-Modal Annotation section.**

**Section badge:** Pin a prominent "Coming soon" badge to the section header.

**Headline:** Give Your Developers Vision

**Body:**
> Developers have AI coding agents that can build, fix, and refactor — but only when given precise context. That context usually lives in someone else's head.
>
> The PM who walked through the broken checkout flow. The designer who spotted the misaligned component. The QA tester who can reproduce the crash every time.
>
> They all see exactly what needs to happen. Until now, there was no good way to get that vision into the hands of the AI that can act on it. Vision|Pipe is closing that gap.

**Three persona cards (PM / Designer / QA):**

| Who | What they do | What arrives in Claude Code |
|---|---|---|
| **Product Manager** | Records a 3-screenshot walkthrough of a broken user flow with voice-narrated context on what needs to change and why | A structured markdown document with every screen, every word, and a clear ask — Claude Code reads it like a spec |
| **Designer** | Captures a UI mismatch across two screens and narrates the expected behavior | Side-by-side screenshots with timestamped narration — the AI sees the gap immediately |
| **QA / CS Team** | Walks through a reproducible bug step by step with voice commentary on each screen | A sequenced, narrated session that gives the developer and the AI the exact reproduction path |

**Subtext:**
> No Loom videos someone has to watch and re-describe. No back-and-forth Slack threads. Just a narrated session — shared as a link, dragged into Claude Code, acted on.

---

### §8. NEW SECTION — "Share It. Ship It." *(Coming soon)*

**Place immediately after "Give Your Developers Vision."**

**Section badge:** Prominent "Coming soon" badge.

**Headline:** Share It. Ship It.

**Body:**
> When the session is ready, one button uploads it to the cloud and generates a private link.
>
> Send it to a developer. Drop it in Slack. Paste it in a ticket. The recipient opens the link, previews the session in their browser — screenshots, transcripts, narration, and metadata — then drags the markdown brief straight into Claude Code.
>
> No files to manage. No context to reconstruct. The brief is intact, structured, and ready to act on.

**Three-step visual flow** (matching the existing Solution section's visual pattern):
```
Record your session     →    Save to Cloud     →    Share the link
(screenshots + narration)    (one click, private)    (developer → Claude Code → done)
```

**Pull quote below the flow:**
> "The person who sees the problem and the AI that can fix it no longer need a developer translator in between."

**Technical credibility note (small text):**
> Sessions upload to Cloudflare R2 via a secure proxy. Links live at `share.visionpipe.app` and are private by default — only someone with the link can access the session. Each upload costs 50 credits ($0.50 at the base pack rate).

**Waitlist capture (single-input form):**
> Get notified when Cloud Share ships. → [email input] → [Notify me] button.
- Form action: TBD (defer to implementation; can stub as a `mailto:` or wire to a simple Vercel API route writing to Neon)
- Underneath: "We'll only email you about the launch. No marketing list."

---

### §9. Rich Metadata — keep as-is

Tables align with README. No changes needed.

---

### §10. Competitive Comparison — three updates

1. **Vision|Pipe row, "Annotate at Capture" subtitle** — change "Voice, text, drawing" → "Voice + caption (drawing soon)."
2. **Add new column: "Markdown Deliverable"** — Vision|Pipe gets ✓; all others get ✗ (they output an image).
3. **Add new column: "Team Sharing" *(Coming soon)*** — Vision|Pipe gets ✓ with a small "(soon)" subtext; all others get ✗ or partial (Loom for review-only video, etc.).

**Quote below the table** — keep as-is.

---

### §11. Tech Stack — replace Whisper card with Apple Speech

Replace the third card:
- **Old:** "Whisper — On-device transcription, no audio leaves your machine."
- **New:** "Apple Speech — On-device transcription via Apple's `SFSpeechRecognizer` framework. No audio leaves your machine."

Tauri and Rust cards: keep.

---

### §12. Open Source — keep as-is

No changes.

---

### §13. Final CTA — minor edits

- Same Windows-roadmap update as hero ("Apple Silicon today. Windows on the roadmap.")
- Headline can stay or swap to: "Stop pasting screenshots. Start delivering briefs."

---

### §14. Feature List — substantial rewrite

**Section headline:** Keep "Everything It Does. Nothing It Doesn't."

**Replace the 11 current items with this set:**

Shipped today:
1. **Multi-screenshot sessions** — string captures together with continuous narration; one shareable bundle.
2. **Real-time on-device transcription** — talk while you capture; Apple Speech anchors transcripts to each screenshot. No audio leaves your machine.
3. **Per-segment re-record** — fix any single piece of narration without losing the rest.
4. **Two view modes** — interleaved (cards + inline narration) or split (cards left, transcript right).
5. **Markdown brief output** — `transcript.md` written to disk + clipboard, optimized for Claude Code, GPT, Gemini, etc.
6. **HistoryHub** — in-app browser for past sessions; reopen, copy, or show in Finder.
7. **Editable captions** — name each screenshot inline; captions travel into the markdown bundle.
8. **Scrolling capture** — capture content that extends beyond the visible viewport.
9. **Configurable hotkeys** — rebind via Settings.
10. **Rich metadata** — spatial, window, browser, and system context bundled automatically.
11. **Local-first persistence** — sessions live on disk in `~/Pictures/VisionPipe/`.
12. **Open source** — see exactly what you're running.
13. **LLM-agnostic** — works with any AI that accepts images and markdown.
14. **Lightweight** — Tauri + Rust; minimal CPU and memory footprint.

Coming soon (each tagged with a small "soon" pill):
15. **Cloud session sharing** — upload to a private link; recipient previews in browser or downloads.
16. **Drawing & annotation** — markup layer returning as part of the annotation rebuild.
17. **On-device WhisperKit** — opt-in alternative to Apple Speech.
18. **Windows support** — Tauri code base supports cross-compilation; Apple Silicon ships today.

---

## Section-by-section: `/pricing`

### Hero — keep

"Free for Developers. Commercial License for Business." — still works as a frame.

But add a one-line subhead beneath it:
> 1 credit = $0.01. Pay only for what you actually send.

### Pricing card 1 (Personal & Open Source) — minor edit

Add a feature row to the bullet list:
- "Local-only use is always free — no account, no credits required."

### Pricing card 2 (Commercial) — reframe heavily

**Replace** the current generic copy with concrete pricing:

- Tier name: "Pay-as-you-go credits"
- Headline number: **$0.01 per credit**
- Body: "Each credit covers a piece of work you send. Take as many screenshots as you want, re-record audio, delete what you don't like — none of it costs anything until you click **Copy & Send**."

Add a small worked-examples table inline (compact version of the spec's table):

| What you sent | Cost |
|---|---|
| 1 screenshot, no audio | 1 credit ($0.01) |
| 3 screenshots, 5s narration | 3 credits ($0.03) |
| 5 screenshots, 47s narration | 9 credits ($0.09) |
| 1 screenshot, 2 min narration | 12 credits ($0.12) |

Below that:
> First 10 seconds of audio per session is free. After that, 1 credit per 10 seconds (rounded up). On-device transcription always free — your audio doesn't leave your Mac.

CTA: keep "View Credit Packs ↓" — the existing CreditPacksSection.

### CreditPacksSection — leave to existing component

(No changes specified here; existing component already handles pack display.)

### FAQ — fix outdated answers + add cloud share entry

**Replace this FAQ:**
> Q: Do I need an account or API key?
> A: No. VisionPipe runs entirely on your machine with no cloud dependency. There are no accounts, no API keys, and no data ever leaves your device (voice transcription is on-device via Whisper).

**With:**
> Q: Do I need an account or API key?
> A: For local use, no — no account, no API keys, nothing leaves your Mac. Voice transcription runs on-device via Apple Speech. *(An account is required for the upcoming Cloud Share feature, which lets you upload sessions to a private link for teammates to view.)*

**Replace this FAQ:**
> Q: What platforms are supported?
> A: Mac (macOS 13 Ventura and later) and Windows (Windows 10 build 19041+). Linux support is on the roadmap.

**With:**
> Q: What platforms are supported?
> A: Mac (Apple Silicon, macOS 13 Ventura and later) ships today. Windows and Linux support are on the roadmap.

**Replace this FAQ:**
> Q: How do I get a commercial license?
> A: Buy Credits. Each credit pack includes a commercial license for the credits you purchase.

**With:**
> Q: How do I get a commercial license?
> A: Buy a credit pack. Each credit costs $0.01 and includes a commercial license for the work you send. No subscription, no per-seat fees.

**Add new FAQ:**
> Q: How does Cloud Share work? *(Coming soon)*
> A: Record a session, click "Save to Cloud," and Vision|Pipe uploads the full session — screenshots, transcripts, narration — to secure cloud storage. You receive a private link at `share.visionpipe.app`. Anyone with the link can preview the session in their browser or download the markdown brief. Each upload costs 50 credits ($0.50). [Notify me when this ships → email capture]

### Bottom CTA — minor edit

Change:
> Free for personal use. No accounts, no API keys, no cloud dependency.

To:
> Local-only use is always free. Cloud Share (coming soon) is opt-in.

---

## Section-by-section: `/download`

Tagline below the title — change:
> Free for personal use. No accounts, no API keys, no cloud dependency.

To:
> Free for personal use. Voice transcription runs on-device — your audio doesn't leave your Mac.

(Removes the "no cloud dependency" line that becomes wrong once Cloud Share ships, while still highlighting the on-device privacy story for today.)

Other content on this page: keep.

---

## Visual treatment for "Coming soon"

Three different visual treatments, scaled to prominence:

1. **Section-level "Coming soon" pill** — for the two new full sections (Give Your Developers Vision; Share It. Ship It.). Pill sits next to the section H2, same font size as a small caps subhead. Distinct color (suggest amber `#d4882a` so it pops against teal/cream and matches existing accent palette).

2. **Card-level "Coming soon" badge** — for the Draw It card. Small pill in the top-right corner of the card.

3. **Inline "(soon)" tag** — for the comparison table column header and the Coming-soon items in the feature list. Small caps, muted-dim color.

The waitlist email capture appears in two places:
- Bottom of the "Share It. Ship It." section (primary)
- Inside the new pricing FAQ "How does Cloud Share work?" answer (secondary)

---

## Open decisions for implementation

1. **Waitlist form backend.** Options:
   - (a) Stub it as a `mailto:hello@visionpipe.ai?subject=Cloud Share waitlist&body=Notify me when Cloud Share ships.` — zero-infrastructure, ugly UX
   - (b) New API route `POST /api/waitlist` writing to a new Drizzle `waitlist` table — clean UX, ~30 min of work given existing infra
   - **Recommend (b)** since billing infra is already in place; reusing it is trivial.

2. **Markdown example styling.** The "Not a Screenshot. A Brief." section needs a code block that renders the example. Use existing `CopyBlock` component? Or a new `MarkdownExample` component for syntax-highlighted display? **Recommend new component** — `CopyBlock` is line-based; the markdown example needs multi-line preformatted display with a copy button.

3. **Persona cards visual.** Three persona cards (PM/Designer/QA). The existing `metadataGroups` cards are a similar pattern (3-up grid with title + table). Reuse that structure or design something new? **Recommend reuse the existing card grid pattern** for visual consistency.

4. **Pricing page worked-examples table styling.** Inline plain HTML table, or a styled `PricingExamples` component? **Recommend plain styled table** — existing competitor table on `/` shows the pattern works.

---

## Testing & verification

Per CLAUDE.md project instructions, before claiming done:

1. Run `npm run dev` and visually inspect all three pages (`/`, `/pricing`, `/download`).
2. Confirm all "Coming soon" badges render correctly.
3. Confirm the markdown example renders (no escaping issues with `**bold**` etc.).
4. Confirm waitlist form submission works (or stub returns 200) — if option (b) chosen.
5. Run `npx tsc --noEmit` clean.
6. Run `npm run build` — confirm no build errors and the affected routes still prerender as static.
7. Mobile responsiveness: resize to ~375px width and confirm all new sections collapse cleanly.

---

## What this spec deliberately does NOT cover

- **Pricing page CreditPacksSection internals** — already shipped; out of scope.
- **Header / Footer / nav** — no changes needed; existing nav already routes to `/pricing` and `/download`.
- **OG card / metadata / SEO** — separate concern; could be addressed in a follow-up.
- **Analytics events** — not in this scope.
- **Dashboard pages** — auth-gated, don't need marketing copy updates.
- **Visual asset updates** — no new images, screenshots, or videos in this pass. The "Screenshot or GIF goes here" placeholders in the How It Works section remain placeholders for now.

---

## Implementation sequencing

Suggested commit order (each commit can be a single PR if desired):

1. **Homepage edits in place** — §§1, 2, 3, 5, 6, 10, 11, 13 (existing sections, copy changes only)
2. **Homepage new section: "Not a Screenshot. A Brief."** — §4 (requires new MarkdownExample component)
3. **Homepage new section: "Give Your Developers Vision"** — §7 (requires Coming-soon section badge styling)
4. **Homepage new section: "Share It. Ship It."** — §8 (requires waitlist form, decision on backend)
5. **Homepage feature list rewrite** — §14
6. **Pricing page updates** — including new FAQ entry
7. **Download page edit** — single line change

Each step independently shippable; if waitlist backend (decision #1) takes longer, ship steps 1–7 with the waitlist form stubbed as a `mailto:` and follow up with the API route in a separate PR.
