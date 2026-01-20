"use client"

// components/SkillSection.tsx
import React from "react";
import SkillItem from "../cards/SkillItem";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface Skill {
    icon: IconType | string;
    name: string;
}

interface SkillSectionProps {
    title: string;
    skills: Skill[][];
}

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const SkillSection = ({ title, skills }: SkillSectionProps) => (
    <div className="flex flex-col gap-2">
        <h1 className="lg:text-lg md:text-sm text-[8px] text-neutral-400 not-md:font-semibold">{title}</h1>
        {skills.map((group, idx) => (
            <motion.div
                key={idx}
                className="flex lg:gap-3 md:gap-2 gap-0.5 flex-wrap"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {group.map((skill, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <SkillItem Icon={skill.icon} name={skill.name} />
                    </motion.div>
                ))}
            </motion.div>
        ))}
    </div>
);

export default SkillSection;
