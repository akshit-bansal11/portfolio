/*
 * opengraph-image.tsx
 * Generates the 1200x630 social preview image for each command reference
 * at build time (see postOgImage for the design).
 */

import { commandTools, getCommandTool } from "@/data/commands";
import { postOgImage } from "@/lib/blog/postOg";

export const alt = "Command reference — copyable cheat sheets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return commandTools.map((tool) => ({ tool: tool.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getCommandTool(slug);

  return postOgImage(
    "Command reference · akshitbansal.me",
    tool ? `${tool.name} commands` : "Command reference",
    tool ? [tool.slug] : [],
  );
}
