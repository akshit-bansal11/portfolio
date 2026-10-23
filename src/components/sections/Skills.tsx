/*
 * Skills.tsx
 * Home-page Skills section, laid out as a whiteboard: a typed heading with a handwritten
 * aside, then each category as a group (handwritten name, short drawn underline) of
 * hand-bordered skill stickers. Tiles pop in with a short stagger when a group enters view.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DrawnPath } from "@/components/blog/Annotation";
import ScrollSection from "@/components/layout/ScrollSection";
import SkillTile, { BORDERS, TILTS } from "@/components/skills/SkillTile";
import { SkillCategories } from "@/data/skillsData";
import { sketchArrow, sketchLine } from "@/lib/blog/sketch";

// Small arrow from the handwritten aside toward the heading.
const ASIDE_ARROW = sketchArrow(46, 6, 4, 22, { seed: 71, curve: 0.3, headSize: 7 });

const GROUP = { show: { transition: { staggerChildren: 0.05 } } };

// Top-level Skills section component.
export default function Skills() {
  const reduceMotion = useReducedMotion();

  return (
    <ScrollSection id="skills" className="gap-10 md:gap-12 lg:gap-14">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <h2 className="font-display text-5xl font-medium tracking-[-0.01em] text-hero-ink md:text-6xl lg:text-7xl">
          Skills
        </h2>
        <p className="flex items-center gap-1 pb-2 font-hand text-3xl font-semibold leading-none text-hero-pen">
          <svg aria-hidden viewBox="0 0 50 30" className="h-7 w-12 shrink-0 overflow-visible">
            <DrawnPath d={ASIDE_ARROW.shaft} duration={0.5} />
            <DrawnPath d={ASIDE_ARROW.head} delay={0.5} duration={0.2} />
          </svg>
          what I build with
        </p>
      </div>
      <div className="columns-1 gap-x-10 md:columns-2 lg:columns-3">
        {SkillCategories.map((category, catIndex) => (
          <div key={category.title} className="mb-10 break-inside-avoid">
            <h3 className="font-hand text-3xl font-bold leading-none text-hero-pen">
              {category.title}
            </h3>
            <svg aria-hidden viewBox="0 0 120 8" className="mt-1 mb-4 h-2 w-28 text-hero-pen">
              <DrawnPath
                d={sketchLine(2, 4, 118, 4, { seed: 31 + catIndex, bow: 1.5 })}
                strokeWidth={2.5}
                duration={0.6}
              />
            </svg>
            <motion.ul
              variants={GROUP}
              initial={reduceMotion ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap gap-x-3 gap-y-4"
            >
              {category.skills.map((skill, index) => (
                <SkillTile
                  key={skill.name}
                  skill={skill}
                  tilt={TILTS[(index * 5 + catIndex * 3) % TILTS.length] ?? TILTS[0]}
                  border={BORDERS[catIndex % BORDERS.length] ?? BORDERS[0]}
                  alt={(index + catIndex) % 2 === 1}
                />
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </ScrollSection>
  );
}
