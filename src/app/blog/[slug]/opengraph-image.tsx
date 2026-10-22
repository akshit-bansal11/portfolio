/*
 * opengraph-image.tsx
 * Generates the 1200x630 social preview image for each post
 * at build time: notebook paper, the post title, tags and a
 * hand-drawn underline.
 */

import { ImageResponse } from "next/og";
import { BLOG_TITLE } from "@/config/blogConfig";
import { blogPosts } from "@/data/blogPosts";

export const alt = `${BLOG_TITLE} — a sketched systems design explainer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);
  const title = post?.title ?? BLOG_TITLE;
  const tags = post?.tags ?? [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#fbf8f1",
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, #e4dccb 47px, #e4dccb 48px)",
        color: "#1c1917",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: "#c2410c", fontWeight: 700 }}>
        {BLOG_TITLE} · akshitbansal.me
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <svg width="520" height="24" viewBox="0 0 520 24" style={{ marginTop: 18 }}>
          <path
            d="M4 14 Q160 4 516 12"
            fill="none"
            stroke="#c2410c"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              fontSize: 26,
              padding: "6px 18px",
              borderRadius: 999,
              border: "2px solid #1c1917",
            }}
          >
            #{tag}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
