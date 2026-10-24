/*
 * ResumeButton.tsx
 * "Download Resume" as the primary call to action: a pen-coloured button with a
 * hand-drawn outline (irregular border-radius). On hover and keyboard focus the
 * outline morphs to a second shape and the button lifts and tilts slightly.
 */

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { RESUME_PATH } from "@/data/heroContent";

// Renders the resume link.
export default function ResumeButton() {
  return (
    <Link
      href={RESUME_PATH}
      className="hand-border hand-border-morph inline-flex h-[52px] items-center gap-2 border-2 border-hero-ink bg-hero-pen px-5 font-grotesk font-semibold text-hero-bg outline-none hover:-translate-y-0.5 hover:-rotate-1 focus-visible:-translate-y-0.5 focus-visible:-rotate-1 active:translate-y-0 active:rotate-0 motion-reduce:transition-none"
    >
      Download Resume
      <ArrowDown aria-hidden className="h-4 w-4" strokeWidth={2.5} />
    </Link>
  );
}
