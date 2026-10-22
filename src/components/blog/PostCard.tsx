/*
 * PostCard.tsx
 * Card for one post on the /blog index. On hover or keyboard
 * focus it lifts, scribbles an underline under the title and
 * nudges its arrow. Shows tags, date and reading time.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { REDUCED_MOTION_STROKE } from "@/components/blog/Annotation";
import { formatPostDate, formatReadingTime } from "@/lib/blog/format";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface PostCardProps {
  post: BlogPost;
  className?: string;
}

const MotionLink = motion.create(Link);

// Wobbly underline drawn under the title on hover (viewBox 0 0 300 12).
const UNDERLINE = sketchLine(2, 7, 298, 5, { seed: 9, bow: 3 });

export default function PostCard({ post, className }: PostCardProps) {
  return (
    <MotionLink
      href={`/blog/${post.slug}`}
      initial="rest"
      animate="rest"
      whileHover="active"
      whileFocus="active"
      variants={{
        rest: { y: 0, boxShadow: "4px 4px 0 0 var(--blog-ink)" },
        active: { y: -4, boxShadow: "8px 8px 0 0 var(--blog-ink)" },
      }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn(
        "group relative block rounded-2xl border-2 border-ink bg-paper-raised p-6 sm:p-8",
        "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-pen",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-3 right-5 font-hand text-5xl leading-none text-ink-muted/40"
      >
        {String(post.part).padStart(2, "0")}
      </span>

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

      <h2 className="relative inline text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {post.title}
      </h2>
      <svg
        aria-hidden
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        className="mt-1 h-3 w-48 text-pen"
      >
        <motion.path
          d={UNDERLINE}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          className={REDUCED_MOTION_STROKE}
          variants={{
            rest: { pathLength: 0, opacity: 0 },
            active: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </svg>

      <p className="mt-3 leading-relaxed text-ink-muted">{post.description}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
        <p>
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span aria-hidden> · </span>
          {formatReadingTime(post.readingMinutes)}
        </p>
        <span className="inline-flex items-center gap-2 font-hand text-xl text-pen">
          read it
          <motion.span
            aria-hidden
            variants={{ rest: { x: 0 }, active: { x: 6 } }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            →
          </motion.span>
        </span>
      </div>
    </MotionLink>
  );
}
