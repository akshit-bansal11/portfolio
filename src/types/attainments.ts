/*
 * attainments.ts
 * Type definitions for badges and certifications shown
 * in the Attainments section.
 */

export interface GoogleBadgeItem {
  gBadgeTitle: string;
  gBadgeLink: string;
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

// A GitHub profile achievement badge (static: GitHub has no achievements API).
export interface GitHubAchievement {
  name: string;
  imgUrl: string;
  tier?: string;
}
