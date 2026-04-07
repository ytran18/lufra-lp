"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    title: "Ghost Mode",
    subtitle: "Invisible & translucent",
    description:
      "Vanish from the screen when you need to focus — translucent, distraction-free, no visual clutter.",
    mockSide: "right" as const,
  },
  {
    title: "Zero Latency",
    subtitle: "Silky 60 fps",
    description:
      "Every action responds instantly. No stutter, no waiting — just velvet-smooth motion.",
    mockSide: "left" as const,
  },
  {
    title: "Multi-task",
    subtitle: "Native-feeling UI",
    description:
      "Work in parallel in a familiar space. Windows, layers, and flows as tidy as on a real machine.",
    mockSide: "right" as const,
  },
  {
    title: "Shortcuts",
    subtitle: "Global shortcuts",
    description:
      "One consistent shortcut set, everywhere. Less movement — more output.",
    mockSide: "left" as const,
  },
];

export default function Features() {
  const introRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  /** Scroll 0→1 across intro runway: reveal (fade + rise), hold, then exit. */
  const introOpacity = useTransform(introProgress, [0, 0.22, 0.48, 0.78], [0, 1, 1, 0]);
  const introY = useTransform(introProgress, [0, 0.22, 0.48, 0.78], [40, 0, 0, -20]);

  return (
    <section
      id="features"
      className="relative w-full bg-[#fbfbfd] text-[#1d1d1f]"
    >
      <div ref={introRef} className="relative min-h-[120vh] w-full">
        <div className="sticky top-0 z-20 flex min-h-[100dvh] w-full items-center justify-center px-6 py-24 md:px-10">
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="max-w-[min(92vw,56rem)] text-center"
          >
            <p className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-[#86868b]">
              Lufra
            </p>
            <h2 className="font-heading text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.12] tracking-tighter text-[#1d1d1f]">
              <span className="block">Immense power.</span>
              <span className="mt-1 block md:mt-2">Quiet at its core.</span>
            </h2>
          </motion.div>
        </div>
      </div>

      <div
        ref={stackRef}
        className="relative h-[520vh] w-full scroll-mt-8"
      >
        <div className="sticky top-0 z-10 flex min-h-[100dvh] w-full items-center justify-center overflow-hidden px-4 py-16 md:px-8">
          <div
            className="relative h-[min(78vh,640px)] w-full max-w-6xl"
            style={{ perspective: 1400 }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                index={i}
                totalCards={FEATURES.length}
                title={f.title}
                subtitle={f.subtitle}
                description={f.description}
                mockSide={f.mockSide}
                scrollYProgress={stackProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
