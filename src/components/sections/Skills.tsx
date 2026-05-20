/*
 * Skills.tsx
 * Home-page Top Skills preview.
 * Shows a staggered row of SkillItem tiles for the
 * curated topSkills list plus a "See More" link
 * pointing to the full /skills page.
 */

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import SkillItem from "@/components/common/cards/SkillItem";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
import { Button } from "@/components/ui/button";

import { topSkills } from "@/data/skillsData";

// Top-level Skills preview section component.
export default function Skills() {
	return (
		<ScrollSection id="skills">
			{/* Heading row with "See More" link to the dedicated skills page. */}
			<div className="flex w-full items-center justify-between gap-4 mb-8">
				<ScrollSectionHeading heading="top skills" />
				<Button
					variant="ghost"
					className="text-neutral-400 hover:text-white hover:bg-neutral-800"
					asChild
				>
					<Link href="/skills">
						See More <GoArrowUpRight className="ml-2" />
					</Link>
				</Button>
			</div>

			{/* Staggered row of skill tiles. */}
			<div className="w-full flex justify-start">
				<div className="flex flex-wrap gap-4 justify-start">
					{topSkills.map((skill, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
						>
							<SkillItem {...skill} /*disableHover={true}*/ />
						</motion.div>
					))}
				</div>
			</div>
		</ScrollSection>
	);
}
