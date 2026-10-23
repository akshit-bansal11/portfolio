/*
 * SocialIcon.tsx
 * One social link as a plain icon with a 44px target. On hover or keyboard
 * focus a hand-drawn circle draws itself around the icon in the pen colour
 * (shown fully drawn under reduced motion).
 */

"use client";

import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { IconType } from "react-icons";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchEllipse } from "@/lib/blog/sketch";

const CIRCLE = sketchEllipse(22, 22, 19, 19, { seed: 27 });

interface SocialIconProps {
  href: string;
  label: string;
  Icon: LucideIcon | IconType;
}

// Renders the icon link.
export default function SocialIcon({ href, label, Icon }: SocialIconProps) {
  const [active, setActive] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="relative flex h-11 w-11 items-center justify-center text-hero-ink/75 outline-none transition-colors hover:text-hero-ink focus-visible:text-hero-ink"
    >
      <Icon className="h-6 w-6" />
      {active && (
        <svg
          aria-hidden
          viewBox="0 0 44 44"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-hero-pen"
        >
          <DrawnPath d={CIRCLE} duration={0.5} />
        </svg>
      )}
    </a>
  );
}
