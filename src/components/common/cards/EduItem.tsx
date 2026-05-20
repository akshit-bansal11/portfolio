/*
 * EduItem.tsx
 * Single education-row card used in the Education section.
 * Shows institution + role on the left and a date badge
 * with the location on the right; animates in on view.
 */

"use client";

import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Public props for one education entry.
interface EduItemProps {
	location: string;
	company: string;
	role: string;
	date: string;
}

// Renders a single education card.
export default function EduItem({ location, company, role, date }: EduItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-full"
		>
			<Card className="w-full border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300">
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
						{/* Left column — institution and role/degree. */}
						<div>
							<h3 className="text-xl font-clash font-semibold text-white tracking-wide mb-1">
								{company}
							</h3>
							<p className="text-neutral-300 font-medium">{role}</p>
						</div>
						{/* Right column — date badge and location row. */}
						<div className="flex flex-col md:items-end gap-2 text-sm text-neutral-400">
							<Badge
								variant="outline"
								className="w-fit gap-2 border-neutral-700 text-neutral-400 font-normal"
							>
								<FaCalendarAlt className="h-3 w-3" />
								{date}
							</Badge>
							<div className="flex items-center gap-2">
								<FaMapMarkerAlt className="h-3 w-3" />
								<span>{location}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
