/*
 * page.tsx
 * /tutorials/[slug] — a single tutorial. Statically generated for
 * every registered slug: loads the MDX module with the tutorial kit,
 * builds SEO metadata, and lays out the sticky table of contents,
 * the article (with reading progress) and the PDF download buttons.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostHeader from "@/components/blog/PostHeader";
import PostNav from "@/components/blog/PostNav";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ThemeToggle from "@/components/blog/ThemeToggle";
import DownloadPdf from "@/components/tutorials/DownloadPdf";
import { tutorialComponents } from "@/components/tutorials/mdxComponents";
import { AUTHOR_NAME } from "@/config/blogConfig";
import { tutorials } from "@/data/tutorials";
import { getTutorial } from "@/lib/tutorials/posts";

interface TutorialPageProps {
  params: Promise<{ slug: string }>;
}

// Only registered slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return tutorials.map((tutorial) => ({ slug: tutorial.slug }));
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getTutorial(slug);
  if (!tutorial) return {};

  const url = `/tutorials/${tutorial.slug}`;
  return {
    title: tutorial.title,
    description: tutorial.description,
    authors: [{ name: AUTHOR_NAME }],
    keywords: tutorial.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: tutorial.title,
      description: tutorial.description,
      url,
      publishedTime: tutorial.publishedAt,
      authors: [AUTHOR_NAME],
      tags: tutorial.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: tutorial.title,
      description: tutorial.description,
    },
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { slug } = await params;
  const tutorial = await getTutorial(slug);
  if (!tutorial) notFound();

  const { default: Content } = await import(`@/content/tutorials/${slug}.mdx`);

  return (
    <main className="mx-auto max-w-[78rem] px-4 pt-24 pb-28 sm:px-6 md:pt-28">
      <div className="mb-6 flex flex-wrap items-start justify-end gap-3 print:hidden">
        <DownloadPdf />
        <ThemeToggle />
      </div>

      <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block print:hidden">
          <TableOfContents headings={tutorial.headings} variant="sidebar" />
        </aside>

        <div className="min-w-0 xl:pr-[296px] print:pr-0">
          <ReadingProgress className="mx-auto max-w-[42.5rem] print:max-w-none">
            <article data-blog-article data-tutorial-article>
              <PostHeader
                post={tutorial}
                backHref="/#tutorials"
                backLabel="All tutorials"
                partLabel="Tutorial"
              />
              <TableOfContents
                headings={tutorial.headings}
                variant="inline"
                className="lg:hidden print:hidden"
              />
              <Content components={tutorialComponents} />
            </article>
            <PostNav
              previous={tutorials[tutorial.part - 2]}
              next={tutorials[tutorial.part]}
              basePath="/tutorials"
              className="print:hidden"
            />
          </ReadingProgress>
        </div>
      </div>
    </main>
  );
}
