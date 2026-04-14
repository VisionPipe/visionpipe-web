"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-deep-forest/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/visionpipe-logo-no-background.png"
            alt="Vision|Pipe"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold text-cream">
            Vision<span className="text-teal">|Pipe</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm text-muted transition hover:text-cream"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted transition hover:text-cream"
          >
            Pricing (free for personal use)
          </Link>
          <a
            href="https://github.com/visionpipe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted transition hover:text-cream"
          >
            GitHub
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <a
            href="/#hero"
            className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-cream transition hover:bg-teal-light"
          >
            Download
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-cream transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-cream transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-white/5 bg-deep-forest px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/#features"
              className="text-sm text-muted transition hover:text-cream"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted transition hover:text-cream"
              onClick={() => setMenuOpen(false)}
            >
              Pricing (free for personal use)
            </Link>
            <a
              href="https://github.com/visionpipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition hover:text-cream"
              onClick={() => setMenuOpen(false)}
            >
              GitHub ↗
            </a>
            <a
              href="/#hero"
              className="inline-block rounded-lg bg-teal px-4 py-2 text-center text-sm font-medium text-cream transition hover:bg-teal-light"
              onClick={() => setMenuOpen(false)}
            >
              Download
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
