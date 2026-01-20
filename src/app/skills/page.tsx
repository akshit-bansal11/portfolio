"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import SkillItem from "@/components/ui/common/cards/SkillItem";
import { skillsData } from "@/data/skillsData";

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit group"
          >
            <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-neutral-400 to-neutral-600 bg-clip-text text-transparent"
          >
            All Skills
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 text-lg max-w-2xl"
          >
            A comprehensive list of technologies, tools, and languages I've
            mastered over the years to build premium digital experiences.
          </motion.p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-20">
          {skillsData.map((category, categoryIndex) => (
            <section key={category.title} className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-200 capitalize tracking-tight">
                  {category.title}
                </h2>
                <div className="h-[1px] flex-grow bg-neutral-800/50" />
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <SkillItem Icon={skill.Icon} name={skill.name} />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
