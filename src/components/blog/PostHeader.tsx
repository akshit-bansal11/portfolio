/*
 * PostHeader.tsx
 * Title block at the top of a post: back link, tags, title,
 * description, date / reading time / author, and an optional
 * handwritten aside.
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Annotation } from "@/components/blog/Annotation";
import { AUTHOR_NAME } from "@/config/blogConfig";
import { formatPostDate, formatReadingTime } from "@/lib/blog/format";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface PostHeaderProps {
  post: BlogPost;
  className?: string;
}

export default function PostHeader({ post, className }: PostHeaderProps) {
  return (
    <header className={cn("mb-10", className)}>
      <Link
        href="/blog"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          aria-hidden
        />
        All posts
      </Link>

      <ul aria-label="Tags" className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-rule px-2.5 py-0.5 text-xs font-medium text-ink-muted"
          >
            #{tag}
          </li>
        ))}
      </ul>

      <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-balance text-ink sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-muted">{post.description}</p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{AUTHOR_NAME}</span>
          <span aria-hidden> · </span>
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span aria-hidden> · </span>
          {formatReadingTime(post.readingMinutes)}
        </p>
        {post.headerNote && (
          <Annotation kind="arrow" direction="left" label={post.headerNote} className="-rotate-2" />
        )}
      </div>
    </header>
  );
}
