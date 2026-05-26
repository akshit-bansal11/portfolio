/*
 * use-nav-click.ts
 * Hook that returns a click handler resolving a target into
 * either a smooth in-page scroll (for section ids) or a
 * Next.js route push (for paths starting with "/").
 */

import { useRouter } from "next/navigation";
import type React from "react";

// Returns a click handler that navigates based on `to` shape.
export function useNavClick(
	to?: string | null,
	externalOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
) {
	// Next.js router for client-side path navigation.
	const router = useRouter();

	return (e: React.MouseEvent<HTMLButtonElement>) => {
		// Always allow the caller to run their own handler first.
		externalOnClick?.(e);
		if (!to) return;
		// Section id → smooth-scroll into view.
		if (!to.startsWith("/")) {
			document.getElementById(to)?.scrollIntoView({ behavior: "smooth" });
		} else {
			// Otherwise treat as a route push.
			router.push(to);
		}
	};
}
