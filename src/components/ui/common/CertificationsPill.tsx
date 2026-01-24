"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Skill } from "@/data/skillsData";

interface CertificationsPillProps {
    certifications: Skill[];
}

const CertificationsPill = ({ certifications }: CertificationsPillProps) => {
    const [isHovered, setIsHovered] = useState(false);

    if (certifications.length === 0) return null;

    return (
        <div
            className="relative z-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                layout
                transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                }}
                className="absolute bottom-0 left-0 bg-neutral-900/95 border border-neutral-800/50 backdrop-blur-xl overflow-hidden rounded-xl shadow-2xl"
                style={{ transformOrigin: "bottom left" }}
            >
                <AnimatePresence mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex flex-col gap-2 p-2 min-w-max"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1"
                            >
                                Certifications
                            </motion.span>

                            {certifications.map((cert, idx) => {
                                const Icon = cert.Icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            opacity: { duration: 0.2, delay: idx * 0.03 },
                                            x: { duration: 0.2, delay: idx * 0.03 }
                                        }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 flex items-center justify-start shrink-0 pt-0.5">
                                            {typeof Icon === "string" ? (
                                                <Image
                                                    src={Icon}
                                                    alt={cert.name}
                                                    width={16}
                                                    height={16}
                                                    className="w-4 h-4 object-contain"
                                                />
                                            ) : (
                                                <Icon className="w-4 h-4 text-neutral-400" />
                                            )}
                                        </div>
                                        <span className="text-xs text-neutral-200">
                                            {cert.name}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="flex items-center gap-2 px-3 h-8 whitespace-nowrap"
                        >
                            <span className="text-xs text-neutral-300 font-medium">
                                Certifications:
                            </span>
                            <div className="flex -space-x-1">
                                {certifications.map((cert, idx) => {
                                    const Icon = cert.Icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="w-6 h-6 flex items-center justify-start"
                                        >
                                            {typeof Icon === "string" ? (
                                                <Image
                                                    src={Icon}
                                                    alt={cert.name}
                                                    width={16}
                                                    height={16}
                                                    className="w-4 h-4 object-contain"
                                                />
                                            ) : (
                                                <Icon className="w-4 h-4 text-neutral-400" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Layout placeholder */}
            <div className="h-8 px-3 invisible">
                Certs
            </div>
        </div>
    );
};

export default CertificationsPill;