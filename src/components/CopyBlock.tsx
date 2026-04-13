"use client";

import { useState } from "react";

export default function CopyBlock({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-start gap-3 rounded-xl border border-teal/30 bg-deep-forest px-5 py-3.5 font-mono text-sm transition hover:border-teal/60 hover:bg-deep-forest/80 ${className}`}
    >
      <div className="flex flex-col gap-1 text-left">
        {lines.map((line, i) => (
          <div key={i}>
            <span className="text-muted">$ </span>
            <span className="text-cream">{line}</span>
          </div>
        ))}
      </div>
      <span className="ml-auto mt-1 text-muted transition group-hover:text-cream">
        {copied ? (
          <svg className="h-4 w-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}
