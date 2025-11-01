/// <reference types="react" />
/// <reference types="@react-three/fiber" />

import React, { useRef } from 'react';
// FIX: Import `ShaderMaterialProps` to fix typing for the custom material.
import { Canvas, useFrame, extend, ShaderMaterialProps } from '@react-three/fiber';
import { Text, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const ColorShiftMaterial = shaderMaterial(
  { u_time: 0 },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }
  `,
  // Fragment Shader
  `
    uniform float u_time;
    varying vec2 vUv;

    void main() {
      vec3 colorA = vec3(0.912, 0.191, 0.652); // A vibrant pink
      vec3 colorB = vec3(0.204, 0.891, 0.925); // A cool cyan

      // Create a wave pattern that moves over time, mixing the two colors.
      float pct = abs(sin(u_time * 0.4 + vUv.x * 3.14159));
      vec3 color = mix(colorA, colorB, pct);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ ColorShiftMaterial });

// FIX: Correctly type the props for the custom material. `JSX.IntrinsicElements['shaderMaterial']` is not a valid type.
// The type should extend `ShaderMaterialProps` and include custom uniforms.
type ColorShiftMaterialImpl = {
  u_time?: number;
} & ShaderMaterialProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      colorShiftMaterial: ColorShiftMaterialImpl;
    }
  }
}

const LogoMesh = () => {
  // FIX: The ref should be typed to the material instance, not its props.
  // The instance is a THREE.ShaderMaterial with the 'u_time' uniform property.
  const materialRef = useRef<THREE.ShaderMaterial & { u_time: number }>(null!);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.u_time = state.clock.getElapsedTime();
    }
  });

  return (
    <Text
      fontSize={1.5}
      maxWidth={10}
      lineHeight={1}
      letterSpacing={-0.05}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      scale={[5, 5, 5]}
    >
      <colorShiftMaterial ref={materialRef} side={THREE.DoubleSide} />
      MN612
    </Text>
  );
};

const GenerativeLogo: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LogoMesh />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default GenerativeLogo;