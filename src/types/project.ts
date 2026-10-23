/*
 * project.ts
 * Type definition for a single project card entry.
 */

export interface ProjectItem {
  title: string;
  description: string;
  imgUrl?: string;
  logoUrl?: string;
  videoUrl?: string;
  techStack: string[];
  /** Short handwritten facts shown on the card. */
  notes?: string[];
  demoLink?: string;
  githubLink?: string;
  siteLink?: string;
  designLink?: string;
  isPublic?: boolean;
}
