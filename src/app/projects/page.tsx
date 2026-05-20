/*
 * page.tsx
 * /projects route — full-page projects gallery.
 * Renders a header with a back-home link and animated
 * title, then a ScrollReveal-staggered grid for each
 * project category (Web, Designs, Scripts, ...).
 */

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ProjectCard from "@/components/common/cards/ProjectCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { projects } from "@/data/projectsData";
import { cn } from "@/lib/utils";

// Shared motion config for each project section's grid wrapper.
const sectionMotion = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0 },
};

// Reused responsive grid classes for the project cards.
const gridLayout = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center";

// Top-level /projects page component.
function Projects() {
	return (
		<main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-16">
			<div className="max-w-7xl mx-auto space-y-24">
				{/* Header */}
				<div className="space-y-12">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
						<div className="space-y-6">
							{/* Back-to-home link with animated arrow on hover. */}
							<Link
								href="/"
								className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit group"
							>
								<IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
								Back to Home
							</Link>

							<div className="space-y-4">
								{/* Page title with gradient-clip animated entry. */}
								<motion.h1
									initial={{ opacity: 0, y: 24 }}
									animate={{ opacity: 1, y: 0 }}
									className={cn(
										"text-5xl md:text-7xl font-bold",
										"bg-linear-to-r from-white via-neutral-400 to-neutral-600",
										"bg-clip-text text-transparent",
									)}
								>
									Featured Projects
								</motion.h1>

								{/* Page subheading. */}
								<motion.p
									initial={{ opacity: 0, y: 24 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="text-neutral-500 max-w-2xl text-lg"
								>
									A collection of web applications, tools, and experiments built with modern
									technologies.
								</motion.p>
							</div>
						</div>
					</div>
				</div>

				{/* Sections */}
				<div className="space-y-32">
					{/* Render one ScrollReveal section per project category. */}
					{Object.entries(projects).map(([category, items], index) => (
						<ScrollReveal key={category} delay={index * 100} className="w-full">
							<section id={category.toLowerCase()} className="space-y-8 scroll-mt-32">
								<h2 className="text-xl md:text-2xl font-light tracking-tight text-neutral-300">
									{category}
								</h2>
								<motion.div
									initial={sectionMotion.initial}
									animate={sectionMotion.animate}
									className={gridLayout}
								>
									{items.map((project, idx) => (
										<ProjectCard key={idx} {...project} />
									))}
								</motion.div>
							</section>
						</ScrollReveal>
					))}
				</div>
			</div>
		</main>
	);
}

export default Projects;
