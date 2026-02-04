//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    DEPENDENCIES    |--------------------//
//--------------------|____________________|--------------------//
import React from 'react';



//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ProfileHeader from '@/components/sections/ProfileHeader';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Certifications from "@/components/sections/Certifications";
import Education from '@/components/sections/Education';
import ScrollReveal from '@/components/ui/ScrollReveal';



//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    MAIN RENDER     |--------------------//
//--------------------|____________________|--------------------//
function Home() {
    return (
        <div className="flex flex-col items-center w-full">
            <HeroGeometric>
                <About
                    text="Building Practical Web Experiences"
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="w-fit mx-auto xl:text-[100px] lg:text-[80px] md:text-[60px] text-[30px] mb-10 font-thin items-center justify-center text-white drop-shadow-2xl"
                />
            </HeroGeometric>

            <div className="flex pt-10 px-4 md:px-10 lg:px-15 flex-col items-center w-full gap-16 md:gap-20 lg:gap-30">
                <ProfileHeader />
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
