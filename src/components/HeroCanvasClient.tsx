"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden="true" />,
});

export default function HeroCanvasClient() {
  return <HeroCanvas />;
}
