import React from "react";
import { ChevronRight } from "lucide-react";
import HeroCanvas from "./HeroCanvas";

/**
 * Hero Component - Apple-esque Minimalism with 50/50 R3F Split
 */
export default function Hero() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-transparent z-10 px-6 max-w-[1400px] mx-auto pt-24 lg:pt-0">
      
      {/* Left Column: Typography & CTA */}
      <div className="flex flex-col items-start text-left lg:pl-12 lg:pr-4 order-2 lg:order-1 pt-10 lg:pt-0 pb-[10vh] pointer-events-auto">
        
        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tighter leading-[0.95] mb-6 drop-shadow-sm">
          Multitask.
          <br /> Without limits.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-xl text-xl md:text-2xl text-[#86868b] leading-relaxed mb-10 tracking-tight drop-shadow-sm">
          Snap any application window into a smooth Picture-in-Picture mode. 
          Experience 60fps with zero latency and original macOS design.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 z-20">
          <button
            className="group relative px-9 py-4 bg-[#1d1d1f] text-white rounded-full text-lg font-semibold transition-all hover:scale-105 hover:bg-black hover:shadow-xl hover:shadow-black/10 active:scale-95"
          >
            Download for Free
          </button>
          
          <button className="flex flex-row items-center gap-1 text-[#0066cc] hover:underline text-lg font-medium group transition-all">
            Watch the film
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Right Column: R3F Canvas */}
      <div className="w-full h-[60vh] lg:h-screen order-1 lg:order-2 flex items-center justify-center relative">
        {/* Overflowing absolute wrapper so corners don't get cut during rotation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] lg:w-[150%] h-[120vh] lg:h-[120%] z-0 flex items-center justify-center">
          <HeroCanvas />
        </div>
      </div>

    </section>
  );
}
