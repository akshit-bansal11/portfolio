"use client";

/**
 * Profile picture + name + role cluster.
 *
 * Journey:
 *   profile entry  → slides in from right, grows to peak size, centred
 *   profile dwell  → stays large and centred
 *   socials entry  → shrinks, floats upward (~25% from top), stays centred-x
 *   socials dwell  → held in the smaller-upper position
 *
 * A single DOM node with CSS transform avoids layout-gap issues because
 * the cluster uses column flex (image on top, text below) so there is no
 * horizontal gap between image and name — they are always stacked.
 */

import { type MotionValue, motion, useTransform } from "framer-motion";
import Image from "next/image";
import { entryEnd, HERO_STAGES } from "../config/stages";
import {
	PROFILE_IMAGE_HOVER_URL,
	PROFILE_IMAGE_URL,
	PROFILE_NAME,
	PROFILE_ROLE,
} from "../data/heroContent";

interface ProfileClusterProps {
	progress: MotionValue<number>;
}

const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

export default function ProfileCluster({ progress }: ProfileClusterProps) {
	const profile = HERO_STAGES.profile.range;
	const socials = HERO_STAGES.socials.range;

	const profileSettled = entryEnd(profile);
	const socialsSettled = entryEnd(socials);

	// ── X: slides in from right, stays centred the whole time ──────
	const x = useTransform(progress, [profile[0], profileSettled, 1], ["55vw", "0vw", "0vw"]);

	// ── Y: centred (0) → floats up to ~-22vh when socials settle ───
	const y = useTransform(
		progress,
		[profile[0], profile[1], socialsSettled, 1],
		["0vh", "0vh", "-15vh", "-15vh"],
	);

	// ── Opacity: fades in during profile entry ──────────────────────
	const opacity = useTransform(progress, [profile[0], profileSettled], [0, 1]);

	// ── Scale: peaks at 1 when centred, shrinks to 0.55 when up ────
	const scale = useTransform(
		progress,
		[profile[0], profileSettled, profile[1], socialsSettled, 1],
		[0.85, 1, 1, 0.8, 0.8],
	);

	return (
		<motion.div
			style={{ x, y, opacity, scale }}
			className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none will-change-transform"
		>
			{/* ── Image ──────────────────────────────────────────────── */}
			<div className="relative h-52 w-52 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 group cursor-pointer shrink-0 pointer-events-auto">
				{/* Coloured halo */}
				<motion.div
					aria-hidden
					className="absolute -inset-3 rounded-full bg-linear-to-br from-indigo-500/40 via-rose-500/30 to-amber-400/40 blur-2xl"
					animate={{ opacity: [0.5, 0.9, 0.5] }}
					transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
				/>
				{/* Rotating conic ring */}
				<motion.div
					aria-hidden
					className="absolute inset-0 rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
					style={{
						background:
							"conic-gradient(from 0deg, rgba(99,102,241,0.0), rgba(244,63,94,0.5), rgba(251,191,36,0.5), rgba(99,102,241,0.0))",
						WebkitMask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
						mask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
					}}
				/>
				<div className="relative h-full w-full rounded-full overflow-hidden bg-neutral-900 shadow-2xl ring-1 ring-white/10">
					<Image
						src={PROFILE_IMAGE_URL}
						alt={PROFILE_NAME}
						fill
						className="object-cover grayscale transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
						draggable={false}
						priority
					/>
					<Image
						src={PROFILE_IMAGE_HOVER_URL}
						alt=""
						fill
						className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
						draggable={false}
					/>
				</div>
			</div>

			{/* ── Name + role ─────────────────────────────────────────── */}
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
	);
}
