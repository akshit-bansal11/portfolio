/*
 * ScrollSection.tsx
 * Generic <section> wrapper used as the outer container
 * of every named home-page scroll section. Provides
 * consistent spacing/padding and an anchor-friendly id.
 */

import type React from "react";

// Public props for the wrapper.
interface ScrollSectionProps {
	id?: string;
	children?: React.ReactNode;
	className?: string;
}

// Renders a flex-column section with the shared layout.
function ScrollSection({ id = "", children = null, className = "" }: ScrollSectionProps) {
	return (
		<section
			id={id}
			className={`
                flex w-full flex-col lg:gap-6 md:gap-4 gap-2 lg:p-5 p-3
                ${className}
            `}
		>
			{children}
		</section>
	);
}

export default ScrollSection;
