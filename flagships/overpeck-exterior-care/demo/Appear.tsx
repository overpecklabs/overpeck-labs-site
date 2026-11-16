"use client";

import { createElement, useEffect, type ReactNode } from "react";

/**
 * Lightweight scroll reveals for this flagship: plain elements with a CSS class, revealed by ONE shared
 * IntersectionObserver (<AppearObserver />), instead of a framer-motion component per element. Same look as the
 * shared Reveal / Stagger (fade + rise, staggered children) at a fraction of the hydration cost on phones.
 * Styles live in exterior.css; prefers-reduced-motion shows everything immediately.
 */

type Tag = "div" | "ol" | "li" | "section" | "figure";

export function Reveal({ children, className = "", delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: Tag }) {
  return createElement(as, { className: `oe-appear ${className}`, style: delay ? { transitionDelay: `${delay}s` } : undefined }, children);
}

export function Stagger({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  return createElement(as, { className: `oe-stagger ${className}` }, children);
}

export function StaggerItem({ children, className = "", as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  return createElement(as, { className: `oe-appear ${className}` }, children);
}

/** Mount once per page. */
export function AppearObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".oe-appear:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
