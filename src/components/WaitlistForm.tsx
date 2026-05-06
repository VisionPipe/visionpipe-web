"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm({
  feature,
  className = "",
}: {
  feature: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feature }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
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
        disabled={status === "submitting"}
        placeholder="you@team.com"
        className="flex-1 rounded-lg border border-white/10 bg-deep-forest px-4 py-2.5 text-sm text-cream placeholder:text-muted-dim focus:border-teal/50 focus:outline-none focus:ring-1 focus:ring-teal/30 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal-light disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Notify me"}
      </button>
      {status === "error" && errorMsg && (
        <p className="text-xs text-sienna sm:basis-full">{errorMsg}</p>
      )}
    </form>
  );
}
