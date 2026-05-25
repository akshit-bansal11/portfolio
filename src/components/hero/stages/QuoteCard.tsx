/*
 * QuoteCard.tsx — improved
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
					className="absolute inset-0 rounded-2xl"
					style={{
						background: "rgba(6, 6, 12, 0.58)",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
					}}
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

				{/* Border — brightens on hover */}
				<motion.div
					aria-hidden
					className="absolute inset-0 rounded-2xl pointer-events-none"
					animate={{
						boxShadow: hovered
							? "inset 0 0 0 1px rgba(255,255,255,0.28), 0 16px 48px rgba(0,0,0,0.55)"
							: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.35)",
					}}
					transition={{ duration: 0.22 }}
				/>

				{/* ── Quote content ─────────────────────────────────────── */}
				<div
					className="relative z-10 px-8 py-10 md:px-10 md:py-14"
					style={{ width: "clamp(280px, 22vw, 340px)" }}
				>
					<div className="flex items-start gap-4">
						<QuoteMark open className="shrink-0 mt-1.5 w-7 h-7 text-indigo-300 opacity-55" />

						<div className="flex flex-col gap-3">
							<p className="text-lg md:text-xl font-semibold text-white/90 leading-snug">
								I don&apos;t just make applications.
							</p>

							<span className="block text-lg md:text-xl font-bold leading-snug text-indigo-300">
								I deliver solutions.
							</span>

							<p className="text-sm md:text-base text-white/40 leading-relaxed mt-1">
								From appealing frontends to reliable backends
								<br />
								to secure environments.
							</p>
						</div>
					</div>

					<div className="flex justify-end mt-5">
						<QuoteMark open={false} className="w-6 h-6 text-rose-300 opacity-35" />
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

// ─── SVG quotation mark ───────────────────────────────────────────────────────
function QuoteMark({ open, className }: { open: boolean; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden
			role="presentation"
			style={{ transform: open ? "none" : "rotate(180deg) scaleX(-1)" }}
		>
			<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
		</svg>
	);
}
