"use client";

import GoogleBadgeCard from "@/components/ui/common/cards/GoogleBadgeCard";
import HackerRankCertificationCard from "@/components/ui/common/cards/HackerRankCertificationCard";
import HackerRankSkillBadge from "@/components/ui/common/cards/HackerRankSkillBadge";
import LinkedInCertificationCard from "@/components/ui/common/cards/LinkedInCertificationCard";
import ScrollSectionHeading from "@/components/ui/common/headings/ScrollSectionHeading";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ScrollSection from "@/components/ui/common/sections/ScrollSection";
import { googleBadges, hackerRankBadges } from "@/data/badgesData";
import {
	hackerRankCertificationsData,
	linkedInCertificationsData,
} from "@/data/certificationsData";

export default function Certifications() {
	return (
		<ScrollSection id="attainments">
			<ScrollSectionHeading heading="attainments" />
			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Badges</h1>
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">Google Cloud</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{googleBadges.map((badge, index) => (
						<GoogleBadgeCard key={index} {...badge} />
					))}
				</div>
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">HackerRank</h1>
				<div className="flex flex-wrap gap-6 justify-center sm:justify-start">
					{hackerRankBadges.map((badge, index) => (
						<HackerRankSkillBadge key={index} {...badge} />
					))}
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Certifications</h1>
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">LinkedIn & Microsoft</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{linkedInCertificationsData.map((cert, index) => (
						<LinkedInCertificationCard key={index} {...cert} />
					))}
				</div>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">HackerRank</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{hackerRankCertificationsData.map((cert, index) => (
						<HackerRankCertificationCard key={index} {...cert} />
					))}
				</div>
			</div>
		</ScrollSection>
	);
}
