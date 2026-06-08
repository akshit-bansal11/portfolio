/*
 * CredentialPill.tsx
 * Compact pill row that displays a credential on mobile.
 * Layout: [icon] [title + provider] [→ button]
 * Used in the Attainments section to replace full cards
 * on narrow viewports.
 */

"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CredentialPillItem } from "@/types/credential-pill";

interface CredentialPillProps {
	item: CredentialPillItem;
	className?: string;
}

export default function CredentialPill({ item, className }: CredentialPillProps) {
	return (
		<a
			href={item.href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"group/pill flex items-center gap-3 px-3 py-2 rounded-full",
				"bg-neutral-900/60 border border-neutral-800/60 backdrop-blur-sm",
				"hover:border-neutral-600 hover:bg-neutral-800/80",
				"transition-all duration-300",
				className,
			)}
		>
			{/* Provider icon */}
			<div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0">
				<Image
					src={item.iconUrl}
					alt={item.iconAlt}
					width={16}
					height={16}
					className="w-4 h-4 object-contain"
				/>
			</div>

			{/* Title + Provider */}
			<div className="flex flex-col min-w-0 flex-1">
				<span className="text-neutral-100 text-sm font-medium leading-tight truncate">
					{item.title}
				</span>
				<span className="text-neutral-400 text-xs leading-tight truncate">{item.provider}</span>
			</div>

			{/* Arrow button */}
			<span
				className={cn(
					"flex items-center justify-center w-7 h-7 rounded-full shrink-0",
					"bg-white/5 border border-white/10",
					"group-hover/pill:bg-white/10 group-hover/pill:border-white/25",
					"transition-all duration-300",
				)}
			>
				<ArrowUpRight className="h-3.5 w-3.5 text-neutral-300 transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5" />
			</span>
		</a>
	);
}
