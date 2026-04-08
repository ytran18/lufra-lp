"use client";

import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import WindowSelectorDemo from "./WindowSelectorDemo";

export function InteractiveLaptop(props: any) {
  const { nodes, materials } = useGLTF("/model/macbook.glb") as any;

  // Entrance animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const entranceAnim = useSpring({
    position: mounted ? [0, -0.6, 0] : [0, -3.5, -2],
    rotation: mounted ? [0, -Math.PI / 6, 0] : [Math.PI / 8, -Math.PI / 2, 0],
    config: { mass: 2, tension: 150, friction: 30 },
  });

  // Screen metrics
  const screenWidth = 2.94;
  const screenHeight = 1.9;

  return (
    <a.group {...props} position={entranceAnim.position as any} rotation={entranceAnim.rotation as any} dispose={null}>

      {/* Laptop Model */}
      <mesh geometry={nodes["PROD-34805_1"].geometry} material={materials.ASSET_MAT_MR} scale={0.11} />

      {/* Screen Anchor Group: Final tuned position */}
      <group position={[0, 1.30, -1.19]} rotation={[0, 0, 0]}>

        {/* Embedded UI — Html with stable containment to prevent resize jitter */}
        <Html
          transform
          occlude
          position={[0, 0, 0.02]}
          distanceFactor={1.2}
          zIndexRange={[1, 1]}
          // prepend keeps the portal out of the canvas stacking context
          prepend
          className="flex justify-center items-center pointer-events-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            // Promote to own compositing layer to avoid layout thrashing on resize
            willChange: "transform",
          }}
        >
          {/*
           * The inner div must have FIXED pixel dimensions — never % or vw.
           * When Canvas resizes, Html recomputes scale, but a stable px size
           * means the content doesn't reflow, eliminating the visual stutter.
           */}
          <div
            style={{
              width: 1024,
              height: 660,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
              // contain: layout prevents the 1024px div from affecting ancestor layout
              contain: "layout",
            }}
          >
            <div
              className="w-full h-full rounded-[14px] bg-[#1c1c1e] text-left relative overflow-hidden pointer-events-auto"
              style={{ transform: "translateZ(0)" }}
            >
              <WindowSelectorDemo autoPlay={true} />
            </div>
          </div>
        </Html>
      </group>
    </a.group>
  );
}

useGLTF.preload("/model/macbook.glb");
