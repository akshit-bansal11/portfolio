/*
 * ExternalLinkBadge.tsx
 * Decorative external-link CTA: two Separator rules with a small
 * round anchor in the middle. Opens the given href in a new tab.
 * Used as the footer of credential cards.
 */

import { ArrowUpRight } from "lucide-react";
import type React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Public props for the badge.
interface ExternalLinkBadgeProps {
	href: string;
	className?: string;
	buttonClassName?: string;
	style?: React.CSSProperties;
}

// Renders the badge layout: separator — anchor — separator.
export default function ExternalLinkBadge({
	href,
	className,
	buttonClassName,
	style,
}: ExternalLinkBadgeProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Left rule. */}
			<Separator className="flex-1 bg-neutral-800/60" />
			{/* Round anchor that opens the href in a new tab. */}
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				style={style}
				className={cn(
					"flex h-8 w-8 items-center justify-center rounded-full",
					"bg-neutral-900/50 border border-neutral-700",
					"hover:bg-neutral-800 transition-all duration-300",
					buttonClassName,
				)}
			>
				<ArrowUpRight className="h-4 w-4" />
			</a>
			{/* Right rule. */}
			<Separator className="flex-1 bg-neutral-800/60" />
		</div>
	);
}
