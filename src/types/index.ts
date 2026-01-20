import { IconType } from "react-icons";
import { StaticImageData } from "next/image";

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
    image: StaticImageData | string;
    techStack: string[];
    demoLink?: string;
    githubLink?: string;
}

export type ProjectCardType = 'large' | 'small' | 'smallWimg';

export interface DetailedProjectItem extends ProjectItem {
    type: ProjectCardType;
    designLink?: string;
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
    certificate: string | StaticImageData;
    link?: string;
    name?: string;
}

// Achievement/SkillBadge in Certifications
export interface AchievementItem {
    name: string;
    icon: IconType;
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
