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
      {/* 
       * Unified Scale Group:
       * By scaling the parent rather than individual meshes, the Html component 
       * and the 3D geometry share the same coordinate space, preventing drift.
       */}
      <group scale={0.11}>
        {/* Laptop Model */}
        <mesh geometry={nodes["PROD-34805_1"].geometry} material={materials.ASSET_MAT_MR} />

        {/* 
         * Screen Anchor Group: Positioned in model units (unscaled units / 0.11)
         * Adjusted to [0, 11.82, -10.82] to match previous world-space position.
         */}
        <group position={[0, 11.82, -10.82]} rotation={[0, 0, 0]}>
          {/* Embedded UI */}
          <Html
            transform
            occlude
            position={[0, 0, 0.2]} // Slightly more Z-offset to prevent z-fighting at lower DPR
            distanceFactor={11} // Calibrated for the new shared scale
            zIndexRange={[1, 1]}
            prepend
            className="flex justify-center items-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
              transformStyle: "preserve-3d",
              // Critical: Allow vertical scrolling of the page even when cursor is on the laptop
              touchAction: "pan-y",
            }}
          >
            <div
              style={{
                width: 1024,
                height: 660,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform",
                contain: "layout",
                overscrollBehavior: "contain",
              }}
            >
              <div
                className="w-full h-full rounded-[14px] bg-[#1c1c1e] text-left relative overflow-hidden"
                style={{ transform: "translateZ(0)" }}
              >
                <WindowSelectorDemo autoPlay={true} />
              </div>
            </div>
          </Html>
        </group>
      </group>
    </a.group>
  );
}

useGLTF.preload("/model/macbook.glb");
