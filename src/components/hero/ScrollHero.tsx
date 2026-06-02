/*
 * ScrollHero.tsx
 * Single responsive hero component.
 *
 * Mobile / tablet (< lg):
 *   A plain stacked section — badge, tagline, profile photo,
 *   name, role, ribbon, resume button, socials. No scroll magic.
 *
 * Desktop (≥ lg):
 *   Pinned, four-stage scroll-driven hero canvas. Owns the
 *   scroll-progress source, mounts each stage (tagline, profile,
 *   socials, jumpto) plus the backdrop and indicator, and reports
 *   completion to the context.
 */

"use client";

import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
	entryEnd,
	HERO_HORIZONTAL_END,
	HERO_SCROLL_LENGTH_VH,
	HERO_STAGES,
} from "@/config/heroStages";
import { useAnimation } from "@/context/AnimationContext";
import {
	PROFILE_IMAGE_HOVER_URL,
	PROFILE_NAME,
	PROFILE_ROLE,
	RESUME_FILENAME,
	RESUME_PATH,
	TAGLINE,
	TAGLINE_ACCENT_CLASS,
	TAGLINE_CLASSNAME,
} from "@/data/heroContent";
import { heroSocialLinks } from "@/data/heroSocialLinks";
import { getSocialAccent } from "@/data/socialAccents";
import { useHeroScrollProgress } from "@/hooks/use-hero-scroll-progress";
import { cn } from "@/lib/utils";
import HeroBackdrop from "./backdrop/HeroBackdrop";
import AkshitBansalBadge from "./elements/AkshitBansalBadge";
import AnimatedText from "./elements/AnimatedText";
import JumpToPanel from "./elements/JumpToPanel";
import ProfileCluster from "./elements/ProfileCluster";
import QuoteCard from "./elements/QuoteCard";
import SocialsStage from "./stages/SocialsStage";
import TaglineStage from "./stages/TaglineStage";

// Pre-compute name halves for the gradient styling on the surname.
const FIRST_NAME = PROFILE_NAME.split(" ")[0];
const LAST_NAME = PROFILE_NAME.split(" ").slice(1).join(" ");

// One social icon button — used in the mobile layout's static icon row.
function MobileSocialButton({
	href,
	label,
	Icon,
	index,
}: {
	href: string;
	label: string;
	Icon: IconType;
	index: number;
}) {
	const accent = getSocialAccent(label);
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 + index * 0.07 }}
			className="relative group"
		>
			<Button
				asChild
				variant="outline"
				size="icon"
				aria-label={label}
				className={cn(
					"h-9 w-9 rounded-lg border-neutral-700 bg-neutral-900/60",
					"text-neutral-300 ring-1 transition-all duration-300",
					accent.ring,
					accent.hoverBg,
					accent.hoverBorder,
					accent.hoverText,
					"hover:scale-110",
				)}
			>
				<a href={href} target="_blank" rel="noopener noreferrer">
					<Icon className="h-5 w-5" />
				</a>
			</Button>
		</motion.div>
	);
}

