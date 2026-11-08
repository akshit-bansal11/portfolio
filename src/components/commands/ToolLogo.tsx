/*
 * ToolLogo.tsx
 * A tool's logo on a small fixed-light chip, so logos drawn for light backgrounds stay
 * readable in the dark theme. Decorative: the tool name always sits next to it.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  logo: string;
  /** Chip edge in px; the logo gets 6px of padding inside. */
  size: number;
  className?: string;
}

export default function ToolLogo({ logo, size, className }: ToolLogoProps) {
  const inner = size - 12;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg border border-rule bg-(--cmd-logo-chip)",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image unoptimized src={logo} alt="" width={inner} height={inner} />
    </span>
  );
}
