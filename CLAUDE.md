# CLAUDE.md — VisionPipe Website

Standing instructions for any Claude Code session working in this project. These apply only to `visionpipe-web` (loaded via project-level `CLAUDE.md`); other projects are unaffected.

## Project at a glance

- **What:** Marketing website for VisionPipe, a desktop screenshot-to-LLM utility
- **Stack:** Next.js 15 (App Router, static), React 19, Tailwind CSS 4, IBM Plex Sans + Source Code Pro
- **Deployment:** Vercel
- **Sister repo:** `/Users/drodio/Projects/visionpipe` (the desktop Tauri app)
- **Authoritative product spec:** `prd/PRD.md`
- **Design spec (historical reference):** `docs/superpowers/specs/2026-04-12-visionpipe-website-design.md`

## Per-commit workflow — REQUIRED on every commit

Every time you commit work to this repo, you MUST update the branch progress log. Do not skip this step.

### Step 1: Find or create the progress log for this branch

- The progress log lives in `prd/<branch-name>.md` (e.g., on `main` → `prd/main.md`; on a feature branch `feature-foo` → `prd/feature-foo.md`).
- If the file already exists, read it and figure out what's changed since the most recent entry.
- If it doesn't exist, create it and add the first entry.

### Step 2: Add a new entry at the TOP of the file

New entries go ABOVE older entries — newest first. Use this exact format:

```markdown
## Progress Update as of [YYYY-MM-DD HH:MM AM/PM PDT or PST]
*(Most recent updates at top)*
### Summary of changes since last update

[One paragraph max — what changed since the last entry.]

### Detail of changes made:

- [Bullet points. Include any context a future LLM would need to ramp up on the state of this branch quickly. File paths, decisions, gotchas, why-not-just-X considerations all welcome.]

### Potential concerns to address:

- [Bullet points. Anything in the codebase that is or could become an issue. Tech debt, spec drift, untested paths, deferred work, fragile assumptions.]

---
```

Use Pacific time (PDT in summer, PST in winter). Get current time with `TZ='America/Los_Angeles' date '+%Y-%m-%d %I:%M %p %Z'`.

### Step 3: Stage the progress log alongside your code changes

`git add prd/<branch>.md` along with whatever else you're committing. The pre-commit hook will warn (not block) if you forgot.

### Step 4: Tell the user you updated the progress log

When you report a successful commit to the user, explicitly state that you also updated `prd/<branch>.md`. Example: "Committed; also wrote a new entry to `prd/main.md`."

## Pre-commit hook

There's a pre-commit hook at `.git/hooks/pre-commit` that warns when committing without modifying `prd/<branch>.md`. It does not block — it's a reminder. If you ever bypass it, make sure you have a real reason.

The hook is local-only (in `.git/hooks/`, not tracked). If the repo is re-cloned, recreate it from this CLAUDE.md.

## Other working norms

- **PRD is the source of truth.** Reference `prd/PRD.md` before making product/scope decisions. If you need to deviate, update the PRD in the same commit and note it in the progress log.
- **Don't create new docs/READMEs unless asked.** The PRD + branch progress log are sufficient for this project's documentation needs.
- **Match the existing visual language.** Earthy palette (Teal/Amber/Cream/Forest/Sienna), IBM Plex Sans + Source Code Pro. Tokens are defined in `prd/PRD.md` and `src/app/globals.css`.
- **Test UI changes in a browser** before claiming the work is done — type-checking is not the same as feature-checking.
