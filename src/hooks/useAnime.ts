/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export const useAnime = <T extends HTMLElement>(params: any) => {
    const ref = useRef<T>(null);
     
    const animationRef = useRef<any>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Skip animation or set duration to 0 if needed, 
            // but for now let's just not run it or run instantly.
            // animejs usually handles this if we set duration to 0, 
            // but manual check is safer for complex timelines.
            // We can just apply final state? 
            // For now, let's just respect the user's wish to not animate heavily.
            return;
        }

        const { targets: _unused, ...rest } = params as any;

        animationRef.current = animate(ref.current, rest);

        return () => {
            if (animationRef.current && animationRef.current.pause) {
                animationRef.current.pause();
            }
        };
    }, [params]);

    return ref;
};
