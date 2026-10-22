/*
 * blogConfig.ts
 * Site-wide constants for the /blog section: canonical URL,
 * blog name and description, author, and the reading speed
 * used to estimate reading time.
 */

// Canonical origin used for metadataBase and Open Graph URLs.
export const SITE_URL = "https://akshitbansal.me";

// Display name of the blog section.
export const BLOG_TITLE = "Systems, Sketched";

// Default description for the blog index.
export const BLOG_DESCRIPTION =
  "Deep dives into systems design, explained with real-life analogies, real company incidents, and diagrams you can poke at.";

// Author shown in post headers and metadata.
export const AUTHOR_NAME = "Akshit Bansal";

// Average adult silent-reading speed for technical prose (words per minute).
export const WORDS_PER_MINUTE = 220;
