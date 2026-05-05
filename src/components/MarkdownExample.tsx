"use client";

import { useState } from "react";

export default function MarkdownExample({
  content,
  filename = "transcript.md",
  className = "",
}: {
  content: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-deep-forest ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-forest/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sienna/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
          <span className="ml-3 font-mono text-xs text-muted-dim">{filename}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-muted transition hover:border-teal/50 hover:text-cream"
          aria-label="Copy markdown"
        >
          {copied ? (
            <>
              <svg
                className="h-3.5 w-3.5 text-teal"
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
              Copied
            </>
          ) : (
            <>
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-cream-dim">
        <code>{content}</code>
      </pre>
    </div>
  );
}
