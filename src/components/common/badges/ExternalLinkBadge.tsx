/*
 * ExternalLinkBadge.tsx
 * Decorative external-link CTA: two thin rules with a small
 * round arrow-up-right button in the middle. Opens the given
 * href in a new tab. Used as the footer of credential cards.
 */

"use client";

import type React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Public props for the badge.
interface ExternalLinkBadgeProps {
	href: string;
	className?: string;
	buttonClassName?: string;
	style?: React.CSSProperties;
}

// Renders the badge layout: hr — button — hr.
export default function ExternalLinkBadge({
	href,
	className,
	buttonClassName,
	style,
}: ExternalLinkBadgeProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			{/* Left rule. */}
			<div className="flex-1 border-t border-neutral-800/60" />
			{/* Round button that opens the href in a new tab. */}
			<Button
				variant="outline"
				size="icon"
				onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
				style={style}
				className={cn(
					"h-8 w-8 rounded-full bg-neutral-900/50 border-neutral-700",
					"hover:bg-neutral-800 transition-all duration-300",
					buttonClassName,
				)}
			>
				<GoArrowUpRight className="h-4 w-4" />
			</Button>
			{/* Right rule. */}
			<div className="flex-1 border-t border-neutral-800/60" />
		</div>
	);
}
