import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import LightRays from "@/components/LightRays";
import WelcomeAnimation from "@/components/ui/WelcomeAnimation";
import { AnimationProvider } from "@/context/AnimationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshit Bansal | Portfolio",
  description:
    "Personal portfolio of Akshit Bansal, a Full Stack Developer & Designer.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white selection:text-black`}
      >
        <AnimationProvider>
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
          <WelcomeAnimation />
          <NavBar />
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
