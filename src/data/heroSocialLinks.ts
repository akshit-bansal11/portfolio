/*
 * heroSocialLinks.ts
 * Curated, ordered list of social links shown in the hero.
 * Kept separate from any global socials list so the hero
 * can showcase its own selection without disturbing other
 * surfaces that consume canonical social data.
 */

import { Github, Linkedin, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { FaHackerrank } from "react-icons/fa6";
import { SiGmail, SiGooglecloud } from "react-icons/si";

import { EMAIL_HREF } from "@/data/heroContent";

// Shape of a single hero-social link entry.
export interface HeroSocialLink {
	name: string;
	Icon: LucideIcon | IconType;
	href: string;
}

// Display order: Gmail → GitHub → LinkedIn → Google Cloud → HackerRank.
export const heroSocialLinks: HeroSocialLink[] = [
	{
		name: "Gmail",
		Icon: SiGmail,
		href: EMAIL_HREF,
	},
	{
		name: "GitHub",
		Icon: Github,
		href: "https://github.com/akshit-bansal11",
	},
	{
		name: "LinkedIn",
		Icon: Linkedin,
		href: "https://www.linkedin.com/in/akshit-bansal11/",
	},
	{
		name: "GoogleCloud",
		Icon: SiGooglecloud,
		href: "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1",
	},
	{
		name: "HackerRank",
		Icon: FaHackerrank,
		href: "http://hackerrank.com/profile/akshitbansal11",
	},
];
