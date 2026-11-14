"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Sparkles } from "@react-three/drei";
import { useEffect, useState } from "react";
import CameraRig from "./CameraRig";
import HeroObject from "./HeroObject";
import LaptopRig from "./LaptopRig";
import Funnel from "./Funnel";
import AIOrb from "./AIOrb";
import Reveal from "./Reveal";
import { SPACING } from "@/lib/journey";


export default function Scene({ active }: { active: boolean }) {
  const [low, setLow] = useState(false);
  const [dprMax, setDprMax] = useState(2);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const set = () => {
      setLow(mq.matches);
      setDprMax(mq.matches ? 1.5 : 2);
    };
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dprMax]}
      camera={{ fov: 50, position: [0, 0, 7], near: 0.1, far: 160 }}
      gl={{ antialias: !low, alpha: true, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor onDecline={() => setDprMax(1)} />
      <fog attach="fog" args={["#05060d", 10, 46]} />
      <ambientLight intensity={0.5} />
      <CameraRig />

      <Reveal when={(p) => p[1] < 0.15} position={[0, 0, 0]}>
        <HeroObject low={low} />
      </Reveal>
      <Reveal when={(p) => p[0] > 0.45 && p[2] < 0.15} position={[0, 0, -SPACING]}>
        <LaptopRig low={low} />
      </Reveal>
      <Reveal when={(p) => p[1] > 0.45 && p[3] < 0.15} position={[0, 0, -SPACING * 2]}>
        <Funnel low={low} />
      </Reveal>
      <Reveal when={(p) => p[2] > 0.45} position={[0, 0, -SPACING * 3]}>
        <AIOrb low={low} />
      </Reveal>

      <Sparkles count={low ? 60 : 160} scale={[22, 12, SPACING * 3.6]} position={[0, 0, -SPACING * 1.6]} size={low ? 3 : 2.5} speed={0.3} color="#19f0d2" opacity={0.7} />
      <Sparkles count={low ? 40 : 110} scale={[22, 12, SPACING * 3.6]} position={[0, 0, -SPACING * 1.6]} size={low ? 3 : 2.5} speed={0.25} color="#9b6bff" opacity={0.7} />
    </Canvas>
  );
}
