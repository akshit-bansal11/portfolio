/**
 * Hero-specific social links. Kept separate from the global
 * `socialLinksData` so the hero can showcase a curated, ordered set
 * (gmail, github, linkedin, google cloud, hackerrank) without
 * disturbing other surfaces that consume the canonical list.
 *
 * Each entry stays compatible with the shared `SocialLink` shape so
 * any existing helpers (e.g. accent lookups) keep working.
 */

import type { IconType } from "react-icons";
import { FaGithub, FaHackerrank, FaLinkedinIn } from "react-icons/fa6";
import { SiGmail, SiGooglecloud } from "react-icons/si";
import { EMAIL_HREF } from "./heroContent";

export interface HeroSocialLink {
	name: string;
	Icon: IconType;
	href: string;
}

export const heroSocialLinks: HeroSocialLink[] = [
	{
		name: "Gmail",
		Icon: SiGmail,
		href: EMAIL_HREF,
	},
	{
		name: "GitHub",
		Icon: FaGithub,
		href: "https://github.com/akshit-bansal11",
	},
	{
		name: "LinkedIn",
		Icon: FaLinkedinIn,
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
