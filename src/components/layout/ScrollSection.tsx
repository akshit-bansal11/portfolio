/*
 * ScrollSection.tsx
 * Generic <section> wrapper used as the outer container
 * of every named home-page scroll section. Provides
 * consistent spacing/padding and an anchor-friendly id.
 */

import type React from "react";
import { cn } from "@/lib/utils";

// Public props for the wrapper.
interface ScrollSectionProps {
	id?: string;
	children?: React.ReactNode;
	className?: string;
}

// Renders a flex-column section with the shared layout.
export default function ScrollSection({
	id = "",
	children = null,
	className = "",
}: ScrollSectionProps) {
	return (
		<section
			id={id}
			className={cn("flex w-full flex-col gap-2 p-3", "md:gap-4 lg:gap-6 lg:p-5", className)}
		>
			{children}
		</section>
	);
}
