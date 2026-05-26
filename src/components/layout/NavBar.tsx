/*
 * NavBar.tsx
 * Persistent global navigation.
 * Centered top bar with icons and hover tooltip labels.
 * Appears only once the user has scrolled past the full hero
 * and reached the first content section.
 * Hidden on /skills and /projects routes.
 */

"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { HERO_HORIZONTAL_END, HERO_SCROLL_LENGTH_VH } from "@/config/heroStages";
import { navConfigs } from "@/config/navConfig";
import { useAnimation } from "@/context/AnimationContext";
import { cn } from "@/lib/utils";

interface NavBarProps {
	page?: string;
}

export default function NavBar({ page }: NavBarProps) {
	const pathname = usePathname();
	const configKey = page || (pathname === "/" ? "home" : "projects");
	const navItems = navConfigs[configKey] || navConfigs.home;
	const [hoveredTab, setHoveredTab] = useState<string | null>(null);
	const { isWelcomeComplete } = useAnimation();

	// True once the user has scrolled past the entire hero wrapper
	// and the first content section has come into view.
	const [isPastHero, setIsPastHero] = useState(false);

	const isHidden = pathname === "/skills" || pathname === "/projects";

	// scrollY at which progress=1 for the hero wrapper: (vh - 1) * innerHeight

	useEffect(() => {
		if (configKey !== "home") return;

		const threshold = (HERO_SCROLL_LENGTH_VH / 100 - 1) * window.innerHeight;

		const handleScroll = () => {
			setIsPastHero(window.scrollY >= threshold);
		};

		// Check immediately in case the page reloads mid-scroll.
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [configKey]);

	// For non-home pages (e.g. /projects sub-route) always show the bar.
	const shouldShow = isWelcomeComplete && !isHidden && (configKey !== "home" || isPastHero);

	// Click handler: scroll to an in-page section anchor.
	const handleScrollTo = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
		e.preventDefault();

		// "profile" is the hero section — navigate to the hero's completion
		// point (the last stage of the horizontal scroll) rather than the top.
		if (id === "profile") {
			const heroEnd = (HERO_SCROLL_LENGTH_VH / 100 - 1) * window.innerHeight;
			window.scrollTo({
				top: HERO_HORIZONTAL_END * heroEnd,
				behavior: "smooth",
			});
			return;
		}

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<AnimatePresence>
			{shouldShow && (
				<motion.div
					key="navbar"
					initial={{ y: -80, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -80, opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					className="hidden md:flex justify-center pt-3 fixed top-0 left-0 right-0 z-50 pointer-events-none"
				>
					<div className="bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-700/50 px-1.5 py-1.5 shadow-2xl pointer-events-auto">
						<div className="flex flex-row items-center gap-0">
							{navItems.map((item, index) => {
								const Icon = item.icon;
								const isRoute = item.to?.startsWith("/");
								const isHovered = hoveredTab === item.to;

								const iconEl = Icon ? (
									<Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
								) : null;

								const baseClass = cn(
									"flex items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-200 text-neutral-400 cursor-pointer focus:outline-none",
									isHovered ? "text-white bg-neutral-700/50" : "hover:text-neutral-200",
								);

								return (
									<div key={index} className="relative flex flex-col items-center">
										{isRoute ? (
											<Link
												href={item.to}
												className={baseClass}
												onMouseEnter={() => setHoveredTab(item.to)}
												onMouseLeave={() => setHoveredTab(null)}
											>
												{iconEl}
											</Link>
										) : (
											<button
												type="button"
												className={baseClass}
												onClick={(e) => handleScrollTo(e, item.to)}
												onMouseEnter={() => setHoveredTab(item.to)}
												onMouseLeave={() => setHoveredTab(null)}
											>
												{iconEl}
											</button>
										)}

										{/* Tooltip with upward arrow */}
										<AnimatePresence>
											{isHovered && (
												<motion.div
													initial={{ opacity: 0, y: 4, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 4, scale: 0.95 }}
													transition={{ duration: 0.12, ease: "easeOut" }}
													className="absolute top-full mt-1.5 pointer-events-none"
												>
													{/* Arrow pointing up */}
													<div className="flex justify-center -mb-px">
														<div className="w-2 h-2 bg-neutral-800 border-l border-t border-neutral-700/60 rotate-45 translate-y-px" />
													</div>
													{/* Label */}
													<div className="px-2.5 py-1 bg-neutral-800 rounded-md text-xs font-medium text-white whitespace-nowrap border border-neutral-700/60 shadow-lg">
														{item.text}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								);
							})}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
