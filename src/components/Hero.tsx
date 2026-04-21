import { ChevronRight } from "lucide-react";
import HeroCanvasClient from "./HeroCanvasClient";
import { GUMROAD_URL } from "@/constants/links";

/**
 * Hero Component — Apple-esque Minimalism with 50/50 R3F Split
 * Responsive: stacks on mobile, side-by-side on lg+
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center bg-transparent z-10 px-0 lg:px-6 max-w-[1400px] mx-auto pt-24 lg:pt-0">

      {/* Left Column: Typography & CTA */}
      <div className="flex flex-col items-start text-left px-6 lg:pl-12 lg:pr-4 order-2 lg:order-1 pb-16 lg:pb-0 pointer-events-auto">

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold text-black tracking-tighter leading-[0.95] mb-6 drop-shadow-sm">
          Multitask.
          <br /> Without limits.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-xl text-lg sm:text-xl md:text-2xl text-[#86868b] leading-relaxed mb-10 tracking-tight drop-shadow-sm">
          Snap any application window into a smooth Picture-in-Picture mode. 
          Experience 60fps with zero latency and original macOS design.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 z-20">
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-9 py-4 bg-[#1d1d1f] text-white rounded-full text-lg font-semibold transition-all hover:scale-105 hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-95 text-center inline-block"
          >
            Download for Free
          </a>

          <a
            href="#features"
            className="flex flex-row items-center gap-1 text-[#0066cc] hover:underline text-lg font-medium group transition-all"
          >
            See how it works
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/*
       * Right Column: R3F Canvas
       * Unified height logic with min-height safety to prevent the 3D scene 
       * from being compressed on short/mobile viewports.
       */}
      <div className="w-full order-1 lg:order-2 h-[60vh] sm:h-[70vh] lg:h-screen min-h-[500px] lg:min-h-0 relative">
        <HeroCanvasClient />
      </div>

    </section>
  );
}
