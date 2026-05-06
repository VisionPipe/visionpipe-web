"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export type StepImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  // CSS object-position for the cropped thumbnail. Defaults to "center".
  // Use values like "right center", "left top" to focus on a specific region.
  collapsedObjectPosition?: string;
  // Additional zoom factor applied to the collapsed thumbnail. Default 1.
  // Combined with object-cover this crops in tighter on the focused region.
  collapsedScale?: number;
};

export default function ExpandableStepImage({ image }: { image: StepImage }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open preview: ${image.alt}`}
        className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/5 bg-deep-forest transition hover:border-teal/30"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover transition-transform duration-300"
          style={{
            objectPosition: image.collapsedObjectPosition ?? "center",
            transform: image.collapsedScale
              ? `scale(${image.collapsedScale})`
              : undefined,
          }}
          unoptimized
        />
      </button>

      {mounted && open
        ? createPortal(
            <ImageModal image={image} onClose={() => setOpen(false)} />,
            document.body,
          )
        : null}
    </>
  );
}

function ImageModal({
  image,
  onClose,
}: {
  image: StepImage;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm sm:p-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block"
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="90vw"
          className="block h-auto max-h-[88vh] w-auto max-w-[92vw] rounded-xl shadow-2xl"
          unoptimized
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          autoFocus
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-deep-forest text-cream shadow-lg transition hover:border-teal/60 hover:text-teal focus:outline-none focus:ring-2 focus:ring-teal/40"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
