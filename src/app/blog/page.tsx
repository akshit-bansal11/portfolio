/*
 * page.tsx
 * /blog index: a notebook-style header and one card per
 * published post (newest first) with tags and reading time.
 */

import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Annotation, Mark } from "@/components/blog/Annotation";
import PostCard from "@/components/blog/PostCard";
import ThemeToggle from "@/components/blog/ThemeToggle";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/config/blogConfig";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: { absolute: `${BLOG_TITLE} | Akshit Bansal` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: "/blog",
  },
  twitter: {
    card: "summary",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-4xl px-4 pt-24 pb-24 sm:px-6 md:pt-28">
      <div className="mb-10 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden
          />
          Back to home
        </Link>
        <ThemeToggle />
      </div>

      <header className="blog-ruled mb-14 rounded-2xl border-2 border-ink bg-paper-raised px-5 pt-8 pb-10 sm:px-10">
        <p className="font-hand text-2xl text-pen">the notebook</p>
        <h1 className="mt-1 text-5xl font-bold tracking-tight text-ink sm:text-6xl">
          <Mark kind="underline" seed={14}>
            {BLOG_TITLE}
          </Mark>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
          Deep dives into systems design for developers and the curious. Every idea starts as a{" "}
          <Mark kind="highlight">real-life analogy</Mark>, gets a diagram you can poke at, and ends
          with what real companies actually did about it.
        </p>
        <Annotation
          kind="arrow"
          direction="down-right"
          label="start here"
          className="mt-4 ml-auto flex w-fit"
        />
      </header>

      <section aria-label="Posts" className="space-y-10">
        {posts.map((post, index) => (
          <ScrollReveal key={post.slug} delay={index * 80}>
            <PostCard post={post} index={posts.length - index} />
          </ScrollReveal>
        ))}
      </section>
    </main>
  );
}
