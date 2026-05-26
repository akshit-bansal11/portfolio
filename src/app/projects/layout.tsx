/*
 * layout.tsx
 * Layout for the /projects route segment.
 * Only purpose is to override page-level metadata so
 * the projects page has its own title and description.
 */

import type { Metadata } from "next";

// Per-route metadata (title/description) for the projects page.
export const metadata: Metadata = {
	title: "Projects | Akshit Bansal",
	description:
		"A collection of web applications, tools, and experiments built with modern technologies.",
};

// Pass-through layout that only contributes metadata.
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
