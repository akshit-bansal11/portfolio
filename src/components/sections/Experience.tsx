"use client";
import ExpItem from "@/components/common/cards/ExpItem";
import ScrollSectionHeading from "@/components/common/headings/ScrollSectionHeading";
//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ScrollSection from "@/components/common/sections/ScrollSection";
import { experience } from "@/data/experienceData";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     MAIN RENDER    |--------------------//
//--------------------|____________________|--------------------//
export default function Experience() {
	return (
		<ScrollSection id="experience">
			<div className="flex w-full gap-2 items-baseline">
				<ScrollSectionHeading heading="experience" />
			</div>
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
