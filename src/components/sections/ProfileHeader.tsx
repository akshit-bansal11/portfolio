"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaCircle, FaLocationDot, FaArrowDownLong } from "react-icons/fa6";
import { Gmail } from "@/components/icons/gmail-icon";
import animeChar from "@/assets/images/animeChar.svg";
import { socialLinks } from "@/data/socialLinksData";

const Resume = "/akshit_bansal.pdf";

function CVButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="group gap-2 border-neutral-500 bg-neutral-900/50 hover:bg-neutral-800 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300"
    >
      <a
        href={Resume}
        download="akshit_bansal.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Download CV</span>
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaArrowDownLong />
        </motion.div>
      </a>
    </Button>
  );
}

function GmailButton() {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-10 w-10 !bg-transparent hover:!bg-transparent active:!bg-transparent hover:scale-110 transition-transform duration-200 shadow-none border-none"
    >
      <a
        href="mailto:artistbansal2004@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Gmail className="h-full hover:scale-110 hover:rotate-10 transition-transform duration-200 w-full object-contain" />
      </a>
    </Button>
  );
}

function Availability() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-4"
    >
      <Badge
        variant="outline"
        className="gap-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1"
      >
        <div className="flex gap-1.5">
          {/* Red - Unavailable */}
          <span className="relative flex h-2 w-2 opacity-50">
            {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span> */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>

          {/* Yellow - Internship / Busy */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>

          {/* Green - Available */}
          <span className="relative flex h-2 w-2 opacity-50">
            {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span> */}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>

        {/* <span>Available for Work</span> */}
        <span>Interning • Open to Full-Time, Freelance & Open-Source</span>
        {/* <span>Not Available</span> */}
      </Badge>
    </motion.div>
  );
}

function DevInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-2 mb-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-5xl lg:text-6xl font-clash font-bold text-white tracking-tight"
      >
        Akshit Bansal
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-lg md:text-xl lg:text-2xl text-neutral-400 font-light"
      >
        MERN-Stack Developer
      </motion.h2>
      <div className="flex items-center gap-2 text-neutral-500 text-sm md:text-base">
        <FaLocationDot />
        <span>Punjab, India</span>
      </div>
    </motion.div>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-4 md:flex-col mt-6 md:mt-0">
      {socialLinks.map(({ Icon, href }, index) => (
        <motion.div
          key={href}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-13 w-13 border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:text-amber-400 hover:border-amber-400/50 transition-all duration-300"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon className="h-6 w-6" />
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

import Image from "next/image";
import pfp from "@/assets/images/pfp.png";
import pfpHover from "@/assets/images/pfp-hover.png";

function ProfileImage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 group cursor-pointer"
    >
      <div className="absolute inset-0 rounded-full transition-all duration-300" />

      <div className="relative h-full w-full rounded-full overflow-hidden bg-neutral-900 shadow-xl">
        {/* Base Image */}
        <Image
          src={pfp}
          alt="Profile"
          fill
          className="object-cover grayscale transition-opacity duration-500 group-hover:opacity-0"
          draggable={false}
          priority
        />
        {/* Hover Image */}
        <Image
          src={pfpHover}
          alt="Profile Hover"
          fill
          className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

export default function ProfileHeader() {
  return (
    <div
      id="profile"
      className="flex w-full max-w-7xl mx-auto items-center justify-between px-4 md:px-8 py-10 flex-col md:flex-row gap-8 md:gap-0"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
        <ProfileImage />

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <DevInfo />
          <Availability />
          <div className="flex items-center gap-4 mt-2">
            <CVButton />
            <GmailButton />
          </div>
        </div>
      </div>

      <SocialLinks />
    </div>
  );
}
