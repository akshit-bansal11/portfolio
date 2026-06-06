/*
 * Attainments.tsx
 * "Attainments" section.
 * Renders the badges block (Google Cloud + HackerRank star
 * badges) followed by the certifications block grouped by
 * issuer (LinkedIn/Microsoft, HackerRank).
 */

import CertificationCard from "@/components/cards/CertificationCard";
import GoogleBadgeCard from "@/components/cards/GoogleBadgeCard";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { googleBadges } from "@/data/badgesData";
import {
	hackerRankCertificationsData,
	linkedInCertificationsData,
} from "@/data/certificationsData";

// Top-level Attainments section component.
export default function Attainments() {
	return (
		<ScrollSection id="attainments">
			<ScrollSectionHeading heading="attainments" />
			{/* Badges block (Google + HackerRank). */}
			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Badges</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{googleBadges.map((badge, index) => (
						<GoogleBadgeCard key={index} {...badge} />
					))}
				</div>
			</div>

			{/* Certifications block (LinkedIn/Microsoft + HackerRank). */}
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
			</div>
		</ScrollSection>
	);
}
