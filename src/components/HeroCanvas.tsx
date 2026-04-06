"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { InteractiveLaptop } from "./InteractiveLaptop";

export default function HeroCanvas() {
  return (
    <div className="w-full h-full relative cursor-auto select-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          
          <InteractiveLaptop />

          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
