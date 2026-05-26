/*
 * CertificationCard.tsx
 * Card for one certification entry in the Attainments
 * section. Shows provider logos, the credential title,
 * optional skill pills, and a footer link badge.
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ExternalLinkBadge from "@/components/badges/ExternalLinkBadge";
import type { CertificationItem } from "@/types/certification";

// Public props: extends CertificationItem with a flag to toggle skill pills.
export interface CertificationCardProps extends CertificationItem {
	showSkillBadges?: boolean;
}

// Renders a single certification card.
export default function CertificationCard({
	name,
	providers,
	skills,
	link,
	showSkillBadges = false,
}: CertificationCardProps) {
	// Spring entrance animation for the whole card.
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 100,
				damping: 10,
				delay: 0.1,
			},
		},
	};

	return (
		<motion.div
			className="group relative flex flex-col justify-between w-full p-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] hover:bg-[#111111] transition-colors duration-300 shadow-sm"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
		>
			<div className="flex flex-col gap-4">
				{/* Provider Logo Badges */}
				<div className="flex gap-2">
					{providers.map((p, idx) => (
						<div
							key={idx}
							className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10"
						>
							{/* Provider logo, with a single-letter fallback if none provided. */}
							{p.logoUrl ? (
								<Image
									src={p.logoUrl}
									alt={p.name}
									width={24}
									height={24}
									className="object-contain w-6 h-6"
								/>
							) : (
								<span className="text-lg font-bold text-neutral-300">{p.name.charAt(0)}</span>
							)}
						</div>
					))}
				</div>

				{/* Certification Name */}
				<div className="flex flex-col gap-1">
					<h3 className="text-neutral-100 font-semibold text-lg leading-tight line-clamp-2">
						{name}
					</h3>
					<p className="text-neutral-400 text-sm">{providers.map((p) => p.name).join(" & ")}</p>
				</div>

				{/* Skills Pills */}
				{showSkillBadges && skills && skills.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{skills.map((skill, idx) => (
							<span
								key={idx}
								className="px-2.5 py-1 text-xs font-medium text-neutral-300 bg-neutral-800/50 rounded-full border border-neutral-700/50"
							>
								{skill}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Link Button */}
			<div className="mt-6">
				<ExternalLinkBadge href={link} />
			</div>
		</motion.div>
	);
}
