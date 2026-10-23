/*
 * Education.tsx
 * Education section: one index card per entry (the Experience card, without points), with
 * the dates and a "class of" note handwritten above it.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import ExperienceCard from "@/components/experience/ExperienceCard";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import { education } from "@/data/educationData";

// The last four-digit year in a date range, if any.
function endYear(date: string): string | undefined {
  return date.match(/\d{4}/g)?.at(-1);
}

// Top-level Education section component.
export default function Education() {
  const reduceMotion = useReducedMotion();

  return (
    <ScrollSection id="education" className="gap-10 md:gap-12 lg:gap-14">
      <SectionTitle title="Education" aside="where it started" />

      <ol className="flex flex-col gap-12">
        {education.map((item, index) => {
          const year = endYear(item.date);
          return (
            <motion.li
              key={`${item.company}-${item.role}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
            >
              <p className="mb-2 flex flex-wrap items-baseline gap-x-3 font-hand text-xl font-semibold leading-tight text-hero-muted">
                <span>{item.date}</span>
                {year && <span className="text-hero-pen">class of {year}</span>}
              </p>
              <ExperienceCard item={{ ...item, points: [] }} index={index} />
            </motion.li>
          );
        })}
      </ol>
    </ScrollSection>
  );
}
