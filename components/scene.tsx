"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const sectionColors = ["#22d3ee", "#818cf8", "#a78bfa", "#2dd4bf"];

function ParticleField({ section }: { section: number }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const positions = useMemo(() => {
    const values = new Float32Array(1700 * 3);
    for (let i = 0; i < 1700; i++) {
      const radius = 2 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20;
      values[i * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * 2;
      values[i * 3 + 1] = y;
      values[i * 3 + 2] = Math.sin(theta) * radius - 5;
    }
    return values;
  }, []);

  useEffect(() => {
    const update = (event: PointerEvent) => setPointer({ x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 });
    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  useFrame((state, delta) => {
    if (!points.current || !material.current) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y += delta * 0.035;
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, pointer.y * 0.16, 0.035);
    points.current.position.x = THREE.MathUtils.lerp(points.current.position.x, pointer.x * 1.2, 0.025);
    points.current.position.y = THREE.MathUtils.lerp(points.current.position.y, -section * 1.1 + pointer.y * -0.5, 0.025);
    material.current.color.lerp(new THREE.Color(sectionColors[section]), 0.035);
    material.current.size = THREE.MathUtils.lerp(material.current.size, 0.026 + section * 0.005, 0.04);
    points.current.rotation.z = Math.sin(t * 0.13) * 0.07;
  });

  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial ref={material} color="#22d3ee" size={0.026} sizeAttenuation transparent opacity={0.72} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function OrbitingShapes({ section }: { section: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.x += delta * 0.07;
    group.current.rotation.y += delta * 0.11;
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -4 + section * 0.7, 0.02);
  });
  return (
    <group ref={group} position={[4.5, 0, -4]}>
      <Float speed={1.8} rotationIntensity={1.6} floatIntensity={1.2}><mesh><icosahedronGeometry args={[1.25, 1]} /><meshBasicMaterial color={sectionColors[section]} wireframe transparent opacity={0.4} /></mesh></Float>
      <Float speed={2.2} rotationIntensity={1} floatIntensity={1.8}><mesh position={[-2.5, 1.5, 1]}><torusGeometry args={[0.72, 0.012, 10, 60]} /><meshBasicMaterial color="#c4b5fd" transparent opacity={0.55} /></mesh></Float>
    </group>
  );
}

function SceneContent({ section }: { section: number }) {
  return <><color attach="background" args={["#020617"]} /><fog attach="fog" args={["#020617", 6, 28]} /><ParticleField section={section} /><OrbitingShapes section={section} /><Stars radius={60} depth={30} count={550} factor={2} saturation={0} fade speed={0.4} /></>;
}

export function BackgroundScene({ section }: { section: number }) {
  return <div className="pointer-events-none fixed inset-0 z-0"><Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 9], fov: 58 }}><SceneContent section={section} /></Canvas></div>;
}
