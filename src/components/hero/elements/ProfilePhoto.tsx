/*
 * ProfilePhoto.tsx
 * The profile photo as a polaroid taped to the whiteboard: off-white paper frame with a
 * faint warm vignette and a thicker bottom strip carrying a handwritten caption. The
 * cut-out portrait sits on a soft indigo-to-rose tint so it stands apart from the frame.
 * Tilted a few degrees; on hover it straightens and lifts a little (instantly under
 * reduced motion).
 */

import Image from "next/image";
import { PROFILE_IMAGE_HOVER_URL, PROFILE_NAME } from "@/data/heroContent";
import { cn } from "@/lib/utils";
import Tape from "./Tape";

// Handwritten caption on the bottom strip.
const CAPTION = "akshit · punjab";

interface ProfilePhotoProps {
  /** Width classes; the frame keeps its 5:6 aspect. */
  className?: string;
}

// Renders the taped polaroid.
export default function ProfilePhoto({ className }: ProfilePhotoProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative aspect-5/6 -rotate-3 bg-paper-card px-3 pb-14 pt-3 transition-transform duration-300",
        "hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none",
        className,
      )}
      style={{ boxShadow: "var(--note-shadow), inset 0 0 26px rgb(168 130 70 / 14%)" }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 38%, var(--polaroid-tint-1), var(--polaroid-tint-2))",
        }}
      >
        <Image
          src={PROFILE_IMAGE_HOVER_URL}
          alt={PROFILE_NAME}
          fill
          sizes="(min-width: 1280px) 300px, 260px"
          className="object-cover"
          draggable={false}
          priority
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 14%)" }}
        />
      </div>
      <p className="absolute inset-x-0 bottom-3 text-center font-hand text-2xl font-semibold leading-none text-note-ink">
        {CAPTION}
      </p>
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
    </div>
  );
}
