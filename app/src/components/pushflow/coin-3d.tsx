"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Html, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useEffect, useMemo, useRef, useState } from "react"

function useCssVar(name: string, fallback: string) {
  const [val, setVal] = useState(fallback)
  useEffect(() => {
    const el = document.documentElement
    const v = getComputedStyle(el).getPropertyValue(name).trim()
    if (v) setVal(v)
  }, [name])
  return val
}

function Coin() {
  const mesh = useRef<THREE.Mesh>(null!)
  const pink = useCssVar("--push-pink-500", "#FF66CC")
  const purple = useCssVar("--push-purple-500", "#7A3AEC")
  const edgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(pink),
        metalness: 0.6,
        roughness: 0.25,
        emissive: new THREE.Color(pink).multiplyScalar(0.15),
        emissiveIntensity: 0.8,
      }),
    [pink],
  )

  const faceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(purple),
        metalness: 0.7,
        roughness: 0.2,
      }),
    [purple],
  )

  useFrame((state, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += delta * 1.2
    mesh.current.rotation.y += delta * 0.6
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.15
  })

  return (
    <group>
      {/* coin: cylinder with different materials (edge vs faces) */}
      <mesh ref={mesh} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.2, 64, 1, false]} />
        {/* order: side, top, bottom */}
        <meshStandardMaterial attach="material-0" {...edgeMat} />
        <meshStandardMaterial attach="material-1" {...faceMat} />
        <meshStandardMaterial attach="material-2" {...faceMat} />
      </mesh>
      {/* soft glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <ringGeometry args={[1.2, 2.2, 64]} />
        <meshBasicMaterial color={pink} opacity={0.25} transparent />
      </mesh>
    </group>
  )
}

export default function Coin3D({ scale = 1 }: { scale?: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 42 }} className="rounded-3xl overflow-hidden shadow-2xl">
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} castShadow />
      <group scale={[scale, scale, scale]}>
        <Coin />
      </group>
      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={false} />
      <Html>
        <span className="sr-only">3D flipping coin animation</span>
      </Html>
    </Canvas>
  )
}
