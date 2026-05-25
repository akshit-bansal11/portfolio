/*
 * badgesData.ts
 * Static lists of skill badges shown in the Attainments section.
 * Splits into HackerRank star badges and Google Cloud
 * generative-AI badges, each linked to its public profile URL.
 */

import type { GoogleBadgeItem } from "@/types/certification";

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
