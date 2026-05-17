// components/common/badges/ExternalLinkBadge.tsx
"use client";

import type React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExternalLinkBadgeProps {
	href: string;
	className?: string;
	buttonClassName?: string;
	style?: React.CSSProperties;
}

export default function ExternalLinkBadge({
	href,
	className,
	buttonClassName,
	style,
}: ExternalLinkBadgeProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div className="flex-1 border-t border-neutral-800/60" />
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
			<div className="flex-1 border-t border-neutral-800/60" />
		</div>
	);
}
