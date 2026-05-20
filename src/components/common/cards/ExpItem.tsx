/*
 * ExpItem.tsx
 * Single experience entry card.
 * Composes ExpHeader, an optional summary paragraph,
 * a bulleted points list, a row of skill pills, and
 * a credential link button when provided.
 */

"use client";
import { motion } from "framer-motion";
import CertificateLinkButton from "@/components/common/cards/CertificateLinkButton";
import ExpHeader from "@/components/common/cards/ExpHeader";
import ExpPointsList from "@/components/common/cards/ExpPointsList";
import ExpSkillsList from "@/components/common/cards/ExpSkillsList";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types";

// Renders one experience card.
export default function ExpItem({
	location,
	company,
	role,
	date,
	points,
	generalPoint,
	certificate,
	logo,
	skills = [],
}: ExperienceItem) {
	// Logo presence drives padding / background variants below.
	const hasLogo = !!logo;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.1 }}
			transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			className="w-full relative group"
		>
			<Card
				className={cn(
					"relative overflow-hidden border-neutral-800 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-[-2px]",
					hasLogo
						? "bg-neutral-900 group-hover:border-neutral-700/70"
						: "bg-neutral-900/50 group-hover:border-neutral-700/50",
				)}
			>
				{/* Soft top-left highlight overlay. */}
				<div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

				<CardContent className={cn("relative z-10", hasLogo ? "p-6 md:p-7" : "p-7")}>
					{/* Top header row (logo + meta or text-only). */}
					<ExpHeader company={company} role={role} location={location} date={date} logo={logo} />

					{/* Optional intro paragraph. */}
					{generalPoint && (
						<p className="mt-6 text-[14px] md:text-[15px] text-neutral-400 leading-relaxed">
							{generalPoint}
						</p>
					)}

					{/* Bulleted achievements/responsibilities list. */}
					<ExpPointsList points={points} indented={hasLogo} />

					{/* Skill pills row. */}
					<ExpSkillsList skills={skills} />

					{/* Optional credential/proof link button (positioned per layout). */}
					{certificate && (
						<CertificateLinkButton
							href={certificate}
							className={hasLogo ? "mt-5" : "mt-4 md:mt-0 md:absolute md:bottom-6 md:right-7"}
						/>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
