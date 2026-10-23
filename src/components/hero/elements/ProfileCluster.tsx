/*
 * ProfileCluster.tsx
 * The desktop profile group: polaroid with handwritten context beside it, then the
 * name, role, resume link and social stickers directly underneath. It slides in
 * from the right, holds, drops its side notes and slides left to make room for
 * the board on the right.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { Annotation } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { NAME_ACCENT_CLASS, PROFILE_NAME, PROFILE_NOTE, PROFILE_ROLE } from "@/data/heroContent";
import SocialsStage from "../stages/SocialsStage";
import ProfileExtras from "./ProfileExtras";
import ProfilePhoto from "./ProfilePhoto";

// Public props for the cluster.
interface ProfileClusterProps {
  progress: MotionValue<number>;
}

// Pre-compute name halves so the gradient styling can target the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Renders the entire profile group across all four hero stages.
export default function ProfileCluster({ progress }: ProfileClusterProps) {
  // Pull stage ranges and their settled points for transform math.
  const profile = HERO_STAGES.profile.range;
  const jumpto = HERO_STAGES.jumpto.range;

  const profileSettled = entryEnd(profile);
  const jumptoSettled = entryEnd(jumpto);

  // Horizontal motion: enter from right, hold center, slide left for jumpto.
  const x = useTransform(
    progress,
    [profile[0], profileSettled, jumpto[0], jumptoSettled, 1],
    ["55vw", "0vw", "0vw", "-28vw", "-28vw"],
  );
  // The handwritten notes beside the photo leave as the board arrives.
  const sideOpacity = useTransform(progress, [jumpto[0], jumpto[0] + 0.03], [1, 0]);
  // Fade in at profile entry.
  const opacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);

  return (
    <motion.div
      style={{ x, opacity }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 will-change-transform"
    >
      <div className="relative">
        {/* Handwritten "that's me" note, arrow pointing down at the photo. */}
        <motion.div
          aria-hidden
          style={{ opacity: sideOpacity }}
          className="pointer-events-none absolute -left-36 -top-14 -rotate-3"
        >
          <Annotation
            kind="arrow"
            direction="down-right"
            label={PROFILE_NOTE}
            seed={7}
            className="text-3xl font-semibold"
          />
        </motion.div>

        <ProfilePhoto className="w-44 lg:w-48 xl:w-56" />

        {/* Context beside the photo; absolutely placed so the group stays centred. */}
        <motion.div
          style={{ opacity: sideOpacity }}
          className="pointer-events-none absolute left-full top-4 ml-10 w-72"
        >
          <ProfileExtras />
        </motion.div>
      </div>

      {/* ── Name + role ─────────────────────────────────────── */}
      <div className="mt-3 flex flex-col items-center gap-1 text-center">
        <h1 className="font-display font-bold tracking-[-0.02em] whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-6xl leading-[0.95]">
          <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
          <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
        </h1>
        <h2 className="font-grotesk text-sm sm:text-base md:text-lg text-hero-muted font-normal whitespace-nowrap">
          {PROFILE_ROLE}
        </h2>
      </div>

      <SocialsStage progress={progress} />
    </motion.div>
  );
}
