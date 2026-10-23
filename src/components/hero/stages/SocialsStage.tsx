/*
 * SocialsStage.tsx
 * Hero stage 3 — the resume link and the social stickers, laid out as part of
 * the profile group (directly under the role line). They rise and fade in as the
 * stage begins; the parent cluster handles all horizontal movement.
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

// Per-icon props for one social sticker.
interface SocialItemProps extends HeroSocialLink {
  progress: MotionValue<number>;
  index: number;
  itemStart: number;
  itemEnd: number;
}

// Renders one staggered social sticker.
function SocialItem({ progress, itemStart, itemEnd, ...link }: SocialItemProps) {
  // Per-icon rise + fade tied to its slice of the entry span.
  const y = useTransform(progress, [itemStart, itemEnd], [24, 0]);
  const opacity = useTransform(progress, [itemStart, itemEnd], [0, 1]);

  return (
    <motion.div style={{ y, opacity }}>
      <SocialIcon {...link} />
    </motion.div>
  );
}

// Renders the socials stage layout (resume + sticker row).
export default function SocialsStage({ progress }: SocialsStageProps) {
  // Stage 3 progress range / span.
  const [start] = HERO_STAGES.socials.range;
  const settled = entryEnd(HERO_STAGES.socials.range);
  const entrySpan = settled - start;

  // Stage 4 start: the "say hello" note leaves before the board slides in.
  const jumptoStart = HERO_STAGES.jumpto.range[0];
  const jumptoSettled = entryEnd(HERO_STAGES.jumpto.range);

  // Resume button leads the reveal during the first 35% of the entry span.
  const resumeEnd = start + entrySpan * 0.35;
  const resumeOpacity = useTransform(progress, [start, resumeEnd], [0, 1]);
  const resumeY = useTransform(progress, [start, resumeEnd], [20, 0]);

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
    <div className="flex flex-col items-center gap-2">
      <motion.div style={{ opacity: resumeOpacity, y: resumeY }} className="pointer-events-auto">
        <ResumeButton />
      </motion.div>

      <div className="relative">
        {/* Handwritten "say hello" note, arrow pointing back at the stickers. */}
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
        <div className="pointer-events-auto flex gap-2 pb-6">
          {/* Each sticker gets its own staggered reveal window. */}
          {heroSocialLinks.map((link, index) => {
            const itemStart = start + entrySpan * (0.2 + index * 0.1);
            const itemEnd = Math.min(settled, itemStart + entrySpan * 0.22);
            return (
              <SocialItem
                key={link.href}
                {...link}
                index={index}
                progress={progress}
                itemStart={itemStart}
                itemEnd={itemEnd}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
