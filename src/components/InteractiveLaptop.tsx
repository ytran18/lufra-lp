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

      {/* Screen Anchor Group */}
      <group position={[0, 1.51, -1.02]} rotation={[0.08, 0, 0]}>
        
        {/* Base Screen Backdrop */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Embedded UI with infinite loop simulation */}
        <Html 
          transform 
          position={[0, 0, 0.01]} 
          distanceFactor={1.5}
          zIndexRange={[0, 0]}
          className="flex justify-center items-center"
        >
          <div className="w-[1024px] h-[660px] rounded-[24px] bg-[#1c1c1e] text-left transform-gpu shadow-2xl relative overflow-hidden">
            <WindowSelectorDemo autoPlay={true} />
          </div>
        </Html>
      </group>
    </a.group>
  );
}

useGLTF.preload("/model/macbook.glb");
