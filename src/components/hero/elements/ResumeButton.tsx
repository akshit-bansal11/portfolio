/*
 * ResumeButton.tsx
 * Download-resume CTA shown above the social icon row
 * during the hero socials stage. Wraps a Button-as-anchor
 * with a subtly bouncing arrow indicator.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RESUME_PATH } from "@/data/heroContent";

// Renders the resume download button.
export default function ResumeButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="group gap-2 dark:border-hero-ink/40 dark:bg-hero-surface/60 text-hero-ink/90 dark:hover:bg-hero-surface hover:text-hero-pen hover:border-hero-pen/50 transition-all duration-300 px-5 py-2 rounded-full"
    >
      <Link href={RESUME_PATH}>
        <span className="text-sm md:text-base font-medium">Download Resume</span>
        {/* Subtly bouncing down-arrow indicator. */}
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.span>
      </Link>
    </Button>
  );
}
