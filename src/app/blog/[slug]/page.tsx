/*
 * page.tsx
 * /blog/[slug] — a single post. Statically generated for
 * every registered slug: loads the MDX module, builds SEO
 * metadata, and lays out the sticky table of contents, the
 * article (with reading progress) and the margin-note column.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostHeader from "@/components/blog/PostHeader";
import PostNav from "@/components/blog/PostNav";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ThemeToggle from "@/components/blog/ThemeToggle";
import { AUTHOR_NAME } from "@/config/blogConfig";
import { blogPosts } from "@/data/blogPosts";
import { getPost } from "@/lib/blog/posts";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Only registered slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: AUTHOR_NAME }],
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      authors: [AUTHOR_NAME],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { default: PostContent } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>

      <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <TableOfContents headings={post.headings} variant="sidebar" />
        </aside>

        <div className="min-w-0 xl:pr-[296px]">
          <ReadingProgress className="mx-auto max-w-[42.5rem]">
            <article data-blog-article>
              <PostHeader post={post} />
              <TableOfContents headings={post.headings} variant="inline" className="lg:hidden" />
              <PostContent />
            </article>
            <PostNav previous={blogPosts[post.part - 2]} next={blogPosts[post.part]} />
          </ReadingProgress>
        </div>
      </div>
    </main>
  );
}
