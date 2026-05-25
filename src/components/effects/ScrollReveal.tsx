/*
 * ScrollReveal.tsx
 * Wrapper that fades + slides its children into view
 * the first time they intersect the viewport. Direction
 * (up/left/right) and per-element delay are configurable.
 */

"use client";
import { animate } from "animejs";
import type React from "react";
import { useEffect, useRef } from "react";

// Public props for the wrapper.
interface ScrollRevealProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	direction?: "up" | "left" | "right";
}

// Renders a wrapper that animates its children on first viewport entry.
export default function ScrollReveal({
	children,
	className = "",
	delay = 0,
	direction = "up",
}: ScrollRevealProps) {
	// Ref to the wrapper element that receives the reveal animation.
	const ref = useRef<HTMLDivElement>(null);
	// Tracks "have we already animated?" so the reveal only runs once.
	const infoRef = useRef<{ hasAnimated: boolean }>({ hasAnimated: false });

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		// Resolve from-state offsets based on the configured direction.
		const initialY = direction === "up" ? 50 : 0;
		const initialX = direction === "left" ? 50 : direction === "right" ? -50 : 0;

		// Trigger the animation when at least 10% of the wrapper is visible.
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !infoRef.current.hasAnimated) {
						infoRef.current.hasAnimated = true;

						animate(element, {
							opacity: [0, 1],
							translateY: [initialY, 0],
							translateX: [initialX, 0],
							easing: "spring(1, 80, 10, 0)",
							duration: 800,
							delay: delay,
						});

						observer.unobserve(element);
					}
				});
			},
			{ threshold: 0.1 },
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [delay, direction]);

	return (
		<div ref={ref} className={`opacity-0 ${className}`}>
			{children}
		</div>
	);
}
