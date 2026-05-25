/*
 * heroContent.ts
 * Static text and asset paths used by the scroll hero.
 * Centralized here so copy/asset edits don't require
 * touching the hero components themselves.
 */

// Tagline shown word-by-word in the first hero stage.
export const TAGLINE = "Crafting Production-Grade Next.js Applications";

export const TAGLINE_CLASSNAME =
	"w-fit mx-auto xl:text-8xl lg:text-7xl md:text-6xl sm:text-5xl text-5xl font-light tracking-tight items-center justify-center text-center max-w-5xl leading-[1.2] flex-wrap";

export const TAGLINE_ACCENT_CLASS =
	"bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-violet-200 to-rose-300";

// Public path to the downloadable resume.
export const RESUME_PATH = "/akshit_bansal.pdf";

// Filename suggested when the resume is downloaded.
export const RESUME_FILENAME = "akshit_bansal.pdf";

// mailto: target for the Gmail social icon.
export const EMAIL_HREF = "mailto:artistbansal2004@gmail.com";

// Default profile photo (front face of the flip card).
export const PROFILE_IMAGE_URL =
	"https://media-server.akshitbansal.me/api/images/credentials/pfp.webp";

// Hover/back-face profile photo (revealed on flip).
export const PROFILE_IMAGE_HOVER_URL =
	"https://media-server.akshitbansal.me/api/images/credentials/pfp-hover.webp";

// Display name used in the hero headline.
export const PROFILE_NAME = "Akshit Bansal";

// Sub-headline role string under the name.
export const PROFILE_ROLE = "Next.js Full-Stack Developer";
