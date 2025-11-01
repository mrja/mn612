/// <reference types="react" />
/// <reference types="@react-three/fiber" />

import React, { useRef } from 'react';
// Fix: Removed ShaderMaterialProps from import as it is no longer exported from the top-level of '@react-three/fiber'.
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text, shaderMaterial, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const AuroraMaterial = shaderMaterial(
  { u_time: 0 },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vUv = uv;
    }
  `,
  // Fragment Shader - Aurora Borealis effect
  `
    uniform float u_time;
    varying vec2 vUv;

    // Basic noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Define colors for the aurora
      vec3 color1 = vec3(0.05, 0.4, 0.3); // Deep Green
      vec3 color2 = vec3(0.1, 0.1, 0.5); // Deep Blue/Purple
      vec3 color3 = vec3(0.4, 0.1, 0.3); // Magenta

      // Create multiple layers of flowing, vertical noise patterns
      // These simulate the moving curtains of the aurora
      float n1 = smoothstep(0.2, 0.6, abs(sin(vUv.x * 2.5 + u_time * 0.2)));
      float n2 = smoothstep(0.3, 0.7, abs(cos(vUv.x * 3.5 - u_time * 0.1)));
      
      // Create a shimmering effect based on vertical position and time
      float shimmer = abs(sin(vUv.y * 12.0 + u_time * 3.0));
      shimmer = smoothstep(0.9, 1.0, shimmer);

      // Mix the colors based on the noise patterns
      vec3 finalColor = mix(color1, color2, n1);
      finalColor = mix(finalColor, color3, n2);

      // Add the shimmer as bright highlights to the final color
      finalColor += shimmer * 0.25;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ AuroraMaterial });

// Fix: Used ReactThreeFiber.ShaderMaterialProps which is available via reference types. This correctly types the custom material props.
type AuroraMaterialImpl = {
  u_time?: number;
} & ReactThreeFiber.ShaderMaterialProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      auroraMaterial: AuroraMaterialImpl;
    }
  }
}

const LogoMesh = () => {
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
      <auroraMaterial ref={materialRef} side={THREE.DoubleSide} />
      MN612
    </Text>
  );
};

const GenerativeLogo: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <LogoMesh />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} height={300} intensity={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default GenerativeLogo;