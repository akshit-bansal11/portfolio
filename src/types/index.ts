import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import type { Skill } from "@/data/skillsData";

// Project Types
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

// Experience Types
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

// Education Types
export interface EducationItem {
	location: string;
	company: string;
	role: string;
	date: string;
}

// Attainments Types

export interface GoogleBadgeItem {
	gBadgeTitle: string;
	gBadgeLink: string;
}

export interface HackerRankBadgeItem {
	name: string;
	icon: string;
	stars: number;
	source: string;
	delay: number;
	link: string;
	color?: string;
}

export interface CertificationProvider {
	name: string;
	logoUrl?: string;
}

export interface CertificationItem {
	name: string;
	providers: CertificationProvider[];
	skills?: string[];
	link: string;
}

// Nav Types
export interface NavItem {
	text: string;
	to: string;
	icon: IconType;
}

// Hero Types
export type HeroStageId = "tagline" | "profile" | "socials" | "jumpto";

export interface HeroStage {
	id: HeroStageId;
	range: readonly [number, number];
}

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

export interface JumpToCardData {
	label: string;
	sectionId: string;
	description: string;
	detail: string;
	colorClass: string;
}
