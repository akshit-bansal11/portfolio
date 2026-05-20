/**
 * Brand-aligned accent colours for each social platform shown in the
 * hero. Kept separate from the canonical social data so styling can
 * evolve without touching the link list.
 *
 * Lookup is by the `name` field on the hero social entries.
 */

export interface SocialAccent {
	/** Tailwind text colour applied on hover. */
	hoverText: string;
	/** Tailwind border colour applied on hover. */
	hoverBorder: string;
	/** Tailwind background tint applied on hover. */
	hoverBg: string;
	/** Tailwind ambient ring colour applied at rest for a coloured glow. */
	ring: string;
}

const FALLBACK: SocialAccent = {
	hoverText: "hover:text-amber-400",
	hoverBorder: "hover:border-amber-400/50",
	hoverBg: "hover:bg-amber-500/10",
	ring: "ring-amber-400/20",
};

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

export const getSocialAccent = (name: string): SocialAccent => ACCENTS[name] ?? FALLBACK;
