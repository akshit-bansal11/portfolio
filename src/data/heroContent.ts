/*
 * heroContent.ts
 * Static text and asset paths used by the scroll hero.
 * Centralized here so copy/asset edits don't require
 * touching the hero components themselves.
 */

import { asset } from "@/config/assets";

// Tagline shown word-by-word in the first hero stage, one array entry per line (desktop keeps
// these breaks). The non-breaking spaces keep the selected phrase as one word so the
// whiteboard selection box can wrap it.
export const TAGLINE_MARKED = "end to end";
export const TAGLINE_LINES = [
  "I design, build and ship",
  "production software,",
  `${TAGLINE_MARKED}.`,
] as const;

// Handwritten facts pointing at tagline words (a compact list where there is no room for arrows).
export const TAGLINE_FACTS = [
  { word: "production", text: "1,900+ automated tests", side: "left" },
  { word: "ship", text: "2 live platforms in under 3 months", side: "top" },
  { word: "software", text: "7 open-source apps, 650+ commits", side: "right" },
] as const;

// Handwritten aside under the tagline, with an arrow pointing back up at it.
export const TAGLINE_ASIDE = "…and I help others ship theirs, tech or not";

export const TAGLINE_CLASSNAME =
  "font-display font-medium tracking-[-0.01em] text-[clamp(2.5rem,1.2rem+4.2vw,5.25rem)] justify-center text-center leading-[1.02] flex-wrap";

export const TAGLINE_ACCENT_CLASS =
  "bg-clip-text text-transparent bg-linear-to-r from-hero-grad-1 via-hero-grad-2 to-hero-grad-3";

// Gradient on the surname; the stops are theme tokens, stronger on paper.
export const NAME_ACCENT_CLASS =
  "text-transparent bg-clip-text bg-linear-to-r from-hero-grad-1 via-hero-grad-2 to-hero-grad-3";

// Route of the printable resume page.
export const RESUME_PATH = "/resume";

// mailto: target for the Gmail social icon.
export const EMAIL_HREF = "mailto:artistbansal2004@gmail.com";

// Default profile photo (front face of the flip card).
export const PROFILE_IMAGE_URL = asset("personal/pfp.webp");

// Hover/back-face profile photo (revealed on flip).
export const PROFILE_IMAGE_HOVER_URL = asset("personal/pfp-hover.webp");

// Display name used in the hero headline.
export const PROFILE_NAME = "Akshit Bansal";

// Sub-headline role string under the name.
export const PROFILE_ROLE = "Full-Stack Software Engineer · Punjab, India";

// Handwritten note drawn beside the profile photo.
export const PROFILE_NOTE = "hi, that's me!";

// Stage 4: typed heading plus four beliefs. Each note shows a typed word with a handwritten
// gloss on the front and three short points on the back (drafts, to be edited).
export const BELIEFS_HEADING = "What I believe in";
export const BELIEFS = [
  {
    word: "Judgment",
    gloss: "my gut + insight, then decide",
    points: [
      "Decide with my own gut and insight",
      "Weigh the facts, then commit",
      "Change course when the facts change",
    ],
  },
  {
    word: "Ownership",
    gloss: "the good, the bad, the mistakes. all mine.",
    points: [
      "What I made is mine: the good and the bad",
      "The pros, the cons and the mistakes",
      "No blaming the tools or the team",
    ],
  },
  {
    word: "Asking for help",
    gloss: "no shame in it, ever",
    points: [
      "Ask early, not after a week stuck",
      "No ego about not knowing",
      "Pay it back by helping others",
    ],
  },
  {
    word: "Humbleness",
    gloss: "I listen, whoever's talking",
    points: [
      "Listen to everyone, whatever their experience",
      "Good ideas come from anywhere",
      "Stay a learner",
    ],
  },
] as const;

// Profile stage: what I am doing now (an item may carry a link), and the domains I have worked across.
export const CURRENTLY: readonly { text: string; link?: { label: string; href: string } }[] = [
  { text: "SDE-3 & Chief Advisor @ Elina Club" },
  { text: "Co-founder & CTO @ a stealth startup" },
  { text: "building ", link: { label: "Kiteloom", href: "https://kiteloom.com" } },
];
export const WORKED_ACROSS = ["FOSS", "Real Estate", "SaaS", "PR", "Design / UI/UX"] as const;
