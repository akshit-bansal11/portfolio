/*
 * ContributionCard.tsx
 * The GitHub contribution heatmap on a page taped to the board. Fetches the current year;
 * shows an empty note when GitHub returns nothing. The heatmap scrolls inside the card on
 * narrow screens, never the page.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Tape from "@/components/hero/elements/Tape";
import Heatmap from "@/components/numbers/Heatmap";
import { fetchGitHubContributions } from "@/lib/api/github";
import type { GitHubContributions } from "@/types/coding-stats";

interface ContributionCardProps {
  className?: string;
}

// Renders the card.
export default function ContributionCard({ className }: ContributionCardProps) {
  const reduceMotion = useReducedMotion();
  const year = new Date().getFullYear();
  const [contributions, setContributions] = useState<GitHubContributions | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchGitHubContributions(year).then((data) => {
      if (!cancelled) setContributions(data);
    });
    return () => {
      cancelled = true;
    };
  }, [year]);

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    for (const week of contributions?.weeks ?? []) {
      for (const day of week.contributionDays) map[day.date] = day.contributionCount;
    }
    return map;
  }, [contributions]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      <div className="relative -rotate-[0.6deg] text-page-ink transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 focus-within:-translate-y-1 focus-within:rotate-0 motion-reduce:transition-none">
        <div
          className="flex flex-col gap-4 border border-page-border bg-page-bg p-5 pt-7"
          style={{ boxShadow: "var(--note-shadow)" }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.01em]">
              GitHub contributions
            </h3>
            {contributions !== null && contributions.weeks.length > 0 && (
              <p className="font-grotesk text-sm tabular-nums text-page-muted">
                {contributions.totalContributions.toLocaleString("en-US")} in {year}
              </p>
            )}
          </div>
          <div className="overflow-x-auto pb-1">
            {contributions === null ? (
              <p className="font-hand text-2xl font-bold text-page-muted">
                loading the calendar...
              </p>
            ) : contributions.weeks.length > 0 ? (
              <Heatmap data={data} year={year} total={contributions.totalContributions} />
            ) : (
              <p className="font-hand text-2xl font-bold text-page-muted">
                no contribution data to show right now
              </p>
            )}
          </div>
        </div>
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2" />
      </div>
    </motion.div>
  );
}
