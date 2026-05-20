/*
 * navConfig.ts
 * Per-page navigation menus.
 * The home page lists every section anchor; nested routes
 * (like /projects) get a simpler menu that just links home.
 */

import {
	FaBriefcase,
	FaCertificate,
	FaGraduationCap,
	FaHome,
	FaLaptopCode,
	FaUser,
} from "react-icons/fa";
import { FaShapes } from "react-icons/fa6";
import type { NavItem } from "@/types";

// Map of route key → ordered list of nav entries displayed in the navbar.
export const navConfigs: Record<string, NavItem[]> = {
	// Home page navigation: scrolls to in-page section anchors.
	home: [
		{ text: "Profile", to: "profile", icon: FaUser },
		{ text: "Projects", to: "projects", icon: FaLaptopCode },
		{ text: "Experience", to: "experience", icon: FaBriefcase },
		{ text: "Skills", to: "skills", icon: FaShapes },
		{ text: "Attainments", to: "attainments", icon: FaCertificate },
		{ text: "Education", to: "education", icon: FaGraduationCap },
	],
	// Sub-route navigation: just a single back-to-home link.
	projects: [{ text: "Home", to: "/", icon: FaHome }],
};
