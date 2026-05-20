/*
 * index.ts
 * Central type definitions shared across the portfolio.
 * Defines shapes for projects, experience, education,
 * attainments, navigation, and the four-stage scroll hero.
 */

import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import type { Skill } from "@/data/skillsData";

// Shape of a single project card (web app, design, or script).
export interface ProjectItem {
	title: string;
	description: string;
	imgUrl?: string;
	videoUrl?: string;
	techStack: string[];
	demoLink?: string;
	githubLink?: string;
	siteLink?: string;
	designLink?: string;
	openSource?: boolean;
}

// A "label: body" bullet point inside an experience card.
export interface ExperienceLabeledPoint {
	label: string;
	body: string;
}

// Either a plain string bullet or a labeled point.
export type ExperiencePoint = string | ExperienceLabeledPoint;

// Shape of a single experience entry (internship, training, etc.).
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

// Shape of a single education row.
export interface EducationItem {
	location: string;
	company: string;
	role: string;
	date: string;
}

// Google Cloud skill badge entry.
export interface GoogleBadgeItem {
	gBadgeTitle: string;
	gBadgeLink: string;
}

// HackerRank star-rated skill badge entry.
export interface HackerRankBadgeItem {
	name: string;
	icon: string;
	stars: number;
	source: string;
	delay: number;
	link: string;
	color?: string;
}

// One issuing organization on a certification card.
export interface CertificationProvider {
	name: string;
	logoUrl?: string;
}

// A certification listed on the attainments section.
export interface CertificationItem {
	name: string;
	providers: CertificationProvider[];
	skills?: string[];
	link: string;
}

// One row in the global navbar (label, target, icon).
export interface NavItem {
	text: string;
	to: string;
	icon: IconType;
}

// Identifier of one of the four hero scroll stages.
export type HeroStageId = "tagline" | "profile" | "socials" | "jumpto";

// Hero stage definition: id plus its [start, end] progress range.
export interface HeroStage {
	id: HeroStageId;
	range: readonly [number, number];
}

// Props for the reusable word/letter blur-reveal AnimatedText.
export interface AnimatedTextProps {
	text: string;
	stagger?: number;
	animateBy?: "words" | "letters";
	direction?: "top" | "bottom";
	className?: string;
	onComplete?: () => void;
	active?: boolean;
	wordClassName?: (segment: string, index: number) => string | undefined;
}

// Shape of one card inside the JumpTo panel (stage 4 of the hero).
export interface JumpToCardData {
	label: string;
	sectionId: string;
	description: string;
	detail: string;
	colorClass: string;
}
