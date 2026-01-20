//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    DEPENDENCIES    |--------------------//
//--------------------|____________________|--------------------//
import React from 'react';



//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|     COMPONENTS     |--------------------//
//--------------------|____________________|--------------------//
import ProfileHeader from '@/components/sections/ProfileHeader';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Certifications from "@/components/sections/Certifications";
import Education from '@/components/sections/Education';



//--------------------|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|--------------------//
//--------------------|    MAIN RENDER     |--------------------//
//--------------------|____________________|--------------------//
function Home() {
    return (
        <div className="flex pt-20 lg:px-10 md:px-15 px-5 flex-col items-center w-full gap-30 md:gap-20 lg:gap-30">
            <About
                text="Building Practical Web Experiences"
                delay={150}
                animateBy="words"
                direction="top"
                className="w-fit mx-auto lg:text-[100px] md:text-[60px] mb-10 text-[30px] font-thin items-center justify-center text-white drop-shadow-2xl"
            />
            <ProfileHeader />
            <Projects />
            <Experience />
            <Skills />
            <Certifications />
            <Education />
        </div>
    );
}

export default Home;
