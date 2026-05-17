import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Projects | Akshit Bansal",
	description:
		"A collection of web applications, tools, and experiments built with modern technologies.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
