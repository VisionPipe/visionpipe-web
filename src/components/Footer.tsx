import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-deep-forest">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="text-lg font-semibold text-cream">
              Vision<span className="text-amber">|</span>Pipe
            </span>
            <p className="mt-3 text-sm text-muted">
              The missing link between your screen and your AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
              Product
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/visionpipe/visionpipe/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  Downloads
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
              Community
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://github.com/visionpipe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/visionpipe/visionpipe/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Vision_Pipe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  X / Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
              Contact
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hello@visionpipe.ai"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  hello@visionpipe.ai
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/visionpipe/visionpipe/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition hover:text-cream"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-dim">
              Built with the Unix philosophy: do one thing, do it well.
            </p>
            <p className="text-sm text-muted-dim">
              &copy; {new Date().getFullYear()} Vision<span className="text-amber">|</span>Pipe. Free for personal
              use.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