// Renders the full pinned scroll hero (desktop) plus a static mobile layout.
export default function ScrollHero() {
	// Tall wrapper ref + 0..1 progress driving every desktop stage.
	const { wrapperRef, progress } = useHeroScrollProgress();
	const { isWelcomeComplete, isHeroComplete, setHeroComplete, setHeroProgress } = useAnimation();

	// Register the progress MotionValue globally so the fixed ScrollIndicator can read it.
	useEffect(() => {
		setHeroProgress(progress);
	}, [progress, setHeroProgress]);

	// Mark the hero "complete" once progress crosses the horizontal end threshold.
	useMotionValueEvent(progress, "change", (latest) => {
		const shouldBeComplete = latest >= HERO_HORIZONTAL_END;
		if (shouldBeComplete !== isHeroComplete) {
			setHeroComplete(shouldBeComplete);
		}
	});

	// ── Stage 4 flex layout (desktop) ───────────────────────────────────
	const jumptoRange = HERO_STAGES.jumpto.range;
	const jumptoStart = jumptoRange[0];
	const jumptoSettled = entryEnd(jumptoRange);
	const entrySpan = jumptoSettled - jumptoStart;
	const stage4X = useTransform(progress, [jumptoStart, jumptoSettled, 1], ["60vw", "0vw", "0vw"]);
	const stage4Opacity = useTransform(
		progress,
		[jumptoStart, jumptoStart + entrySpan * 0.25, jumptoSettled],
		[0, 0.9, 1],
	);

	return (
		<>
			{/* ── Mobile / tablet layout (hidden on lg+) ────────────────────────
			    Plain static stack — no scroll driver needed. All content
			    renders immediately at its settled visual state.              */}
			<section
				id="profile"
				aria-label="Hero introduction"
				className="relative z-0 w-full bg-[#030303] overflow-hidden lg:hidden"
			>
				{/* Decorative ambient backdrop for mobile/tablet section. */}
				<HeroBackdrop />

				{/* ── Stage 1: Badge + Tagline (Centered in Viewport) ── */}
				<div className="w-full min-h-svh flex flex-col items-center justify-center px-6 py-12 text-center">
					<div className="flex flex-col items-center gap-6">
						<AkshitBansalBadge active={true} />
						<AnimatedText
							text={TAGLINE}
							stagger={150}
							animateBy="words"
							direction="top"
							active={true}
							wordClassName={() => TAGLINE_ACCENT_CLASS}
							className={TAGLINE_CLASSNAME}
						/>
					</div>
				</div>

				{/* ── Stage 2: Profile photo + name + role + socials (Reveals on Scroll) ── */}
				<div className="w-full min-h-svh flex flex-col items-center justify-center px-6 py-12 text-center">
					<ScrollReveal direction="up" delay={50} className="w-full flex justify-center">
						<div className="flex flex-col items-center gap-6 w-full">
							{/* Profile circle */}
							<div className="relative h-40 w-40 sm:h-48 sm:w-48">
								{/* Ambient halo */}
								<div
									aria-hidden
									className="absolute -inset-3 rounded-full bg-linear-to-br from-indigo-500/40 via-rose-500/30 to-amber-400/40 blur-2xl pointer-events-none"
								/>
								{/* Rotating conic ring */}
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
								{/* Photo */}
								<div className="absolute inset-0 rounded-full overflow-hidden bg-neutral-900 shadow-2xl ring-1 ring-white/10">
									<Image
										src={PROFILE_IMAGE_HOVER_URL}
										alt={PROFILE_NAME}
										fill
										className="object-cover"
										draggable={false}
										priority
									/>
								</div>
							</div>

							{/* Name + role */}
							<div className="flex flex-col items-center gap-1 text-center">
								<h1 className="font-clash font-bold tracking-tight whitespace-nowrap text-4xl sm:text-5xl leading-[0.95]">
									<span className="text-white">{FIRST_NAME}</span>{" "}
									<span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 via-white/90 to-rose-300">
										{LAST_NAME}
									</span>
								</h1>
								<p className="text-sm sm:text-base text-neutral-400 font-light whitespace-nowrap">
									{PROFILE_ROLE}
								</p>
							</div>

							{/* Resume download CTA */}
							<div>
								<Button
									asChild
									variant="outline"
									size="sm"
									className="h-8 gap-1.5 border-neutral-500 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 rounded-full px-3"
								>
									<a
										href={RESUME_PATH}
										download={RESUME_FILENAME}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span className="text-xs font-medium">Download Resume</span>
									</a>
								</Button>
							</div>

							{/* Social icons */}
							<div className="relative">
								<div
									aria-hidden
									className="absolute -inset-3 rounded-xl bg-linear-to-r from-indigo-500/20 via-rose-500/20 to-amber-400/20 blur-xl"
								/>
								<div className="relative flex gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-900/70 backdrop-blur-md border border-neutral-700/60 shadow-xl">
									{heroSocialLinks.map(({ Icon, href, name }, index) => (
										<MobileSocialButton
											key={href}
											href={href}
											label={name}
											Icon={Icon}
											index={index}
										/>
									))}
								</div>
							</div>
						</div>
					</ScrollReveal>
				</div>
			</section>

			{/* ── Desktop layout (hidden below lg) ─────────────────────────────
			    Pinned, four-stage scroll-driven hero canvas.              */}
			<section
				id="profile"
				ref={wrapperRef}
				className="relative w-full hidden lg:block"
				style={{ height: `${HERO_SCROLL_LENGTH_VH}vh` }}
				aria-label="Hero introduction"
			>
				{/* Pinned, viewport-sized inner canvas. */}
				<div className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-[#030303]">
					{/* Decorative ambient backdrop. */}
					<HeroBackdrop />

					{/* The four hero stages — each consumes the same scroll progress. */}
					<TaglineStage progress={progress} active={isWelcomeComplete} />
					<ProfileCluster progress={progress} />

					<SocialsStage progress={progress} />

					{/* ── Stage 4: Three-column flex layout ────────────────────────
					     Uses justify-between so the QuoteCard naturally centres
					     between the left profile/socials region and the right
					     JumpTo panel. Each column is a flex item. */}
					<motion.div
						style={{ x: stage4X, opacity: stage4Opacity }}
						className="absolute inset-0 flex items-center justify-between px-8 md:px-12 lg:px-16 pointer-events-none z-20"
					>
						{/* Left spacer — matches the space occupied by profile + socials */}
						<div className="w-[28vw] shrink-0" />

						{/* Centre — Quote card */}
						<div className="flex items-center justify-center flex-1">
							<QuoteCard progress={progress} />
						</div>

						{/* Right — Jump to panel */}
						<div className="shrink-0">
							<JumpToPanel />
						</div>
					</motion.div>

					{/* Scroll affordance hint is now rendered as a fixed overlay in layout.tsx. */}
				</div>
			</section>
		</>
	);
}
