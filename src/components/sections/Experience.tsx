"use client";
//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    DEPENDENCIES    |--------------------//
//--------------------|____________________|--------------------//
import React from "react";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ScrollSection from '@/components/ui/common/sections/ScrollSection';
import ScrollSectionHeading from '@/components/ui/common/headings/ScrollSectionHeading';
import ExpItem from '@/components/ui/common/cards/ExpItem';
import { experience } from "@/data/experienceData";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     MAIN RENDER    |--------------------//
//--------------------|____________________|--------------------//
export default function Experience() {
    return (
        <ScrollSection id="experience">
            <div className="flex w-full gap-2 items-baseline"><ScrollSectionHeading heading="experience" /></div>
            {experience.map((category, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <h1 className="text-neutral-400 text-[8px] md:text-lg lg:text-2xl">{category.title}</h1>
                    {category.items.map((item, i) => (
                        <ExpItem key={i} {...item} />
                    ))}
                </div>
            ))}
        </ScrollSection>
    );
}
