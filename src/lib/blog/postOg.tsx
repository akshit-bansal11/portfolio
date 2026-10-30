/*
 * postOg.tsx
 * Shared 1200x630 social preview image for blog posts and tutorials:
 * notebook paper, a kicker line, the title, a hand-drawn underline and tags.
 */

import { ImageResponse } from "next/og";

const OG_SIZE = { width: 1200, height: 630 };

// Renders the preview image for one post.
export function postOgImage(kicker: string, title: string, tags: string[]) {
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
        {kicker}
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
    OG_SIZE,
  );
}
