/*
 * opengraph-image.tsx
 * Generates the 1200x630 social preview image for each post
 * at build time (see postOgImage for the design).
 */

import { BLOG_TITLE } from "@/config/blogConfig";
import { blogPosts } from "@/data/blogPosts";
import { postOgImage } from "@/lib/blog/postOg";

export const alt = `${BLOG_TITLE} — a sketched systems design explainer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  return postOgImage(
    `${BLOG_TITLE} · akshitbansal.me`,
    post?.title ?? BLOG_TITLE,
    post?.tags ?? [],
  );
}
