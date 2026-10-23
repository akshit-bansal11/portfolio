/*
 * ProfilePhoto.tsx
 * The profile photo as an object taped to the whiteboard: a paper card tilted a
 * few degrees, a hand-drawn frame stroke and a strip of tape. On hover it
 * straightens and lifts a little (instantly under reduced motion).
 */

import Image from "next/image";
import { PROFILE_IMAGE_HOVER_URL, PROFILE_NAME } from "@/data/heroContent";
import { sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import Tape from "./Tape";

// Frame stroke around the card (card aspect is 5:6, matching the viewBox).
const FRAME_PATH = sketchRect(-3, -3, 106, 126, { seed: 5, bow: 1.5 });

interface ProfilePhotoProps {
  /** Width classes; the card keeps its 5:6 aspect. */
  className?: string;
}

// Renders the taped photo card.
export default function ProfilePhoto({ className }: ProfilePhotoProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative aspect-5/6 -rotate-3 transition-transform duration-300",
        "hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none",
        className,
      )}
    >
      <div className="absolute inset-0 border border-hero-ink/15 bg-hero-surface p-2">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={PROFILE_IMAGE_HOVER_URL}
            alt={PROFILE_NAME}
            fill
            sizes="(min-width: 1024px) 256px, 192px"
            className="object-cover"
            draggable={false}
            priority
          />
        </div>
      </div>
      <svg
        aria-hidden
        viewBox="0 0 100 120"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-hero-pen"
      >
        <path
          d={FRAME_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <Tape seed={9} className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-2" />
    </div>
  );
}
