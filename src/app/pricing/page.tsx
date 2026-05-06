import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CreditPacksSection } from "@/components/CreditPacksSection";

export const metadata: Metadata = {
  title: "Pricing — Vision|Pipe",
  description:
    "Vision|Pipe is free for personal use. Commercial licenses available for businesses and revenue-generating workflows.",
};

function VP() {
  return <>Vision<span className="text-amber">|</span>Pipe</>;
}

const faqs: { q: ReactNode; a: ReactNode }[] = [
  {
    q: "What counts as commercial use?",
    a: (
      <>
        Any use of <VP /> in a workflow, product, or service that generates
        revenue — directly or indirectly. This includes use at a business or
        company, building revenue-generating products, client work and
        consulting where you bill for output, and commercial websites or
        applications.
      </>
    ),
  },
  {
    q: (
      <>
        Is <VP /> open source?
      </>
    ),
    a: (
      <>
        <VP /> is source-available under a Revenue-Trigger License (PolyForm
        Noncommercial 1.0.0). The code is visible and forkable on GitHub. It is
        free for personal and non-commercial use. A commercial license is
        required for business use.
      </>
    ),
  },
  {
    q: (
      <>
        Can I contribute to <VP />?
      </>
    ),
    a: "Absolutely. We welcome pull requests. Fork the repo, create a feature branch, and open a PR. See our CONTRIBUTING.md on GitHub for development setup instructions.",
  },
  {
    q: "How do I get a commercial license?",
    a: (
      <>
        <a
          href="#credit-packs"
          className="text-cream underline hover:text-teal"
        >
          Buy a credit pack
        </a>
        . Each credit costs $0.01 and includes a commercial license for the
        work you send. No subscription, no per-seat fees.
      </>
    ),
  },
  {
    q: "Do I need an account or API key?",
    a: (
      <>
        For local use, no — no account, no API keys, nothing leaves your Mac.
        Voice transcription runs on-device via Apple Speech.{" "}
        <span className="text-cream-dim">
          (An account is required for the upcoming Cloud Share feature, which
          lets you upload sessions to a private link for teammates to view.)
        </span>
      </>
    ),
  },
  {
    q: "What platforms are supported?",
    a: "Mac (Apple Silicon, macOS 13 Ventura and later) ships today. Windows and Linux support are on the roadmap.",
  },
  {
    q: (
      <>
        How does Cloud Share work?{" "}
        <span className="ml-1 inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-amber">
          Coming soon
        </span>
      </>
    ),
    a: (
      <>
        Record a session, click &ldquo;Save to Cloud,&rdquo; and <VP /> uploads
        the full session — screenshots, transcripts, narration — to secure
        cloud storage. You receive a private link at{" "}
        <code className="rounded bg-forest px-1.5 py-0.5 font-mono text-xs text-cream-dim">
          share.visionpipe.app
        </code>
        . Anyone with the link can preview the session in their browser or
        download the markdown brief. Each upload costs 50 credits ($0.50).{" "}
        <a
          href="/#features"
          className="text-cream underline hover:text-teal"
        >
          Get on the waitlist →
        </a>
      </>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-cream sm:text-5xl">
            Free for Developers.
            <br />
            Commercial License for Business.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            <VP /> uses a Revenue-Trigger License. The payment obligation is
            triggered by revenue — not intent. If you&rsquo;re not making money
            with it, you don&rsquo;t pay.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base text-teal">
            1 credit = $0.01. Pay only for what you actually send.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {/* Free tier */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-deep-forest p-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-teal">
                Personal &amp; Open Source
              </h2>
              <p className="mt-4 text-4xl font-bold text-cream">Free</p>
              <p className="mt-2 text-sm text-muted">Forever. No limits.</p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {[
                "Local-only use is always free — no account, no credits required",
                "Personal projects and hobby work",
                "Learning and experimentation",
                "Open source contributions",
                "Non-profit and educational use",
                "Any work that does not generate revenue",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://github.com/visionpipe/visionpipe/releases"
              className="mt-8 block rounded-lg bg-teal px-6 py-3 text-center text-sm font-semibold text-cream transition hover:bg-teal-light"
            >
              Download Now
            </a>
          </div>

          {/* Commercial tier */}
          <div className="flex flex-col rounded-2xl border border-amber/30 bg-deep-forest p-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber">
                Pay-as-you-go credits
              </h2>
              <p className="mt-4 text-4xl font-bold text-cream">
                $0.01<span className="text-lg text-muted"> / credit</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                Each credit covers a piece of work you send. Take as many
                screenshots as you want, re-record audio, delete what you
                don&rsquo;t like — none of it costs anything until you click{" "}
                <span className="font-semibold text-cream">Copy &amp; Send</span>.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-forest/40">
                    <th className="px-3 py-2 text-left font-semibold text-cream">
                      What you sent
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-cream">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  {[
                    ["1 screenshot, no audio", "1 credit ($0.01)"],
                    ["3 screenshots, 5s narration", "3 credits ($0.03)"],
                    ["5 screenshots, 47s narration", "9 credits ($0.09)"],
                    ["1 screenshot, 2 min narration", "12 credits ($0.12)"],
                  ].map(([what, cost]) => (
                    <tr key={what} className="border-b border-white/5 last:border-0">
                      <td className="px-3 py-2">{what}</td>
                      <td className="px-3 py-2 text-right font-mono text-cream">
                        {cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-muted-dim">
              First 10 seconds of audio per session is free. After that,
              1 credit per 10 seconds (rounded up). On-device transcription
              is always free — your audio doesn&rsquo;t leave your Mac.
            </p>

            <a
              href="#credit-packs"
              className="mt-8 block rounded-lg border border-amber/30 px-6 py-3 text-center text-sm font-semibold text-cream transition hover:border-amber/60 hover:bg-amber/10"
            >
              View Credit Packs ↓
            </a>
          </div>
        </div>
      </section>

      <CreditPacksSection />

      {/* FAQ */}
      <section className="border-t border-white/5 bg-deep-forest px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-cream">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 space-y-8">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-cream">{faq.q}</h3>
                <p className="mt-2 text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-cream">
            Ready to give your LLM eyes?
          </h2>
          <p className="mt-4 text-muted">
            Local-only use is always free.{" "}
            <span className="text-cream-dim">Cloud Share (coming soon) is opt-in.</span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/visionpipe/visionpipe/releases"
              className="rounded-lg bg-teal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-teal-light"
            >
              Download Now
            </a>
            <a
              href="#credit-packs"
              className="rounded-lg border border-teal/30 px-6 py-3 text-sm font-semibold text-cream transition hover:border-teal/60"
            >
              Buy Credits
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
