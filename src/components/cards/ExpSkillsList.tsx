/*
 * ExpSkillsList.tsx
 * Wraps an experience entry's tech-stack skills into a
 * row of SkillPill components. Renders nothing when
 * the skills array is empty.
 */

"use client";
import SkillPill from "@/components/pills/SkillPill";
import type { Skill } from "@/types/skill";

// Public props for the list.
interface ExpSkillsListProps {
	skills: Skill[];
}

// Renders the wrapping row of skill pills.
export default function ExpSkillsList({ skills }: ExpSkillsListProps) {
	if (!skills.length) return null;

	return (
		<div className="mt-5 flex flex-wrap gap-2">
			{skills.map((skill) => (
				<SkillPill key={skill.name} skill={{ ...skill, variant: "expItem" }} />
			))}
		</div>
	);
}
