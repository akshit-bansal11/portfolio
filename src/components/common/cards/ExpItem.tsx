"use client";
import { motion } from "framer-motion";
import CertificateLinkButton from "@/components/common/cards/CertificateLinkButton";
import ExpHeader from "@/components/common/cards/ExpHeader";
import ExpPointsList from "@/components/common/cards/ExpPointsList";
import ExpSkillsList from "@/components/common/cards/ExpSkillsList";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types";

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
				<div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

				<CardContent className={cn("relative z-10", hasLogo ? "p-6 md:p-7" : "p-7")}>
					<ExpHeader company={company} role={role} location={location} date={date} logo={logo} />

					{generalPoint && (
						<p className="mt-6 text-[14px] md:text-[15px] text-neutral-400 leading-relaxed">
							{generalPoint}
						</p>
					)}

					<ExpPointsList points={points} indented={hasLogo} />

					<ExpSkillsList skills={skills} />

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
