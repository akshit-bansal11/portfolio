/*
 * Experience.tsx
 * Experience section. Iterates the experience data
 * grouped by category (Internship, Training) and
 * renders an ExpItem for each entry below its
 * category label.
 */

"use client";
import ExpItem from "@/components/common/cards/ExpItem";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/common/sections/ScrollSection";
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
					<h1 className="text-neutral-400 text-[8px] md:text-lg lg:text-2xl">{category.title}</h1>
					{category.items.map((item, i) => (
						<ExpItem key={i} {...item} />
					))}
				</div>
			))}
		</ScrollSection>
	);
}
