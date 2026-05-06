"use client";

import Image from "next/image";
import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

const ROTATE_INTERVAL_MS = 4000;
const COLLAPSE_DELAY_MS = 800;

const lastSentence = "Your LLM will thank you for the clarity of vision.";

type ExpandableImage = {
  minimizedSrc: string;
  fullSrc: string;
  alt: string;
  // Natural pixel dimensions of fullSrc. The carousel expands its container
  // to this exact aspect when this step is active+expanded so the image fits
  // without cropping.
  fullWidth: number;
  fullHeight: number;
};

type TestimonialData = {
  logoSrc: string;
  logoAlt: string;
  quote: ReactNode;
  attribution: ReactNode;
  // When provided, the testimonial becomes click-to-expand: the source
  // screenshot replaces the quote in the box.
  proofImageSrc?: string;
  proofImageAlt?: string;
  proofImageWidth?: number;
  proofImageHeight?: number;
};

type Step = {
  num: number;
  sentence: ReactNode;
  content?: ReactNode;
  expandable?: ExpandableImage;
  testimonial?: TestimonialData;
};

const steps: Step[] = [
  {
    num: 1,
    sentence: (
      <>
        Use Vision<span className="text-amber">|</span>Pipe to capture and
        narrate screenshots.
      </>
    ),
    expandable: {
      minimizedSrc: "/images/screenshots/app-session-split-view-minimized.png",
      fullSrc: "/images/screenshots/app-session-split-view.png",
      alt: "Vision|Pipe session view showing two screenshots with split-pane narration",
      fullWidth: 3402,
      fullHeight: 2142,
    },
  },
  {
    num: 2,
    sentence: "Turn your screenshots and narration into an LLM Spec with 1-click.",
    expandable: {
      minimizedSrc: "/images/screenshots/finder-session-folder-minimized.png",
      fullSrc: "/images/screenshots/finder-session-folder.png",
      alt: "Finder window showing the saved Vision|Pipe session folder structure",
      fullWidth: 2892,
      fullHeight: 846,
    },
  },
  {
    num: 3,
    sentence: "The LLM Spec turns your images and narration into machine readable output.",
    expandable: {
      minimizedSrc: "/images/screenshots/markdown-llm-spec-output-minimized.png",
      fullSrc: "/images/screenshots/markdown-llm-spec-output.png",
      alt: "Editor showing the rendered transcript.md LLM Spec output",
      fullWidth: 3392,
      fullHeight: 2154,
    },
  },
  {
    num: 4,
    sentence: (
      <>
        Vision<span className="text-amber">|</span>Pipe also sends detailed
        metadata to the LLM
      </>
    ),
    expandable: {
      minimizedSrc: "/images/screenshots/json-sidecar-output-minimized.png",
      fullSrc: "/images/screenshots/json-sidecar-output.png",
      alt: "Editor showing the structured JSON sidecar output with detailed metadata",
      fullWidth: 2818,
      fullHeight: 2140,
    },
  },
  {
    num: 5,
    sentence: lastSentence,
    testimonial: {
      logoSrc: "/images/brand/claude-code.svg",
      logoAlt: "Claude Code",
      quote: (
        <>
          &ldquo;This format is roughly 3–5× more useful to me than a prompt
          describing the same request. I&rsquo;d happily take VisionPipe
          specs as input over text-only prompts.&rdquo;
        </>
      ),
      attribution: (
        <>
          Claude Code (Opus 4.7), evaluating a Vision
          <span className="text-amber">|</span>Pipe LLM Spec
        </>
      ),
      proofImageSrc: "/images/screenshots/claude-code-evaluating-llm-spec.png",
      proofImageAlt: "Claude Code session evaluating a Vision|Pipe LLM Spec, including the testimonial quote",
      proofImageWidth: 2506,
      proofImageHeight: 1898,
    },
  },
  {
    num: 6,
    sentence: lastSentence,
    testimonial: {
      logoSrc: "/images/brand/codex.svg",
      logoAlt: "OpenAI Codex",
      quote: (
        <>
          &ldquo;This is 2–5× more useful than a text-only prompt. In some
          cases closer to 10× when the prompt is vague. VisionPipe gives me
          grounded, multimodal product feedback in a format that is fast to
          parse.&rdquo;
        </>
      ),
      attribution: (
        <>
          OpenAI Codex (GPT 5.4), evaluating a Vision
          <span className="text-amber">|</span>Pipe LLM Spec
        </>
      ),
      proofImageSrc: "/images/screenshots/codex-evaluating-llm-spec.png",
      proofImageAlt: "OpenAI Codex session evaluating a Vision|Pipe LLM Spec",
      proofImageWidth: 1514,
      proofImageHeight: 1398,
    },
  },
];

