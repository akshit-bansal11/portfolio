"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GoogleBadgeItem } from "@/types";

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
					src="https://svgl.app/library/google.svg"
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
			<div className="flex-1 flex items-center justify-center min-h-[3rem]">
				<h3 className="text-white font-semibold text-sm md:text-base text-center line-clamp-2 leading-tight">
					{gBadgeTitle}
				</h3>
			</div>

			{/* Divider with icon row */}
			<div className="flex items-center gap-2">
				<div className="flex-1 border-t border-neutral-800/60" />
				<Button
					variant="outline"
					size="icon"
					onClick={() => window.open(gBadgeLink, "_blank", "noopener,noreferrer")}
					className={cn(
						"h-8 w-8 rounded-full border-neutral-700 bg-neutral-900/50",
						"hover:bg-neutral-800 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300",
					)}
				>
					<GoArrowUpRight className="h-4 w-4" />
				</Button>
				<div className="flex-1 border-t border-neutral-800/60" />
			</div>
		</motion.div>
	);
}
