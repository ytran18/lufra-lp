"use client";

import React, { useState, useEffect } from "react";
import { useGLTF, useTexture, Html } from "@react-three/drei";
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

        {/* Embedded UI with infinite loop simulation */}
        <Html
          transform
          position={[0, 0, 0.01]}
          distanceFactor={1.2} // <-- Tăng tỷ lệ này lên để màn hình to ra (trước là 1.07)
          zIndexRange={[0, 0]}
          className="flex justify-center items-center"
        >
          <div
            style={{
              width: 1024,
              height: 660,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full rounded-[14px] bg-[#1c1c1e] text-left transform-gpu relative overflow-hidden pointer-events-auto">
              <WindowSelectorDemo autoPlay={true} />
            </div>
          </div>
        </Html>
      </group>
    </a.group>
  );
}

useGLTF.preload("/model/macbook.glb");