function Testimonial({
  logoSrc,
  logoAlt,
  quote,
  attribution,
}: {
  logoSrc: string;
  logoAlt: string;
  quote: ReactNode;
  attribution: ReactNode;
}) {
  return (
    <div className="flex h-full items-center gap-6 px-6 sm:gap-8 sm:px-10">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-16 sm:w-16">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={64}
          height={64}
          className="h-full w-full"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-xs leading-relaxed text-cream sm:text-sm md:text-base">
          {quote}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-dim sm:text-xs">
          — {attribution}
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous step" : "Next step"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-deep-forest text-muted transition hover:border-teal/50 hover:text-cream sm:h-10 sm:w-10"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

function ExpandableTestimonial({
  testimonial,
  expanded,
  onToggle,
}: {
  testimonial: TestimonialData;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Collapse source screenshot" : "Show source screenshot"}
      aria-expanded={expanded}
      className="relative block h-full w-full cursor-pointer overflow-hidden text-left"
    >
      {/* Testimonial layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          expanded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={expanded}
      >
        <Testimonial
          logoSrc={testimonial.logoSrc}
          logoAlt={testimonial.logoAlt}
          quote={testimonial.quote}
          attribution={testimonial.attribution}
        />
      </div>

      {/* Proof image layer (only rendered when there's a proof image) */}
      {testimonial.proofImageSrc && (
        <Image
          src={testimonial.proofImageSrc}
          alt={testimonial.proofImageAlt ?? ""}
          fill
          sizes="(min-width: 768px) 800px, 100vw"
          className={`object-contain transition-opacity duration-300 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
          unoptimized
        />
      )}
    </button>
  );
}

function ExpandableImageBox({
  expandable,
  expanded,
  onToggle,
}: {
  expandable: ExpandableImage;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Collapse preview" : "Expand preview"}
      aria-expanded={expanded}
      className="relative block h-full w-full cursor-pointer overflow-hidden"
    >
      {/* Both images render so swap is instantaneous. Crossfade between them. */}
      <Image
        src={expandable.minimizedSrc}
        alt=""
        fill
        sizes="(min-width: 768px) 800px, 100vw"
        className={`object-cover object-top transition-opacity duration-300 ${
          expanded ? "opacity-0" : "opacity-100"
        }`}
        priority
        unoptimized
      />
      <Image
        src={expandable.fullSrc}
        alt={expandable.alt}
        fill
        sizes="(min-width: 768px) 800px, 100vw"
        className={`object-contain transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
        unoptimized
      />
      {/* Bottom fade gradient — only when collapsed, signaling there's more */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep-forest via-deep-forest/70 to-transparent transition-opacity duration-300 ${
          expanded ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCollapse = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const scheduleCollapse = () => {
    cancelCollapse();
    collapseTimerRef.current = setTimeout(() => {
      setExpanded(false);
      collapseTimerRef.current = null;
    }, COLLAPSE_DELAY_MS);
  };

  // Re-arm rotation timer on every slide change (manual or auto).
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % steps.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [paused, activeIndex]);

  // When changing slides, only force-collapse if the new slide can't expand.
  // Otherwise (next slide also has a full image), keep expansion open so the
  // user can flip through expanded views with the arrow buttons.
  useEffect(() => {
    cancelCollapse();
    const newStep = steps[activeIndex];
    const nextStepCanExpand =
      !!newStep.expandable || !!newStep.testimonial?.proofImageSrc;
    if (!nextStepCanExpand) {
      setExpanded(false);
    }
  }, [activeIndex]);

  // Cleanup timer on unmount.
  useEffect(() => () => cancelCollapse(), []);

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + steps.length) % steps.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % steps.length);

  // Compute expanded aspect ratio based on the active step's image dimensions.
  // Falls back to 3/2 if the step has no natural dimensions.
  const expandedAspectRatio = (() => {
    const step = steps[activeIndex];
    if (step.expandable) {
      return `${step.expandable.fullWidth} / ${step.expandable.fullHeight}`;
    }
    if (
      step.testimonial?.proofImageWidth &&
      step.testimonial?.proofImageHeight
    ) {
      return `${step.testimonial.proofImageWidth} / ${step.testimonial.proofImageHeight}`;
    }
    return "3 / 2";
  })();

  return (
    <div
      className="mx-auto mt-12 max-w-4xl"
      onMouseEnter={() => {
        setPaused(true);
        cancelCollapse();
      }}
      onMouseLeave={() => {
        setPaused(false);
        scheduleCollapse();
      }}
      onFocus={() => {
        setPaused(true);
        cancelCollapse();
      }}
      onBlur={() => {
        setPaused(false);
        scheduleCollapse();
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="How Vision|Pipe works"
    >
      {/* Arrows + slide stack in a row */}
      <div className="flex items-center gap-3 sm:gap-4">
        <ArrowButton direction="prev" onClick={goPrev} />

        <div
          className="relative flex-1 overflow-hidden rounded-xl border border-white/5 bg-deep-forest transition-[aspect-ratio] duration-300 ease-out"
          style={{ aspectRatio: expanded ? expandedAspectRatio : "4 / 1" }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeIndex
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== activeIndex}
            >
              {step.expandable ? (
                <ExpandableImageBox
                  expandable={step.expandable}
                  expanded={expanded}
                  onToggle={() => setExpanded((p) => !p)}
                />
              ) : step.testimonial ? (
                step.testimonial.proofImageSrc ? (
                  <ExpandableTestimonial
                    testimonial={step.testimonial}
                    expanded={expanded}
                    onToggle={() => setExpanded((p) => !p)}
                  />
                ) : (
                  <Testimonial
                    logoSrc={step.testimonial.logoSrc}
                    logoAlt={step.testimonial.logoAlt}
                    quote={step.testimonial.quote}
                    attribution={step.testimonial.attribution}
                  />
                )
              ) : step.content ? (
                step.content
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="px-6 text-base text-muted-dim">
                    Image for step {step.num} goes here
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <ArrowButton direction="next" onClick={goNext} />
      </div>

      {/* Sentence below image */}
      <p className="mt-6 min-h-[2.5rem] text-center text-lg font-bold text-cream">
        {steps[activeIndex].sentence}
      </p>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-3">
        {steps.map((step, i) => (
          <button
            key={step.num}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to step ${step.num}`}
            aria-current={i === activeIndex ? "true" : undefined}
            className={`h-3 w-3 rounded-full border transition ${
              i === activeIndex
                ? "border-teal bg-teal"
                : "border-muted-dim bg-transparent hover:border-teal"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
