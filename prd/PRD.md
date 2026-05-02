# VisionPipe Website — Product Requirements Document

## Overview

Marketing website for VisionPipe, the cross-platform desktop screenshot-to-LLM utility. The site exists to drive downloads of the native app and recruit open source contributors.

**Repo:** https://github.com/visionpipe/visionpipe-web
**Deployment:** Vercel
**Stack:** Next.js 15 (App Router, static), React 19, Tailwind CSS 4, IBM Plex Sans + Source Code Pro

## Problem

VisionPipe is a developer tool that needs a public face. Without a website:
- Developers can't discover it outside of GitHub
- The "free for personal, paid for commercial" license model has no place to live
- There's no canonical install path (`brew install visionpipe`, direct downloads)
- No story for what makes VisionPipe different from existing screenshot tools

## Solution

A focused two-page marketing site:

1. **Landing page (`/`)** — sells the product and drives installs
2. **Pricing page (`/pricing`)** — explains the Revenue-Trigger License and routes commercial inquiries to `hello@visionpipe.ai`

Primary CTAs everywhere: `brew install visionpipe`, Mac/Windows direct downloads, GitHub link.

## Goals

### Primary
- Drive installs of the desktop app (brew + direct download)
- Communicate "LLM-native screenshot tool" positioning in under 10 seconds

### Secondary
- Recruit open source contributors via prominent GitHub linking
- Convert commercial users to email contact for licensing
- Establish brand identity (earthy palette, Unix philosophy framing)

## Audience

- **Primary:** Developers who work with LLMs daily and screenshot frequently
- **Secondary:** Engineering managers evaluating tools for their teams (commercial license)
- **Tertiary:** Open source contributors looking for Tauri/Rust projects to join

## Brand & Design

### Color Palette (Earthy Rebrand)

| Token        | Hex       | Role                                     |
|--------------|-----------|------------------------------------------|
| Teal         | `#2e8b7a` | Primary accent, CTAs, interactive states |
| Amber        | `#d4882a` | Secondary accent, highlights             |
| Cream        | `#f5f0e8` | Headings, primary text                   |
| Forest       | `#1a2a20` | Primary background                       |
| Deep Forest  | `#141e18` | Cards, alternating sections              |
| Burnt Sienna | `#c0462a` | Error/destructive states                 |
| Muted        | `#8a9a8a` | Secondary/body text                      |

### Typography
- Headings: IBM Plex Sans, Cream
- Body: IBM Plex Sans, Muted
- Code/monospace: Source Code Pro
- Hero h1: 5xl–7xl responsive; section headers: 3xl–4xl

## Pages

### Landing (`/`)

1. **Hero** — "Give your LLM eyes." + `screenshot | llm` subhead, install CTAs
2. **The Loop You're Stuck In** — describe-misunderstand-describe pain
3. **VisionPipe Skips the Description** — Capture + Comment → Paste → Submit
4. **Five Steps. One Keystroke.** — workflow walkthrough
5. **Multi-Modal Annotation** — Speak It / Type It / Draw It
6. **Rich Metadata** — what the clipboard payload actually contains
7. **Every Other Tool Was Built for Humans** — comparison table vs. Playwright, Zight/CleanShot X, Snagit, macOS Screenshot
8. **Built in the Open** — GitHub + contributing
9. **Final CTA** — repeat install options

### Pricing (`/pricing`)

1. **Hero** — "Free for Developers. Commercial License for Business."
2. **Pricing cards** — Personal & Open Source (Free) / Commercial (Contact Us)
3. **FAQ** — what counts as commercial, is it open source, how to contribute, how to license
4. **Final CTA**

## Shared Components

- **Header** — sticky, Deep Forest with backdrop blur, logo + nav (Features, Pricing, GitHub)
- **Footer** — three columns (Product, Community, Contact) + Unix philosophy tagline

## Content Sources

- Marketing copy: `/Users/drodio/Projects/visionpipe/prd/Storytell marketing outptu...pdf`
- Product context: `/Users/drodio/Projects/visionpipe/prd/PRD.md`
- Design spec: `docs/superpowers/specs/2026-04-12-visionpipe-website-design.md`

## External Links

- GitHub org: https://github.com/visionpipe
- Releases (for direct downloads): https://github.com/visionpipe/visionpipe/releases
- X/Twitter: @Vision_Pipe
- Contact: hello@visionpipe.ai

## Out of Scope (for now)

- Blog / changelog pages
- Documentation site (lives in the desktop repo)
- Analytics / event tracking
- A/B testing infrastructure
- Sign-up / account flows
- Live demo or interactive playground in the browser
