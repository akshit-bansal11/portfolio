/*
 * Pipe.tsx
 * A short connector between two cards with a packet riding it while `active`. It runs
 * down on phones and across from `md` up. `reverse` sends the packet the other way
 * (up / left). With an optional label for what is travelling.
 */

import { cn } from "@/lib/utils";
import styles from "./motion.module.css";

interface PipeProps {
  active: boolean;
  reverse?: boolean;
  tone?: string;
  label?: string;
}

export default function Pipe({ active, reverse, tone = "cyan", label }: PipeProps) {
  return (
    <div
      data-tone={tone}
      className="flex flex-none flex-row items-center justify-center gap-2 py-1 md:flex-col md:py-0"
    >
      <span
        aria-hidden
        className={cn(
          styles.pipe,
          reverse && styles.reverse,
          !active && styles.idle,
          "transition-opacity duration-300",
          !active && "opacity-50",
        )}
      >
        <span className={styles.packet} />
        <span className={styles.head} />
      </span>
      {label && (
        <span
          className={cn(
            "max-w-[9rem] text-center font-mono text-[0.7rem] leading-tight text-(--tone) transition-opacity duration-300",
            !active && "opacity-0",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
