/*
 * ProfileCluster.tsx
 * Profile cluster handling the full hero lifecycle.
 * Slides in, flips logo→photo on click, fades the
 * hover callouts as socials begin, shrinks upward,
 * and slides left to make room for the JumpTo panel.
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { PROFILE_IMAGE_HOVER_URL, PROFILE_NAME, PROFILE_ROLE } from "@/data/heroContent";
import HoverCallout from "./HoverCallout";
import LogoMark from "./LogoMark";

// Public props for the cluster.
interface ProfileClusterProps {
	progress: MotionValue<number>;
}

// Pre-compute name halves so the gradient styling can target the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// Renders the entire profile cluster across all four hero stages.
export default function ProfileCluster({ progress }: ProfileClusterProps) {
	// Pull stage ranges and their settled points for transform math.
	const profile = HERO_STAGES.profile.range;
	const socials = HERO_STAGES.socials.range;
	const jumpto = HERO_STAGES.jumpto.range;

	const profileSettled = entryEnd(profile);
	const socialsSettled = entryEnd(socials);
	const jumptoSettled = entryEnd(jumpto);

	// Tracks whether the photo side of the flip card is showing.
	const [flipped, setFlipped] = useState(false);

	// Auto-flip when socials stage begins; reset if scrolled back before socials.
	useMotionValueEvent(progress, "change", (latest) => {
		const prev = progress.getPrevious();
		if (prev !== undefined) {
			if (prev < socials[0] && latest >= socials[0] && !flipped) {
				setFlipped(true);
			}
			if (prev >= socials[0] && latest < socials[0] && flipped) {
				setFlipped(false);
			}
		} else {
			if (latest >= socials[0] && !flipped) setFlipped(true);
			if (latest < socials[0] && flipped) setFlipped(false);
		}
	});

	// Horizontal motion: enter from right, hold center, slide left for jumpto.
	const x = useTransform(
		progress,
		[profile[0], profileSettled, jumpto[0], jumptoSettled, 1],
		["55vw", "0vw", "0vw", "-28vw", "-28vw"],
	);
	// Vertical motion: drift upward as socials begin to make space.
	const y = useTransform(
		progress,
		[profile[0], profile[1], socialsSettled, 1],
		["0vh", "0vh", "-15vh", "-15vh"],
	);
	// Fade in at profile entry.
	const opacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);
	// Subtle scale: grow during entry, shrink during socials.
	const scale = useTransform(
		progress,
		[profile[0], profileSettled, profile[1], socialsSettled, 1],
		[0.85, 1, 1, 0.8, 0.8],
	);

	return (
		<>
			{/* Floating callouts around the profile circle. */}
			<HoverCallout side="left" progress={progress} hovered={flipped} />
			<HoverCallout side="right" progress={progress} />

			<motion.div
				style={{ x, y, opacity, scale }}
				className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none will-change-transform"
			>
				{/* ── Circle ─────────────────────────────────────────── */}
				<button
					type="button"
					className="relative h-52 w-52 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 pointer-events-auto cursor-pointer bg-transparent border-0 p-0 outline-none"
					style={{ perspective: "900px" }}
					aria-label="Profile image — click to reveal colour photo"
					onClick={() => setFlipped((f) => !f)}
				>
					{/* ── 3-D flip sandwich ─────────────────────────────── */}
					<motion.div
						className="relative h-full w-full"
						animate={{ rotateY: flipped ? 180 : 0 }}
						transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
						style={{ transformStyle: "preserve-3d" }}
					>
						{/* Coloured halo — part of the sandwich */}
						<motion.div
							aria-hidden
							className="absolute -inset-3 rounded-full bg-linear-to-br from-indigo-500/40 via-rose-500/30 to-amber-400/40 blur-2xl pointer-events-none"
							animate={{ opacity: [0.5, 0.9, 0.5] }}
							transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
						/>
						{/* Rotating conic ring — part of the sandwich */}
						<motion.div
							aria-hidden
							className="absolute inset-0 rounded-full pointer-events-none"
							animate={{ rotate: 360 }}
							transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
							style={{
								background:
									"conic-gradient(from 0deg, rgba(99,102,241,0.0), rgba(244,63,94,0.5), rgba(251,191,36,0.5), rgba(99,102,241,0.0))",
								WebkitMask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
								mask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
							}}
						/>

						{/* FRONT — logo on near-black bg */}
						<div
							className="absolute inset-0 rounded-full overflow-hidden bg-[#070707] shadow-2xl ring-1 ring-white/10 flex items-center justify-center"
							style={{ backfaceVisibility: "hidden" }}
						>
							<LogoMark className="w-[52%] h-[52%] opacity-90" />
						</div>

						{/* BACK — colored profile photo only (shown on hover reveal) */}
						<div
							className="absolute inset-0 rounded-full overflow-hidden bg-neutral-900 shadow-2xl ring-1 ring-white/10"
							style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
						>
							<Image
								src={PROFILE_IMAGE_HOVER_URL}
								alt={PROFILE_NAME}
								fill
								className="object-cover"
								draggable={false}
								priority
							/>
						</div>
					</motion.div>
				</button>

				{/* ── Name + role ─────────────────────────────────────── */}
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="font-clash font-bold tracking-tight whitespace-nowrap text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95]">
						<span className="text-white">{FIRST_NAME}</span>{" "}
						<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-white/90 to-rose-300">
							{LAST_NAME}
						</span>
					</h1>
					<h2 className="text-sm sm:text-base md:text-xl lg:text-2xl text-neutral-400 font-light whitespace-nowrap">
						{PROFILE_ROLE}
					</h2>
				</div>
			</motion.div>
		</>
	);
}
