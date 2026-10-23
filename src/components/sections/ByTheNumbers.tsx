/*
 * ByTheNumbers.tsx
 * "By the numbers" section: the GitHub contribution heatmap on a taped page beside four big
 * hand-annotated stats (live commits and repos from the GitHub stats API, plus two fixed
 * year counts), and the GitHub achievements as round stickers.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import AchievementSticker from "@/components/numbers/AchievementSticker";
import ContributionCard from "@/components/numbers/ContributionCard";
import Stat from "@/components/numbers/Stat";
import { githubAchievements } from "@/data/badgesData";
import { fetchGitHubStats, type GitHubStats } from "@/lib/api/github";

const ACHIEVEMENTS_URL = "https://github.com/akshit-bansal11?tab=achievements";

// Professional years, bumped manually as time passes.
const YEARS_PROFESSIONAL = 1.4; // Jan 2026 to present

interface ByTheNumbersProps {
  /** Years since the owner started building (March 2021), computed on the server. */
  yearsBuilding: number;
}

// Top-level section component.
export default function ByTheNumbers({ yearsBuilding }: ByTheNumbersProps) {
  const reduceMotion = useReducedMotion();
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    fetchGitHubStats().then(setStats);
  }, []);

  // A zero from the API means "unavailable", so those stats show a dash instead.
  const commits = stats && stats.totalCommits > 0 ? stats.totalCommits : null;
  const repos = stats && stats.publicRepos > 0 ? stats.publicRepos : null;

  return (
    <ScrollSection id="by-the-numbers" className="gap-10 pb-12 md:gap-12 md:pb-16 lg:gap-14">
      <SectionTitle title="By the numbers" aside="the receipts" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch lg:gap-8">
        <ContributionCard className="lg:h-full" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-1 lg:grid-rows-4 lg:gap-y-4">
          <Stat
            index={0}
            value={commits}
            suffix="+"
            label="total commits"
            doodle="underline"
            note="so far"
          />
          <Stat index={1} value={repos} suffix="+" label="public repos" doodle="circle" />
          <Stat
            index={2}
            value={YEARS_PROFESSIONAL}
            suffix=" y"
            label="professional experience"
            doodle="underline"
          />
          <Stat
            index={3}
            value={yearsBuilding}
            suffix=" y"
            label="years building"
            doodle="circle"
          />
        </div>
      </div>

      <motion.div
        className="flex flex-col gap-4"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35 }}
      >
        <h3 className="font-hand text-3xl font-bold leading-none text-hero-muted">
          <a
            href={ACHIEVEMENTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center underline decoration-wavy underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen"
          >
            github achievements
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>
        <ul className="flex flex-wrap gap-x-8 gap-y-6 pl-1">
          {githubAchievements.map((achievement, index) => (
            <li key={achievement.name}>
              <AchievementSticker achievement={achievement} index={index} />
            </li>
          ))}
        </ul>
      </motion.div>
    </ScrollSection>
  );
}
