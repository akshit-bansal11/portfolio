/*
 * Blog.tsx
 * Home-page Blog section: a typed heading with a handwritten aside, then one notebook
 * page per post (newest first) taped to the board. See PostCard for the page itself.
 */

import PostCard from "@/components/blog/PostCard";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import { getAllPosts } from "@/lib/blog/posts";

// Top-level Blog section component.
export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <ScrollSection id="blog" className="gap-10 md:gap-12 lg:gap-14">
      <SectionTitle title="Blog" aside="notes from the whiteboard" />
      <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} basePath="/blog" label="Part" />
        ))}
      </ul>
    </ScrollSection>
  );
}
