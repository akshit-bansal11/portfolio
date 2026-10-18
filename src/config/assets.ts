/*
 * assets.ts
 * Public Cloudflare R2 bucket ("portfolio") served from a custom domain.
 * Data files reference media by object key so the host lives in one place.
 */

export const ASSETS_HOST = "assets.akshitbansal.dev";

// Object key (e.g. "skills/sql.svg") → absolute public URL.
export const asset = (key: string): string => `https://${ASSETS_HOST}/${key}`;
