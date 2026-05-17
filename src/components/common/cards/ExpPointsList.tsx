import { cn } from "@/lib/utils";
import type { ExperiencePoint } from "@/types";

interface ExpPointsListProps {
	points: ExperiencePoint[];
	indented?: boolean;
}

export default function ExpPointsList({ points, indented = false }: ExpPointsListProps) {
	if (!points.length) return null;

	return (
		<ul className={cn("space-y-3", indented ? "mt-6" : "space-y-4")}>
			{points.map((point, idx) => {
				const isLabeled = typeof point !== "string";

				return (
					<li key={idx} className="flex gap-3 text-neutral-400 group/item leading-relaxed">
						<div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/30 group-hover/item:bg-amber-500 group-hover/item:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
						<span className="text-[14px] md:text-[15px] group-hover/item:text-neutral-200 transition-colors duration-300">
							{isLabeled ? (
								<>
									<span className="font-semibold text-neutral-200">{point.label}: </span>
									{point.body}
								</>
							) : (
								point
							)}
						</span>
					</li>
				);
			})}
		</ul>
	);
}
