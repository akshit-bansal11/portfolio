/*
 * OpenSourceBadge.tsx
 * Tiny emerald pill labelled "open source" that flags
 * project cards whose source is publicly available.
 */

// Public props for the badge.
interface OpenSourceBadgeProps {
	className?: string;
}

// Renders an emerald-tinted "open source" pill.
export default function OpenSourceBadge({ className }: OpenSourceBadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ${className ?? ""}`}
		>
			open source
		</span>
	);
}
