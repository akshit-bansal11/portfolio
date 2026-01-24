"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skill } from "@/data/skillsData";
import { cn } from "@/lib/utils";

interface SkillPillProps {
    skill: Skill;
}

const SkillPill = ({ skill }: SkillPillProps) => {
    const Icon = skill.Icon;
    const isStringIcon = typeof Icon === "string";

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full",
                "bg-neutral-800/70 border border-neutral-700/50",
                "text-sm text-neutral-200 select-none"
            )}
        >
            {isStringIcon ? (
                <Image
                    src={Icon}
                    alt={skill.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                />
            ) : (
                <Icon className="h-5 w-5 text-neutral-300" />
            )}

            <span className="whitespace-nowrap">{skill.name}</span>
        </motion.div>
    );
};

export default SkillPill;
