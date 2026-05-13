import type { IconType } from "react-icons";

// Skills Types
export interface SkillItem {
	icon: IconType | string;
	name: string;
}

export interface SkillCategory {
	title: string;
	skills: SkillItem[][];
}

// Social Links Types
export interface SocialLink {
	Name: string;
	Icon: IconType;
	href: string;
	delay: number;
}

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
export interface ExperienceItem {
	location: string;
	company: string;
	role: string;
	date: string;
	points: string[];
	certificate?: string;
}

// Education Types
export interface EducationItem {
	location: string;
	company: string;
	role: string;
	date: string;
}

// Certification Types
export interface CertificationItem {
	imgUrl?: string;
	link?: string;
	name?: string;
}

export interface GoogleBadgeItem {
	gBadgeTitle: string;
	gBadgeLink: string;
}

// Achievement/SkillBadge in Certifications
export interface AchievementItem {
	name: string;
	icon: string;
	stars: number;
	source: string;
	delay: number;
	link: string;
}

// Nav Types
export interface NavItem {
	text: string;
	to: string;
	icon: IconType;
}
