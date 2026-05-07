import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CopyBlock from "@/components/CopyBlock";

export const metadata: Metadata = {
  title: "Download — Vision|Pipe",
  description:
    "Download Vision|Pipe for Mac. Free for personal use. Lightweight, open source, on-device.",
};

export default function DownloadPage() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Image
          src="/images/visionpipe-logo-no-background.png"
          alt="Vision|Pipe logo"
          width={120}
          height={120}
          className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl">
          Download Vision<span className="text-amber">|</span>Pipe
        </h1>
        <p className="mt-4 font-mono text-base text-teal sm:text-lg">
          screenshot | llm — now a reality.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted">
          Free for personal use. Voice transcription runs on-device — your
          audio doesn&rsquo;t leave your Mac.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4">
          <a
            href="/downloads/VisionPipe.dmg"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-6 py-3 text-lg font-semibold text-cream transition hover:bg-teal-light"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download for Mac
          </a>

          <p className="text-sm uppercase tracking-wider text-muted-dim">
            or install via Homebrew
          </p>

          <CopyBlock
            lines={[
              "brew tap visionpipe/visionpipe",
              "brew install --cask visionpipe",
            ]}
            className="w-full max-w-md"
          />

          <p className="mt-4 text-sm text-muted-dim">
            Apple Silicon today. Windows on the roadmap.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3 text-sm text-muted sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="https://github.com/visionpipe"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-cream"
          >
            View on GitHub →
          </a>
          <Link href="/pricing" className="transition hover:text-cream">
            Pricing →
          </Link>
          <Link href="/" className="transition hover:text-cream">
            ← Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
