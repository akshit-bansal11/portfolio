/*
 * SocialsStage.tsx
 * Hero stage 3 — the resume link and the social stickers, one row at the foot of the
 * profile composition. They rise and fade in as the stage begins; the parent cluster
 * handles all horizontal movement.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
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

  // Resume button leads the reveal during the first 35% of the entry span.
  const resumeEnd = start + entrySpan * 0.35;
  const resumeOpacity = useTransform(progress, [start, resumeEnd], [0, 1]);
  const resumeY = useTransform(progress, [start, resumeEnd], [20, 0]);

  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-4">
      <motion.div style={{ opacity: resumeOpacity, y: resumeY }}>
        <ResumeButton />
      </motion.div>
      <div className="flex gap-2 pb-6">
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
  );
}
