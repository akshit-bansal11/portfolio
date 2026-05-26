/*
 * CertificateLinkButton.tsx
 * Pill-style external link button used at the bottom of
 * experience cards. Animates open on hover to reveal the
 * "Credential" label next to the arrow icon.
 */

import { GoArrowUpRight } from "react-icons/go";
import { cn } from "@/lib/utils";

// Public props for the button.
interface CertificateLinkButtonProps {
	href: string;
	className?: string;
}

// Renders the expanding pill anchor.
export default function CertificateLinkButton({ href, className }: CertificateLinkButtonProps) {
	return (
		<div className={className}>
			{/* Anchor that grows on hover from a circle into a pill. */}
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"group/btn inline-flex items-center overflow-hidden rounded-full",
					"bg-white/5 border border-white/15 hover:border-white/30",
					"hover:bg-white/10 transition-all duration-300",
					"h-8 w-8 hover:w-[115px]",
				)}
			>
				{/* Label slides in from right, hidden at rest */}
				<span
					className={cn(
						"text-white text-xs font-semibold tracking-wide uppercase whitespace-nowrap",
						"w-0 group-hover/btn:w-auto overflow-hidden",
						"pl-0 group-hover/btn:pl-3",
						"transition-all duration-300 ease-in-out",
					)}
				>
					Credential
				</span>

				{/* Arrow icon — always visible, centered at rest */}
				<span className="flex items-center justify-center shrink-0 w-8 h-8">
					<GoArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
				</span>
			</a>
		</div>
	);
}
