/*
 * Education.tsx
 * Education section that renders one EduItem per
 * entry in the education data array, under the
 * standard scroll section heading.
 */

import EduItem from "@/components/cards/EduItem";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
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
