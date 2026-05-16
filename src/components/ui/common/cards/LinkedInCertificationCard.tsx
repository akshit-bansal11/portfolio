"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import type { LinkedInCertificationItem } from "@/types";

export default function LinkedInCertificationCard({
	name,
	providers,
	skills,
	link,
}: LinkedInCertificationItem) {
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
							<Image
								src={p.logoUrl}
								alt={p.name}
								width={24}
								height={24}
								className="object-contain w-6 h-6"
							/>
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
			</div>

			{/* Link Button */}
			<div className="mt-6 flex items-center justify-between">
				<div className="flex-1 border-t border-neutral-800/60 mr-4" />
				<Button
					variant="outline"
					size="icon"
					onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
					className="h-8 w-8 rounded-full bg-neutral-900/50 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-300 shrink-0"
				>
					<GoArrowUpRight className="h-4 w-4" />
				</Button>
			</div>
		</motion.div>
	);
}
