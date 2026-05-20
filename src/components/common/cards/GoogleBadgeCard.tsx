/*
 * GoogleBadgeCard.tsx
 * Card for one Google Cloud Skill Boost generative-AI badge.
 * Shows a Google Cloud header strip, the badge title,
 * and an external-link badge that opens the public proof.
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ExternalLinkBadge from "@/components/common/badges/ExternalLinkBadge";
import { cn } from "@/lib/utils";
import type { GoogleBadgeItem } from "@/types";

// Renders a single Google badge card.
export default function GoogleBadgeCard({ gBadgeTitle, gBadgeLink }: GoogleBadgeItem) {
	return (
		<motion.div
			whileHover={{ y: -4 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"group relative flex flex-col gap-4 p-4 rounded-2xl",
				"border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm",
				"hover:border-neutral-700 hover:shadow-xl hover:shadow-black/50 transition-colors duration-300",
			)}
		>
			{/* Top section: Google Logo + Cloud */}
			<div className="flex items-center justify-center gap-2">
				<Image
					src="https://svgl.app/library/google-cloud.svg"
					alt="Google"
					width={20}
					height={20}
					className="h-5 w-5 object-contain"
				/>
				<span className="text-neutral-300 text-sm font-medium">Cloud</span>
			</div>

			{/* Divider */}
			<div className="border-t border-neutral-800" />

			{/* Middle section: Badge Title */}
			<div className="flex-1 flex items-center justify-center min-h-12">
				<h3 className="text-white font-semibold text-sm md:text-base text-center line-clamp-2 leading-tight">
					{gBadgeTitle}
				</h3>
			</div>

			{/* Divider with icon row */}
			<ExternalLinkBadge
				href={gBadgeLink}
				buttonClassName="hover:text-amber-400 hover:border-amber-400/50"
			/>
		</motion.div>
	);
}
