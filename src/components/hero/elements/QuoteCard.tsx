/*
 * QuoteCard.tsx — "What I believe in" card, improved
 * - Removed ambient back gradient
 * - 3D tilt range cranked up (±18° X / ±24° Y vs old ±7/10)
 * - Tighter spring (stiffer, less damping = snappier follow)
 * - perspective pushed closer (600px) for more dramatic effect
 * - Removed shimmer sweep (felt cheap, killed it)
 * - Border and glow now driven off tilt magnitude for physical feel
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { BELIEFS_HEADING } from "@/data/heroContent";
import BeliefsList from "./BeliefsList";

interface QuoteCardProps {
  progress: MotionValue<number>;
}

function calcTilt(rect: DOMRect, cx: number, cy: number): { rotateX: number; rotateY: number } {
  const nx = (cx - (rect.left + rect.width / 2)) / (rect.width / 2);
  const ny = (cy - (rect.top + rect.height / 2)) / (rect.height / 2);
  // Clamped to avoid extreme angles at card edges
  return {
    rotateX: Math.max(-18, Math.min(18, -ny * 18)),
    rotateY: Math.max(-24, Math.min(24, nx * 24)),
  };
}

export default function QuoteCard({ progress }: QuoteCardProps) {
  const jumptoStart = HERO_STAGES.jumpto.range[0];
  const jumptoSettled = entryEnd(HERO_STAGES.jumpto.range);
  const entrySpan = jumptoSettled - jumptoStart;

  const cardEnterStart = jumptoStart + entrySpan * 0.15;
  const cardEnterEnd = jumptoStart + entrySpan * 0.85;

  const opacity = useTransform(progress, [cardEnterStart, cardEnterEnd], [0, 1]);
  const yPx = useTransform(progress, [cardEnterStart, cardEnterEnd], ["28px", "0px"]);
  const scale = useTransform(progress, [cardEnterStart, cardEnterEnd], [0.92, 1]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);

  // Dynamic highlight position based on mouse — gives a "light source" feel
  const [highlightPos, setHighlightPos] = useState({ x: 50, y: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt(calcTilt(rect, e.clientX, e.clientY));
    setHighlightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const onLeave = () => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
    setHighlightPos({ x: 50, y: 50 });
  };

  return (
    <motion.div style={{ opacity, y: yPx, scale }} className="pointer-events-auto">
      {/* ── 3D tilt card ─────────────────────────────────────────── */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: hovered ? 1.04 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 420, // was 300 — snappier follow
          damping: 22, // was 26 — less over-damped
          mass: 0.4, // was 0.6 — lighter feel
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "600px", // was 900px — tighter = more dramatic
        }}
        className="relative rounded-2xl overflow-hidden cursor-default select-none"
      >
        {/* Glass background */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-hero-surface/60 border border-hero-ink/10 backdrop-blur-xl"
        />

        {/* Dynamic specular highlight — follows mouse like a light source */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: `radial-gradient(circle at ${highlightPos.x}% ${highlightPos.y}%, rgba(255,255,255,0.07) 0%, transparent 65%)`,
          }}
        />

        {/* Border — brightens on hover (shadow derived from the hero tokens, so it shows in both themes) */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-200 motion-reduce:transition-none"
          style={{
            boxShadow: hovered
              ? "inset 0 0 0 1px color-mix(in srgb, var(--hero-ink) 28%, transparent), 0 16px 48px color-mix(in srgb, var(--hero-ink) 18%, transparent)"
              : "inset 0 0 0 1px color-mix(in srgb, var(--hero-ink) 8%, transparent), 0 4px 20px color-mix(in srgb, var(--hero-ink) 10%, transparent)",
          }}
        />

        {/* ── Beliefs content ───────────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col gap-5 px-7 py-8 md:px-9 md:py-10"
          style={{ width: "clamp(300px, 24vw, 380px)" }}
        >
          <h3 className="text-lg font-semibold text-hero-ink/90 md:text-xl">{BELIEFS_HEADING}</h3>
          <BeliefsList progress={progress} />
        </div>
      </motion.div>
    </motion.div>
  );
}
