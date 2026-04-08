"use client";

import dynamic from "next/dynamic";

/**
 * Client Component wrapper so that next/dynamic with ssr:false is valid.
 * (ssr:false is only allowed inside Client Components, not Server Components.)
 *
 * Hero pulls in Three.js, @react-three/fiber, @react-three/drei and a 13MB GLB —
 * deferring it here keeps those out of the initial JS bundle and unblocks FCP/LCP.
 */
const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => (
    <div className="relative min-h-screen w-full" aria-hidden="true" />
  ),
});

export default function HeroWrapper() {
  return <Hero />;
}
