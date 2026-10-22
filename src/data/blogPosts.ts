/*
 * blogPosts.ts
 * Registry of published blog posts. Each slug must have a
 * matching MDX file at src/content/blog/<slug>.mdx.
 * Order here does not matter; the index sorts by date.
 */

import type { BlogPostMeta } from "@/types/blog";

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "tight-coupling",
    title: "Tight Coupling: Why One Dead Bulb Darkens the Whole Tree",
    description:
      "What coupling and cohesion really mean, where the ideas came from, how interfaces, events and queues loosen things up, and how to avoid the over-abstraction trap. With real case files from Amazon, Segment, Shopify, Uber and Zerodha.",
    publishedAt: "2026-10-22",
    tags: ["architecture", "modularity", "microservices"],
    headerNote: "grab a chai, and click everything",
  },
];
