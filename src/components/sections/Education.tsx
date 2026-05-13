"use client";
import EduItem from "@/components/ui/common/cards/EduItem";
import ScrollSectionHeading from "@/components/ui/common/headings/ScrollSectionHeading";
import ScrollSection from "@/components/ui/common/sections/ScrollSection";
import { education } from "@/data/educationData";

export default function Education() {
	return (
		<ScrollSection id="education">
			<div className="flex w-full gap-2 items-baseline">
				<ScrollSectionHeading heading="education" />
			</div>
			{education.map((item, index) => (
				<EduItem key={index} {...item} />
			))}
		</ScrollSection>
	);
}
