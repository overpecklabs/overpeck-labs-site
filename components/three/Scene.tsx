"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useState } from "react";
import CameraRig from "./CameraRig";
import LaptopRig from "./LaptopRig";
import NodeGraph from "./NodeGraph";
import Dashboard from "./Dashboard";
import AIOrb from "./AIOrb";
import Reveal from "./Reveal";
import { Flask, Beaker, TubeRack } from "./LabProps";
import { SPACING } from "@/lib/journey";

// Progress slots: p[0] hero (fixed at 1, the hero is 2D), p[1] websites, p[2] workflows, p[3] tracking, p[4] AI
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
      <fog attach="fog" args={["#f8f8f5", 12, 46]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 6, 8]} intensity={0.6} />
      <CameraRig />

      <Reveal when={(p) => p[0] > 0.62 && p[1] < 0.97} position={[0, 0, -SPACING]}>
        <LaptopRig low={low} />
        <Flask position={[3.7, -1.15, -1.6]} liquid="#19f0d2" scale={0.75} />
      </Reveal>
      <Reveal when={(p) => p[1] > 0.62 && p[2] < 0.97} position={[0, 0, -SPACING * 2]}>
        <NodeGraph low={low} />
        <TubeRack position={[3.3, -1.9, -1.4]} scale={0.6} />
      </Reveal>
      <Reveal when={(p) => p[2] > 0.62 && p[3] < 0.97} position={[0, 0, -SPACING * 3]}>
        <Dashboard low={low} />
        <Beaker position={[2.6, -1.35, -0.6]} liquid="#4caf6e" scale={0.6} />
      </Reveal>
      <Reveal when={(p) => p[3] > 0.62} position={[0, 0, -SPACING * 4]}>
        <AIOrb low={low} />
      </Reveal>
    </Canvas>
  );
}
