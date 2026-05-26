/*
 * skill.ts
 * Type definitions for skill entries used across the
 * Skills section, experience cards, and home page pills.
 */

export type SkillPillVariant = "skillSection" | "expItem";

export interface Skill {
	name: string;
	Icon: string;
	usedIn?: string[];
	variant?: SkillPillVariant;
}

export interface SkillCategory {
	title: string;
	skills: Skill[];
}
