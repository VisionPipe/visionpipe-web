import Image from "next/image";
import CopyBlock from "@/components/CopyBlock";
import ComingSoon from "@/components/ComingSoon";
import HeroCarousel from "@/components/HeroCarousel";
import MarkdownExample from "@/components/MarkdownExample";
import WaitlistForm from "@/components/WaitlistForm";

function VP() {
  return <>Vision<span className="text-amber">|</span>Pipe</>;
}

const steps = [
  {
    num: 1,
    keys: "Cmd+Shift+C",
    keysWin: "Ctrl+Shift+C",
    title: "Press your hotkey",
    desc: "Cmd+Shift+C activates the session window and the capture overlay. Configurable in Settings to whatever you prefer.",
  },
  {
    num: 2,
    title: "Select a region",
    desc: "Drag to capture the first screenshot. It lands as a card in the session window.",
  },
  {
    num: 3,
    title: "Narrate what you're seeing",
    desc: "Speak continuously — Vision|Pipe transcribes on-device in real time, anchoring your words to the screenshot in front of you.",
  },
  {
    num: 4,
    title: "Take the next screenshot",
    desc: 'Hit your hotkey again without stopping the session. Each new capture becomes its own card with its own segment of narration. Edit captions inline.',
  },
  {
    num: 5,
    title: "Add a closing note",
    desc: "Summarize the ask in the closing narration field. Tell your AI exactly what you want done.",
  },
  {
    num: 6,
    title: "Hit Copy & Send",
    desc: "A structured markdown bundle is written to disk and copied to your clipboard. Drag it into Claude Code or paste it anywhere. Your AI has everything — screenshots, transcripts, context, and a clear ask.",
  },
];

