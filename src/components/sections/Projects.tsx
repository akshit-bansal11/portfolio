/*
 * Projects.tsx
 * Home-page Projects preview.
 * Shows the first three Web projects in a responsive
 * grid plus a "See More" link to the full /projects
 * page for the complete gallery.
 */

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ProjectCard from "@/components/cards/ProjectCard";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projectsData";

// Top-level Projects preview section component.
export default function Projects() {
	return (
		<ScrollSection id="projects">
			{/* Heading row with the "See More" link. */}
			<div className="flex w-full items-center justify-between gap-4 mb-4">
				<ScrollSectionHeading heading="projects" />
				<Button
					variant="ghost"
					className="text-neutral-400 hover:text-white hover:bg-neutral-800"
					asChild
				>
					<Link href="/projects">
						See More <ArrowUpRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
			{/* Top three Web projects. */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
				{projects.Web.slice(0, 3).map((project, index) => (
					<ProjectCard key={index} {...project} />
				))}
			</div>
		</ScrollSection>
	);
}
