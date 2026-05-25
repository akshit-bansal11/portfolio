/*
 * skill.ts
 * Type definitions for skill entries used across the
 * Skills section, experience cards, and home page pills.
 */

export interface Skill {
	name: string;
	Icon: string;
}

export interface SkillCategory {
	title: string;
	description: string;
	certifications: Skill[];
	skills: Skill[];
}

export interface HomeSkill {
	name: string;
	Icon: string;
	usedIn: string[];
}

export interface HomeSkillCategory {
	title: string;
	skills: HomeSkill[];
}
