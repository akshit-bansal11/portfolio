import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.svgl.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "svgl.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media-server.akshitbansal.me",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

// MDX support for blog posts in src/content/blog. No remark/rehype plugins on purpose:
// heading ids and the table of contents are derived in src/lib/blog.
//
// Under webpack (`npm run dev` uses --webpack), Next's RSC aliases for react/jsx-runtime don't
// apply to .mdx files, and MDX's automatic JSX runtime crashes the page with "Cannot read
// properties of undefined (reading 'recentlyCreatedOwnerStacks')". The classic runtime
// (React.createElement) avoids that. MDX logs a deprecation notice for it, so it is only used
// with webpack; Turbopack (used by `next build`) keeps the default runtime.
const withMDX = createMDX({
  options: process.env.TURBOPACK
    ? {}
    : { jsxRuntime: "classic", pragma: "React.createElement", pragmaFrag: "React.Fragment" },
});

export default withMDX(nextConfig);
