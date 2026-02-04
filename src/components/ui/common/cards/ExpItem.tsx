"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GoArrowUpRight } from "react-icons/go";

interface ExpItemProps {
  location: string;
  company: string;
  role: string;
  date: string;
  points?: string[];
  certificate?: string;
}

export default function ExpItem({
  location,
  company,
  role,
  date,
  points = [],
  certificate,
}: ExpItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full relative group"
    >
      <Card className="relative overflow-hidden border-neutral-800 bg-neutral-900/50 backdrop-blur-xl transition-all duration-500 group-hover:border-neutral-700/50 group-hover:translate-y-[-2px]">
        {/* Subtle Inner Highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <CardContent className="p-7 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-clash font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                {company}
              </h3>
              <p className="text-lg text-neutral-300 font-medium tracking-wide">
                {role}
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-3">
              <Badge
                variant="outline"
                className="px-3 py-1 bg-white/5 border-neutral-800 text-neutral-300 font-medium gap-2 hover:bg-white/10 transition-colors"
              >
                <FaCalendarAlt className="h-3 w-3 text-amber-500/80" />
                {date}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium px-1">
                <FaMapMarkerAlt className="h-3 w-3 text-neutral-600" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <ul className="space-y-4">
            {points.map((point, idx) => (
              <li
                key={idx}
                className="flex gap-4 text-neutral-400 group/item leading-relaxed"
              >
                <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/30 group-hover/item:bg-amber-500 group-hover/item:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                <span className="text-[15px] group-hover/item:text-neutral-200 transition-colors duration-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Certificate Link Button */}
          {certificate && (
            <div className="mt-4 md:mt-0 md:absolute md:bottom-6 md:right-7">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full md:w-auto group/btn gap-2 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-500 transition-all duration-300 rounded-full pl-4 pr-3"
              >
                <a href={certificate} target="_blank" rel="noopener noreferrer">
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    View Certificate
                  </span>
                  <GoArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
