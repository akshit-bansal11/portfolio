"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaExternalLinkAlt } from "react-icons/fa";
import GoogleBadgeCard from "@/components/ui/common/cards/GoogleBadgeCard";
// import HackerRankSkillBadge from "@/components/ui/common/cards/HackerRankSkillBadge";
import ScrollSectionHeading from "@/components/ui/common/headings/ScrollSectionHeading";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ScrollSection from "@/components/ui/common/sections/ScrollSection";
import { googleBadges /*, hackerRankBadges*/ } from "@/data/badgesData";
import { hackerRankCertifications, linkedInCertifications } from "@/data/certificationsData";
import type { /*HackerRankBadgeItem,*/ HackerRankCertificationItem } from "@/types";

export default function Certifications() {
	return (
		<ScrollSection id="attainments">
			<ScrollSectionHeading heading="attainments" />
			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Google Cloud</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{googleBadges.map((badge, index) => (
						<GoogleBadgeCard key={index} {...badge} />
					))}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Hacker Rank</h1>
				{/* <h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">Badges</h1>
				<div className="flex lg:gap-4 gap-2">
					{hackerRankBadges.map((item, index) => (
						<SkillBadge
							key={index}
							name={item.name}
							icon={
								<Image
									src={item.icon}
									alt={item.name}
									width={40}
									height={40}
									className="h-10 w-10 object-contain"
								/>
							}
							stars={item.stars}
							source={item.source}
							delay={item.delay}
							link={item.link}
						/>
					))}
				</div>
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">Certifications</h1> */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{hackerRankCertifications.map((cert, index) => (
						<Certificates key={index} {...cert} />
					))}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">LinkedIn & Microsoft</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{linkedInCertifications.map((certificate, index) => (
						<Certificates key={index} {...certificate} />
					))}
				</div>
			</div>
		</ScrollSection>
	);
}

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|  UTILITY FUNCTIONS |--------------------//
//--------------------|____________________|--------------------//
// Reusing CertificationItem from types, but expanding if needed or just using it directly
// Reusing CertificationItem from types, but expanding if needed or just using it directly
function Certificates({ imgUrl, name, link = "" }: HackerRankCertificationItem) {
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring" as const,
				stiffness: 100,
				damping: 10,
				delay: 0.1,
			},
		},
	};

	const overlayVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	return (
		<motion.div
			className="group relative mx-auto w-full max-w-[280px] md:max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			whileTap={{ scale: 0.9 }}
			viewport={{ once: true, amount: 0.3 }}
		>
			<a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`View certificate: ${name}`}
				className="block"
			>
				<div className="overflow-hidden">
					<Image
						className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
						src={imgUrl ?? ""}
						alt={name || "Certificate Image"}
						width={400}
						height={300}
					/>
				</div>
				<motion.div
					className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-white"
					variants={overlayVariants}
					initial="hidden"
					whileHover="visible"
					transition={{ duration: 0.4 }}
				>
					<FaExternalLinkAlt className="mb-2 h-10 w-10" />
					<p className="text-center font-semibold">{name}</p>
					<p className="mt-1 text-center text-sm text-slate-300">Click to view</p>
				</motion.div>
			</a>
		</motion.div>
	);
}
