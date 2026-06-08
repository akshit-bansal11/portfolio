/*
 * Experience.tsx
 * Experience section. Displays category tabs (e.g. Internship,
 * Training) above an accordion list of experience entries.
 * Clicking a tab switches the visible set of cards.
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ExpAccordionItem from "@/components/cards/ExpAccordionItem";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { experience } from "@/data/experienceData";
import { cn } from "@/lib/utils";

// Top-level Experience section component.
export default function Experience() {
	const [activeTab, setActiveTab] = useState(0);
	const activeCategory = experience[activeTab];

	return (
		<ScrollSection id="experience">
			{/* Section heading. */}
			<div className="flex w-full gap-2 items-baseline">
				<ScrollSectionHeading heading="experience" />
			</div>

			{/* Category tab bar */}
			<div className="flex items-center gap-1 mt-2">
				{experience.map((category, index) => (
					<button
						key={category.title}
						type="button"
						onClick={() => setActiveTab(index)}
						className={cn(
							"relative px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-lg transition-colors duration-200",
							activeTab === index ? "text-white" : "text-neutral-500 hover:text-neutral-300",
						)}
					>
						{category.title}

						{/* Active underline indicator */}
						{activeTab === index && (
							<motion.div
								layoutId="exp-tab-indicator"
								className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-white/20"
								transition={{ type: "spring", stiffness: 380, damping: 30 }}
							/>
						)}
					</button>
				))}
			</div>

			{/* Accordion list for active category */}
			<AnimatePresence mode="wait">
				{activeCategory && (
					<motion.div
						key={activeCategory.title}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						className="flex flex-col gap-2 mt-2"
					>
						{activeCategory.items.map((item, i) => (
							<ExpAccordionItem key={i} {...item} />
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</ScrollSection>
	);
}
