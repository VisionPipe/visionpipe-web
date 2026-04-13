# VisionPipe Website — Design Spec

## Overview

Marketing website for VisionPipe, a desktop screenshot-to-LLM utility. Two pages: landing page and pricing. Primary goal is driving downloads of the native app. Secondary goal is linking to GitHub for open source contributions.

## Tech Stack

- Next.js 15 (App Router, static generation)
- React 19
- Tailwind CSS 4
- Fonts: IBM Plex Sans (UI/body), Source Code Pro (code/monospace) via `next/font/google`
- Deployment: Vercel

## Color Palette (Earthy Rebrand)

| Token        | Hex       | Role                                    |
|--------------|-----------|-----------------------------------------|
| Teal         | `#2e8b7a` | Primary accent, CTAs, interactive states |
| Amber        | `#d4882a` | Secondary accent, highlights             |
| Cream        | `#f5f0e8` | Headings, primary text                   |
| Forest       | `#1a2a20` | Primary background                       |
| Deep Forest  | `#141e18` | Cards, alternating sections              |
| Burnt Sienna | `#c0462a` | Error/destructive states                 |
| Muted        | `#8a9a8a` | Secondary/body text                      |

## Typography

- Headings: IBM Plex Sans, Cream (`#f5f0e8`)
- Body: IBM Plex Sans, Muted (`#8a9a8a`)
- Code/monospace: Source Code Pro
- Hierarchy: hero h1 ~5xl-7xl responsive, section headers ~3xl-4xl, body ~lg

## Shared Layout

### Sticky Header
- VisionPipe SVG logo (no-background version, 32px) on left
- Nav links: Features (anchor to landing), Pricing (/pricing), GitHub (external, opens new tab with icon)
- Mobile: hamburger menu
- Background: Deep Forest with slight transparency/backdrop blur

### Footer
- Three columns: Product (Features, Pricing), Community (GitHub, Contributing, X/Twitter @Vision_Pipe), Contact (hello@visionpipe.ai)
- Bottom bar: "Built with the Unix philosophy: do one thing, do it well." + copyright
- Background: Deep Forest

## Landing Page (/)

### Section 1: Hero
- Primary headline: "Give your LLM eyes."
- Subheadline in monospace: `screenshot | llm` — now a reality.
- Body copy: brief description from marketing doc
- CTA cluster:
  - Primary: `brew install visionpipe` copyable code block
  - Secondary: "Download for Mac" and "Download for Windows" buttons
  - Tertiary: "View on GitHub →" link to https://github.com/visionpipe
- VisionPipe logo displayed prominently

### Section 2: Problem — "The Loop You're Stuck In"
- Copy from marketing doc about the describe-misunderstand-describe loop
- "Productivity tax" framing
- Visual treatment: text-focused, possibly with a simple illustration placeholder

### Section 3: Solution — "VisionPipe Skips the Description"
- Contrasting workflow: Capture + Comment → Paste → Submit
- "No uploads. No integrations. No UI sprawl."
- Unix philosophy callout

### Section 4: How It Works — "Five Steps. One Keystroke."
- 5 steps with icons/numbers
- Each step has a description and a placeholder slot for a screenshot/GIF
- Example workflow beneath showing the full flow

### Section 5: Multi-Modal Annotation
- "Captures What You Mean, Not Just What You See"
- Three sub-sections with icons: Speak It, Type It, Draw It
- Each with example quote from marketing doc
- Callout: all three can be combined into one clipboard payload

### Section 6: Rich Metadata
- "Your LLM Gets the Full Picture"
- Styled metadata tables showing the categories: Spatial & Display, Window & Application, Browser Context, System
- Visual treatment: dark cards with monospace text, mimicking what the actual clipboard output looks like

### Section 7: Competitive Comparison
- "Every Other Tool Was Built for Humans"
- Comparison table: VisionPipe vs Playwright, Zight/CleanShot X, Snagit, macOS Screenshot
- Columns: Built For, LLM-Native, Annotate at Capture, Rich Metadata
- VisionPipe row highlighted with Teal accent

### Section 8: Open Source / Contributing
- "Built in the Open"
- GitHub link prominent
- Brief contributing instructions
- "Questions? Open an issue or reach out on X @Vision_Pipe"

### Section 9: Final CTA
- Repeat the brew install / download buttons
- "Free for personal use. Open for contributions. Built for developers."

## Pricing Page (/pricing)

### Hero
- "Free for Developers. Commercial License for Business."
- Brief explanation of Revenue-Trigger License model

### Pricing Cards
- **Personal & Open Source** (Free): personal projects, hobby, learning, open source contributions, non-profit/educational
- **Commercial** (Contact Us): business/company use, revenue-generating products, client work/consulting
- Commercial card CTA: "Contact Us" linking to hello@visionpipe.ai

### FAQ Section
- What counts as commercial use?
- Is VisionPipe open source?
- Can I contribute to VisionPipe?
- How do I get a commercial license?

## File Structure

```
src/
  app/
    layout.tsx          — shared layout with header, footer, fonts
    page.tsx            — landing page
    globals.css         — CSS custom properties, base styles
    pricing/
      page.tsx          — pricing page
    images/
      visionpipe-logo-no-background.png
      visionpipe-logo.png
      visionpipe-logo.svg
  components/
    Header.tsx          — sticky nav header
    Footer.tsx          — site footer
    CopyBlock.tsx       — copyable code block (brew install)
    ComparisonTable.tsx — competitive comparison table
    MetadataShowcase.tsx — metadata tables display
    PricingCard.tsx     — pricing tier card
```

## Assets Needed (Future)
- Screenshots of VisionPipe in action (placeholder slots designed in)
- Animated GIFs of the capture flow
- Demo video (optional, for hero or how-it-works)

## External Links
- GitHub: https://github.com/visionpipe
- X/Twitter: @Vision_Pipe
- Contact: hello@visionpipe.ai
- Download links: point to GitHub Releases (https://github.com/visionpipe/visionpipe/releases)
