/*
 * ScrollHero.tsx
 * Single responsive hero component.
 *
 * Mobile / tablet (< lg):
 *   A plain stacked section — badge, tagline, profile photo,
 *   name, role, resume link, socials, beliefs. No scroll magic.
 *
 * Desktop (≥ lg):
 *   Pinned, four-stage scroll-driven hero canvas. Owns the
 *   scroll-progress source, mounts each stage (tagline, profile,
 *   socials, jumpto) plus the doodle layer and scroll cue, and reports
 *   completion to the context.
 */

"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { Annotation } from "@/components/blog/Annotation";
import ScrollReveal from "@/components/effects/ScrollReveal";
import {
  entryEnd,
  HERO_HORIZONTAL_END,
  HERO_SCROLL_LENGTH_VH,
  HERO_STAGES,
} from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import { NAME_ACCENT_CLASS, PROFILE_NAME, PROFILE_NOTE, PROFILE_ROLE } from "@/data/heroContent";
import { heroSocialLinks } from "@/data/heroSocialLinks";
import { useHeroScrollProgress } from "@/hooks/use-hero-scroll-progress";
import WhiteboardDoodles from "./backdrop/WhiteboardDoodles";
import AkshitBansalBadge from "./elements/AkshitBansalBadge";
import BeliefsBoard, { ScrollBeliefsBoard } from "./elements/BeliefsBoard";
import JumpToPanel from "./elements/JumpToPanel";
import ProfileCluster from "./elements/ProfileCluster";
import ProfileExtras from "./elements/ProfileExtras";
import ProfilePhoto from "./elements/ProfilePhoto";
import ResumeButton from "./elements/ResumeButton";
import ScrollIndicator, { ScrollCue } from "./elements/ScrollIndicator";
import SocialIcon from "./elements/SocialIcon";
import TaglineDisplay from "./elements/TaglineDisplay";
import TaglineStage from "./stages/TaglineStage";

// Pre-compute name halves for the gradient styling on the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Renders the full pinned scroll hero (desktop) plus a static mobile layout.
export default function ScrollHero() {
  // Tall wrapper ref + 0..1 progress driving every desktop stage.
  const { wrapperRef, progress } = useHeroScrollProgress();
  const { isWelcomeComplete, isHeroComplete, setHeroComplete } = useAnimation();

  // Mark the hero "complete" once progress crosses the horizontal end threshold.
  useMotionValueEvent(progress, "change", (latest) => {
    const shouldBeComplete = latest >= HERO_HORIZONTAL_END;
    if (shouldBeComplete !== isHeroComplete) {
      setHeroComplete(shouldBeComplete);
    }
  });

  // ── Stage 4 flex layout (desktop) ───────────────────────────────────
  const jumptoRange = HERO_STAGES.jumpto.range;
  const jumptoStart = jumptoRange[0];
  const jumptoSettled = entryEnd(jumptoRange);
  const entrySpan = jumptoSettled - jumptoStart;
  const stage4X = useTransform(progress, [jumptoStart, jumptoSettled, 1], ["60vw", "0vw", "0vw"]);
  const stage4Opacity = useTransform(
    progress,
    [jumptoStart, jumptoStart + entrySpan * 0.25, jumptoSettled],
    [0, 0.9, 1],
  );

  return (
    <>
      {/* ── Mobile / tablet layout (hidden on lg+) ────────────────────────
				    Plain static stack — no scroll driver needed. All content
				    renders immediately at its settled visual state.              */}
      <section
        id="profile"
        aria-label="Hero introduction"
        className="hero-scope relative z-0 w-full overflow-hidden lg:hidden"
      >
        {/* ── Stage 1: Badge + Tagline (Centered in Viewport) ── */}
        <div className="relative w-full min-h-svh flex flex-col items-center justify-center px-6 py-12 text-center">
          <WhiteboardDoodles />
          <div className="relative flex flex-col items-center gap-6">
            <AkshitBansalBadge active={true} />
            <TaglineDisplay />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <ScrollCue />
          </div>
        </div>

        {/* ── Stage 2: Profile photo + name + role + socials (Reveals on Scroll) ── */}
        <div className="w-full min-h-svh flex flex-col items-center justify-center px-6 py-12 text-center">
          <ScrollReveal direction="up" delay={50} className="w-full flex justify-center">
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Handwritten note pointing down at the photo. */}
              <Annotation
                kind="arrow"
                direction="down"
                label={PROFILE_NOTE}
                seed={7}
                className="-mb-2 -rotate-3 text-2xl font-semibold"
              />
              <ProfilePhoto className="w-44 sm:w-52" />

              {/* Name + role */}
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="font-display font-medium tracking-[-0.01em] whitespace-nowrap text-4xl sm:text-5xl leading-[0.95]">
                  <span className="text-hero-ink">{FIRST_NAME}</span>{" "}
                  <span className={NAME_ACCENT_CLASS}>{LAST_NAME}</span>
                </h1>
                <p className="font-grotesk text-sm sm:text-base text-hero-muted whitespace-normal text-balance max-w-xs">
                  {PROFILE_ROLE}
                </p>
              </div>

              <ResumeButton />

              {/* Social icons */}
              <div className="flex gap-2 pb-6">
                {heroSocialLinks.map((link, index) => (
                  <SocialIcon key={link.href} {...link} index={index} />
                ))}
              </div>

              <ProfileExtras className="w-full max-w-xs" />
            </div>
          </ScrollReveal>
        </div>

        {/* ── Stage 3: What I believe in (sticky notes, ticks draw on view) ── */}
        <div className="w-full flex justify-center px-6 pb-16">
          <div className="w-full max-w-md">
            <BeliefsBoard />
          </div>
        </div>
      </section>

      {/* ── Desktop layout (hidden below lg) ─────────────────────────────
				    Pinned, four-stage scroll-driven hero canvas.              */}
      <section
        id="profile"
        ref={wrapperRef}
        className="hero-scope relative w-full hidden lg:block"
        style={{ height: `${HERO_SCROLL_LENGTH_VH}vh` }}
        aria-label="Hero introduction"
      >
        {/* Pinned, viewport-sized inner canvas; the whiteboard shows through. */}
        <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
          {/* Hand-drawn doodles around the edges, drifting with the scroll. */}
          <WhiteboardDoodles progress={progress} />

          {/* The four hero stages — each consumes the same scroll progress. */}
          <TaglineStage progress={progress} active={isWelcomeComplete} />
          <ProfileCluster progress={progress} />

          {/* ── Stage 4: Three-column flex layout ────────────────────────
					     Uses justify-between so the beliefs board naturally centres
					     between the left profile/socials region and the right
					     jump-to index. Each column is a flex item. */}
          <motion.div
            style={{ x: stage4X, opacity: stage4Opacity }}
            className="absolute inset-0 flex items-center justify-between px-8 md:px-12 lg:px-16 pointer-events-none z-20"
          >
            {/* Left spacer — matches the space occupied by profile + socials */}
            <div className="w-[28vw] shrink-0" />

            {/* Centre — beliefs board */}
            <div className="flex items-center justify-center flex-1">
              <ScrollBeliefsBoard progress={progress} />
            </div>

            {/* Right — Jump to panel */}
            <div className="shrink-0">
              <JumpToPanel />
            </div>
          </motion.div>

          {/* Scroll cue: draws in, bobs, and fades for good once the hero starts moving. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <ScrollIndicator progress={progress} />
          </div>
        </div>
      </section>
    </>
  );
}
