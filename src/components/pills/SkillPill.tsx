/*
 * SkillPill.tsx
 * Compact pill displaying a skill's icon and name.
 * Used across category bento grids and experience
 * cards as a unified tech-stack chip.
 */

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";

// Public props for the pill.
interface SkillPillProps {
	skill: Skill;
}

// Floating popover rendered into document.body via a portal.
function Popover({ skill, anchor }: { skill: Skill; anchor: DOMRect }) {
	const GAP = 10; // px gap between pill and popover
	const popoverRef = useRef<HTMLDivElement>(null);
	const [pos, setPos] = useState({ top: 0, left: 0 });
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!popoverRef.current) return;
		const popH = popoverRef.current.offsetHeight;
		const popW = popoverRef.current.offsetWidth;
		const vw = window.innerWidth;

		// Prefer above; fall back to below.
		let top = anchor.top + window.scrollY - popH - GAP;
		if (top < window.scrollY + 8) {
			top = anchor.bottom + window.scrollY + GAP;
		}

		// Centre horizontally over the pill, clamp to viewport.
		let left = anchor.left + anchor.width / 2 - popW / 2;
		left = Math.max(8, Math.min(left, vw - popW - 8));

		setPos({ top, left });
		setReady(true);
	}, [anchor]);

	return (
		<div
			ref={popoverRef}
			style={{
				position: "absolute",
				top: pos.top,
				left: pos.left,
				opacity: ready ? 1 : 0,
				transition: "opacity 0.1s",
				zIndex: 9999,
				pointerEvents: "none",
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 6, scale: 0.96 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 4, scale: 0.97 }}
				transition={{ duration: 0.18, ease: "easeOut" }}
				className={cn(
					"min-w-[160px] max-w-[220px] rounded-2xl px-4 py-3",
					"bg-neutral-900 border border-neutral-700/60",
					"shadow-xl shadow-black/60",
				)}
			>
				<ul className="space-y-1">
					{(skill.usedIn ?? []).map((place) => (
						<li key={place} className="text-[13px] text-neutral-200 flex items-center gap-2">
							<span className="w-1 h-1 rounded-full bg-neutral-500 shrink-0" />
							{place}
						</li>
					))}
				</ul>
			</motion.div>
		</div>
	);
}

// Renders a single home-page skill pill with hover popover.
const SkillPill = ({ skill }: SkillPillProps) => {
	const isExpItem = (skill.variant ?? "skillSection") === "expItem";
	const [hovered, setHovered] = useState(false);
	const [anchor, setAnchor] = useState<DOMRect | null>(null);
	const pillRef = useRef<HTMLDivElement>(null);

	const handleMouseEnter = () => {
		if (pillRef.current) {
			setAnchor(pillRef.current.getBoundingClientRect());
		}
		setHovered(true);
	};

	const handleMouseLeave = () => {
		setHovered(false);
		setAnchor(null);
	};

	return (
		<>
			<motion.div
				ref={pillRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				whileHover={{ y: -3 }}
				transition={{ type: "spring", stiffness: 320, damping: 22 }}
				className={cn(
					"flex items-center rounded-full cursor-default select-none",
					"bg-neutral-800/70 border border-neutral-700/50",
					"hover:border-neutral-500/60 hover:bg-neutral-800 transition-colors",
					isExpItem ? "gap-2 px-4 py-2" : "gap-3 px-5 py-2.5",
				)}
			>
				<Image
					src={skill.Icon}
					alt={skill.name}
					width={isExpItem ? 14 : 22}
					height={isExpItem ? 14 : 22}
					className={
						isExpItem
							? "h-[18px] w-[18px] object-contain opacity-80"
							: "h-[22px] w-[22px] object-contain"
					}
				/>
				<span
					className={cn(
						"whitespace-nowrap",
						isExpItem ? "text-[13px] text-neutral-400" : "text-[15px] text-neutral-200",
					)}
				>
					{skill.name}
				</span>
			</motion.div>

			{!isExpItem &&
				hovered &&
				anchor &&
				(skill.usedIn?.length ?? 0) > 0 &&
				createPortal(<Popover skill={skill} anchor={anchor} />, document.body)}
		</>
	);
};

export default SkillPill;
