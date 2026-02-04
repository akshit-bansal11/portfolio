'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createTimeline } from 'animejs';
import { createDrawable } from 'animejs/svg';
import { useAnimation } from '@/context/AnimationContext';

const WelcomeAnimation = () => {
    const [showAnimation, setShowAnimation] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setWelcomeComplete } = useAnimation();

    useEffect(() => {
        // const hasSeen = sessionStorage.getItem('portfolio-welcome-v1');
        // console.log('WelcomeAnimation: hasSeen?', hasSeen);
        // if (!hasSeen) {
        setTimeout(() => {
            setShowAnimation(true);
        }, 50);
        // }
    }, []);

    useEffect(() => {
        if (!showAnimation || !containerRef.current) return;

        console.log('WelcomeAnimation: Starting animation');
        // Initialize Timeline
        const tl = createTimeline({
            onComplete: () => {
                console.log('WelcomeAnimation: Animation complete');
                // sessionStorage.setItem('portfolio-welcome-v1', 'true');
                setShowAnimation(false);
                setWelcomeComplete(true);
            }
        });

        // Use createDrawable for the paths
        const drawables = createDrawable('.welcome-svg path');

        // 1. Draw strokes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tl.add(drawables as any, {
            draw: ['0 0', '0 1'],
            easing: 'easeInOutSine',
            duration: 4000,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delay: (_el: any, i: number) => i * 250,
        });

        // 2. Fade in fill
        tl.add('.welcome-svg path', {
            fillOpacity: [0, 1],
            easing: 'easeInOutQuad',
            duration: 1500,
        }, '-=2000');

        // 3. Stay for a bit
        tl.add({
            duration: 800
        });

        // 3.5 Glitch effect
        tl.add('.welcome-svg', {
            translateX: [
                { value: 5, duration: 50 },
                { value: -5, duration: 50 },
                { value: 10, duration: 50 },
                { value: -10, duration: 50 },
                { value: 0, duration: 50 }
            ],
            skewX: [
                { value: 20, duration: 50 },
                { value: -20, duration: 50 },
                { value: 0, duration: 50 }
            ],
            scale: [
                { value: 1.1, duration: 50 },
                { value: 0.9, duration: 50 },
                { value: 1, duration: 50 }
            ],
            opacity: [1, 0.5, 1, 0.2, 1],
            easing: 'linear',
            duration: 500
        });

        // 4. Fade out the whole screen
        tl.add(containerRef.current, {
            scale: [1, 1.5],
            opacity: [1, 0],
            duration: 800,
            easing: 'easeInExpo',
        });

    }, [showAnimation]);

    if (!showAnimation) return null;

    return (
        <div
            ref={containerRef}
            className="fixed w-full h-full z-[9999] flex flex-col items-center justify-center bg-black"
        >
            <div className="relative">
                <svg
                    width="222"
                    height="247"
                    viewBox="0 0 221.75 246.86"
                    className="welcome-svg w-32 h-32 md:w-48 md:h-48"
                >
                    <g fill="#ffffff" fillOpacity="0" stroke="#ffffff" strokeWidth="0.3">
                        <path
                            d="M103.707.275c-.293 0-.587-.001-.917.035-2.46.074-5.542 1.91-6.46 4.185-6.055 15.158-21.616 68.519-23.635 77.254-15.157 4.037-36.516 13.616-50.168 25.69-4.771 4.22-10.753 14.533-6.973 19.01 4 4.735 12.148 7.928 18.46 6.827 3.45-.587 7.267-6.166 5.359-9.028-1.689-2.57-5.542-3.67-9.212-4.478-1.395-.33-1.616-1.284-.478-2.165C43.262 107.11 51.593 103.11 68.07 96.76c-4.954 15.083-10.166 31.304-14.386 46.608-11.854 0-42.719-2.496-50.903 5.909C.837 151.258-.08 154.01.03 156.726c.55 16.698 53.95 72.484 67.969 85.586 2.312 2.128 4.476 3.523 7.595 4.037 1.432-.44 3.488-.735 3.818-2.314 5.91-25.983 7.963-63.931 12.44-89.474 6.496-.514 13.764-1.248 20.223-1.285a518 518 0 0 1-5.982 32.738c-1.432 7.707-5.357 25.578-7.266 36.588-.587 3.523 1.945 6.643 5.542 6.826.44 0 .88.038 1.284.038 2.973.146 5.835-2.386 6.385-5.322a3243 3243 0 0 1 8.002-41.911c13.248-1.065 28.258-1.798 39.231 7.12 8.735 7.12 7.047 18.167 0 25.8a36.7 36.7 0 0 1-6.568 5.651c-9.718 6.163-12.951 10.295-9.575 14.112 1.542 1.761 5.19 6.817 15.042-3.102 20.7-14.13 35.598-43.636-3.78-59.894 24.588-11.01 53.838-24.112 64.922-50.61 8.88-21.212-9.247-41.873-28.441-48.185-27.562-9.065-60.924-3.56-89.22.146 1.322-21.213 3.745-37.508 6.204-58.354.294-2.459.733-6.422 1.027-8.844.404-3.267-1.944-5.836-5.247-5.726zM150.28 82.19l-.037.035c28.7-.44 72.519 4.074 51.93 42.5-10.423 19.413-56.858 38.769-79.098 43.43.74-2.588.964-5.48 1.527-8.117l.816-5.868-.086-.599.173-.025 3.54-.514 6.418-.93c5.87-.897 13.312-2.084 18.926-2.972 3.046-.477 5.542-3.487 5.542-6.57 0-3.377-3.008-6.165-6.715-6.055-7.854.22-16.736.844-23.893 1.175 1.212-6.13 3.598-20.188 4.736-26.427.66-3.78-1.871-7.12-5.688-7.156h-.293c-3.633-.037-7.01 2.972-7.706 6.532-1.358 6.9-4.628 22.976-5.839 28.628-7.12 1.1-12.697 1.064-19.854 1.1 2.532-16.771 2.825-35.966 5.835-52.444 11.854-3.413 21.03-3.962 33.25-4.99 4.037-.256 9.874-.623 16.516-.733m-66.437 9.953c.34.028.615.432.633 1.202v.038c.257 9.982-4.44 43.01-5.651 47.672-1.982 1.504-6.129 1.175-8.808 1.212-1.32-1.395 8.99-38.608 12.808-49.068.275-.734.679-1.083 1.018-1.056M70.64 156.03c2.349 0 4.734.036 6.826 0a3202 3202 0 0 1-8.11 67.895c-9.91-9.432-19.011-19.56-28.223-29.653-9.799-10.68-19.157-22.314-26.9-34.645-.881-1.358-.22-2.569 1.395-2.606a559 559 0 0 1 33.286-.11l-4.745 17.538c-1.395 4 .917 7.486 5.137 7.486h1.761c2.79-.037 5.837-2.312 6.791-4.954l6.03-20.84c2.055-.073 4.403-.111 6.752-.111"
                        />
                    </g>
                </svg>
            </div>
            <h1 className="mt-8 text-2xl font-light tracking-[0.2em] text-white animate-pulse">
                WELCOME
            </h1>
        </div>
    );
};

export default WelcomeAnimation;
