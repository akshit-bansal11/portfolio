/*
 * ProfileCluster.tsx
 * The desktop profile group. Stages 2–3 show one centred composition (max 1080px): a big
 * polaroid on the left; on the right the name, role, "currently" list, "worked across"
 * stamps, then the resume button and social stickers, all at once. It slides in from the
 * right and holds. As the beliefs board arrives it cross-fades into `CompactProfile`, the
 * same content as one compact column (small polaroid on top) that slides into the left
 * cell of the stage-4 grid.
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import { Annotation } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { NAME_ACCENT_CLASS, PROFILE_NAME, PROFILE_NOTE, PROFILE_ROLE } from "@/data/heroContent";
import ProfileActions from "./ProfileActions";
import ProfileExtras from "./ProfileExtras";
import ProfilePhoto from "./ProfilePhoto";

// Public props for the cluster.
interface ProfileClusterProps {
  progress: MotionValue<number>;
}

// Pre-compute name halves so the gradient styling can target the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Progress distance over which the wide composition hands over to the compact column.
const HANDOVER = 0.03;

// True once the hero has reached the stage-4 hand-over (drives which layer is inert).
function useCompact(progress: MotionValue<number>) {
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(progress, "change", (latest) => {
    setCompact(latest >= HERO_STAGES.jumpto.range[0] + HANDOVER / 2);
  });
  return compact;
}

// Renders the wide profile composition (stages 2–3).
export default function ProfileCluster({ progress }: ProfileClusterProps) {
  const profile = HERO_STAGES.profile.range;
  const jumpto = HERO_STAGES.jumpto.range;
  const profileSettled = entryEnd(profile);
  const compact = useCompact(progress);

  // Enter from the right and fade in.
  const enterX = useTransform(progress, [profile[0], profileSettled], ["55vw", "0vw"]);
  const enterOpacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);
  // Hand-over to the compact column.
  const wideOpacity = useTransform(progress, [jumpto[0], jumpto[0] + HANDOVER], [1, 0]);

  return (
    <motion.div
      style={{ x: enterX, opacity: enterOpacity }}
      className="pointer-events-none absolute inset-0 will-change-transform"
    >
      <motion.div
        style={{ opacity: wideOpacity }}
        aria-hidden={compact}
        inert={compact}
        className="absolute inset-0 flex items-center justify-center px-8"
      >
        <div className="flex w-full max-w-[1080px] items-center justify-center gap-12 xl:gap-16">
          <div className="relative shrink-0">
            {/* Handwritten "that's me" note, arrow pointing down at the photo. */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-full left-0 mb-1 -rotate-3"
            >
              <Annotation
                kind="arrow"
                direction="down"
                label={PROFILE_NOTE}
                seed={7}
                className="text-3xl font-semibold"
              />
            </div>
            <ProfilePhoto className="w-[260px] xl:w-[300px]" />
          </div>

          <div className="flex min-w-0 flex-col items-start gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-[-0.01em] whitespace-nowrap xl:text-6xl">
                <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
                <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
              </h1>
              <h2 className="font-grotesk text-base font-normal text-hero-muted xl:text-lg">
                {PROFILE_ROLE}
              </h2>
            </div>
            <ProfileExtras className="pointer-events-auto" />
            <ProfileActions />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Renders the stage-4 left column: the profile content, compact, polaroid on top.
export function CompactProfile({ progress }: ProfileClusterProps) {
  const jumpto = HERO_STAGES.jumpto.range;
  const jumptoSettled = entryEnd(jumpto);
  const compact = useCompact(progress);

  // Fade in as the wide composition fades out, drifting in from where its text column sat.
  const opacity = useTransform(progress, [jumpto[0], jumpto[0] + HANDOVER], [0, 1]);
  const x = useTransform(progress, [jumpto[0], jumptoSettled], ["22vw", "0vw"]);

  return (
    <motion.div
      style={{ opacity, x }}
      aria-hidden={!compact}
      inert={!compact}
      className="flex w-full max-w-[360px] flex-col items-start gap-3 will-change-transform"
    >
      <ProfilePhoto className="w-[clamp(130px,22vh,200px)] self-center" />
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.01em] whitespace-nowrap">
          <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
          <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
        </p>
        <p className="font-grotesk text-sm text-hero-muted">{PROFILE_ROLE}</p>
      </div>
      <ProfileExtras compact className="pointer-events-auto" />
      <ProfileActions />
    </motion.div>
  );
}
