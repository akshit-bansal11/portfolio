/*
 * layout.tsx
 * Root Next.js layout for the entire portfolio.
 * Loads global fonts, declares site metadata,
 * mounts persistent UI (light-rays backdrop,
 * welcome animation, NavBar) and the animation
 * provider that gates inner content.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/effects/LightRays";
import WelcomeAnimation from "@/components/effects/WelcomeAnimation";
import ScrollIndicator from "@/components/hero/decorations/ScrollIndicator";
import NavBar from "@/components/layout/NavBar";
import { AnimationProvider } from "@/context/AnimationContext";

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
		<html lang="en" className="dark">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white selection:text-black`}
			>
				<AnimationProvider>
					{/* Fixed background canvas hosting the WebGL light rays effect. */}
					<div className="fixed inset-0 -z-10 bg-black">
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
					{/* SVG draw-on welcome animation that plays once on first load. */}
					<WelcomeAnimation disabled={isWelcomeAnimationDisabled} />
					{/* Persistent navigation bar. */}
					<NavBar />
					{/* Fixed scroll affordance — stays on screen even after the hero scrolls away. */}
					<ScrollIndicator />
					{children}
				</AnimationProvider>
			</body>
		</html>
	);
}
