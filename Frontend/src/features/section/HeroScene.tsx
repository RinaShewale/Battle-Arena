import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  MeshTransmissionMaterial, 
  Float, 
  Sphere, 
  Environment, 
  Stars 
} from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const FloatingCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  
  // Make the whole group tilt based on mouse position
  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.mouse;
    
    // Smoothly rotate the group towards the mouse
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.3, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.3, 0.1);
    
    // Make the inner core pulse slightly
    if (innerSphereRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      innerSphereRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. THE OUTER GLASS SHELL */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[1.4, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={12}
            thickness={1.0}
            chromaticAberration={0.05}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#ffffff"
            transmission={1}
            roughness={0.01}
            ior={1.2}
          />
        </Sphere>
      </Float>

      {/* 2. THE GLOWING AI CORE */}
      <mesh ref={innerSphereRef} scale={0.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          emissive="#3b82f6" 
          emissiveIntensity={12} 
          color="#1d4ed8" 
          roughness={0} 
        />
        {/* Adds a blue light that shines through the glass */}
        <pointLight intensity={10} color="#3b82f6" distance={5} />
      </mesh>
    </group>
  );
};

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-[#050505]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
        
        {/* Lights */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#4f46e5" />
        
        {/* Background "Data" particles */}
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

        <FloatingCore />

        {/* Studio environment for glass reflections */}
        <Environment preset="city" />

        {/* Subtle floor glow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshBasicMaterial color="#0a0a0a" transparent opacity={1} />
        </mesh>
      </Canvas>

      {/* Vignette Overlay to focus the eye on the center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,5,5,1)_100%)]" />
    </div>
  );
};