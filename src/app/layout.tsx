/*
 * layout.tsx
 * Root Next.js layout for the entire portfolio.
 * Loads global fonts, declares site metadata,
 * mounts persistent UI (welcome animation,
 * NavBar, theme toggle) and the animation
 * provider that gates inner content.
 */

import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import WelcomeAnimation from "@/components/effects/WelcomeAnimation";
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
  weight: ["500", "600", "700"],
});

// Display face for the hero tagline, name and headings (self-hosted).
const clashDisplay = localFont({
  variable: "--font-clash-display",
  src: [
    { path: "../assets/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
});

// Secondary typed face: role line, buttons, labels.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${clashDisplay.variable} ${spaceGrotesk.variable} antialiased selection:bg-white selection:text-black`}
      >
        <AnimationProvider>
          {/* SVG draw-on welcome animation that plays once on first load. */}
          <WelcomeAnimation disabled={isWelcomeAnimationDisabled} />
          {/* Persistent navigation bar. */}
          <NavBar />
          {/* Always-visible light/dark switch, clear of the centred NavBar. */}
          <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[10000] rounded-xl border border-hero-ink/15 bg-hero-surface/80 backdrop-blur-md md:right-5 print:hidden">
            <ThemeToggle />
          </div>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
