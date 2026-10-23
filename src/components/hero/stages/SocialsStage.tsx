/*
 * SocialsStage.tsx
 * Hero stage 3 — resume link + social icons rise from
 * the bottom while the profile shrinks upward, then
 * the whole group slides left during stage 4 (jumpto).
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { useState } from "react";
import { Annotation } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { SOCIALS_NOTE } from "@/data/heroContent";
import { type HeroSocialLink, heroSocialLinks } from "@/data/heroSocialLinks";
import ResumeButton from "../elements/ResumeButton";
import SocialIcon from "../elements/SocialIcon";

// Public props for the stage.
interface SocialsStageProps {
  progress: MotionValue<number>;
}

// Per-icon props for one social button.
interface SocialItemProps extends HeroSocialLink {
  progress: MotionValue<number>;
  itemStart: number;
  itemEnd: number;
}

// Renders one staggered social icon.
function SocialItem({ progress, itemStart, itemEnd, href, name, Icon }: SocialItemProps) {
  // Per-icon rise + fade tied to its slice of the entry span.
  const y = useTransform(progress, [itemStart, itemEnd], [36, 0]);
  const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1]);

  return (
    <motion.div style={{ y, opacity }}>
      <SocialIcon href={href} label={name} Icon={Icon} />
    </motion.div>
  );
}

// Renders the full socials stage layout (resume + icon row).
export default function SocialsStage({ progress }: SocialsStageProps) {
  // Stage 3 progress range / span.
  const [start] = HERO_STAGES.socials.range;
  const settled = entryEnd(HERO_STAGES.socials.range);
  const entrySpan = settled - start;

  // Stage 4 thresholds drive the left-slide of this whole group.
  const jumptoStart = HERO_STAGES.jumpto.range[0];
  const jumptoSettled = entryEnd(HERO_STAGES.jumpto.range);

  // ── Rise from bottom during socials entry ─────────────────────────
  const containerOpacity = useTransform(
    progress,
    [start, start + entrySpan * 0.3, settled, 1],
    [0, 1, 1, 1],
  );
  const containerY = useTransform(progress, [start, settled, 1], ["80px", "0px", "0px"]);

  // ── Slide left during jumpto entry ────────────────────────────────
  const containerX = useTransform(
    progress,
    [jumptoStart, jumptoSettled, 1],
    ["0vw", "-28vw", "-28vw"],
  );

  // Resume button leads the reveal during the first 35% of the entry span.
  const resumeEnd = start + entrySpan * 0.35;
  const resumeOpacity = useTransform(progress, [start, resumeEnd], [0, 1]);
  const resumeY = useTransform(progress, [start, resumeEnd], [28, 0]);

  // The "say hello" note leaves before the board slides in beside the icons.
  const noteOpacity = useTransform(
    progress,
    [jumptoStart, jumptoStart + (jumptoSettled - jumptoStart) * 0.4],
    [1, 0],
  );

  // The note's strokes only start drawing once the icons have arrived.
  const [isNoteDrawn, setIsNoteDrawn] = useState(false);
  useMotionValueEvent(progress, "change", (latest) => {
    if (latest >= settled) setIsNoteDrawn(true);
  });

  return (
    <motion.div
      style={{ opacity: containerOpacity, y: containerY, x: containerX }}
      className="pointer-events-none absolute inset-x-0 bottom-16 md:bottom-20 flex flex-col items-center gap-3 md:gap-4"
    >
      {/* Resume link */}
      <motion.div style={{ opacity: resumeOpacity, y: resumeY }} className="pointer-events-auto">
        <ResumeButton />
      </motion.div>

      {/* Social icons row */}
      <div className="relative">
        {/* Handwritten "say hello" note, arrow pointing back at the icons. */}
        {isNoteDrawn && (
          <motion.div
            aria-hidden
            style={{ opacity: noteOpacity }}
            className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 -rotate-2 whitespace-nowrap"
          >
            <Annotation
              kind="arrow"
              direction="left"
              label={SOCIALS_NOTE}
              seed={9}
              className="text-3xl font-semibold"
            />
          </motion.div>
        )}
        <div className="flex gap-1 pointer-events-auto">
          {/* Each icon gets its own staggered reveal window. */}
          {heroSocialLinks.map(({ Icon, href, name }, index) => {
            const itemStart = start + entrySpan * (0.2 + index * 0.1);
            const itemEnd = Math.min(settled, itemStart + entrySpan * 0.22);
            return (
              <SocialItem
                key={href}
                progress={progress}
                itemStart={itemStart}
                itemEnd={itemEnd}
                href={href}
                name={name}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
