/*
 * NavBar.tsx
 * Persistent global navigation.
 * Two presentations toggled by scroll position: a
 * top-center pill while at the top, and a vertical
 * right-edge dock once the user is inside a section.
 * Hidden entirely on /skills and /projects routes.
 */

"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navConfigs } from "@/config/navConfig";
import { useAnimation } from "@/context/AnimationContext";
import { cn } from "@/lib/utils";

// Public props for the navbar.
interface NavBarProps {
	page?: string;
}

// Renders the global navbar.
export default function NavBar({ page }: NavBarProps) {
	// Resolve which navigation set to render based on the current route.
	const pathname = usePathname();
	const configKey = page || (pathname === "/" ? "home" : "projects");
	const navItems = navConfigs[configKey] || navConfigs.home;
	// Currently-active section id (from intersection observer).
	const [activeTab, setActiveTab] = useState<string | null>(null);
	// Currently-hovered tab (drives the animated highlight).
	const [hoveredTab, setHoveredTab] = useState<string | null>(null);
	// True once the user has scrolled past the top region.
	const [isScrolled, setIsScrolled] = useState(false);
	const { isHeroComplete } = useAnimation();

	// Skip effect if navbar is hidden
	const isHidden = pathname === "/skills" || pathname === "/projects";

	// On the home page the navbar waits until the hero choreography finishes.
	const isGatedByHero = configKey === "home" && !isHeroComplete;

	// Track active section + scroll position for switching presentations.
	useEffect(() => {
		if (configKey !== "home") return;

		// Update activeTab when a section becomes 50% visible.
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveTab(entry.target.id);
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersection, {
			threshold: 0.5,
			rootMargin: "-10% 0px -10% 0px",
		});

		// Observe every nav target that maps to an in-page section.
		navItems.forEach((item) => {
			if (!item.to.startsWith("/")) {
				const element = document.getElementById(item.to);
				if (element) observer.observe(element);
			}
		});

		// Combined scroll handler: resets active state at top, flips presentation.
		const handleScroll = () => {
			const scrollY = window.scrollY;
			if (scrollY < 100) {
				setActiveTab(null);
				setIsScrolled(false);
			} else {
				setIsScrolled(true);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, [configKey, navItems]);

	// Click handler for in-page nav buttons (smooth scroll + activate tab).
	const handleScroll = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			setActiveTab(id);
		}
	};

	if (isHidden || isGatedByHero) return null;

	return (
		<AnimatePresence mode="wait">
			{/* TOP NAVBAR — visible at the top of the page. */}
			{!isScrolled && (
				<motion.div
					key="top-navbar"
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -100, opacity: 0 }}
					transition={{ duration: 0.5, ease: "easeInOut" }}
					className="hidden md:flex justify-center p-4 fixed top-0 left-0 right-0 z-50 pointer-events-none"
				>
					<div className="bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-700/50 p-1.5 shadow-xl pointer-events-auto">
						<NavigationMenu>
							<NavigationMenuList className="flex-row space-x-1">
								{/* Render each nav entry with the correct presentation/handler. */}
								{navItems.map((item, index) => {
									const _Icon = item.icon;
									const isRoute = item.to?.startsWith("/");
									const isActive = activeTab === item.to || (isRoute && pathname === item.to);
									const isHovered = hoveredTab === item.to;

									return (
										<NavigationMenuItem key={index} className="relative">
											{isRoute ? (
												<Link
													href={item.to}
													className="relative z-20 flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 transition-colors duration-200 hover:text-white"
													onMouseEnter={() => setHoveredTab(item.to)}
													onMouseLeave={() => setHoveredTab(null)}
													onClick={() => setActiveTab(item.to)}
													data-active={isActive ? "true" : undefined}
												>
													<span className="hidden sm:inline">{item.text}</span>
												</Link>
											) : (
												<button
													type="button"
													className={cn(
														"relative z-20 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none",
														isActive ? "text-white" : "text-neutral-400 hover:text-white",
													)}
													onClick={(e) => handleScroll(e, item.to)}
													onMouseEnter={() => setHoveredTab(item.to)}
													onMouseLeave={() => setHoveredTab(null)}
												>
													<span className="hidden sm:inline">{item.text}</span>
												</button>
											)}

											{/* Animated active/hover highlight pill. */}
											{((isActive && !hoveredTab) || isHovered) && (
												<motion.div
													layoutId="nav-box-top"
													className="absolute inset-0 z-10 rounded-full bg-neutral-700/50 border border-neutral-600/50"
													initial={{ opacity: 0, scale: 0.95 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.95 }}
													transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
												/>
											)}
										</NavigationMenuItem>
									);
								})}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</motion.div>
			)}

			{/* SIDE NAVBAR — appears when inside a named section. */}
			{isScrolled && activeTab && (
				<motion.div
					key="side-navbar"
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 100, opacity: 0 }}
					transition={{ duration: 0.5, ease: "easeInOut" }}
					className="hidden md:flex fixed top-0 right-0 h-full flex-col justify-center pr-3 z-50 pointer-events-none"
				>
					<div className="bg-neutral-900/80 backdrop-blur-md rounded-full border border-neutral-700/50 p-1.5 shadow-xl pointer-events-auto flex flex-col items-center">
						<NavigationMenu>
							<NavigationMenuList className="flex-col space-y-2">
								{/* Vertical icon-only stack of nav entries. */}
								{navItems.map((item, index) => {
									const Icon = item.icon;
									const isRoute = item.to?.startsWith("/");
									const isActive = activeTab === item.to || (isRoute && pathname === item.to);
									const isHovered = hoveredTab === item.to;
									const colorClass = item.color ?? "text-neutral-400";

									return (
										<NavigationMenuItem key={index} className="relative">
											{isRoute ? (
												<Link
													href={item.to}
													className={cn(
														"relative z-20 flex items-center justify-center p-1.5 text-sm font-medium transition-colors duration-200",
														isActive || isHovered ? colorClass : "text-neutral-500",
													)}
													onMouseEnter={() => setHoveredTab(item.to)}
													onMouseLeave={() => setHoveredTab(null)}
													onClick={() => setActiveTab(item.to)}
													data-active={isActive ? "true" : undefined}
												>
													{Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
												</Link>
											) : (
												<button
													type="button"
													className={cn(
														"relative z-20 flex items-center justify-center p-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none",
														isActive || isHovered ? colorClass : "text-neutral-500",
													)}
													onClick={(e) => handleScroll(e, item.to)}
													onMouseEnter={() => setHoveredTab(item.to)}
													onMouseLeave={() => setHoveredTab(null)}
												>
													{Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
												</button>
											)}

											{/* Animated active/hover highlight pill (side variant). */}
											{((isActive && !hoveredTab) || isHovered) && (
												<motion.div
													layoutId="nav-box-side"
													className="absolute inset-0 z-10 rounded-full bg-neutral-700/50 border border-neutral-600/50"
													initial={{ opacity: 0, scale: 0.95 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.95 }}
													transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
												/>
											)}
										</NavigationMenuItem>
									);
								})}
							</NavigationMenuList>
						</NavigationMenu>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
