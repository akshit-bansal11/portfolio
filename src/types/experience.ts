/*
 * experience.ts
 * Type definitions for experience section entries.
 */

import type { StaticImageData } from "next/image";
import type { Skill } from "./skill";

export interface ExperienceLabeledPoint {
	label: string;
	body: string;
}

export type ExperiencePoint = string | ExperienceLabeledPoint;

export interface ExperienceItem {
	location: string;
	company: string;
	role: string;
	date: string;
	points: ExperiencePoint[];
	generalPoint?: string;
	certificate?: string;
	logo?: string | StaticImageData;
	skills?: Skill[];
}
