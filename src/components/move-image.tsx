"use client";

import { useState } from "react";

const CATEGORY_EMOJI: Record<string, string> = {
  Power: "💥",
  Submission: "🦵",
  "High-Flying": "🪂",
  Signature: "🎯",
};

interface MoveImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Renders a move image with a styled fallback if the URL fails to load.
 */
export default function MoveImage({ src, alt, category, className = "", imgClassName = "" }: MoveImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-4xl" aria-hidden>
            {CATEGORY_EMOJI[category] ?? "🤼"}
          </span>
          <span className="max-w-[80%] truncate text-xs font-bold uppercase tracking-widest text-zinc-500">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${imgClassName} ${className}`}
    />
  );
}
