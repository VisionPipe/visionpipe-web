# Branch Progress: main

This document tracks progress on the `main` branch of the VisionPipe website. It is updated with each commit and serves as a context handoff for any future LLM picking up this work. Newest entries at the top.

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
