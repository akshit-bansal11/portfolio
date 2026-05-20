"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import ExternalLinkBadge from "@/components/common/badges/ExternalLinkBadge";

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
					className="group-hover:filter-[drop-shadow(0_0_20px_var(--badge-glow))]"
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
			<ExternalLinkBadge
				href={link}
				className="px-3 w-full"
				style={{
					// NOTE: Dynamic hex-derived border and text color — must stay inline; cannot be expressed as Tailwind class
					borderColor: `${color}60`,
					color,
				}}
			/>
		</motion.div>
	);
};

export default HackerRankSkillBadge;
