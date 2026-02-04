"use client";
//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    DEPENDENCIES    |--------------------//
//--------------------|____________________|--------------------//
import React from "react";
import { motion } from "framer-motion";
import SkillItem from "@/components/ui/common/cards/SkillItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

import { SiNextdotjs } from "react-icons/si";

//--------------------|       COMMON       |--------------------//
import ScrollSection from "@/components/ui/common/sections/ScrollSection";
import ScrollSectionHeading from "@/components/ui/common/headings/ScrollSectionHeading";

//--------------------|       CONFIG       |--------------------//
const topSkills = [
  { name: "TypeScript", Icon: "https://svgl.app/library/typescript.svg" },
  { name: "React", Icon: "https://svgl.app/library/react_dark.svg" },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind CSS", Icon: "https://svgl.app/library/tailwindcss.svg" },
  { name: "Firebase", Icon: "https://svgl.app/library/firebase.svg" },
];

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    MAIN RENDER     |--------------------//
//--------------------|____________________|--------------------//
export default function Skills() {
  return (
    <ScrollSection id="skills">
      <div className="flex w-full items-center justify-between gap-4 mb-8">
        <ScrollSectionHeading heading="top skills" />
        <Button
          variant="ghost"
          className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          asChild
        >
          <Link href="/skills">
            See More <GoArrowUpRight className="ml-2" />
          </Link>
        </Button>
      </div>

      <div className="w-full flex justify-start">
        <div className="flex flex-wrap gap-4 justify-start">
          {topSkills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <SkillItem {...skill} disableHover={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
