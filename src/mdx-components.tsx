/*
 * mdx-components.tsx
 * Required by @next/mdx. Maps markdown elements in blog posts
 * to styled components (headings get stable ids for the table
 * of contents) and makes the shared blog components available
 * in every MDX file without imports.
 */

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import Analogy from "@/components/blog/Analogy";
import { Annotation, Mark } from "@/components/blog/Annotation";
import CaseFile from "@/components/blog/CaseFile";
import DemoFrame from "@/components/blog/DemoFrame";
import Figure from "@/components/blog/Figure";
import MarginNote from "@/components/blog/MarginNote";
import SettingsTable from "@/components/blog/SettingsTable";
import { Takeaway, TLDR } from "@/components/blog/TLDR";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { sketchLine } from "@/lib/blog/sketch";
import { nodeToText, slugify } from "@/lib/blog/slugify";
import { cn } from "@/lib/utils";

// Wavy hand-drawn divider used for markdown "---".
const DIVIDER = [0, 1, 2].map((i) =>
  sketchLine(10 + i * 4, 10 + i * 3, 190 - i * 4, 10 + i * 3, { seed: 20 + i, bow: 3 }),
);

// Section heading with an id and a hover-revealed anchor link.
function Heading({
  level,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  const id = slugify(nodeToText(children));

  return (
    <Tag
      id={id}
      className={cn(
        "group relative scroll-mt-28 font-bold tracking-tight text-balance text-ink",
        level === 2
          ? "mt-20 mb-5 text-3xl sm:text-[2.1rem] sm:leading-tight"
          : "mt-12 mb-3 text-xl sm:text-2xl",
        className,
      )}
      {...props}
    >
      <a
        href={`#${id}`}
        aria-label={`Link to section: ${nodeToText(children)}`}
        className="absolute top-0 -left-6 hidden font-hand text-pen opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:block"
      >
        #
      </a>
      {children}
    </Tag>
  );
}

const components: MDXComponents = {
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  p: ({ className, ...props }) => (
    <p className={cn("my-5 text-[1.075rem] leading-[1.8] text-ink", className)} {...props} />
  ),
  a: ({ href = "", className, children, ...props }) => {
    const linkClass = cn(
      "font-medium text-ink underline decoration-pen decoration-2 underline-offset-4 transition-colors hover:text-pen",
      className,
    );
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} className={linkClass} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  },
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-5 list-disc space-y-2 pl-6 text-[1.075rem] leading-[1.75] marker:text-pen",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-5 list-decimal space-y-2 pl-6 text-[1.075rem] leading-[1.75] marker:font-hand marker:text-lg marker:text-pen",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => <li className={cn("pl-1", className)} {...props} />,
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-ink", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 border-l-4 border-pen pl-5 text-lg text-ink-muted italic [&>p]:text-ink-muted",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-md border border-rule bg-paper-raised px-1.5 py-0.5 font-mono text-[0.88em] text-ink",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-7 overflow-x-auto rounded-xl border-2 border-ink bg-paper-raised p-4 text-sm leading-relaxed text-ink sm:p-5",
        "[&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[0.85rem]",
        className,
      )}
      {...props}
    />
  ),
  hr: () => (
    <svg aria-hidden viewBox="0 0 200 20" className="mx-auto my-14 h-5 w-48 text-ink-muted">
      {DIVIDER.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  ),
  Analogy,
  Annotation,
  CaseFile,
  DemoFrame,
  Figure,
  MarginNote,
  Mark,
  ScrollReveal,
  SettingsTable,
  Takeaway,
  TLDR,
};

// Called by @next/mdx for every MDX file.
export function useMDXComponents(): MDXComponents {
  return components;
}
