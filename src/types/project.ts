/*
 * project.ts
 * Type definition for a single project card entry.
 */

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
