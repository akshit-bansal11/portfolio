"use client";

/**
 * Empty buffer placed between the pinned scroll hero and the regular
 * vertical sections. Gives the user breathing room so a fast scroll
 * gesture doesn't punch them straight from the hero socials directly
 * into the projects grid.
 *
 * Renders nothing visible by design – it is purely scroll distance.
 */

export const HERO_TO_CONTENT_GAP_VH = 60;

export default function HeroToContentSpacer() {
	return (
		<div
			aria-hidden
			className="w-full pointer-events-none"
			style={{ height: `${HERO_TO_CONTENT_GAP_VH}vh` }}
		/>
	);
}
