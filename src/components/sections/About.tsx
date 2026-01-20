"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useAnimation, Variant, Variants } from "framer-motion";
import { CardContent } from "@/components/ui/card";

interface AboutProps {
    text?: string;
    delay?: number;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    className?: string;
}

export default function About({
    text = "Building Practical Web Experiences",
    delay = 150,
    animateBy = "words",
    direction = "top",
    className = "text-4xl md:text-6xl lg:text-7xl font-thin tracking-tight text-center",
}: AboutProps) {
    const buildKeyframes = (from: any, steps: any[]) => {
        const keys = new Set([
            ...Object.keys(from),
            ...steps.flatMap((s) => Object.keys(s)),
        ]);
        const keyframes: Record<string, any[]> = {};
        keys.forEach((k) => {
            keyframes[k] = [from[k], ...steps.map((s) => s[k])];
        });
        return keyframes;
    };

    interface BlurTextProps {
        text: string;
        delay: number;
        className: string;
        animateBy: "words" | "letters";
        direction: "top" | "bottom";
        threshold?: number;
        rootMargin?: string;
        animationFrom?: any;
        animationTo?: any[];
        easing?: (t: number) => number;
        onAnimationComplete?: () => void;
        stepDuration?: number;
    }

    const BlurText = ({
        text,
        delay,
        className,
        animateBy,
        direction,
        threshold = 0.1,
        rootMargin = "0px",
        animationFrom,
        animationTo,
        easing = (t: number) => t,
        onAnimationComplete,
        stepDuration = 0.35,
    }: BlurTextProps) => {
        const elements = animateBy === "words" ? text.split(" ") : text.split("");
        const [inView, setInView] = useState(false);
        const ref = useRef<HTMLParagraphElement>(null);

        useEffect(() => {
            if (!ref.current) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        observer.unobserve(ref.current!);
                    }
                },
                { threshold, rootMargin }
            );
            observer.observe(ref.current);
            return () => observer.disconnect();
        }, [threshold, rootMargin]);

        const defaultFrom =
            direction === "top"
                ? { filter: "blur(10px)", opacity: 0, y: -50 }
                : { filter: "blur(10px)", opacity: 0, y: 50 };

        const defaultTo = [
            { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
            { filter: "blur(0px)", opacity: 1, y: 0 },
        ];

        const fromSnapshot = animationFrom ?? defaultFrom;
        const toSnapshots = animationTo ?? defaultTo;

        const stepCount = toSnapshots.length + 1;
        const totalDuration = stepDuration * (stepCount - 1);
        const times = Array.from({ length: stepCount }, (_, i) =>
            stepCount === 1 ? 0 : i / (stepCount - 1)
        );

        return (
            <div>
                <p
                    ref={ref}
                    className={`blur-text ${className} flex flex-wrap justify-center`}
                >
                    {elements.map((segment, index) => {
                        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

                        const spanTransition = {
                            duration: totalDuration,
                            times,
                            delay: (index * delay) / 1000,
                            ease: easing,
                        };

                        return (
                            <motion.span
                                key={index}
                                className="inline-block will-change-[transform,filter,opacity]"
                                initial={fromSnapshot}
                                animate={inView ? animateKeyframes : fromSnapshot}
                                transition={spanTransition}
                                onAnimationComplete={
                                    index === elements.length - 1 ? onAnimationComplete : undefined
                                }
                            >
                                {segment === " " ? "\u00A0" : segment}
                                {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
                            </motion.span>
                        );
                    })}
                </p>

            </div>
        );
    };

    return (
        <div>
            <motion.section
                id="about"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full flex flex-col items-center text-center px-6 py-12 relative"
            >
                {/* Headline */}
                <BlurText
                    text={text}
                    delay={delay}
                    animateBy={animateBy}
                    direction={direction}
                    className={`${className} text-white drop-shadow-xl mb-10`}
                />

                {/* Subtext */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-8 max-w-4xl relative"
                >
                    <CardContent className="p-8 text-neutral-400 text-sm md:text-lg lg:text-xl leading-relaxed font-light">
                        <p>
                            Hi, I’m <span className="text-white font-medium">Akshit Bansal</span> — a{" "}
                            <span className="text-amber-400 font-semibold">Full-Stack Developer</span> passionate about
                            crafting practical, scalable, and visually appealing web applications.
                        </p>
                        <p className="mt-4">
                            I specialize in the <span className="text-pink-400 font-semibold">MERN stack</span> and love
                            solving real problems by blending clean code with thoughtful design.
                            From seamless UIs to reliable backends, I enjoy turning ideas into
                            experiences people actually use.
                        </p>
                    </CardContent>
                </motion.div>
            </motion.section>
        </div>
    );
}
