/*
 * layout.tsx
 * Layout for the /blog route segment. Loads the Caveat
 * handwriting font, wraps every blog page in the themed
 * notebook root, and sets shared metadata defaults.
 */

import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { BlogThemeRoot } from "@/components/blog/BlogThemeRoot";
import { BLOG_DESCRIPTION, BLOG_TITLE, SITE_URL } from "@/config/blogConfig";

// Handwritten layer for margin notes, annotations and sticky notes.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

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
  return <BlogThemeRoot className={caveat.variable}>{children}</BlogThemeRoot>;
}