const annotations = [
  {
    icon: (
      <svg className="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    title: "Speak It",
    desc: (
      <>
        Narrate continuously across the entire session. As you capture each
        screenshot, <VP /> transcribes your voice in real time — anchoring your
        words to the screenshot you were looking at the moment you said them.
        No editing. No re-typing. Your intent is preserved, sequenced, and
        delivered with the images it describes.
      </>
    ),
    subnote: "Transcription runs on-device via Apple Speech. No audio leaves your machine.",
    example: '"This dropdown is rendering below the viewport on Safari — why?"',
    comingSoon: false,
  },
  {
    icon: (
      <svg className="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Caption It",
    desc: (
      <>
        Each screenshot gets a short editable caption — a name that anchors it
        in your bundle and gives your AI an instant index of what each frame
        contains.
      </>
    ),
    subnote: null,
    example: "Token generation logic — line 84",
    comingSoon: false,
  },
  {
    icon: (
      <svg className="h-8 w-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Draw It",
    desc: (
      <>
        Circle the problem. Highlight the element. Draw an arrow. A lightweight
        markup layer is in development — it briefly shipped earlier and is
        being rebuilt as part of the annotation system.
      </>
    ),
    subnote: null,
    example: null,
    comingSoon: true,
  },
];

const personas = [
  {
    role: "Product Manager",
    does: "Records a 3-screenshot walkthrough of a broken user flow with voice-narrated context on what needs to change and why.",
    delivers: "A structured markdown document with every screen, every word, and a clear ask — Claude Code reads it like a spec.",
  },
  {
    role: "Designer",
    does: "Captures a UI mismatch across two screens and narrates the expected behavior.",
    delivers: "Side-by-side screenshots with timestamped narration — the AI sees the gap immediately.",
  },
  {
    role: "QA / CS Team",
    does: "Walks through a reproducible bug step by step with voice commentary on each screen.",
    delivers: "A sequenced, narrated session that gives the developer and the AI the exact reproduction path.",
  },
];

const metadataGroups = [
  {
    title: "Spatial & Display",
    fields: [
      ["Capture region", "x: 240, y: 180"],
      ["Capture dimensions", "1200 × 800 px"],
      ["Screen resolution", "2560 × 1600"],
      ["DPI / scale factor", "2x (Retina)"],
      ["Monitor", "LG UltraFine 5K"],
      ["Color profile", "Display P3"],
    ],
  },
  {
    title: "Window & Application",
    fields: [
      ["Active application", "Visual Studio Code"],
      ["Window title", "visionpipe — README.md"],
      ["Window size", "1440 × 900"],
      ["Window state", "Windowed"],
      ["Process ID", "PID 4821"],
    ],
  },
  {
    title: "Browser Context",
    fields: [
      ["Browser", "Chrome 124.0"],
      ["Active tab URL", "github.com/visionpipe"],
      ["Page title", "Vision|Pipe — GitHub"],
      ["Viewport", "1440 × 789"],
    ],
  },
  {
    title: "System",
    fields: [
      ["Timestamp", "2026-04-11T14:32:01Z"],
      ["Operating system", "macOS 15.3.2"],
      ["Hostname", "colins-macbook-pro"],
      ["Screen count", "2"],
    ],
  },
];

type CompetitorCell = boolean | "Partial" | "Post-capture" | "At capture" | "soon";

interface Competitor {
  name: React.ReactNode;
  builtFor: string;
  llmNative: CompetitorCell;
  annotate: CompetitorCell;
  metadata: CompetitorCell;
  markdown: CompetitorCell;
  teamShare: CompetitorCell;
  highlight?: boolean;
}

const competitors: Competitor[] = [
  {
    name: "Playwright",
    builtFor: "Programmatic browser automation",
    llmNative: false,
    annotate: false,
    metadata: "Partial",
    markdown: false,
    teamShare: false,
  },
  {
    name: "Loom / Zight / CleanShot X",
    builtFor: "Sharing with humans",
    llmNative: false,
    annotate: "Post-capture",
    metadata: false,
    markdown: false,
    teamShare: "Partial",
  },
  {
    name: "Snagit",
    builtFor: "Documentation & tutorials",
    llmNative: false,
    annotate: "Post-capture",
    metadata: false,
    markdown: false,
    teamShare: false,
  },
  {
    name: "macOS Screenshot",
    builtFor: "General capture",
    llmNative: false,
    annotate: false,
    metadata: false,
    markdown: false,
    teamShare: false,
  },
  {
    name: <VP />,
    builtFor: "Piping visual context into LLMs",
    llmNative: true,
    annotate: "At capture",
    metadata: true,
    markdown: true,
    teamShare: "soon",
    highlight: true,
  },
];

const sampleMarkdown = `# Vision|Pipe Session — 2026-05-06 10:21:00 UTC
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
`;

const shippedFeatures = [
  { label: "Multi-screenshot sessions", desc: "String captures together with continuous narration; one shareable bundle." },
  { label: "Real-time on-device transcription", desc: "Talk while you capture; Apple Speech anchors transcripts to each screenshot. No audio leaves your machine." },
  { label: "Per-segment re-record", desc: "Fix any single piece of narration without losing the rest." },
  { label: "Two view modes", desc: "Interleaved (cards + inline narration) or split (cards left, transcript right)." },
  { label: "Markdown LLM Spec output", desc: "A timestamped, structured markdown file written to disk + clipboard, optimized for Claude Code, GPT, Gemini, etc." },
  { label: "HistoryHub", desc: "In-app browser for past sessions; reopen, copy, or show in Finder." },
  { label: "Editable captions", desc: "Name each screenshot inline; captions travel into the markdown bundle." },
  { label: "Scrolling capture", desc: "Capture content that extends beyond the visible viewport." },
  { label: "Configurable hotkeys", desc: "Rebind via Settings." },
  { label: "Rich metadata", desc: "Spatial, window, browser, and system context bundled automatically." },
  { label: "Local-first persistence", desc: "Sessions live on disk in ~/Pictures/VisionPipe/." },
  { label: "Open source", desc: "See exactly what you're running." },
  { label: "LLM-agnostic", desc: "Works with any AI that accepts images and markdown." },
  { label: "Lightweight", desc: "Tauri + Rust; minimal CPU and memory footprint." },
];

const comingSoonFeatures = [
  { label: "Cloud session sharing", desc: "Upload to a private link; recipient previews in browser or downloads." },
  { label: "Drawing & annotation", desc: "Markup layer returning as part of the annotation rebuild." },
  { label: "On-device WhisperKit", desc: "Opt-in alternative to Apple Speech." },
  { label: "Windows support", desc: "Tauri code base supports cross-compilation; Apple Silicon ships today." },
];

function Check({ amber = false }: { amber?: boolean }) {
  return (
    <svg className={`mx-auto h-5 w-5 ${amber ? "text-amber" : "text-teal"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross() {
  return (
    <svg className="mx-auto h-5 w-5 text-muted-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function renderCell(value: CompetitorCell): React.ReactNode {
  if (value === true || value === "At capture") {
    return (
      <div>
        <Check />
        {value === "At capture" && (
          <span className="mt-0.5 block text-xs text-teal">Voice + caption</span>
        )}
      </div>
    );
  }
  if (value === "soon") {
    return (
      <div>
        <Check amber />
        <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-amber">soon</span>
      </div>
    );
  }
  if (value === "Post-capture") {
    return <span className="text-xs text-muted-dim">Post-capture only</span>;
  }
  if (value === "Partial") {
    return <span className="text-xs text-muted-dim">Partial</span>;
  }
  return <Cross />;
}

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Image
            src="/images/visionpipe-logo-no-background.png"
            alt="Vision|Pipe logo"
            width={150}
            height={150}
            className="mx-auto mb-8"
          />
          <h1 className="text-5xl font-bold tracking-tight text-cream sm:text-7xl">
            Give Your LLM Vision
          </h1>
          <p className="mt-4 font-mono text-xl text-teal sm:text-2xl">
            A Picture is Worth a Thousand Prompts
          </p>
          <HeroCarousel />

          {/* CTA cluster */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="/downloads/VisionPipe.dmg"
              download
              className="inline-flex items-center gap-2 text-3xl font-semibold text-teal underline decoration-teal/40 underline-offset-4 transition hover:text-teal-light hover:decoration-teal-light/60"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for Mac
            </a>
            <CopyBlock lines={["brew tap visionpipe/visionpipe", "brew install --cask visionpipe"]} className="w-full max-w-md" />
            <p className="text-sm text-muted-dim">
              Apple Silicon today. Windows on the roadmap.
            </p>
            <a
              href="https://github.com/visionpipe"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-muted transition hover:text-cream"
            >
              View on GitHub &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ── Pain ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Stop Working Blind
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed">
            <p>
              You&rsquo;re working with an AI and need to show it what&rsquo;s
              on your screen. You describe it in words. It misunderstands. You
              describe again. Repeat.
            </p>
            <p>
              Or you need to walk your AI through a workflow that spans five
              different screens. So you take Screenshot 1. Paste it. Describe
              what it connects to. Take Screenshot 2. Switch back. Paste again.
              Re-establish the context you just lost. Repeat.
            </p>
            <p>
              Or you&rsquo;re not a developer at all. You see exactly
              what&rsquo;s wrong — but describing a visual problem in a Jira
              ticket is hopeless. So you schedule a call. The developer takes
              notes. Some of it gets lost. They brief Claude Code from memory.
              The fix misses the point.
            </p>
            <p className="text-cream font-medium">
              The gap between what you see and what your AI understands is
              costing the whole team — not just the developers.
            </p>
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Show your LLM What You Mean
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            <p>
              Capture a sequence of screens. Narrate as you go — your voice
              transcribes on-device, anchored to the screenshot you were
              looking at when you said it. Hit Copy &amp; Send. A structured
              markdown LLM Spec lands on your clipboard, ready for any LLM.
            </p>
            <p className="text-cream font-medium">
              No uploads. No integrations. No UI sprawl.
            </p>
            <p>
              Just the Unix philosophy applied to AI vision: do one thing, do
              it well, compose it with everything else.
            </p>
          </div>

          {/* Workflow comparison */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-deep-forest p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-dim">
                Every other tool
              </p>
              <div className="mt-4 space-y-2 font-mono text-sm text-muted">
                <p>Capture</p>
                <p className="text-muted-dim">&darr;</p>
                <p>Upload image</p>
                <p className="text-muted-dim">&darr;</p>
                <p>Switch to LLM</p>
                <p className="text-muted-dim">&darr;</p>
                <p>Type context</p>
                <p className="text-muted-dim">&darr;</p>
                <p>Submit</p>
              </div>
            </div>
            <div className="rounded-xl border border-teal/30 bg-deep-forest p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-cream">
                Vision<span className="text-amber">|</span>Pipe
              </p>
              <div className="mt-4 space-y-2 font-mono text-sm text-cream">
                <p>Capture(s) + Narrate</p>
                <p className="text-teal">&darr;</p>
                <p>Copy &amp; Send</p>
                <p className="text-teal">&darr;</p>
                <p>Paste &rarr; done</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW: Not just screenshots. A full narrated LLM Spec ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Not just screenshots. A full narrated LLM Spec
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-lg leading-relaxed">
            <p>Every other tool puts an image on your clipboard.</p>
            <p>
              <VP /> produces a structured markdown document — timestamped,
              narrated, and organized the same way a senior engineer would hand
              off a bug report. Claude Code reads it with its native Read tool.
              No extra prompting. No re-explaining the context you already
              spoke.
            </p>
          </div>

          <MarkdownExample
            content={sampleMarkdown}
            filename="VisionPipe-Spec-for-My-App-May-6-2026-10-21-AM-UTC.md"
            className="mt-12"
          />

          <p className="mx-auto mt-8 max-w-3xl text-center text-base text-muted">
            Claude Code gets the full sequence — not a fragment. Your narration
            travels with the screenshot it describes. The ask is explicit. The
            AI can act.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            One Session. Complete LLM Spec.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Six steps from hotkey to handoff.
          </p>
          <div className="mt-16 space-y-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`flex flex-col items-center gap-8 lg:flex-row ${step.num % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Screenshot placeholder */}
                <div className="flex w-full items-center justify-center rounded-xl border border-white/5 bg-deep-forest p-12 lg:w-1/2">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-teal/30 text-2xl font-bold text-teal">
                      {step.num}
                    </div>
                    <p className="mt-4 text-sm text-muted-dim">
                      Screenshot or GIF goes here
                    </p>
                  </div>
                </div>
                {/* Text */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-cream">
                      {step.num}
                    </span>
                    <h3 className="text-xl font-semibold text-cream">
                      {step.title}
                    </h3>
                  </div>
                  {step.keys && (
                    <div className="mt-3 flex gap-2">
                      <kbd className="rounded-md border border-white/10 bg-forest px-2.5 py-1 font-mono text-xs text-cream">
                        {step.keys}
                      </kbd>
                      <span className="text-xs text-muted-dim self-center">Mac</span>
                      <kbd className="rounded-md border border-white/10 bg-forest px-2.5 py-1 font-mono text-xs text-cream">
                        {step.keysWin}
                      </kbd>
                      <span className="text-xs text-muted-dim self-center">Windows</span>
                    </div>
                  )}
                  <p className="mt-3 text-base text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multi-Modal Annotation ── */}
      <section id="features" className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Captures What You Mean,
            <br />
            Not Just What You See
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Every other screenshot tool captures pixels. <VP /> captures intent.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {annotations.map((a) => (
              <div
                key={a.title}
                className="relative rounded-xl border border-white/5 bg-forest p-8"
              >
                {a.comingSoon && <ComingSoon variant="card" />}
                <div className="mb-4">{a.icon}</div>
                <h3 className="text-xl font-semibold text-cream">{a.title}</h3>
                <p className="mt-3 text-sm text-muted">{a.desc}</p>
                {a.subnote && (
                  <p className="mt-3 text-xs italic text-muted-dim">{a.subnote}</p>
                )}
                {a.example && (
                  <p className="mt-4 rounded-lg bg-deep-forest p-3 font-mono text-xs text-amber italic">
                    {a.example}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-teal/20 bg-forest p-6 text-center">
            <p className="text-sm text-muted">
              <span className="font-medium text-cream">
                Voice + caption today. Drawing returning soon.
              </span>{" "}
              Your narration travels with the screenshot it describes; your
              captions name each one; the full bundle is one paste away.
            </p>
          </div>
        </div>
      </section>

      {/* ── NEW: Give Your Developers Vision (Coming Soon) ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
            <h2 className="text-3xl font-bold text-cream sm:text-4xl">
              Give Your Developers Vision
            </h2>
            <ComingSoon variant="section" />
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-lg leading-relaxed">
            <p>
              Developers have AI coding agents that can build, fix, and
              refactor — but only when given precise context. That context
              usually lives in someone else&rsquo;s head.
            </p>
            <p>
              The PM who walked through the broken checkout flow. The designer
              who spotted the misaligned component. The QA tester who can
              reproduce the crash every time.
            </p>
            <p>
              They all see exactly what needs to happen. Until now, there was
              no good way to get that vision into the hands of the AI that can
              act on it. <VP /> is closing that gap.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {personas.map((p) => (
              <div
                key={p.role}
                className="rounded-xl border border-white/5 bg-deep-forest p-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber">
                  {p.role}
                </h3>
                <p className="mt-4 text-sm text-muted">{p.does}</p>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-dim">
                    What arrives in Claude Code
                  </p>
                  <p className="mt-2 text-sm text-cream">{p.delivers}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-base text-muted">
            No Loom videos someone has to watch and re-describe. No
            back-and-forth Slack threads. Just a narrated session — shared as
            a link, dragged into Claude Code, acted on.
          </p>
        </div>
      </section>

      {/* ── NEW: Share It. Ship It. (Coming Soon) ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
            <h2 className="text-3xl font-bold text-cream sm:text-4xl">
              Share It. Ship It.
            </h2>
            <ComingSoon variant="section" />
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-lg leading-relaxed">
            <p>
              When the session is ready, one button uploads it to the cloud
              and generates a private link.
            </p>
            <p>
              Send it to a developer. Drop it in Slack. Paste it in a ticket.
              The recipient opens the link, previews the session in their
              browser — screenshots, transcripts, narration, and metadata —
              then drags the markdown LLM Spec straight into Claude Code.
            </p>
            <p>
              No files to manage. No context to reconstruct. The LLM Spec is
              intact, structured, and ready to act on.
            </p>
          </div>

          {/* Three-step visual flow */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Record your session", sub: "screenshots + narration" },
              { label: "Save to Cloud", sub: "one click, private" },
              { label: "Share the link", sub: "developer → Claude Code → done" },
            ].map((step, i) => (
              <div
                key={step.label}
                className="relative rounded-xl border border-amber/20 bg-forest p-5 text-center"
              >
                <div className="mb-2 font-mono text-xs uppercase tracking-wider text-amber">
                  Step {i + 1}
                </div>
                <p className="text-base font-semibold text-cream">
                  {step.label}
                </p>
                <p className="mt-1 text-xs text-muted-dim">{step.sub}</p>
              </div>
            ))}
          </div>

          <blockquote className="mt-12 border-l-2 border-amber pl-6 text-lg italic text-cream-dim">
            &ldquo;The person who sees the problem and the AI that can fix it
            no longer need a developer translator in between.&rdquo;
          </blockquote>

          <p className="mt-8 text-center text-xs text-muted-dim">
            Sessions upload to Cloudflare R2 via a secure proxy. Links live at{" "}
            <code className="rounded bg-deep-forest px-1.5 py-0.5 font-mono text-muted">
              share.visionpipe.app
            </code>{" "}
            and are private by default. Each upload costs 50 credits ($0.50 at
            the base pack rate).
          </p>

          {/* Waitlist */}
          <div className="mx-auto mt-10 max-w-xl rounded-xl border border-amber/30 bg-forest p-6">
            <p className="text-center text-sm font-semibold text-cream">
              Get notified when Cloud Share ships.
            </p>
            <WaitlistForm feature="Cloud Share" className="mt-4" />
            <p className="mt-3 text-center text-xs text-muted-dim">
              We&rsquo;ll only email you about the launch. No marketing list.
            </p>
          </div>
        </div>
      </section>

      {/* ── Rich Metadata ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Your LLM Gets the Full Picture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            <VP /> doesn&rsquo;t just send a screenshot. It sends the complete
            context of where and what the image was captured from —
            automatically appended to every clipboard payload.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {metadataGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-white/5 bg-deep-forest p-6"
              >
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-teal">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.fields.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <span className="text-xs text-muted-dim">{label}</span>
                      <span className="font-mono text-xs text-cream">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-dim">
            Captured via macOS Accessibility API. Windows UI Automation on the
            roadmap.
          </p>
        </div>
      </section>

      {/* ── Competitive Comparison ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Every Other Tool Was Built for Humans
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            <VP /> was built for your AI — and the team around it.
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 font-semibold text-cream">Tool</th>
                  <th className="px-4 py-3 font-semibold text-cream">Built For</th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">LLM-Native</th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">Annotate at Capture</th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">Rich Metadata</th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">Markdown Deliverable</th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">
                    Team Sharing
                    <span className="ml-1 text-[10px] uppercase tracking-wider text-amber">soon</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr
                    key={i}
                    className={`border-b border-white/5 ${c.highlight ? "bg-teal/10" : ""}`}
                  >
                    <td className={`px-4 py-3 font-medium ${c.highlight ? "text-teal" : "text-cream"}`}>
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-muted">{c.builtFor}</td>
                    <td className="px-4 py-3 text-center">{renderCell(c.llmNative)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(c.annotate)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(c.metadata)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(c.markdown)}</td>
                    <td className="px-4 py-3 text-center">{renderCell(c.teamShare)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <blockquote className="mt-10 border-l-2 border-teal pl-6 text-lg text-muted italic">
            &ldquo;If Playwright gives your test suite vision, <VP /> gives{" "}
            <span className="text-cream">you</span> vision — and the rest of
            your team a way to share it.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Built the Right Way
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                label: "Tauri",
                desc: "Lightweight and secure — not Electron. Minimal memory footprint.",
              },
              {
                label: "Rust",
                desc: "Systems-level metadata capture, performance, and reliability.",
              },
              {
                label: "Apple Speech",
                desc: "On-device transcription via SFSpeechRecognizer. No audio leaves your machine.",
              },
            ].map((t) => (
              <div key={t.label} className="rounded-xl border border-white/5 bg-deep-forest p-6">
                <p className="font-mono text-lg font-semibold text-teal">
                  {t.label}
                </p>
                <p className="mt-2 text-sm text-muted">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Source ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Built in the Open
          </h2>
          <p className="mt-6 text-lg text-muted">
            <VP /> is source-available and community-driven. The code is
            visible, forkable, and we welcome pull requests.
          </p>

          <div className="mt-8 rounded-xl border border-white/5 bg-forest p-6 text-left font-mono text-sm">
            <p className="text-muted-dim"># Fork the repo</p>
            <p className="text-cream">git checkout -b feature/your-feature</p>
            <p className="text-cream">git commit -am &apos;Add your feature&apos;</p>
            <p className="text-muted-dim"># Open a Pull Request</p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/visionpipe"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-teal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-teal-light"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/visionpipe/visionpipe/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-teal/30 px-6 py-3 text-sm font-semibold text-cream transition hover:border-teal/60"
            >
              Contributing Guide
            </a>
          </div>

          <p className="mt-6 text-sm text-muted-dim">
            Questions? Open an{" "}
            <a
              href="https://github.com/visionpipe/visionpipe/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline transition hover:text-cream"
            >
              issue
            </a>{" "}
            or reach out on{" "}
            <a
              href="https://x.com/Vision_Pipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline transition hover:text-cream"
            >
              X @Vision_Pipe
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Stop Pasting Screenshots. Start Delivering LLM Specs.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Free for personal use. Open for contributions. Built for everyone
            who can see what needs to change.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="/downloads/VisionPipe.dmg"
              download
              className="inline-flex items-center gap-2 text-3xl font-semibold text-teal underline decoration-teal/40 underline-offset-4 transition hover:text-teal-light hover:decoration-teal-light/60"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for Mac
            </a>
            <CopyBlock
              lines={["brew tap visionpipe/visionpipe", "brew install --cask visionpipe"]}
              className="w-full max-w-md"
            />
            <p className="text-sm text-muted-dim">
              Apple Silicon today. Windows on the roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature List ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Everything It Does. Nothing It Doesn&rsquo;t.
          </h2>

          <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-teal">
            Shipping today
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shippedFeatures.map((f) => (
              <div key={f.label} className="flex gap-3 rounded-lg border border-white/5 bg-forest p-4">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-cream">{f.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-amber">
            Coming soon
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoonFeatures.map((f) => (
              <div key={f.label} className="flex gap-3 rounded-lg border border-amber/20 bg-forest p-4">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-cream">
                    {f.label}
                    <ComingSoon variant="inline" label="soon" />
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
