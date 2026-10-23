/*
 * layout.tsx
 * Root Next.js layout for the entire portfolio.
 * Loads global fonts, declares site metadata,
 * mounts persistent UI (light-rays backdrop,
 * welcome animation, NavBar) and the animation
 * provider that gates inner content.
 */

import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/effects/LightRays";
import WelcomeAnimation from "@/components/effects/WelcomeAnimation";
import ScrollIndicator from "@/components/hero/elements/ScrollIndicator";
import NavBar from "@/components/layout/NavBar";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { AnimationProvider } from "@/context/AnimationContext";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

// Geist Sans loaded via next/font for the body sans stack.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist Mono loaded via next/font for code/inline mono usage.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Handwritten layer for margin notes, annotations and hero pen notes.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Site-wide <head> metadata (title, description, favicon).
export const metadata: Metadata = {
  title: "Akshit Bansal | Portfolio",
  description: "Personal portfolio of Akshit Bansal, a Full Stack Developer & Designer.",
  icons: {
    icon: "/favicon.svg",
  },
};

// Viewport + theme color metadata for mobile browsers.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

// Root layout component wrapping every route in the app.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Allow disabling the welcome animation via env (useful for previews).
  const isWelcomeAnimationDisabled =
    process.env.WELCOME_ANIMATION_DISABLED?.trim().toLowerCase() === "true";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased selection:bg-white selection:text-black`}
      >
        <AnimationProvider>
          {/* Fixed background canvas hosting the WebGL light rays effect. */}
          <div className="fixed inset-0 -z-10 bg-black print:hidden">
            <div className="hero-rays h-full w-full">
              <LightRays
                raysOrigin="top-center"
                raysColor="#ffffff"
                raysSpeed={1}
                lightSpread={1}
                rayLength={2}
                pulsating={false}
                fadeDistance={1}
                saturation={1}
                followMouse={false}
              />
            </div>
          </div>
          {/* SVG draw-on welcome animation that plays once on first load. */}
          <WelcomeAnimation disabled={isWelcomeAnimationDisabled} />
          {/* Persistent navigation bar. */}
          <NavBar />
          {/* Always-visible light/dark switch, clear of the centred NavBar. */}
          <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[10000] rounded-xl border border-hero-ink/15 bg-hero-surface/80 backdrop-blur-md md:right-5 print:hidden">
            <ThemeToggle />
          </div>
          {/* Fixed scroll affordance — stays on screen even after the hero scrolls away. */}
          <ScrollIndicator />
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
