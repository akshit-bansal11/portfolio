/*
 * layout.tsx
 * Layout for the /skills route segment.
 * Only purpose is to override page-level metadata so
 * the skills page has its own title and description.
 */

import type { Metadata } from "next";

// Per-route metadata (title/description) for the skills page.
export const metadata: Metadata = {
	title: "Skills & Tools | Akshit Bansal",
	description:
		"Technologies and tools used to design, build, scale, and polish modern digital products.",
};

// Pass-through layout that only contributes metadata.
export default function SkillsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
