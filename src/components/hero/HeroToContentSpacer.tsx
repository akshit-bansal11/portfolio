/*
 * HeroToContentSpacer.tsx
 * Empty scroll buffer between the pinned hero and the
 * first content section. Renders nothing visible — its
 * only job is to add scroll distance for a softer transition.
 */

"use client";

// Buffer height in viewport-heights between hero and content.
export const HERO_TO_CONTENT_GAP_VH = 60;

// Renders an invisible spacer of the configured height.
export default function HeroToContentSpacer() {
	return (
		<div
			aria-hidden
			className="w-full pointer-events-none"
			style={{ height: `${HERO_TO_CONTENT_GAP_VH}vh` }}
		/>
	);
}
