/*
 * opengraph-image.tsx
 * Generates the 1200x630 social preview image for each tutorial
 * at build time (see postOgImage for the design).
 */

import { tutorials } from "@/data/tutorials";
import { postOgImage } from "@/lib/blog/postOg";

export const alt = "Tutorials — hands-on, step by step";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return tutorials.map((tutorial) => ({ slug: tutorial.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = tutorials.find((entry) => entry.slug === slug);

  return postOgImage(
    "Tutorials · akshitbansal.me",
    tutorial?.title ?? "Tutorials",
    tutorial?.tags ?? [],
  );
}
