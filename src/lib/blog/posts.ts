/*
 * posts.ts
 * Build-time helpers for blog posts. Reads each post's MDX
 * source from src/content/blog to derive its word count,
 * reading time and table-of-contents headings, and merges
 * those with the registry in src/data/blogPosts.ts.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { WORDS_PER_MINUTE } from "@/config/blogConfig";
import { blogPosts } from "@/data/blogPosts";
import { slugify, stripInlineMarkdown } from "@/lib/blog/slugify";
import type { BlogPost, BlogPostMeta, TocHeading } from "@/types/blog";

// Folder holding one <slug>.mdx file per post.
const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

// Matches fenced code blocks (``` ... ```), including the fences.
const CODE_FENCE = /```[\s\S]*?```/g;

// Reads the raw MDX source for a slug.
async function readPostSource(slug: string): Promise<string> {
  return readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
}

// Pulls ## and ### headings (outside code blocks) for the table of contents.
export function extractHeadings(source: string): TocHeading[] {
  const withoutCode = source.replace(CODE_FENCE, "");
  const headings: TocHeading[] = [];

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = stripInlineMarkdown(match[2]);
    headings.push({ id: slugify(text), text, level: match[1].length === 2 ? 2 : 3 });
  }

  return headings;
}

// Counts words a reader actually reads: prose, JSX string props and code, minus syntax.
export function countWords(source: string): number {
  const readable = source
    .replace(/^(import|export)\s.*$/gm, " ")
    .replace(/<\/?[A-Za-z][\w.]*/g, " ")
    .replace(/\b[a-zA-Z]+=(?=["{])/g, " ")
    .replace(/https?:\/\/\S+/g, " ");

  return readable.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
}

// Merges a registry entry with the values derived from its MDX source.
export function enrichPost(meta: BlogPostMeta, part: number, source: string): BlogPost {
  const wordCount = countWords(source);

  return {
    ...meta,
    part,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    headings: extractHeadings(source),
  };
}

// Returns a single enriched post, or null when the slug is unknown.
export async function getPost(slug: string): Promise<BlogPost | null> {
  const index = blogPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return null;

  return enrichPost(blogPosts[index], index + 1, await readPostSource(slug));
}

// Returns every published post, newest first (later parts first on the same day).
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(blogPosts.map((post) => getPost(post.slug)));

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.part - a.part);
}
