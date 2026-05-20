/*
 * utils.ts
 * Tiny class-name helper used across the app.
 * Combines clsx (conditional class joining) with twMerge (tailwind
 * conflict resolution) into a single `cn()` function.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge any number of class-value inputs into a clean tailwind-safe string.
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
