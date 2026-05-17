"use client";

import { animate } from "animejs";
import type React from "react";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

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
