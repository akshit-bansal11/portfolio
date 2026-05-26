/*
 * AnimationContext.tsx
 * React context that tracks two top-level animation flags.
 * `isWelcomeComplete` gates content behind the SVG intro.
 * `isHeroComplete` gates surfaces (e.g. NavBar) behind the
 * horizontal hero scroll choreography.
 *
 * `heroProgressRef` holds the hero scroll MotionValue in a plain
 * ref (not state) so React never re-renders when the value changes.
 * `isHeroProgressReady` is the boolean state that signals once the
 * value has been registered by ScrollHero.
 */

"use client";

import { type MotionValue } from "framer-motion";
import {
	createContext,
	type ReactNode,
	type RefObject,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

// Public shape of the animation context value.
interface AnimationContextType {
	isWelcomeComplete: boolean;
	setWelcomeComplete: (completed: boolean) => void;
	isHeroComplete: boolean;
	setHeroComplete: (completed: boolean) => void;
	/** Stable ref to the hero scroll MotionValue. Read `.current` to get it. */
	heroProgressRef: RefObject<MotionValue<number> | null>;
	/**
	 * The hero scroll MotionValue stored in state so it can be safely read
	 * during render (unlike the ref). Null until ScrollHero registers it.
	 */
	heroProgress: MotionValue<number> | null;
	/** Flips to true once ScrollHero has registered its progress. */
	isHeroProgressReady: boolean;
	/** Call once from ScrollHero to register the progress MotionValue. */
	setHeroProgress: (mv: MotionValue<number>) => void;
}

// Internal context — undefined sentinel forces use through useAnimation().
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Provider wires the two flags into a context for the whole tree.
export const AnimationProvider = ({ children }: { children: ReactNode }) => {
	// Welcome-animation completion flag.
	const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
	// Horizontal-hero completion flag.
	const [isHeroComplete, setIsHeroComplete] = useState(false);

	// Hero scroll progress: kept in a ref for stable identity AND in state
	// so components can safely read the MotionValue reference during render.
	const heroProgressRef = useRef<MotionValue<number> | null>(null);
	const [heroProgress, setHeroProgressState] = useState<MotionValue<number> | null>(null);
	const [isHeroProgressReady, setIsHeroProgressReady] = useState(false);

	// Stable setter: only fires state updates once, on first registration.
	const setHeroProgress = useCallback((mv: MotionValue<number>) => {
		if (heroProgressRef.current === mv) return;
		heroProgressRef.current = mv;
		setHeroProgressState(mv);
		setIsHeroProgressReady(true);
	}, []);

	return (
		<AnimationContext.Provider
			value={{
				isWelcomeComplete,
				setWelcomeComplete: setIsWelcomeComplete,
				isHeroComplete,
				setHeroComplete: setIsHeroComplete,
				heroProgressRef,
				heroProgress,
				isHeroProgressReady,
				setHeroProgress,
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
