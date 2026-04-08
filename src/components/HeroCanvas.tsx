"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { InteractiveLaptop } from "./InteractiveLaptop";

export default function HeroCanvas() {
  return (
    <div className="w-full h-full relative cursor-auto select-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        // Cap DPR to prevent expensive re-renders on high-DPI screens during resize
        dpr={[1, 1.5]}
        // Debounce canvas resize so it doesn't jitter on every pixel change
        resize={{ debounce: 200 }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />

          <InteractiveLaptop />

          <ContactShadows position={[0, -1.35, 0]} opacity={0.55} scale={10} blur={2.8} far={4} />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableDamping={true} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
}
