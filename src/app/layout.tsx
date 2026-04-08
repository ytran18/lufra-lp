import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";

// Limit to only actually-used weights to reduce font payload
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
  preload: false, // secondary font, don't block render
});

export const metadata: Metadata = {
  title: "Lufra — Picture-in-Picture for macOS",
  description:
    "Float any app above everything else. Resize freely, reposition effortlessly. Experience PiP with 60fps, zero latency, and native macOS design.",
  keywords: ["Picture in Picture", "macOS", "PiP", "productivity", "multitasking"],
  openGraph: {
    title: "Lufra — Picture-in-Picture for macOS",
    description: "Float any app above everything else with 60fps, zero latency.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#fbfbfd]`}>
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
