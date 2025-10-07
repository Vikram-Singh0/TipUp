"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

type Coin3DLogoProps = {
  scale?: number;
  startSpeed?: number;
  fastFactor?: number;
};

function CoinMesh({
  scale = 1,
  startSpeed = 0.6,
  fastFactor = 2,
}: Coin3DLogoProps) {
  const group = React.useRef<THREE.Group>(null);
  const speed = React.useRef(startSpeed);
  const targetSpeed = React.useRef(startSpeed);

  const logo = useTexture("/pushchain-logo.png");
  React.useEffect(() => {
    logo.anisotropy = 8;
    logo.colorSpace = THREE.SRGBColorSpace;
    logo.wrapS = logo.wrapT = THREE.ClampToEdgeWrapping;
    logo.needsUpdate = true;
  }, [logo]);

  useFrame((_, delta) => {
    speed.current = THREE.MathUtils.damp(
      speed.current,
      targetSpeed.current,
      3,
      delta
    );
    if (group.current) {
      group.current.rotation.x += speed.current * delta;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        0.12,
        2,
        delta
      );
    }
  });

  const height = 0.2;
  const radius = 1;

  const onOver = () => (targetSpeed.current = startSpeed * fastFactor);
  const onOut = () => (targetSpeed.current = startSpeed);
  const onDown = () => (targetSpeed.current = startSpeed * fastFactor * 1.5);
  const onUp = () => (targetSpeed.current = startSpeed);

  return (
    <group
      ref={group}
      scale={scale}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onClick={onDown}
    >
      {/* Coin edge */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
        <meshStandardMaterial
          color={"#1a0f1f"}
          metalness={0.75}
          roughness={0.25}
          emissive={"#ff3db1"}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Front logo cap */}
      <mesh
        position={[0, height / 2 + 0.001, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          map={logo}
          transparent
          color={"#ffffff"}
          metalness={0.1}
          roughness={0.45}
        />
      </mesh>

      {/* Back logo cap (mirrored) */}
      <mesh
        position={[0, -height / 2 - 0.001, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      >
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          map={logo}
          transparent
          color={"#ffffff"}
          metalness={0.1}
          roughness={0.45}
        />
      </mesh>

      {/* Subtle neon ring */}
      <mesh scale={[1.3, 1.3, 1.3]} visible={false}>
        <torusGeometry args={[radius + 0.05, 0.03, 16, 100]} />
        <meshBasicMaterial color={"#ff47c6"} transparent opacity={0.0} />
      </mesh>
    </group>
  );
}

export default function Coin3DLogo({
  scale = 1,
  startSpeed = 0.6,
  fastFactor = 2,
}: Coin3DLogoProps) {
  return (
    <Canvas
      camera={{ fov: 45, position: [0, 1.2, 3] }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, -4]} intensity={0.6} />
      <CoinMesh scale={scale} startSpeed={startSpeed} fastFactor={fastFactor} />
    </Canvas>
  );
}
