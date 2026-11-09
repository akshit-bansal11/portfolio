/*
 * Tutorials.tsx
 * Home-page Tutorials section: same notebook-page cards as the Blog, one per tutorial
 * (newest first), linking to /tutorials/<slug>.
 */

import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import { commandTools } from "@/data/commands";
import { getAllTutorials } from "@/lib/tutorials/posts";

// Top-level Tutorials section component.
export default async function Tutorials() {
  const tutorials = await getAllTutorials();

  return (
    <ScrollSection id="tutorials" className="gap-10 md:gap-12 lg:gap-14">
      <SectionTitle title="Tutorials" aside="build it, break it, fix it" />
      <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {tutorials.map((tutorial, index) => (
          <PostCard
            key={tutorial.slug}
            post={tutorial}
            index={index}
            basePath="/tutorials"
            label="Tutorial"
          />
        ))}
      </ul>
      <Link
        href="/tutorials/commands"
        className="w-fit text-ink underline underline-offset-4 hover:text-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen"
      >
        Command reference: cheat sheets for {commandTools.length} tools
      </Link>
    </ScrollSection>
  );
}
