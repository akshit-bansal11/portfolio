/*
 * ExpHeader.tsx
 * Header block for an experience card. Has two layouts:
 * with a logo (logo + divider + meta) or without
 * (stacked headings with a side date badge).
 */

import Image, { type StaticImageData } from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

// Public props for the header.
interface ExpHeaderProps {
	company: string;
	role: string;
	location: string;
	date: string;
	logo?: string | StaticImageData;
}

// Renders the appropriate header layout based on whether a logo is provided.
export default function ExpHeader({ company, role, location, date, logo }: ExpHeaderProps) {
	// ── Variant A: with company logo ──────────────────────────────────
	if (logo) {
		return (
			<div className="flex items-stretch gap-4 md:gap-6">
				{/* Logo tile. */}
				<div className="relative h-14 w-14 md:h-20 md:w-20 shrink-0 rounded-xl bg-white/5 border border-neutral-800 overflow-hidden">
					<Image
						src={logo}
						alt={`${company} logo`}
						fill
						sizes="(max-width: 768px) 56px, 80px"
						className="object-contain p-2"
					/>
				</div>

				{/* Vertical divider rule between logo and text. */}
				<div
					aria-hidden
					className="w-px self-stretch bg-linear-to-b from-transparent via-neutral-700/70 to-transparent"
				/>

				{/* Text column: company / role / location + date. */}
				<div className="flex flex-1 flex-col justify-center min-w-0 gap-1.5">
					<span className="text-2xl font-thin text-neutral-400">{company}</span>
					<h3 className="text-lg md:text-2xl font-clash font-bold text-white tracking-wide leading-tight group-hover:text-amber-400 transition-colors duration-300">
						{role}
					</h3>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs md:text-sm text-neutral-400">
						<span className="flex items-center gap-1.5">
							<FaMapMarkerAlt className="h-3 w-3 text-neutral-500" />
							{location}
						</span>
						<span aria-hidden className="text-neutral-700">
							•
						</span>
						<span className="flex items-center gap-1.5">
							<FaCalendarAlt className="h-3 w-3 text-amber-500/70" />
							{date}
						</span>
					</div>
				</div>
			</div>
		);
	}

	// ── Variant B: text-only header (no logo) ─────────────────────────
	return (
		<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
			{/* Left column: company + role. */}
			<div className="space-y-1">
				<h3 className="text-2xl font-clash font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
					{company}
				</h3>
				<p className="text-lg text-neutral-300 font-medium tracking-wide">{role}</p>
			</div>
			{/* Right column: date badge + location. */}
			<div className="flex flex-col md:items-end gap-3">
				<Badge
					variant="outline"
					className="px-3 py-1 bg-white/5 border-neutral-800 text-neutral-300 font-medium gap-2 hover:bg-white/10 transition-colors"
				>
					<FaCalendarAlt className="h-3 w-3 text-amber-500/80" />
					{date}
				</Badge>
				<div className="flex items-center gap-2 text-sm text-neutral-500 font-medium px-1">
					<FaMapMarkerAlt className="h-3 w-3 text-neutral-600" />
					<span>{location}</span>
				</div>
			</div>
		</div>
	);
}
