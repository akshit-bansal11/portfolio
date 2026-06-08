/*
 * ExpAccordionItem.tsx
 * Accordion-style experience card. Shows a compact header
 * row that toggles open to reveal description, bullet points,
 * skill pills, and an optional credential link.
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Calendar, ChevronDown, MapPin } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import CredentialLinkButton from "@/components/cards/CredentialLinkButton";
import ExpPointsList from "@/components/cards/ExpPointsList";
import ExpSkillsList from "@/components/cards/ExpSkillsList";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/experience";

// Renders a single accordion experience entry.
export default function ExpAccordionItem({
	company,
	role,
	date,
	location,
	points,
	generalPoint,
	certificate,
	logo,
	skills = [],
}: ExperienceItem) {
	const [isOpen, setIsOpen] = useState(false);

	const hasExpandableContent =
		!!generalPoint || points.length > 0 || skills.length > 0 || !!certificate;

	return (
		<div
			className={cn(
				"rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm overflow-hidden transition-colors duration-300",
				isOpen && "border-neutral-700/70 bg-neutral-900/80",
			)}
		>
			{/* ── Clickable header row ────────────────────────────── */}
			<button
				type="button"
				onClick={() => {
					if (hasExpandableContent) setIsOpen((prev) => !prev);
				}}
				className={cn(
					"flex w-full items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-4 md:px-6 md:py-5 text-left transition-colors duration-200",
					hasExpandableContent && "cursor-pointer hover:bg-white/[0.02]",
					!hasExpandableContent && "cursor-default",
				)}
			>
				{/* Company logo or briefcase fallback */}
				<div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-neutral-800 overflow-hidden">
					{logo ? (
						<Image
							src={logo as string | StaticImageData}
							alt={`${company} logo`}
							width={24}
							height={24}
							className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 object-contain"
						/>
					) : (
						<Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px] text-neutral-500" />
					)}
				</div>

				{/* Role + Company + Date (inline) */}
				<div className="flex flex-1 flex-col min-w-0 gap-0">
					<span className="text-xs sm:text-sm md:text-base lg:text-lg font-clash font-bold text-white tracking-wide truncate">
						{role}
					</span>
					<div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] sm:text-[11px] md:text-xs text-neutral-500">
						<span className="truncate">{company}</span>
						<span className="flex items-center gap-1 text-neutral-600">
							<Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-neutral-600" />
							{date}
						</span>
					</div>
				</div>

				{/* Right side: date badge + location + chevron */}
				<div className="hidden md:flex items-center gap-4 shrink-0">
					<div className="flex flex-col items-end gap-1">
						<span className="flex items-center gap-1.5 text-xs text-neutral-400">
							<Calendar className="h-3 w-3 text-amber-500/70" />
							{date}
						</span>
						<span className="flex items-center gap-1.5 text-xs text-neutral-500">
							<MapPin className="h-3 w-3 text-neutral-600" />
							{location}
						</span>
					</div>

					{hasExpandableContent && (
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
						>
							<ChevronDown className="h-4 w-4 text-neutral-500" />
						</motion.div>
					)}
				</div>

				{/* Mobile chevron */}
				{hasExpandableContent && (
					<motion.div
						className="md:hidden shrink-0"
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
					>
						<ChevronDown className="h-4 w-4 text-neutral-500" />
					</motion.div>
				)}
			</button>

			{/* ── Expandable body ─────────────────────────────────── */}
			<AnimatePresence initial={false}>
				{isOpen && hasExpandableContent && (
					<motion.div
						key="content"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 md:px-6 md:pb-6 border-t border-neutral-800/60">
							{/* Logo + description side-by-side on desktop */}
							<div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4">
								{/* Left column: logo + description */}
								<div className="md:w-2/5 min-w-0 shrink-0">
									{generalPoint && (
										<>
											<span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
												Description
											</span>
											<p className="mt-1.5 text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-neutral-400 leading-relaxed">
												{generalPoint}
											</p>
										</>
									)}

									{/* Skill pills */}
									<ExpSkillsList skills={skills} />
								</div>

								{/* Right column: key points */}
								{points.length > 0 && (
									<div className="md:w-3/5 min-w-0">
										<span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/70">
											Key Achievements
										</span>
										<div className="mt-2">
											<ExpPointsList points={points} />
										</div>
									</div>
								)}
							</div>

							{/* Credential link */}
							{certificate && (
								<div className="flex justify-end mt-4">
									<CredentialLinkButton href={certificate} />
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
