"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { skillsData } from "@/data/skillsData";
import CategoryBento from "@/components/ui/CategoryBento";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return skillsData;

    return skillsData
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.skills.length > 0);
  }, [searchQuery]);

  const handleScrollToCategory = (title: string) => {
    const element = document.getElementById(title);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Header & Controls */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors w-fit group"
              >
                <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "text-5xl md:text-7xl font-bold",
                    "bg-gradient-to-r from-white via-neutral-400 to-neutral-600",
                    "bg-clip-text text-transparent"
                  )}
                >
                  Skills & Tools
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-neutral-500 max-w-2xl text-lg"
                >
                  Technologies and tools I’ve used to design, build, scale,
                  and polish modern digital products.
                </motion.p>
              </div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative w-full md:w-96"
            >
              <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg" />
              <input
                type="text"
                placeholder="Search for a skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full bg-neutral-900/50 border border-neutral-800 rounded-2xl py-4 pl-12 pr-6",
                  "text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600",
                  "focus:ring-1 focus:ring-neutral-600 transition-all"
                )}
              />
            </motion.div>
          </div>

          {/* Quick Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 pb-4 border-b border-neutral-900"
          >
            {skillsData.map((category) => (
              <button
                key={category.title}
                onClick={() => handleScrollToCategory(category.title)}
                className={cn(
                  "px-4 py-2 rounded-full bg-neutral-900/40 border border-neutral-800",
                  "text-sm text-neutral-400 hover:text-white hover:border-neutral-600",
                  "transition-all whitespace-nowrap"
                )}
              >
                {category.title}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Bento Sections */}
        <div className="space-y-32">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <ScrollReveal key={category.title} delay={index * 100} className="w-full">
                <section
                  id={category.title}
                  className="space-y-8 scroll-mt-32"
                >
                  <h2 className="text-xl md:text-2xl font-light tracking-tight text-neutral-300">
                    {category.title}
                  </h2>

                  <div className="grid grid-cols-12 auto-rows-[140px] gap-6">
                    <CategoryBento
                      category={category}
                      reversed={index % 2 !== 0}
                    />
                  </div>
                </section>
              </ScrollReveal>
            ))
          ) : (
            <div className="text-center py-32 space-y-4">
              <p className="text-neutral-500 text-lg">No skills found matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-white hover:underline underline-offset-4"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
