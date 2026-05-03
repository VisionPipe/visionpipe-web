import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CreditPacksSection } from "@/components/CreditPacksSection";

export const metadata: Metadata = {
  title: "Pricing — Vision|Pipe",
  description:
    "Vision|Pipe is free for personal use. Commercial licenses available for businesses and revenue-generating workflows.",
};

function VP() {
  return <>Vision<span className="text-teal">|</span>Pipe</>;
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
          Buy Credits
        </a>
        . Each credit pack includes a commercial license for the credits you
        purchase.
      </>
    ),
  },
  {
    q: "Do I need an account or API key?",
    a: (
      <>
        No. <VP /> runs entirely on your machine with no cloud dependency. There
        are no accounts, no API keys, and no data ever leaves your device (voice
        transcription is on-device via Whisper).
      </>
    ),
  },
  {
    q: "What platforms are supported?",
    a: "Mac (macOS 13 Ventura and later) and Windows (Windows 10 build 19041+). Linux support is on the roadmap.",
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
                Commercial
              </h2>
              <p className="mt-4 text-4xl font-bold text-cream">
                Let&rsquo;s talk
              </p>
              <p className="mt-2 text-sm text-muted">
                Flexible pricing for teams and businesses.
              </p>
            </div>

            <ul className="mt-8 flex-1 space-y-3">
              {[
                "Use at a business or company",
                "Revenue-generating products or workflows",
                "Client work and consulting",
                "Commercial websites and applications",
                "Priority support and guidance",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber"
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
            Free for personal use. No accounts, no API keys, no cloud
            dependency.
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
