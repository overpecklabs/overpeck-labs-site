import { createElement, type ReactNode } from "react";

/**
 * Lightweight scroll reveals for this flagship: plain elements with a CSS class, revealed by ONE shared
 * IntersectionObserver (<AppearObserver />, AppearObserver.tsx), instead of a framer-motion component per element. Same look as the
 * shared Reveal / Stagger (fade + rise, staggered children) at a fraction of the hydration cost on phones.
 * Styles live in electric.css; prefers-reduced-motion shows everything immediately.
 */

type Tag = "div" | "ol" | "li" | "section" | "figure";

export function Reveal({ children, className = "", delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: Tag }) {
  return createElement(as, { className: `el-appear ${className}`, style: delay ? { transitionDelay: `${delay}s` } : undefined }, children);
}

export function Stagger({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  return createElement(as, { className: `el-stagger ${className}` }, children);
}

export function StaggerItem({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  return createElement(as, { className: `el-appear ${className}` }, children);
}
