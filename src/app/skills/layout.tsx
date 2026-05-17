import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Skills & Tools | Akshit Bansal",
	description:
		"Technologies and tools used to design, build, scale, and polish modern digital products.",
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
