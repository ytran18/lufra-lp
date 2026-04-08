"use client";

import React, { useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { DoubleSide } from "three";
import { useWindowSelectorTexture } from "./WindowSelectorTexture";

let __didDisableImageBitmap = false;
function disableImageBitmapLoaderForCompat() {
  if (__didDisableImageBitmap) return;
  if (typeof window === "undefined") return;
  if (typeof navigator === "undefined" || typeof navigator.userAgent !== "string") return;

  // GLTFLoader will prefer ImageBitmapLoader when `createImageBitmap` exists.
  // Some browsers can intermittently fail to decode `blob:` image URIs used for
  // embedded textures (bufferView images), producing:
  // THREE.GLTFLoader: Couldn't load texture "blob:..."
  // Falling back to TextureLoader (<img>) is more robust for this landing page.
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = ua.includes("Firefox");

  if ((isSafari || isFirefox) && "createImageBitmap" in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).createImageBitmap = undefined;
      __didDisableImageBitmap = true;
    } catch {
      // If the property is non-writable, ignore — we just keep default behavior.
    }
  }
}

disableImageBitmapLoaderForCompat();

export function InteractiveLaptop(props: any) {
  const { nodes, materials } = useGLTF("/model/macbook.glb") as any;
  const screenTexture = useWindowSelectorTexture({ autoPlay: true, width: 1024, height: 660 });

  // Entrance animation
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const entranceAnim = useSpring({
    position: mounted ? [0, -0.6, 0] : [0, -3.5, -2],
    rotation: mounted ? [0, -Math.PI / 6, 0] : [Math.PI / 8, -Math.PI / 2, 0],
    config: { mass: 2, tension: 150, friction: 30 },
  });

  // Screen metrics
  // NOTE: The screen plane lives inside the `group scale={0.11}`.
  // Use model-space dimensions here (world size / 0.11), otherwise it will appear tiny.
  const modelScale = 0.11;
  const screenWidth = 2.94 / modelScale;
  const screenHeight = 1.9 / modelScale;

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
          {/* 
           * Robust "screen" rendering:
           * Use real 3D geometry (a plane) instead of DOM overlay (`Html`).
           * This removes drift caused by browser zoom/DPR/subpixel rounding.
           */}
          <mesh position={[0, 0, 0.09]} renderOrder={10}>
            <planeGeometry args={[screenWidth, screenHeight]} />
            <meshBasicMaterial
              map={screenTexture}
              toneMapped={false}
              side={DoubleSide}
              transparent
              polygonOffset
              polygonOffsetFactor={-2}
              polygonOffsetUnits={-2}
            />
          </mesh>
        </group>
      </group>
    </a.group>
  );
}

useGLTF.preload("/model/macbook.glb");
