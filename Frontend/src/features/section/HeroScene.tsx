import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, MeshTransmissionMaterial, Float, Sphere, Environment } from '@react-three/drei';
import { useRef } from 'react';

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-[#050505]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Sphere args={[1.2, 64, 64]}>
            <MeshTransmissionMaterial
              backside
              samples={8}
              thickness={2}
              chromaticAberration={0.02}
              anisotropy={0.1}
              distortion={0.1}
              distortionScale={0.1}
              temporalDistortion={0.1}
              color="#ffffff"
              transmission={1}
              roughness={0.05}
            />
          </Sphere>
        </Float>

        {/* Ambient background glow */}
        <mesh position={[0, 0, -2]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#111" transparent opacity={0.5} />
        </mesh>
      </Canvas>
    </div>
  );
};