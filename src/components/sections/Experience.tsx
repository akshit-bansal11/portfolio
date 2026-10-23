/*
 * Experience.tsx
 * Experience section as a hand-drawn timeline with tabs (work, internships, training). The
 * active category shows a wavy line that draws itself with the scroll (fully drawn under
 * reduced motion), a circle node per entry that fills once the line reaches it, the entry's
 * date handwritten beside the node, and every entry as a taped index card.
 */

"use client";

import { motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import ExperienceCard from "@/components/experience/ExperienceCard";
import ScrollSection from "@/components/layout/ScrollSection";
import { type ExperienceCategory, experience } from "@/data/experienceData";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchArrow, sketchEllipse, sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/experience";

// Small arrow from the handwritten aside toward the heading.
const ASIDE_ARROW = sketchArrow(46, 6, 4, 22, { seed: 63, curve: 0.3, headSize: 7 });

// Written tab names, keyed by the data's category title.
const CATEGORY_LABELS: Record<string, string> = {
  Work: "work",
  Internship: "internships",
  Training: "training",
};

// Tiny five-point star beside "now".
const STAR = "M6 1l1.5 3.5L11 5 8.3 7.5 9 11 6 9.2 3 11l.7-3.5L1 5l3.5-.5z";

// Hand-drawn node outline.
const NODE = sketchEllipse(10, 10, 7, 7, { seed: 41, jitter: 0.5 });

// Hand-drawn underline of the active tab.
const TAB_UNDERLINE = sketchLine(2, 5, 98, 4, { seed: 7, bow: 1.5 });

// Distance between wiggles of the timeline.
const WAVE_STEP = 48;

// A vertical wavy line of the given height, centred on x = 10.
function wavePath(height: number): string {
  let d = "M10 0";
  for (let i = 0, y = 0; y < height; i += 1, y += WAVE_STEP) {
    const x = 10 + (i % 2 ? 3.5 : -3.5) * (0.7 + 0.3 * Math.sin(i * 2.1));
    d += ` Q${x.toFixed(1)} ${y + WAVE_STEP / 2} 10 ${y + WAVE_STEP}`;
  }
  return d;
}

interface EntryProps {
  item: ExperienceItem;
  index: number;
}

// One timeline row: node on the rail, date and the card.
function Entry({ item, index }: EntryProps) {
  const reduceMotion = useReducedMotion();
  const nodeRef = useRef<SVGSVGElement>(null);
  const reached = useInView(nodeRef, { once: true, margin: "0px 0px -30% 0px" });
  const filled = reduceMotion || reached;
  const isNow = item.date.endsWith("Present");

  return (
    <motion.li
      className="relative pl-10 md:pl-[132px]"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 5) * 0.07 }}
    >
      <motion.svg
        ref={nodeRef}
        aria-hidden
        viewBox="0 0 20 20"
        className="absolute left-4 top-14 h-5 w-5 -translate-x-1/2 overflow-visible text-hero-ink md:left-[100px] md:top-9"
        animate={filled && !reduceMotion ? { scale: [1, 1.4, 1] } : undefined}
        transition={{ duration: 0.5 }}
      >
        <path
          d={NODE}
          strokeWidth={2}
          strokeLinecap="round"
          stroke="currentColor"
          className={cn(
            "transition-colors duration-300",
            filled ? "fill-hero-pen" : "fill-hero-bg",
          )}
        />
      </motion.svg>
      <p className="mb-2 flex items-center gap-2 font-hand text-xl font-semibold leading-tight text-hero-muted md:absolute md:left-0 md:top-8 md:mb-0 md:w-[84px] md:flex-col md:items-end md:gap-0 md:text-right">
        <span>{item.date}</span>
        {isNow && (
          <span className="inline-flex items-center gap-1 text-hero-pen">
            <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 overflow-visible">
              <path
                d={STAR}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
            now
          </span>
        )}
      </p>
      <ExperienceCard item={item} index={index} />
    </motion.li>
  );
}

// The wavy line and the entries of one category; remounted per tab so it restarts.
function Timeline({ category }: { category: ExperienceCategory }) {
  const [trackRef, size] = useElementSize<HTMLDivElement>();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <div ref={trackRef} className="relative">
      {size.height > 0 && (
        <svg
          aria-hidden
          width={20}
          height={size.height}
          viewBox={`0 0 20 ${size.height}`}
          className="pointer-events-none absolute left-4 top-0 -translate-x-1/2 overflow-visible text-hero-ink md:left-[100px]"
        >
          <path
            d={wavePath(size.height)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <motion.path
            d={wavePath(size.height)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ pathLength: reduceMotion ? 1 : scrollYProgress }}
          />
        </svg>
      )}
      <ol className="flex flex-col gap-14">
        {category.items.map((item, index) => (
          <Entry key={`${item.company}-${item.date}`} item={item} index={index} />
        ))}
      </ol>
    </div>
  );
}

// Top-level Experience section component.
export default function Experience() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const category = experience[active];

  // Left/Right wrap, Home/End jump; focus follows selection.
  const onKeyDown = (e: KeyboardEvent) => {
    const last = experience.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % experience.length
        : e.key === "ArrowLeft"
          ? (active + last) % experience.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <ScrollSection id="experience" className="gap-10 md:gap-12 lg:gap-14">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <h2 className="font-display text-5xl font-medium tracking-[-0.01em] text-hero-ink md:text-6xl lg:text-7xl">
          Experience
        </h2>
        <p className="flex items-center gap-1 pb-2 font-hand text-3xl font-semibold leading-none text-hero-pen">
          <svg aria-hidden viewBox="0 0 50 30" className="h-7 w-12 shrink-0 overflow-visible">
            <DrawnPath d={ASIDE_ARROW.shaft} duration={0.5} />
            <DrawnPath d={ASIDE_ARROW.head} delay={0.5} duration={0.2} />
          </svg>
          where I&apos;ve worked
        </p>
      </div>

      <div className="-mt-4 flex flex-wrap gap-x-8 gap-y-1" role="tablist" aria-label="Experience">
        {experience.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.title}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative flex min-h-11 cursor-pointer items-baseline gap-1.5 px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen",
                selected ? "text-hero-ink" : "text-hero-muted hover:text-hero-ink",
              )}
            >
              <span className="font-hand text-[1.6rem] font-bold leading-none">
                {CATEGORY_LABELS[tab.title] ?? tab.title.toLowerCase()}
              </span>
              <span className="font-grotesk text-xs font-medium">{tab.items.length}</span>
              {selected && (
                <svg
                  aria-hidden
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-0 bottom-1 h-2 w-full overflow-visible text-hero-pen"
                >
                  <DrawnPath d={TAB_UNDERLINE} strokeWidth={2.5} duration={0.4} />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {category && (
        <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`}>
          <Timeline key={category.title} category={category} />
        </div>
      )}
    </ScrollSection>
  );
}
