/*
 * Experience.tsx
 * Experience section. Iterates the experience data
 * grouped by category (Internship, Training) and
 * renders an ExpItem for each entry below its
 * category label.
 */

import ExpItem from "@/components/cards/ExpItem";
import ScrollSectionHeading from "@/components/headings/ScrollSectionHeading";
import ScrollSection from "@/components/layout/ScrollSection";
import { experience } from "@/data/experienceData";

// Top-level Experience section component.
export default function Experience() {
	return (
		<ScrollSection id="experience">
			{/* Section heading. */}
			<div className="flex w-full gap-2 items-baseline">
				<ScrollSectionHeading heading="experience" />
			</div>
			{/* Render each category group with its label and items. */}
			{experience.map((category, index) => (
				<div key={index} className="flex flex-col gap-2">
					<h1 className="text-neutral-400 text-xs sm:text-base md:text-lg lg:text-2xl">
						{category.title}
					</h1>
					{category.items.map((item, i) => (
						<ExpItem key={i} {...item} />
					))}
				</div>
			))}
		</ScrollSection>
	);
}
