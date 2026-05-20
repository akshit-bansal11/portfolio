/**
 * Cards shown in the JumpTo panel (stage 4). Each maps to a section
 * anchor already present on the page.
 */
import type { JumpToCardData } from "@/types";

export const JUMP_TO_CARDS: JumpToCardData[] = [
	{
		label: "Projects",
		sectionId: "projects",
		description: "Things I've built",
		detail: "Full-stack apps, open-source tools & side experiments",
		colorClass: "border-indigo-500/40 shadow-indigo-500/20 hover:border-indigo-400/70",
	},
	{
		label: "Experience",
		sectionId: "experience",
		description: "Where I've worked",
		detail: "Roles, responsibilities & the teams I've been part of",
		colorClass: "border-rose-500/40 shadow-rose-500/20 hover:border-rose-400/70",
	},
	{
		label: "Skills",
		sectionId: "skills",
		description: "What I work with",
		detail: "Languages, frameworks, databases & dev tools",
		colorClass: "border-amber-500/40 shadow-amber-500/20 hover:border-amber-400/70",
	},
	{
		label: "Attainments",
		sectionId: "attainments",
		description: "Certs & badges",
		detail: "Google, HackerRank & other verified credentials",
		colorClass: "border-emerald-500/40 shadow-emerald-500/20 hover:border-emerald-400/70",
	},
	{
		label: "Education",
		sectionId: "education",
		description: "Academic background",
		detail: "Degrees, coursework & academic highlights",
		colorClass: "border-violet-500/40 shadow-violet-500/20 hover:border-violet-400/70",
	},
	{
		label: "By The Numbers",
		sectionId: "by-the-numbers",
		description: "Commits, repos & time",
		detail: "Live GitHub stats and months of professional experience",
		colorClass: "border-cyan-500/40 shadow-cyan-500/20 hover:border-cyan-400/70",
	},
	{
		label: "Testimonials",
		sectionId: "testimonials",
		description: "What people say",
		detail: "Colleagues, instructors & collaborators share their experience",
		colorClass: "border-pink-500/40 shadow-pink-500/20 hover:border-pink-400/70",
	},
];
