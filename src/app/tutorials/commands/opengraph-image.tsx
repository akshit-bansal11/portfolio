/*
 * opengraph-image.tsx
 * Generates the 1200x630 social preview image for the command reference index
 * at build time (see postOgImage for the design).
 */

import { commandTools } from "@/data/commands";
import { postOgImage } from "@/lib/blog/postOg";

export const alt = "Command reference — copyable cheat sheets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return postOgImage(
    "Command reference · akshitbansal.me",
    "Command reference",
    commandTools.map((tool) => tool.slug),
  );
}
