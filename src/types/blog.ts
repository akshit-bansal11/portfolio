/*
 * blog.ts
 * Types for blog posts: the hand-written registry entry,
 * table-of-contents headings, and the enriched post object
 * (reading time, word count, headings) built at build time.
 */

// One entry in src/data/blogPosts.ts.
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-10-22". */
  publishedAt: string;
  tags: string[];
  /** Short handwritten aside shown in the post header. */
  headerNote?: string;
}

// A heading that appears in the table of contents.
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

// Registry entry plus values derived from the MDX source.
export interface BlogPost extends BlogPostMeta {
  wordCount: number;
  readingMinutes: number;
  headings: TocHeading[];
}
