"use client";

/**
 * Download-resume CTA shown above the social cluster in the final
 * beat. Mirrors the styling of the original `ProfileHeader` resume
 * button so the look-and-feel stays consistent across surfaces.
 */

import { motion } from "framer-motion";
import { FaArrowDownLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { RESUME_FILENAME, RESUME_PATH } from "@/data/heroContent";

export default function ResumeButton() {
	return (
		<Button
			asChild
			variant="outline"
			className="group gap-2 border-neutral-500 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300 px-5 py-2 rounded-full"
		>
			<a href={RESUME_PATH} download={RESUME_FILENAME} target="_blank" rel="noopener noreferrer">
				<span className="text-sm md:text-base font-medium">Download Resume</span>
				<motion.span
					animate={{ y: [0, 3, 0] }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
					className="inline-flex"
				>
					<FaArrowDownLong className="h-3.5 w-3.5" />
				</motion.span>
			</a>
		</Button>
	);
}
