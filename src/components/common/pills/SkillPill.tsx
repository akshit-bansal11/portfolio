/*
 * SkillPill.tsx
 * Compact pill displaying a skill's icon and name.
 * Used across category bento grids and experience
 * cards as a unified tech-stack chip.
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Skill } from "@/data/skillsData";
import { cn } from "@/lib/utils";

// Public props for the pill.
interface SkillPillProps {
	skill: Skill;
}

// Renders a single skill pill.
const SkillPill = ({ skill }: SkillPillProps) => {
	// Pull the icon URL off the skill object for clarity.
	const Icon = skill.Icon;

	return (
		<motion.div
			whileHover={{ y: -4 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"flex items-center gap-3 px-4 py-2 rounded-full",
				"bg-neutral-800/70 border border-neutral-700/50",
				"text-sm text-neutral-200 select-none",
			)}
		>
			<Image
				src={Icon}
				alt={skill.name}
				width={20}
				height={20}
				className="h-5 w-5 object-contain"
			/>

			<span className="whitespace-nowrap">{skill.name}</span>
		</motion.div>
	);
};

export default SkillPill;
