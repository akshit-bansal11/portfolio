"use client";

import CertificationCard from "@/components/common/cards/CertificationCard";
import GoogleBadgeCard from "@/components/common/cards/GoogleBadgeCard";
import HackerRankSkillBadge from "@/components/common/cards/HackerRankSkillBadge";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ScrollSection from "@/components/common/sections/ScrollSection";
import { googleBadges, hackerRankBadges } from "@/data/badgesData";
import {
	cuvetteCertificationsData,
	hackerRankCertificationsData,
	linkedInCertificationsData,
	scalerCertificationsData,
	udemyCertificationsData,
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
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl mt-4">Certifications</h1>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">LinkedIn & Microsoft</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{linkedInCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={true} />
					))}
				</div>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl mt-2">HackerRank</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{hackerRankCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={false} />
					))}
				</div>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl mt-2">Udemy</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{udemyCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={false} />
					))}
				</div>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl mt-2">Scaler</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{scalerCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={false} />
					))}
				</div>

				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl mt-2">Cuvette</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{cuvetteCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={false} />
					))}
				</div>
			</div>
		</ScrollSection>
	);
}
