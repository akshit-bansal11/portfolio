/*
 * Attainments.tsx
 * "Attainments" section.
 * Renders the badges block (Google Cloud + HackerRank star
 * badges) followed by the certifications block grouped by
 * issuer (LinkedIn/Microsoft, HackerRank).
 *
 * On mobile (<sm) each item is a compact CredentialPill.
 * On desktop the full card grids are shown instead.
 */

import CertificationCard from "@/components/cards/CertificationCard";
import GoogleBadgeCard from "@/components/cards/GoogleBadgeCard";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import CredentialPill from "@/components/pills/CredentialPill";
import { googleBadges } from "@/data/badgesData";
import {
	hackerRankCertificationsData,
	linkedInCertificationsData,
} from "@/data/certificationsData";
import type { CredentialPillItem } from "@/types/credential-pill";

/* ── data mappers ────────────────────────────────────────── */

function badgeToPill(b: (typeof googleBadges)[number]): CredentialPillItem {
	return {
		iconUrl: "https://svgl.app/library/google-cloud.svg",
		iconAlt: "Google Cloud",
		title: b.gBadgeTitle,
		provider: "Google Cloud",
		href: b.gBadgeLink,
	};
}

function certToPill(c: (typeof linkedInCertificationsData)[number]): CredentialPillItem {
	return {
		iconUrl: c.providers[0]?.logoUrl ?? "",
		iconAlt: c.providers.map((p) => p.name).join(" & "),
		title: c.name,
		provider: c.providers.map((p) => p.name).join(" & "),
		href: c.link,
	};
}

// Top-level Attainments section component.
export default function Attainments() {
	return (
		<ScrollSection id="attainments">
			<ScrollSectionHeading heading="attainments" />

			{/* ── Badges ─────────────────────────────────────── */}
			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl">Badges</h1>

				{/* Mobile pills */}
				<div className="flex flex-col gap-2 sm:hidden">
					{googleBadges.map((badge, index) => (
						<CredentialPill key={index} item={badgeToPill(badge)} />
					))}
				</div>

				{/* Desktop cards */}
				<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{googleBadges.map((badge, index) => (
						<GoogleBadgeCard key={index} {...badge} />
					))}
				</div>
			</div>

			{/* ── Certifications ──────────────────────────────── */}
			<div className="flex flex-col gap-4">
				<h1 className="text-neutral-100 text-xs md:text-sm lg:text-2xl mt-4">Certifications</h1>

				{/* LinkedIn & Microsoft */}
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl">LinkedIn & Microsoft</h1>

				{/* Mobile pills */}
				<div className="flex flex-col gap-2 sm:hidden">
					{linkedInCertificationsData.map((cert, index) => (
						<CredentialPill key={index} item={certToPill(cert)} />
					))}
				</div>

				{/* Desktop cards */}
				<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{linkedInCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={true} />
					))}
				</div>

				{/* HackerRank */}
				<h1 className="text-neutral-400 text-xs md:text-sm lg:text-xl mt-2">HackerRank</h1>

				{/* Mobile pills */}
				<div className="flex flex-col gap-2 sm:hidden">
					{hackerRankCertificationsData.map((cert, index) => (
						<CredentialPill key={index} item={certToPill(cert)} />
					))}
				</div>

				{/* Desktop cards */}
				<div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{hackerRankCertificationsData.map((cert, index) => (
						<CertificationCard key={index} {...cert} showSkillBadges={false} />
					))}
				</div>
			</div>
		</ScrollSection>
	);
}
