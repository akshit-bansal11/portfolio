/*
 * Skills.tsx
 * Home-page Skills section.
 * Shows skills grouped into categories with larger pills
 * (vs the /skills page pills). Each pill has a hover
 * popover listing where that skill was used.
 * Does NOT affect the /skills page at all.
 */

"use client";

import { motion } from "framer-motion";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import SkillPill from "@/components/pills/SkillPill";
import { SkillCategories } from "@/data/skillsData";

// Home-page Skills section component.
export default function Skills() {
	return (
		<ScrollSection id="skills">
			{/* Heading row */}
			<div className="flex w-full items-center justify-between gap-4 mb-8">
				<ScrollSectionHeading heading="skills" />
			</div>

			{/* Category blocks */}
			<div className="flex flex-col gap-8 w-full">
				{SkillCategories.map((category, catIndex) => (
					<motion.div
						key={category.title}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: catIndex * 0.08 }}
						className="flex flex-col gap-3"
					>
						{/* Category label */}
						<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
							{category.title}
						</span>

						{/* Pill row */}
						<div className="flex flex-wrap gap-2.5">
							{category.skills.map((skill, skillIndex) => (
								<motion.div
									key={skill.name}
									initial={{ opacity: 0, scale: 0.92 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: catIndex * 0.06 + skillIndex * 0.03 }}
								>
									<SkillPill skill={skill} />
								</motion.div>
							))}
						</div>
					</motion.div>
				))}
			</div>
		</ScrollSection>
	);
}
