/*
 * Attainments.tsx
 * "Attainments" section: certificates pinned on the board (paper cards with a hand-drawn
 * rosette), then the Google Cloud skill badges as round stickers. Everything pops in once
 * with a short stagger; reduced motion shows the final state.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import BadgeSticker from "@/components/attainments/BadgeSticker";
import CertificateCard from "@/components/attainments/CertificateCard";
import ScrollSection from "@/components/layout/ScrollSection";
import SectionTitle from "@/components/layout/SectionTitle";
import { googleBadges } from "@/data/badgesData";
import {
  hackerRankCertificationsData,
  linkedInCertificationsData,
} from "@/data/certificationsData";

const CERTIFICATIONS = [...linkedInCertificationsData, ...hackerRankCertificationsData];

// Top-level Attainments section component.
export default function Attainments() {
  const reduceMotion = useReducedMotion();

  // Pop-in props for the item at this position; the stagger restarts every few items.
  const pop = (index: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.35, delay: (index % 3) * 0.08 },
  });

  return (
    <ScrollSection id="attainments" className="gap-10 md:gap-12 lg:gap-14">
      <SectionTitle title="Attainments" aside="proof I keep learning" />

      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 pt-2 md:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((item, index) => (
          <motion.li key={item.name} {...pop(index)}>
            <CertificateCard item={item} index={index} />
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-col gap-4">
        <h3 className="font-hand text-3xl font-bold leading-none text-hero-muted">badges</h3>
        <ul className="flex flex-wrap gap-x-8 gap-y-8">
          {googleBadges.map((badge, index) => (
            <motion.li key={badge.gBadgeLink} {...pop(index)}>
              <BadgeSticker badge={badge} index={index} />
            </motion.li>
          ))}
        </ul>
      </div>
    </ScrollSection>
  );
}
