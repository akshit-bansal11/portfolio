/*
 * Education.tsx
 * Education section that renders one EduItem per
 * entry in the education data array, under the
 * standard scroll section heading.
 */

"use client";
import EduItem from "@/components/common/cards/EduItem";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
import { education } from "@/data/educationData";

// Top-level Education section component.
export default function Education() {
	return (
		<ScrollSection id="education">
			{/* Section heading. */}
			<div className="flex w-full gap-2 items-baseline">
				<ScrollSectionHeading heading="education" />
			</div>
			{/* One card per education entry. */}
			{education.map((item, index) => (
				<EduItem key={index} {...item} />
			))}
		</ScrollSection>
	);
}
