"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
	name: string;
	icon: string;
	stars: number;
	source?: string;
	delay?: number;
	link?: string;
	color?: string;
}

// Pointy-top hexagon (matches the reference image shape)
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const HackerRankSkillBadge = ({
	name,
	icon,
	stars,
	delay = 0,
	link = "",
	color = "#22C55E",
}: SkillBadgeProps) => {
	const totalStars = 5;

	// Derive a subtle glow rgba from the hex color
	const glowColor = `${color}40`; // 25% opacity version

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			whileInView={{
				y: 0,
				opacity: 1,
				transition: { duration: 0.5, ease: "easeOut", delay },
			}}
			whileHover={{ y: -6 }}
			viewport={{ once: true, amount: 0.3 }}
			className="flex flex-col items-center gap-4 group"
		>
			{/* ── Hexagon Badge ── */}
			<div className="relative">
				{/* Outer hex — acts as the colored border */}
				<div
					style={{
						clipPath: HEX_CLIP,
						background: color,
						width: "130px",
						height: "150px",
						padding: "1px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						filter: `drop-shadow(0 0 12px ${glowColor})`,
						transition: "filter 0.4s ease",
					}}
					className="group-hover:[filter:drop-shadow(0_0_20px_var(--badge-glow))]"
				>
					{/* Inner hex — dark fill */}
					<div
						style={{
							clipPath: HEX_CLIP,
							background: "linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)",
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
						}}
					>
						{/* Icon */}
						<Image
							src={icon}
							alt={name}
							width={36}
							height={36}
							className="h-9 w-9 object-contain drop-shadow-md transition-transform duration-400 group-hover:scale-110"
						/>

						{/* Name */}
						<span
							style={{ color: "#e5e5e5" }}
							className="text-xs font-bold tracking-wide text-center px-2 leading-tight group-hover:text-white transition-colors"
						>
							{name}
						</span>

						{/* Stars */}
						<div className="flex gap-0.5">
							{[...Array(totalStars)].map((_, idx) => (
								<FaStar
									key={idx}
									style={{
										fontSize: "9px",
										color: idx < stars ? color : "#3a3a3a",
										filter: idx < stars ? `drop-shadow(0 0 3px ${glowColor})` : "none",
										transition: "color 0.3s",
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ── Card footer — mirrors GoogleBadgeCard layout ── */}
			<div className={cn("w-full flex items-center gap-2 px-3")}>
				<div className="flex-1 border-t border-neutral-800/60" />
				<Button
					variant="outline"
					size="icon"
					onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
					style={{
						borderColor: `${color}60`,
						color: color,
					}}
					className={cn(
						"h-8 w-8 rounded-full bg-neutral-900/50",
						"hover:bg-neutral-800 transition-all duration-300",
					)}
				>
					<GoArrowUpRight className="h-4 w-4" />
				</Button>
				<div className="flex-1 border-t border-neutral-800/60" />
			</div>
		</motion.div>
	);
};

export default HackerRankSkillBadge;
