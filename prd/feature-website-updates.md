# Branch Progress: feature/website-updates

This branch holds website-only updates (copy, layout, navigation, downloads page) that ship independently of the billing system. Branched from the tip of `feature/stripe-billing-phase-1` at commit `b595234` (Release v0.3.2) so the work is testable against the founder's current local environment without rebasing. Newest entries at the top.

---

## Progress Update as of 2026-05-02 07:57 PM PDT
*(Most recent updates at top)*
### Summary of changes since last update

Branch created. First task: the Header's "Download" CTA was wired to `/#hero` on the home page, which is a no-op when the user is already at the top of the page (the apparent bug the founder reported). Created a dedicated `/download` page and pointed both Header download links (desktop nav + mobile menu) at it.

### Detail of changes made:

- Branched `feature/website-updates` from origin's tip of `feature/stripe-billing-phase-1` (`b595234 Release v0.3.2`). Initially branched from `main` but rebased onto the billing branch because the founder's local dev server is running the billing branch (Header has Sign in / UserButton, dashboard exists, etc.) — the website updates need to be testable against that environment.
- `src/app/download/page.tsx` (new): full-page Download CTA. Logo + headline ("Download Vision|Pipe") + tagline + a single big "Download for Mac" button (`/downloads/VisionPipe.dmg`, `download` attr). Below: brew install commands via the existing `<CopyBlock>` component. "Windows support coming soon" notice. Footer links to GitHub, /pricing, and back to home. Uses the existing earthy-palette tokens (bg-forest, text-cream, text-teal, etc.) — no new design tokens introduced.
- `src/components/Header.tsx`: replaced both `href="/#hero"` instances (desktop nav at L80 + mobile menu at L152) with `href="/download"`. Used `replace_all`. The button's class names and label ("Download") unchanged so the visual rhythm is preserved.
- Verified: `npx tsc --noEmit` clean; `npm run build` succeeds with 15 routes (`/download` listed as `○` prerendered static).

### Potential concerns to address:

- The `/download` page duplicates the install commands and Mac DMG link from the home page hero. If founder later wants the home page hero to be lighter (just headline + a single "Download" CTA → /download) we can de-duplicate. For now both surfaces work.
- `VisionPipe.dmg` symlink in `public/downloads/` is currently 5.9MB and dated v0.3.2 (May 2 19:26). The DMG link is platform-agnostic in copy ("Download for Mac") but the binary is Apple-specific. When Windows ships, this page will need a platform-detection branch or per-platform CTAs.
- Header still has `href="/downloads/VisionPipe.dmg"` style direct-download in some other CTAs on the home page (CTA cluster in the hero, bottom CTA at L638). Those are intentional — direct download from in-page CTAs is fine; the header button now sends users to a focused page.

---
