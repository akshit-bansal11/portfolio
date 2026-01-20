"use client"

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollSectionHeadingProps {
    heading: string;
}

function ScrollSectionHeading({ heading }: ScrollSectionHeadingProps) {
    return (
        <motion.h1
            initial={{ x: "-70px", opacity: 0 }}
            whileInView={{ x: "0px", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
            className={cn(
                "w-fit lg:text-7xl md:text-4xl text-2xl",
                "font-clash font-extrabold capitalize",
                "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500",
                "hover:bg-gradient-to-r hover:to-amber-500 hover:via-orange-500 hover:from-pink-500",
                "transition-colors ease-in-out duration-500",
                "bg-clip-text text-transparent"
            )}
        >
            {heading}
        </motion.h1>
    );
}

export default ScrollSectionHeading;
