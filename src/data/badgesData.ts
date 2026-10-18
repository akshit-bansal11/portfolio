/*
 * badgesData.ts
 * Static lists of skill badges shown in the Attainments section.
 * Splits into HackerRank star badges and Google Cloud
 * generative-AI badges, each linked to its public profile URL.
 */

import { asset } from "@/config/assets";
import type { GitHubAchievement, GoogleBadgeItem } from "@/types/attainments";

// Google Cloud Skill Boost generative-AI badge entries.
export const googleBadges: GoogleBadgeItem[] = [
  {
    gBadgeTitle: "Gen AI Agents: Transform Your Organization",
    gBadgeLink:
      "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146512",
  },
  {
    gBadgeTitle: "Gen AI Apps: Transform Your Work",
    gBadgeLink:
      "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146482",
  },
  {
    gBadgeTitle: "Gen AI: Navigate the Landscape",
    gBadgeLink:
      "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146407",
  },
  {
    gBadgeTitle: "Gen AI: Unlock Foundational Concepts",
    gBadgeLink:
      "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146328",
  },
  {
    gBadgeTitle: "Gen AI: Beyond the Chatbot",
    gBadgeLink:
      "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1/badges/24146201",
  },
];

// GitHub profile achievements shown under the contribution heatmap.
export const githubAchievements: GitHubAchievement[] = [
  { name: "Starstruck", imgUrl: asset("attainments/github/starstruck.png") },
  {
    name: "Pair Extraordinaire",
    imgUrl: asset("attainments/github/pair-extraordinaire.png"),
    tier: "x2",
  },
  { name: "Pull Shark", imgUrl: asset("attainments/github/pull-shark.png"), tier: "x2" },
  { name: "Quickdraw", imgUrl: asset("attainments/github/quickdraw.png") },
  { name: "YOLO", imgUrl: asset("attainments/github/yolo.png") },
];
