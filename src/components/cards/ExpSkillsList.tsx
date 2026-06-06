/*
 * ExpSkillsList.tsx
 * Wraps an experience entry's tech-stack skills into a
 * row of SkillPill components. Renders nothing when
 * the skills array is empty.
 */

import SkillPill from "@/components/pills/SkillPill";
import { skillsData } from "@/data/skillsData";

// Public props for the list.
interface ExpSkillsListProps {
	skills: string[];
}

// Renders the wrapping row of skill pills.
export default function ExpSkillsList({ skills }: ExpSkillsListProps) {
	if (!skills.length) return null;

	const resolvedSkills = skills.map((tech) => {
		const found = skillsData.find((s) => s.name.toLowerCase() === tech.toLowerCase());
		return {
			name: tech,
			Icon: found?.Icon ?? "",
			variant: "expItem" as const,
		};
	});

	return (
		<div className="mt-4 md:mt-5 flex flex-wrap gap-1.5">
			{resolvedSkills.map((skill) => (
				<SkillPill key={skill.name} skill={skill} />
			))}
		</div>
	);
}
