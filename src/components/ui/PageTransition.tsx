'use client';

import React, { useRef, useEffect } from 'react';
import { animate } from 'animejs';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // animate() in v4 might return a timeline or animation instance.
        // We target the container to fade in and slide up.

        // Reset initial state (in case of fast remounts or just to be safe, 
        // though the className 'opacity-0' should handle it).
        // anime.set(containerRef.current, { opacity: 0, translateY: 10 }); 
        // ^ v4 'set' might be part of animate or utility. 
        // 'animate' handles from/to if specified.

        if (!containerRef.current) return;

        animate(containerRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: 100,
        });
    }, []);

    return (
        <div ref={containerRef} className="opacity-0 w-full">
            {children}
        </div>
    );
}
