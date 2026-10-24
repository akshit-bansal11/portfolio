/*
 * heroSocialLinks.ts
 * Curated, ordered list of social links shown in the hero.
 * Kept separate from any global socials list so the hero
 * can showcase its own selection without disturbing other
 * surfaces that consume canonical social data. The sticker
 * icon for each `name` lives in SocialIcon.tsx.
 */

import { EMAIL_HREF } from "@/data/heroContent";

// Shape of a single hero-social link entry.
export interface HeroSocialLink {
  name: string;
  /** Handwritten label that writes in under the sticker on hover. */
  note: string;
  href: string;
}

// Display order: Gmail → GitHub → LinkedIn → Google Skills → HackerRank.
export const heroSocialLinks: HeroSocialLink[] = [
  { name: "Gmail", note: "email", href: EMAIL_HREF },
  { name: "GitHub", note: "github", href: "https://github.com/akshit-bansal11" },
  { name: "LinkedIn", note: "linkedin", href: "https://www.linkedin.com/in/akshit-bansal11/" },
  {
    name: "Google Skills",
    note: "Google Skills",
    href: "https://www.skills.google/public_profiles/57032e10-4253-4ac1-9944-91f03bb226d1",
  },
  { name: "HackerRank", note: "hackerrank", href: "http://hackerrank.com/profile/akshitbansal11" },
];
