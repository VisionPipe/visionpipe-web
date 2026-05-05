"use client";

import { useState } from "react";

// NOTE: This is a temporary mailto-based stub. A proper API route
// (POST /api/waitlist writing to a Drizzle table) is a planned follow-up.
// The visible UX is identical to what a real form would look like.
export default function WaitlistForm({
  feature,
  className = "",
}: {
  feature: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent(`${feature} waitlist`);
    const body = encodeURIComponent(
      `Notify me when ${feature} ships.\n\nEmail: ${email}`,
    );
    window.location.href = `mailto:hello@visionpipe.ai?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className={`text-sm text-teal ${className}`}>
        Thanks — we&rsquo;ll let you know when {feature} ships.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col items-stretch gap-2 sm:flex-row sm:items-center ${className}`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@team.com"
        className="flex-1 rounded-lg border border-white/10 bg-deep-forest px-4 py-2.5 text-sm text-cream placeholder:text-muted-dim focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/30"
      />
      <button
        type="submit"
        className="rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal-light"
      >
        Notify me
      </button>
    </form>
  );
}
