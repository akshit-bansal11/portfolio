/*
 * PostNav.tsx
 * Previous / next links at the bottom of a post, following
 * the series order in the registry.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPostMeta } from "@/types/blog";

interface PostNavProps {
  previous?: BlogPostMeta;
  next?: BlogPostMeta;
  /** Route the posts live under; defaults to the blog. */
  basePath?: string;
  className?: string;
}

interface NavCardProps {
  post: BlogPostMeta;
  direction: "previous" | "next";
  basePath: string;
}

function NavCard({ post, direction, basePath }: NavCardProps) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className={cn(
        "group block rounded-2xl border-2 border-ink bg-paper-raised p-4 transition-transform hover:-translate-y-0.5",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pen",
        direction === "next" && "sm:text-right",
      )}
    >
      <span className="font-hand text-xl text-pen">
        {direction === "previous" ? "← previous" : "next →"}
      </span>
      <span className="mt-1 block font-semibold text-ink">{post.title}</span>
    </Link>
  );
}

export default function PostNav({ previous, next, basePath = "/blog", className }: PostNavProps) {
  if (!previous && !next) return null;
  return (
    <nav
      aria-label="More posts in this series"
      className={cn("mt-16 grid gap-4 sm:grid-cols-2", className)}
    >
      {previous ? (
        <NavCard post={previous} direction="previous" basePath={basePath} />
      ) : (
        <span aria-hidden />
      )}
      {next && <NavCard post={next} direction="next" basePath={basePath} />}
    </nav>
  );
}
