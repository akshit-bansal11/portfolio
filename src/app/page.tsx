//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import { HeroToContentSpacer, ScrollHero } from "@/components/hero";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import ScrollReveal from "@/components/ui/ScrollReveal";

//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    MAIN RENDER     |--------------------//
//--------------------|____________________|--------------------//
function Home() {
	return (
		<div className="flex flex-col items-center w-full">
			<ScrollHero />
			<HeroToContentSpacer />

			<div className="flex pt-10 px-4 md:px-10 lg:px-15 flex-col items-center w-full gap-16 md:gap-20 lg:gap-30">
				<ScrollReveal className="w-full" delay={200}>
					<Projects />
				</ScrollReveal>
				<ScrollReveal className="w-full" delay={250}>
					<Experience />
				</ScrollReveal>
				<ScrollReveal className="w-full" delay={300}>
					<Skills />
				</ScrollReveal>
				<ScrollReveal className="w-full" delay={350}>
					<Certifications />
				</ScrollReveal>
				<ScrollReveal className="w-full" delay={400}>
					<Education />
				</ScrollReveal>
			</div>
		</div>
	);
}

export default Home;
