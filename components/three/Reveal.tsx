"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { journey } from "@/lib/journey";

/** Only renders a set-piece while the camera is near it (saves draw calls, hides pop-in behind fog). */
export default function Reveal({ when, children, ...rest }: { when: (p: number[]) => boolean; children: React.ReactNode; position?: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = when(journey.p);
  });
  return (
    <group ref={ref} {...rest}>
      {children}
    </group>
  );
}
