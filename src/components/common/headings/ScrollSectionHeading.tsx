/*
 * ScrollSectionHeading.tsx
 * Standard section heading used at the top of every
 * scroll section. Reveals from the left and animates
 * its gradient fill on hover.
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Public props for the heading.
interface ScrollSectionHeadingProps {
	heading: string;
}

// Renders the gradient-filled, slide-in section heading.
function ScrollSectionHeading({ heading }: ScrollSectionHeadingProps) {
	return (
		<motion.h1
			initial={{ x: "-70px", opacity: 0 }}
			whileInView={{
				x: "0px",
				opacity: 1,
				transition: { duration: 0.5, ease: "easeInOut" },
			}}
			className={cn(
				"w-fit lg:text-7xl md:text-4xl text-2xl",
				"font-clash font-extrabold capitalize",
				"bg-linear-to-r from-amber-500 via-orange-500 to-pink-500",
				"hover:bg-linear-to-r hover:to-amber-500 hover:via-orange-500 hover:from-pink-500",
				"transition-colors ease-in-out duration-500",
				"transition-colors ease-in-out duration-500",
				"bg-clip-text text-transparent bg-linear-to-r",
			)}
		>
			{heading}
		</motion.h1>
	);
}

export default ScrollSectionHeading;
