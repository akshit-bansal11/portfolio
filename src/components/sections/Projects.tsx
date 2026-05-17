"use client";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import ProjectCard from "@/components/common/cards/ProjectCard";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projectsData";

export default function Projects() {
	return (
		<ScrollSection id="projects">
			<div className="flex w-full items-center justify-between gap-4 mb-4">
				<ScrollSectionHeading heading="projects" />
				<Button
					variant="ghost"
					className="text-neutral-400 hover:text-white hover:bg-neutral-800"
					asChild
				>
					<Link href="/projects">
						See More <GoArrowUpRight className="ml-2" />
					</Link>
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
				{projects.Web.slice(0, 3).map((project, index) => (
					<ProjectCard key={index} {...project} />
				))}
			</div>
		</ScrollSection>
	);
}
