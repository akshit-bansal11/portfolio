"use client";

import React from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "@/data/skillsData";
import SkillPill from "@/components/ui/common/SkillPill";
import CertificationsPill from "@/components/ui/common/CertificationsPill";
import { cn } from "@/lib/utils";


interface CategoryBentoProps {
    category: SkillCategory;
    reversed?: boolean;
}

const CategoryBento = ({ category, reversed = false }: CategoryBentoProps) => {
    return (
        <>
            {/* Anchor Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 90 }}
                className={cn(
                    "col-span-1 md:col-span-5 md:row-span-2 rounded-3xl p-8",
                    "bg-gradient-to-br from-neutral-900 to-neutral-800",
                    "border border-neutral-800 flex flex-col justify-between",
                    reversed && "md:order-last"
                )}
            >
                <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-white leading-tight">
                        {category.title}
                    </h3>

                    <p className="text-neutral-400 text-sm md:text-base max-w-sm">
                        {category.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">


                    <CertificationsPill certifications={category.certifications} />
                </div>
            </motion.div>

            {/* Skill Cluster */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className={cn(
                    "col-span-1 md:col-span-7 md:row-span-2 rounded-3xl p-6",
                    "bg-neutral-900/60 border border-neutral-800",
                    "flex flex-wrap gap-4 content-start"
                )}
            >
                {category.skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                ))}
            </motion.div>
        </>
    );
};

export default CategoryBento;
