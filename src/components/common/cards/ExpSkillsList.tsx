"use client";
import SkillPill from "@/components/common/pills/SkillPill";
import type { Skill } from "@/data/skillsData";

interface ExpSkillsListProps {
	skills: Skill[];
}

export default function ExpSkillsList({ skills }: ExpSkillsListProps) {
	if (!skills.length) return null;

	return (
		<div className="mt-5 flex flex-wrap gap-2">
			{skills.map((skill) => (
				<SkillPill key={skill.name} skill={skill} />
			))}
		</div>
	);
}
