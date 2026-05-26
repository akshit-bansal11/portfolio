/*
 * nav.ts
 * Type definition for navigation bar items.
 * Uses lucide-react LucideIcon since all nav icons
 * are sourced from lucide-react.
 */

import type { LucideIcon } from "lucide-react";

export interface NavItem {
	text: string;
	to: string;
	icon: LucideIcon;
	color?: string;
}
