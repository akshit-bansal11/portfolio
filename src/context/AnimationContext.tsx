"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AnimationContextType {
	isWelcomeComplete: boolean;
	setWelcomeComplete: (completed: boolean) => void;
	/**
	 * True once the user has scrolled past the horizontal hero
	 * choreography. Other surfaces (e.g. the global NavBar) gate
	 * their entrance on this flag so they don't compete with the
	 * hero animation.
	 */
	isHeroComplete: boolean;
	setHeroComplete: (completed: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
	const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
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

export const useAnimation = () => {
	const context = useContext(AnimationContext);
	if (!context) {
		throw new Error("useAnimation must be used within an AnimationProvider");
	}
	return context;
};
