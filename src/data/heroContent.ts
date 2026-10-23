/*
 * heroContent.ts
 * Static text and asset paths used by the scroll hero.
 * Centralized here so copy/asset edits don't require
 * touching the hero components themselves.
 */

import { asset } from "@/config/assets";

// Tagline shown word-by-word in the first hero stage. The non-breaking space keeps
// the circled phrase as one word so the hand-drawn mark can wrap it.
export const TAGLINE_MARKED = "make things";
export const TAGLINE = `I ${TAGLINE_MARKED} and solve problems.`;

// Handwritten aside under the tagline, with an arrow pointing back up at it.
export const TAGLINE_ASIDE = "…and help others do the same, tech or not";

export const TAGLINE_CLASSNAME =
  "w-fit mx-auto xl:text-8xl lg:text-7xl md:text-5xl sm:text-4xl text-4xl font-light tracking-tight items-center justify-center text-center max-w-5xl leading-[1.2] flex-wrap";

export const TAGLINE_ACCENT_CLASS =
  "bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-violet-200 to-rose-300 in-data-[theme=light]:from-indigo-700 in-data-[theme=light]:via-violet-700 in-data-[theme=light]:to-rose-700";

// Gradient on the surname, with a darker pair on paper for contrast.
export const NAME_ACCENT_CLASS =
  "text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-white/90 to-rose-300 in-data-[theme=light]:from-indigo-700 in-data-[theme=light]:via-stone-900 in-data-[theme=light]:to-rose-700";

// Public path to the downloadable resume.
export const RESUME_PATH = "/akshit_bansal.pdf";

// Filename suggested when the resume is downloaded.
export const RESUME_FILENAME = "akshit_bansal.pdf";

// mailto: target for the Gmail social icon.
export const EMAIL_HREF = "mailto:artistbansal2004@gmail.com";

// Default profile photo (front face of the flip card).
export const PROFILE_IMAGE_URL = asset("personal/pfp.webp");

// Hover/back-face profile photo (revealed on flip).
export const PROFILE_IMAGE_HOVER_URL = asset("personal/pfp-hover.webp");

// Display name used in the hero headline.
export const PROFILE_NAME = "Akshit Bansal";

// Sub-headline role string under the name.
export const PROFILE_ROLE = "Next.js Full-Stack Developer";

// Handwritten notes drawn beside the profile photo and the social icons.
export const PROFILE_NOTE = "hi, that's me!";
export const SOCIALS_NOTE = "say hello";

// Stage 4: typed heading plus four beliefs, each a typed word with a handwritten gloss.
export const BELIEFS_HEADING = "What I believe in";
export const BELIEFS = [
  { word: "Judgment", gloss: "my gut + insight, then decide" },
  { word: "Ownership", gloss: "the good, the bad, the mistakes. all mine." },
  { word: "Asking for help", gloss: "no shame in it, ever" },
  { word: "Humbleness", gloss: "I listen, whoever's talking" },
] as const;
