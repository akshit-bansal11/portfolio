/*
 * template.tsx
 * Next.js template that re-runs on every navigation.
 * Wraps each rendered route in PageTransition so route
 * changes get a brief fade-and-rise entrance animation.
 */

import PageTransition from "@/components/ui/PageTransition";

// Default export consumed by Next.js App Router.
export default function Template({ children }: { children: React.ReactNode }) {
	return <PageTransition>{children}</PageTransition>;
}
