/*
 * socialAccents.ts
 * Brand-aligned hover accent colors for the hero social icons.
 * Lookup is by social platform name; an unknown name falls
 * back to a neutral amber palette.
 */

// Per-platform Tailwind hover/ring class bundle.
export interface SocialAccent {
	hoverText: string;
	hoverBorder: string;
	hoverBg: string;
	ring: string;
}

// Neutral fallback used when a social name has no entry below.
const FALLBACK: SocialAccent = {
	hoverText: "hover:text-amber-400",
	hoverBorder: "hover:border-amber-400/50",
	hoverBg: "hover:bg-amber-500/10",
	ring: "ring-amber-400/20",
};

// Per-platform color schemes (Gmail rose, GitHub white, etc.).
const ACCENTS: Record<string, SocialAccent> = {
	Gmail: {
		hoverText: "hover:text-rose-400",
		hoverBorder: "hover:border-rose-400/60",
		hoverBg: "hover:bg-rose-500/10",
		ring: "ring-rose-400/20",
	},
	GitHub: {
		hoverText: "hover:text-white",
		hoverBorder: "hover:border-white/60",
		hoverBg: "hover:bg-white/10",
		ring: "ring-white/15",
	},
	LinkedIn: {
		hoverText: "hover:text-sky-400",
		hoverBorder: "hover:border-sky-400/60",
		hoverBg: "hover:bg-sky-500/10",
		ring: "ring-sky-400/20",
	},
	GoogleCloud: {
		hoverText: "hover:text-blue-400",
		hoverBorder: "hover:border-blue-400/60",
		hoverBg: "hover:bg-blue-500/10",
		ring: "ring-blue-400/20",
	},
	HackerRank: {
		hoverText: "hover:text-emerald-400",
		hoverBorder: "hover:border-emerald-400/60",
		hoverBg: "hover:bg-emerald-500/10",
		ring: "ring-emerald-400/20",
	},
};

// Resolve a per-platform accent, or the fallback if unknown.
export const getSocialAccent = (name: string): SocialAccent => ACCENTS[name] ?? FALLBACK;
