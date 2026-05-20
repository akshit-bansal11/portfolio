/*
 * AnimationContext.tsx
 * React context that tracks two top-level animation flags.
 * `isWelcomeComplete` gates content behind the SVG intro.
 * `isHeroComplete` gates surfaces (e.g. NavBar) behind the
 * horizontal hero scroll choreography.
 */

"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

// Public shape of the animation context value.
interface AnimationContextType {
	isWelcomeComplete: boolean;
	setWelcomeComplete: (completed: boolean) => void;
	isHeroComplete: boolean;
	setHeroComplete: (completed: boolean) => void;
}

// Internal context — undefined sentinel forces use through useAnimation().
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Provider wires the two flags into a context for the whole tree.
export const AnimationProvider = ({ children }: { children: ReactNode }) => {
	// Welcome-animation completion flag.
	const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
	// Horizontal-hero completion flag.
	const [isHeroComplete, setIsHeroComplete] = useState(false);

	return (
		<AnimationContext.Provider
			value={{
				isWelcomeComplete,
				setWelcomeComplete: setIsWelcomeComplete,
				isHeroComplete,
				setHeroComplete: setIsHeroComplete,
			}}
		>
			{children}
		</AnimationContext.Provider>
	);
};

// Consumer hook with a missing-provider safety check.
export const useAnimation = () => {
	const context = useContext(AnimationContext);
	if (!context) {
		throw new Error("useAnimation must be used within an AnimationProvider");
	}
	return context;
};
