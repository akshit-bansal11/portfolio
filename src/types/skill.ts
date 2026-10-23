/*
 * skill.ts
 * Type definitions for skill entries used across the
 * Skills section.
 */

export interface Skill {
  name: string;
  Icon: string;
  usedIn?: string[];
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}
