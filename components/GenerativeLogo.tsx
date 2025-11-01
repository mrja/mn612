/// <reference types="react" />
/// <reference types="@react-three/fiber" />

import React, { useRef } from 'react';
import { Canvas, useFrame, extend, ThreeElements } from '@react-three/fiber';
import { Text, shaderMaterial, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const AuroraMaterial = shaderMaterial(
  { u_time: 0 },
  `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }
  `,
  `
    uniform float u_time;
    varying vec2 vUv;

    void main() {
      vec3 color1 = vec3(0.05, 0.4, 0.3); // Deep Green
      vec3 color2 = vec3(0.1, 0.1, 0.5); // Deep Blue/Purple
      vec3 color3 = vec3(0.4, 0.1, 0.3); // Magenta

      float n1 = sin(vUv.x * 3.0 + u_time * 0.2) * 0.5 + 0.5;
      float n2 = cos(vUv.x * 5.0 - u_time * 0.1) * 0.5 + 0.5;
      
      float shimmer = sin(vUv.y * 15.0 + u_time * 4.0) * 0.5 + 0.5;
      shimmer = smoothstep(0.95, 1.0, shimmer);

      vec3 finalColor = mix(color1, color2, n1);
      finalColor = mix(finalColor, color3, n2 * (1.0 - vUv.y)); // Mix more towards the bottom

      finalColor += shimmer * 0.3;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ AuroraMaterial });

// Fix: Augment the '@react-three/fiber' module to include the custom shader material.
// This makes `auroraMaterial` available as a JSX element and resolves the type error.
declare module '@react-three/fiber' {
  interface ThreeElements {
    auroraMaterial: ThreeElements['shaderMaterial'] & { u_time?: number };
  }
}

const LogoMesh = () => {
  // Use InstanceType for better type inference from the shaderMaterial constructor
  const materialRef = useRef<THREE.ShaderMaterial & { uniforms: { u_time: { value: number } } }>(null!);
  
  useFrame((state) => {
    if (materialRef.current) {
      // FIX: Correctly update the uniform's .value property.
      // This was the primary cause of the runtime crash.
      materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <Text
      font="https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff"
      fontSize={3}
      maxWidth={10}
      lineHeight={1}
      letterSpacing={-0.05}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      <auroraMaterial ref={materialRef} side={THREE.DoubleSide} />
      MN612
    </Text>
  );
};

const GenerativeLogo: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <Stars radius={150} depth={50} count={5000} factor={5} saturation={0} fade speed={1.5} />
        <LogoMesh />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} height={300} intensity={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default GenerativeLogo;