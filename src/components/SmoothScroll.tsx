'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Use ONLY the GSAP ticker — this is the official Lenis+GSAP integration.
    // Avoid the manual requestAnimationFrame loop to prevent double-ticking lenis
    // (which would advance scroll physics twice per frame → jitter + wasted CPU).
    lenis.on('scroll', ScrollTrigger.update);

    const gsapTickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTickerHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsapTickerHandler);
    };
  }, []);

  return <>{children}</>;
}
