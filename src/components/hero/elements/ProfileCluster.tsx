/*
 * ProfileCluster.tsx
 * Profile cluster handling the full hero lifecycle.
 * Slides in, shrinks upward as the socials arrive,
 * and slides left to make room for the board on the right.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { Annotation } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { NAME_ACCENT_CLASS, PROFILE_NAME, PROFILE_NOTE, PROFILE_ROLE } from "@/data/heroContent";
import ProfilePhoto from "./ProfilePhoto";

// Public props for the cluster.
interface ProfileClusterProps {
  progress: MotionValue<number>;
}

// Pre-compute name halves so the gradient styling can target the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Renders the entire profile cluster across all four hero stages.
export default function ProfileCluster({ progress }: ProfileClusterProps) {
  // Pull stage ranges and their settled points for transform math.
  const profile = HERO_STAGES.profile.range;
  const socials = HERO_STAGES.socials.range;
  const jumpto = HERO_STAGES.jumpto.range;

  const profileSettled = entryEnd(profile);
  const socialsSettled = entryEnd(socials);
  const jumptoSettled = entryEnd(jumpto);

  // Horizontal motion: enter from right, hold center, slide left for jumpto.
  const x = useTransform(
    progress,
    [profile[0], profileSettled, jumpto[0], jumptoSettled, 1],
    ["55vw", "0vw", "0vw", "-28vw", "-28vw"],
  );
  // Vertical motion: drift upward as socials begin to make space.
  const y = useTransform(
    progress,
    [profile[0], profile[1], socialsSettled, 1],
    ["0vh", "0vh", "-15vh", "-15vh"],
  );
  // The handwritten note leaves as the socials stage begins.
  const noteOpacity = useTransform(progress, [socials[0], socials[0] + 0.03], [1, 0]);
  // Fade in at profile entry.
  const opacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);
  // Subtle scale: grow during entry, shrink during socials.
  const scale = useTransform(
    progress,
    [profile[0], profileSettled, profile[1], socialsSettled, 1],
    [0.85, 1, 1, 0.8, 0.8],
  );

  return (
    <motion.div
      style={{ x, y, opacity, scale }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 will-change-transform"
    >
      {/* Handwritten "that's me" note, arrow pointing down at the photo. */}
      <motion.div
        aria-hidden
        style={{ opacity: noteOpacity }}
        className="pointer-events-none absolute left-[calc(50%-14rem)] top-[calc(50%-16rem)] -rotate-3"
      >
        <Annotation
          kind="arrow"
          direction="down-right"
          label={PROFILE_NOTE}
          seed={7}
          className="text-3xl font-semibold"
        />
      </motion.div>

      <ProfilePhoto className="w-52 md:w-56 xl:w-64" />

      {/* ── Name + role ─────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-display font-bold tracking-[-0.03em] whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
          <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
          <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
        </h1>
        <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl text-hero-muted font-light whitespace-nowrap">
          {PROFILE_ROLE}
        </h2>
      </div>
    </motion.div>
  );
}
