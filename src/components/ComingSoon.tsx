type Variant = "section" | "card" | "inline";

const variantClasses: Record<Variant, string> = {
  section:
    "inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber",
  card:
    "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber",
  inline:
    "ml-1.5 inline-flex items-center rounded-full border border-amber/30 bg-amber/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber",
};

export default function ComingSoon({
  variant = "section",
  label = "Coming soon",
  className = "",
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  return <span className={`${variantClasses[variant]} ${className}`}>{label}</span>;
}
