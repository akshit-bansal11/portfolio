/*
 * layout.tsx
 * Layout for the /blog route segment. Wraps every blog page
 * in the themed notebook root and sets shared metadata
 * defaults. (The Caveat font is loaded once in the root layout.)
 */

import type { Metadata } from "next";
import { BlogThemeRoot } from "@/components/blog/BlogThemeRoot";
import { BLOG_DESCRIPTION, BLOG_TITLE, SITE_URL } from "@/config/blogConfig";

// Defaults inherited by the index and every post.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BLOG_TITLE} | Akshit Bansal`,
    template: `%s | ${BLOG_TITLE}`,
  },
  description: BLOG_DESCRIPTION,
  openGraph: {
    siteName: BLOG_TITLE,
    type: "website",
    locale: "en_US",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <BlogThemeRoot>{children}</BlogThemeRoot>;
}
