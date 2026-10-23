/*
 * page.tsx
 * Home page composition.
 * ScrollHero is now a single responsive component — it renders
 * a static stack on mobile/tablet (lg:hidden) and the pinned
 * scroll-driven canvas on desktop (hidden lg:block). No separate
 * MobileHero import is needed.
 */

// import Testimonials from "@/components/sections/Testimonials";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { HeroToContentSpacer, ScrollHero } from "@/components/hero";
import Attainments from "@/components/sections/Attainments";
import Blog from "@/components/sections/Blog";
import ByTheNumbers from "@/components/sections/ByTheNumbers";
import Education from "@/components/sections/Education";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

// Started building in March 2021.
const BUILDING_SINCE = Date.UTC(2021, 2, 1);
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// The page is static, so this runs at build time and is fresh on every deploy
// (one decimal, rounded down).
const YEARS_BUILDING = Math.floor(((Date.now() - BUILDING_SINCE) / MS_PER_YEAR) * 10) / 10;

// Top-level home page component.
function Home() {

  return (
    <div className="flex flex-col items-center w-full">
      {/* Single responsive hero — mobile static stack + desktop scroll canvas. */}
      <ScrollHero />
      {/* Empty buffer between the desktop hero and content sections (desktop only). */}
      <div className="hidden lg:block">
        <HeroToContentSpacer />
      </div>

      <div className="flex pt-10 px-4 md:px-10 lg:px-15 flex-col items-center w-full gap-16 md:gap-20 lg:gap-30">
        {/* Each section is staggered in via ScrollReveal as it enters the viewport. */}
        <ScrollReveal className="w-full" delay={200}>
          <Projects />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={250}>
          <Experience />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={300}>
          <Blog />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={350}>
          <Skills />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={400}>
          <Attainments />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={450}>
          <Education />
        </ScrollReveal>
        <ScrollReveal className="w-full" delay={500}>
          <ByTheNumbers yearsBuilding={YEARS_BUILDING} />
        </ScrollReveal>
        {/* <ScrollReveal className="w-full" delay={550}> */}
        {/* <Testimonials /> */}
        {/* </ScrollReveal> */}
      </div>
    </div>
  );
}

export default Home;
