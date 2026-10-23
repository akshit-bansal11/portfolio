/*
 * Blog.tsx
 * Home-page Blog section: a typed heading with a handwritten aside, then one notebook
 * page per post (newest first) taped to the board. Each page is a single link to the
 * post; the newest one spans the full width with a handwritten "latest" mark.
 */

import Link from "next/link";
import { DrawnPath } from "@/components/blog/Annotation";
import Stamp from "@/components/hero/elements/Stamp";
import Tape from "@/components/hero/elements/Tape";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import { formatPostDate, formatReadingTime } from "@/lib/blog/format";
import { getAllPosts } from "@/lib/blog/posts";
import { sketchArrow, sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

// Resting tilt per page, within -1.5..1.5deg (full class names so Tailwind can see them).
const TILTS = [
  "-rotate-[1.2deg]",
  "rotate-[0.9deg]",
  "-rotate-[0.6deg]",
  "rotate-[1.4deg]",
  "-rotate-[1deg]",
  "rotate-[0.5deg]",
] as const;

// Ruled lines plus one red margin line, painted on the paper.
const PAPER_LINES = [
  "linear-gradient(to right, transparent calc(1.75rem - 1px), var(--card-margin) calc(1.75rem - 1px), var(--card-margin) 1.75rem, transparent 1.75rem)",
  "repeating-linear-gradient(to bottom, transparent 0 27px, var(--card-rule) 27px 28px)",
].join(", ");

// Wobbly underline drawn under the title on hover (viewBox 0 0 300 12).
const UNDERLINE = sketchLine(2, 7, 298, 5, { seed: 9, bow: 3 });

// Tiny arrow from the margin note toward the title.
const NOTE_ARROW = sketchArrow(4, 20, 30, 4, { seed: 71, curve: 0.3, headSize: 6 });

interface PostPageProps {
  post: BlogPost;
  index: number;
}

// One post as a taped notebook page; the whole page is the link.
function PostPage({ post, index }: PostPageProps) {
  const latest = index === 0;
  const titleId = `blog-post-${post.slug}`;

  return (
    <li
      className={cn(
        "group relative text-page-ink transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 focus-within:-translate-y-1 focus-within:rotate-0 motion-reduce:transition-none",
        TILTS[index % TILTS.length],
        latest && "md:col-span-2",
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-labelledby={titleId}
        className="block border border-page-border bg-page-bg py-6 pl-9 pr-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-ink sm:pr-6"
        style={{ backgroundImage: PAPER_LINES, boxShadow: "var(--note-shadow)" }}
      >
        <p className="font-grotesk text-sm text-page-muted">
          Part {post.part}
          <span aria-hidden> · </span>
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span aria-hidden> · </span>
          {formatReadingTime(post.readingMinutes)}
        </p>

        <h3
          id={titleId}
          className="mt-2 font-display text-2xl font-medium leading-tight tracking-[-0.01em] md:text-3xl"
        >
          {post.title}
        </h3>
        <svg
          aria-hidden
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          className="h-3 w-48 text-hero-pen"
        >
          <path
            d={UNDERLINE}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={1}
            className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-500 group-hover:[stroke-dashoffset:0] group-focus-within:[stroke-dashoffset:0] motion-reduce:transition-none"
          />
        </svg>

        <p className="mt-3 line-clamp-3 font-grotesk text-sm leading-relaxed md:text-base">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <Stamp key={tag} label={tag} index={i} onPaper />
            ))}
          </ul>
        )}

        {post.headerNote && (
          <p className="mt-4 flex items-end gap-1 font-hand text-2xl font-semibold leading-none text-hero-pen">
            <svg aria-hidden viewBox="0 0 34 24" className="h-6 w-8 shrink-0 overflow-visible">
              <DrawnPath d={NOTE_ARROW.shaft} duration={0.4} />
              <DrawnPath d={NOTE_ARROW.head} delay={0.4} duration={0.2} />
            </svg>
            {post.headerNote}
          </p>
        )}
      </Link>

      {latest && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-2 right-6 rotate-3 font-hand text-2xl font-bold leading-none text-hero-pen"
        >
          latest
        </span>
      )}
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
    </li>
  );
}

// Top-level Blog section component.
export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <ScrollSection id="blog" className="gap-10 md:gap-12 lg:gap-14">
      <SectionTitle title="Blog" aside="notes from the whiteboard" />
      <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {posts.map((post, index) => (
          <PostPage key={post.slug} post={post} index={index} />
        ))}
      </ul>
    </ScrollSection>
  );
}
