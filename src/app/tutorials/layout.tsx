/*
 * layout.tsx
 * Layout for the /tutorials route segment. Wraps every tutorial in the
 * themed notebook root (same tokens as the blog), loads the tutorial
 * styles (tones, code colours) and sets metadata defaults.
 */

import type { Metadata } from "next";
import { BlogThemeRoot } from "@/components/blog/BlogThemeRoot";
import { SITE_URL } from "@/config/blogConfig";
import "./tutorials.css";

const TUTORIALS_TITLE = "Tutorials";
const TUTORIALS_DESCRIPTION =
  "Hands-on, step-by-step tutorials you complete on your own machine, with checkpoints and fixes for the errors you will hit.";

// Defaults inherited by every tutorial.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${TUTORIALS_TITLE} | Akshit Bansal`,
    template: `%s | ${TUTORIALS_TITLE}`,
  },
  description: TUTORIALS_DESCRIPTION,
  openGraph: {
    siteName: TUTORIALS_TITLE,
    type: "website",
    locale: "en_US",
  },
};

export default function TutorialsLayout({ children }: { children: React.ReactNode }) {
  return <BlogThemeRoot>{children}</BlogThemeRoot>;
}
