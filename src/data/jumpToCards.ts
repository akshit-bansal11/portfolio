/*
 * jumpToCards.ts
 * Entries of the hand-written "jump to" index (hero stage 4).
 * Each one targets an in-page section anchor and carries a short gloss.
 * Only sections the home page actually renders are listed.
 */

import type { JumpToCardData } from "@/types/hero";

// Ordered list of jump-to entries rendered in the index.
export const JUMP_TO_CARDS: JumpToCardData[] = [
  { label: "Projects", sectionId: "projects", description: "Things I've built" },
  { label: "Experience", sectionId: "experience", description: "Where I've worked" },
  { label: "Skills", sectionId: "skills", description: "What I work with" },
  { label: "Attainments", sectionId: "attainments", description: "Certs & badges" },
  { label: "Education", sectionId: "education", description: "Academic background" },
  { label: "By The Numbers", sectionId: "by-the-numbers", description: "Commits, repos & time" },
];
