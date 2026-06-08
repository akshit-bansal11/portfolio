/*
 * EduItem.tsx
 * Single education-row card used in the Education section.
 * Shows institution + role on the left and a date badge
 * with the location on the right; animates in on view.
 */

"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EducationItem } from "@/types/education";

// Renders a single education card.
export default function EduItem({ location, company, role, date }: EducationItem) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full"
		>
			<Card className="w-full border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300">
				<CardContent className="p-2 sm:p-3 md:p-6">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-4">
						{/* Left column — institution and role/degree. */}
						<div>
							<h3 className="text-base text-sm md:text-xl font-clash md:font-semibold text-white tracking-wide mb-0.5 sm:mb-1">
								{company}
							</h3>
							<p className="text-sm text-neutral-300 md:font-medium">{role}</p>
						</div>
						{/* Right column — date badge and location row. */}
						<div className="flex flex-col item-start md:items-end gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-400">
							<Badge
								variant="outline"
								className="w-fit scale-70 md:scale-100 origin-top-left gap-1.5 sm:gap-2 border-neutral-700 text-neutral-400 font-normal text-xs sm:text-sm"
							>
								<Calendar className="h-3 w-3" />
								{date}
							</Badge>
							<div className="flex items-center gap-1.5 sm:gap-2">
								<MapPin className="h-3 w-3" />
								<span>{location}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
