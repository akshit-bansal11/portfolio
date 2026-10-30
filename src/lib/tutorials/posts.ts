/*
 * posts.ts
 * Build-time helpers for tutorials. Same enrichment as the blog
 * (reading time, headings), reading MDX from src/content/tutorials
 * and the registry in src/data/tutorials.ts.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { tutorials } from "@/data/tutorials";
import { enrichPost } from "@/lib/blog/posts";
import type { BlogPost } from "@/types/blog";

// Folder holding one <slug>.mdx file per tutorial.
const CONTENT_DIR = path.join(process.cwd(), "src", "content", "tutorials");

// Returns a single enriched tutorial, or null when the slug is unknown.
export async function getTutorial(slug: string): Promise<BlogPost | null> {
  const index = tutorials.findIndex((tutorial) => tutorial.slug === slug);
  if (index === -1) return null;
  const source = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");

  return enrichPost(tutorials[index], index + 1, source);
}

// Returns every published tutorial, newest first (later numbers first on the same day).
export async function getAllTutorials(): Promise<BlogPost[]> {
  const all = await Promise.all(tutorials.map((tutorial) => getTutorial(tutorial.slug)));

  return all
    .filter((tutorial): tutorial is BlogPost => tutorial !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.part - a.part);
}
