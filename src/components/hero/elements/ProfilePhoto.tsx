/*
 * ProfilePhoto.tsx
 * The profile photo as a polaroid taped to the whiteboard: paper-white frame
 * with a thicker bottom border, a strip of tape across the top, tilted a few
 * degrees. On hover it straightens and lifts a little (instantly under reduced
 * motion).
 */

import Image from "next/image";
import { PROFILE_IMAGE_HOVER_URL, PROFILE_NAME } from "@/data/heroContent";
import { cn } from "@/lib/utils";
import Tape from "./Tape";

interface ProfilePhotoProps {
  /** Width classes; the frame keeps its 5:6 aspect. */
  className?: string;
}

// Renders the taped polaroid.
export default function ProfilePhoto({ className }: ProfilePhotoProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative aspect-5/6 -rotate-3 bg-paper-card px-3 pb-12 pt-3 transition-transform duration-300",
        "hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none",
        className,
      )}
      style={{ boxShadow: "var(--note-shadow)" }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={PROFILE_IMAGE_HOVER_URL}
          alt={PROFILE_NAME}
          fill
          sizes="(min-width: 1280px) 256px, 208px"
          className="object-cover"
          draggable={false}
          priority
        />
      </div>
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
    </div>
  );
}
