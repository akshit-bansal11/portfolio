/*
 * PageTransition.tsx
 * Wraps each navigated route in a brief mount-time fade
 * + rise animation. Used by the App Router template
 * to give every page a consistent entrance feel.
 */

"use client";

import { animate } from "animejs";
import type React from "react";
import { useEffect, useRef } from "react";

// Renders a wrapper that fades and rises in on mount.
export default function PageTransition({ children }: { children: React.ReactNode }) {
	// Ref to the wrapper element that receives the animation.
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Fade + lift the wrapper into place after a short delay.
		animate(containerRef.current, {
			opacity: [0, 1],
			translateY: [20, 0],
			duration: 800,
			easing: "easeOutExpo",
			delay: 100,
		});
	}, []);

	return (
		<div ref={containerRef} className="opacity-0 w-full">
			{children}
		</div>
	);
}
