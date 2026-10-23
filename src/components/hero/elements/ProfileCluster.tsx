/*
 * ProfileCluster.tsx
 * The desktop profile group, one centred composition (max 1080px): a big polaroid on
 * the left; on the right the name, role, "currently" list, "worked across" stamps, then
 * the resume button and social stickers. It slides in from the right and holds. As the
 * beliefs board arrives it cross-fades into a compact left column (small polaroid, name,
 * role, resume, socials; the extras are gone) which slides left to make room.
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import { Annotation } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { NAME_ACCENT_CLASS, PROFILE_NAME, PROFILE_NOTE, PROFILE_ROLE } from "@/data/heroContent";
import { heroSocialLinks } from "@/data/heroSocialLinks";
import SocialsStage from "../stages/SocialsStage";
import ProfileExtras from "./ProfileExtras";
import ProfilePhoto from "./ProfilePhoto";
import ResumeButton from "./ResumeButton";
import SocialIcon from "./SocialIcon";

// Public props for the cluster.
interface ProfileClusterProps {
  progress: MotionValue<number>;
}

// Pre-compute name halves so the gradient styling can target the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Progress distance over which the wide composition hands over to the compact column.
const HANDOVER = 0.03;

// Renders the entire profile group across all four hero stages.
export default function ProfileCluster({ progress }: ProfileClusterProps) {
  // Pull stage ranges and their settled points for transform math.
  const profile = HERO_STAGES.profile.range;
  const jumpto = HERO_STAGES.jumpto.range;

  const profileSettled = entryEnd(profile);
  const jumptoSettled = entryEnd(jumpto);

  // Which of the two layers is live (the other is inert and hidden from assistive tech).
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(progress, "change", (latest) => {
    setCompact(latest >= jumpto[0] + HANDOVER / 2);
  });

  // Enter from the right and fade in.
  const enterX = useTransform(progress, [profile[0], profileSettled], ["55vw", "0vw"]);
  const enterOpacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);

  // Hand-over between the wide composition and the compact column.
  const wideOpacity = useTransform(progress, [jumpto[0], jumpto[0] + HANDOVER], [1, 0]);
  const compactOpacity = useTransform(progress, [jumpto[0], jumpto[0] + HANDOVER], [0, 1]);
  // The compact column slides left to make room for the board.
  const compactX = useTransform(progress, [jumpto[0], jumptoSettled, 1], ["0vw", "-28vw", "-28vw"]);

  return (
    <motion.div
      style={{ x: enterX, opacity: enterOpacity }}
      className="pointer-events-none absolute inset-0 will-change-transform"
    >
      {/* ── Wide composition (stages 2–3) ───────────────────── */}
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
            <SocialsStage progress={progress} />
          </div>
        </div>
      </motion.div>

      {/* ── Compact column (stage 4) ────────────────────────── */}
      <motion.div
        style={{ opacity: compactOpacity, x: compactX }}
        aria-hidden={!compact}
        inert={!compact}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      >
        <ProfilePhoto className="w-44 xl:w-52" />
        <div className="mt-3 flex flex-col items-center gap-1 text-center">
          <p className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.01em] whitespace-nowrap xl:text-5xl">
            <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
            <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
          </p>
          <p className="font-grotesk text-sm text-hero-muted whitespace-nowrap xl:text-base">
            {PROFILE_ROLE}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <ResumeButton />
          <div className="flex gap-2 pb-6">
            {heroSocialLinks.map((link, index) => (
              <SocialIcon key={link.href} {...link} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
