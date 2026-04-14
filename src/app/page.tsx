import Image from "next/image";
import CopyBlock from "@/components/CopyBlock";

function VP() {
  return <>Vision<span className="text-teal">|</span>Pipe</>;
}

const steps = [
  {
    num: 1,
    keys: "Cmd+Shift+C",
    keysWin: "Ctrl+Shift+C",
    title: "Press your hotkey",
    desc: "One keystroke activates the capture overlay. No menus, no clicks. Default is Cmd+Shift+C (Mac) / Ctrl+Shift+C (Windows) — configurable to whatever you prefer.",
  },
  {
    num: 2,
    title: "Select a region",
    desc: "Drag to capture any area of your screen. Full screen or surgical precision.",
  },
  {
    num: 3,
    title: "Annotate your intent",
    desc: "Speak it, type it, or draw it. Voice, text, and markup — all at the moment of capture.",
  },
  {
    num: 4,
    title: "Hit Enter",
    desc: "Screenshot + annotation + rich metadata are bundled into one clipboard payload.",
  },
  {
    num: 5,
    title: "Paste into any LLM",
    desc: "GPT-4, Claude, Gemini, Codex — any AI that accepts images. Your LLM gets it right on the first try.",
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
    desc: (<>Record a voice note alongside your screenshot. <VP /> transcribes it automatically using on-device Whisper and bundles the transcript with the image.</>),
    example: '"This dropdown is rendering below the viewport on Safari — why?"',
  },
  {
    icon: (
      <svg className="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Type It",
    desc: "Add a written comment at the exact moment of capture. Your intent travels with the image as a single payload.",
    example: "Why is this button misaligned in dark mode?",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Draw It",
    desc: "Circle the problem. Highlight the element. Draw an arrow. A lightweight markup layer so your LLM knows exactly what to focus on.",
    example: null,
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

const competitors = [
  {
    name: "Playwright",
    builtFor: "Programmatic browser automation",
    llmNative: false,
    annotate: false,
    metadata: "Partial",
  },
  {
    name: "Zight / CleanShot X",
    builtFor: "Sharing with humans",
    llmNative: false,
    annotate: "Post-capture",
    metadata: false,
  },
  {
    name: "Snagit",
    builtFor: "Documentation & tutorials",
    llmNative: false,
    annotate: "Post-capture",
    metadata: false,
  },
  {
    name: "macOS Screenshot",
    builtFor: "General capture",
    llmNative: false,
    annotate: false,
    metadata: false,
  },
  {
    name: <VP />,
    builtFor: "Piping visual context into LLMs",
    llmNative: true,
    annotate: "At capture",
    metadata: true,
    highlight: true,
  },
];

function Check() {
  return (
    <svg className="mx-auto h-5 w-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            Give your LLM eyes.
          </h1>
          <p className="mt-4 font-mono text-lg text-teal sm:text-xl">
            screenshot | llm — now a reality.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Vision<span className="text-teal">|</span>Pipe is a lightweight open source utility that captures your
            screen and pipes it, along with your voice, text, or visual
            annotations plus rich contextual metadata, directly into any LLM.
          </p>
          <p className="mt-2 text-base text-muted-dim">
            Built for developers who think in pipes.
          </p>

          {/* CTA cluster */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <CopyBlock lines={["brew tap visionpipe/visionpipe", "brew install --cask visionpipe"]} className="w-full max-w-md" />
            <a
              href="https://github.com/VisionPipe/visionpipe/releases/download/v0.1.0/VisionPipe_0.1.0_aarch64.dmg"
              className="inline-flex items-center gap-2 text-xl font-semibold text-teal underline decoration-teal/40 underline-offset-4 transition hover:text-teal-light hover:decoration-teal-light/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for Mac
            </a>
            <p className="text-sm text-muted-dim">Windows support coming soon</p>
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

      {/* ── Problem ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            The Loop You&rsquo;re Stuck In
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            <p>
              You&rsquo;re working with an AI and need to show it what&rsquo;s on
              your screen. You describe it in words. It misunderstands. You
              describe again. Repeat.
            </p>
            <p>
              Every time you type{" "}
              <span className="text-cream">
                &ldquo;the button in the top right of the modal&rdquo;
              </span>{" "}
              instead of just pointing at it, you&rsquo;re paying a productivity
              tax that compounds across every debugging session, every code
              review, every UI bug report you file.
            </p>
            <p className="text-cream font-medium">
              The gap between what you see and what your AI understands is
              costing you hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Vision<span className="text-teal">|</span>Pipe Skips the Description
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed">
            <p>
              Capture the screen. Annotate however feels natural — speak it, type
              it, or draw it. Paste the full context — image, annotation, and
              metadata — into your LLM in one action.
            </p>
            <p className="text-cream font-medium">
              No uploads. No integrations. No UI sprawl.
            </p>
            <p>
              Just the Unix philosophy applied to AI vision: do one thing, do it
              well, compose it with everything else.
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
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                Vision|Pipe
              </p>
              <div className="mt-4 space-y-2 font-mono text-sm text-cream">
                <p>Capture + Comment</p>
                <p className="text-teal">&darr;</p>
                <p>Paste</p>
                <p className="text-teal">&darr;</p>
                <p>Submit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Five Steps. One Keystroke.
          </h2>
          <div className="mt-16 space-y-16">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`flex flex-col items-center gap-8 lg:flex-row ${step.num % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Screenshot placeholder */}
                <div className="flex w-full items-center justify-center rounded-xl border border-white/5 bg-forest p-12 lg:w-1/2">
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
      <section id="features" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Captures What You Mean,
            <br />
            Not Just What You See
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Every other screenshot tool captures pixels. Vision<span className="text-teal">|</span>Pipe captures
            intent.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {annotations.map((a) => (
              <div
                key={a.title}
                className="rounded-xl border border-white/5 bg-deep-forest p-8"
              >
                <div className="mb-4">{a.icon}</div>
                <h3 className="text-xl font-semibold text-cream">{a.title}</h3>
                <p className="mt-3 text-sm text-muted">{a.desc}</p>
                {a.example && (
                  <p className="mt-4 rounded-lg bg-forest p-3 font-mono text-xs text-amber italic">
                    {a.example}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-teal/20 bg-deep-forest p-6 text-center">
            <p className="text-sm text-muted">
              <span className="font-medium text-cream">All three, combined.</span>{" "}
              Voice, text, and drawing can be used simultaneously. The full
              context is bundled into one clipboard payload. Paste once — your AI
              has everything.
            </p>
          </div>
        </div>
      </section>

      {/* ── Rich Metadata ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Your LLM Gets the Full Picture
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Vision<span className="text-teal">|</span>Pipe doesn&rsquo;t just send a screenshot. It sends the
            complete context of where and what the image was captured from —
            automatically appended to every clipboard payload.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {metadataGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-xl border border-white/5 bg-forest p-6"
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
            Captured via macOS Accessibility API and Windows UI Automation. No
            browser extension required.
          </p>
        </div>
      </section>

      {/* ── Competitive Comparison ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Every Other Tool Was Built for Humans
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
            Vision<span className="text-teal">|</span>Pipe was built for your AI.
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 font-semibold text-cream">Tool</th>
                  <th className="px-4 py-3 font-semibold text-cream">
                    Built For
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">
                    LLM-Native
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">
                    Annotate at Capture
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-cream">
                    Rich Metadata
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr
                    key={c.name}
                    className={`border-b border-white/5 ${c.highlight ? "bg-teal/10" : ""}`}
                  >
                    <td
                      className={`px-4 py-3 font-medium ${c.highlight ? "text-teal" : "text-cream"}`}
                    >
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-muted">{c.builtFor}</td>
                    <td className="px-4 py-3 text-center">
                      {c.llmNative === true ? (
                        <Check />
                      ) : (
                        <Cross />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.annotate === true || c.annotate === "At capture" ? (
                        <div>
                          <Check />
                          <span className="mt-0.5 block text-xs text-teal">
                            Voice, text, drawing
                          </span>
                        </div>
                      ) : c.annotate === "Post-capture" ? (
                        <span className="text-xs text-muted-dim">
                          Post-capture only
                        </span>
                      ) : (
                        <Cross />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {c.metadata === true ? (
                        <Check />
                      ) : c.metadata === "Partial" ? (
                        <span className="text-xs text-muted-dim">Partial</span>
                      ) : (
                        <Cross />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <blockquote className="mt-10 border-l-2 border-teal pl-6 text-lg text-muted italic">
            &ldquo;If Playwright gives your test suite vision, Vision<span className="text-teal">|</span>Pipe gives{" "}
            <span className="text-cream">you</span> vision.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
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
                label: "Whisper",
                desc: "On-device transcription — no audio leaves your machine.",
              },
            ].map((t) => (
              <div key={t.label} className="rounded-xl border border-white/5 bg-forest p-6">
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
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Built in the Open
          </h2>
          <p className="mt-6 text-lg text-muted">
            Vision<span className="text-teal">|</span>Pipe is source-available and community-driven. The code is
            visible, forkable, and we welcome pull requests.
          </p>

          <div className="mt-8 rounded-xl border border-white/5 bg-deep-forest p-6 text-left font-mono text-sm">
            <p className="text-muted-dim"># Fork the repo</p>
            <p className="text-cream">
              git checkout -b feature/your-feature
            </p>
            <p className="text-cream">
              git commit -am &apos;Add your feature&apos;
            </p>
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
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-4xl">
            Stop Describing. Start Showing.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Free for personal use. Open for contributions. Built for developers.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <CopyBlock
              lines={["brew tap visionpipe/visionpipe", "brew install --cask visionpipe"]}
              className="w-full max-w-md"
            />
            <a
              href="https://github.com/VisionPipe/visionpipe/releases/download/v0.1.0/VisionPipe_0.1.0_aarch64.dmg"
              className="inline-flex items-center gap-2 text-xl font-semibold text-teal underline decoration-teal/40 underline-offset-4 transition hover:text-teal-light hover:decoration-teal-light/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Download for Mac
            </a>
            <p className="text-sm text-muted-dim">Windows support coming soon</p>
          </div>
        </div>
      </section>

      {/* ── Feature List (SEO-friendly) ── */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-cream sm:text-4xl">
            Everything It Does. Nothing It Doesn&rsquo;t.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Lightweight", desc: "Minimal CPU and memory footprint — Tauri, not Electron" },
              { label: "Fast", desc: "Capture and copy in milliseconds" },
              { label: "Multi-modal", desc: "Voice, text, and drawing annotation in one tool" },
              { label: "Auto-transcription", desc: "Voice notes converted to text on-device via Whisper" },
              { label: "Rich metadata", desc: "Spatial, window, browser, and system context bundled automatically" },
              { label: "Open source", desc: "See exactly what you're running" },
              { label: "Cross-platform", desc: "Mac and Windows" },
              { label: "Keyboard-first", desc: "One hotkey does everything" },
              { label: "LLM-agnostic", desc: "Works with any AI that accepts images" },
              { label: "No accounts", desc: "No API keys, no logins, no cloud dependency" },
              { label: "Clipboard-native", desc: "Composes naturally with every LLM UI on the planet" },
            ].map((f) => (
              <div key={f.label} className="flex gap-3 rounded-lg border border-white/5 bg-deep-forest p-4">
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
        </div>
      </section>
    </>
  );
}
