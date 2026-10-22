/*
 * slugify.ts
 * Shared helpers that turn heading text into URL-safe ids.
 * Used both at build time (table of contents from MDX source)
 * and at render time (h2/h3 ids in mdx-components) so the two
 * always agree.
 */

import { isValidElement, type ReactNode } from "react";

// "How it came to be?" -> "how-it-came-to-be"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Flattens rendered heading children back into plain text.
export function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeToText(node.props.children);
  return "";
}

// Strips inline markdown (`code`, **bold**, _em_, [links](...)) from a heading line.
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
}
