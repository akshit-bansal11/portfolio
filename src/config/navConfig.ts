/*
 * navConfig.ts
 * Per-page navigation menus.
 * The home page lists every section anchor; nested routes
 * (like /projects) get a simpler menu that just links home.
 */

import {
	Award,
	BarChart2,
	Blocks,
	BookOpen,
	Briefcase,
	FolderCode,
	Home,
	User,
	// Quote,
} from "lucide-react";
import type { NavItem } from "@/types";

// Map of route key → ordered list of nav entries displayed in the navbar.
export const navConfigs: Record<string, NavItem[]> = {
	// Home page navigation: scrolls to in-page section anchors.
	home: [
		{ text: "Profile", to: "profile", icon: User, color: "text-sky-400/70" },
		{ text: "Projects", to: "projects", icon: FolderCode, color: "text-violet-400/70" },
		{ text: "Experience", to: "experience", icon: Briefcase, color: "text-amber-400/70" },
		{ text: "Skills", to: "skills", icon: Blocks, color: "text-emerald-400/70" },
		{ text: "Attainments", to: "attainments", icon: Award, color: "text-rose-400/70" },
		{ text: "Education", to: "education", icon: BookOpen, color: "text-cyan-400/70" },
		{ text: "By the Numbers", to: "by-the-numbers", icon: BarChart2, color: "text-orange-400/70" },
		// { text: "Testimonials", to: "testimonials",  icon: Quote,      color: "text-pink-400/70"     },
	],
	// Sub-route navigation: just a single back-to-home link.
	projects: [{ text: "Home", to: "/", icon: Home, color: "text-neutral-400" }],
};
