"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveLaptop } from "./InteractiveLaptop";


export default function HeroCanvas() {
  const { progress } = useProgress();
  const isLoaded = progress === 100;
  const startTime = useRef(performance.now());
  const logged = useRef(false);

  useEffect(() => {
    if (isLoaded && !logged.current) {
      const endTime = performance.now();
      const loadTime = (endTime - startTime.current).toFixed(2);
      console.log(`%c 🚀 HeroCanvas Loaded in ${loadTime}ms`, "background: #1d1d1f; color: #fff; padding: 4px 8px; border-radius: 4px;");
      logged.current = true;
    }
  }, [isLoaded]);

  return (
    <div className="w-full h-full relative cursor-auto select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full"
      >

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
      </motion.div>
    </div>
  );
}
