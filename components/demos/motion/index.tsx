"use client";

/**
 * Shared motion for every client demo (clients/{slug}/demo/page-content.tsx).
 *
 *   <MotionRoot>            wrap the whole page: smooth in-page scrolling + reduced-motion handling
 *   <StickyHeader>          sticky header under the demo banner that shrinks and gains a shadow on scroll
 *   <HeroIntro> + <HeroItem>  hero entrance: headline, then subtext, then buttons
 *   <HeroImage>             hero photo with a slow zoom + gentle parallax
 *   <Reveal>                fade-and-rise when scrolled into view
 *   <Stagger> + <StaggerItem>  same, staggered for grids
 *   <CountUp to={21} />     counts up when visible (use only for TRUE numbers)
 *   className="demo-lift"   hover lift for cards/buttons (CSS, see motion.css)
 *
 * All effects turn off under prefers-reduced-motion. Animations use transform/opacity only: no layout shift.
 */

import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import "./motion.css";

export { default as DemoImage } from "./DemoImage";

const EASE = [0.2, 0.7, 0.2, 1] as const;

/* ---------- root ---------- */

export function MotionRoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, [reduce]);
  return <div className={`demo-root ${className}`}>{children}</div>;
}

/* ---------- sticky header ---------- */

/**
 * Sticky header that sits just under the demo banner. The outer box keeps a fixed height so the page never
 * jumps; the inner bar shrinks and gains a shadow once you scroll.
 */
export function StickyHeader({
  children,
  height = 72,
  shrunk = 58,
  className = "",
  barClassName = "bg-white/90",
}: {
  children: ReactNode;
  height?: number;
  shrunk?: number;
  className?: string;
  barClassName?: string;
}) {
  const [top, setTop] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const banner = document.querySelector<HTMLElement>("[data-demo-banner]");
    const update = () => {
      const h = banner?.offsetHeight ?? 0;
      setTop(h);
      document.documentElement.style.setProperty("--demo-offset", `${h + height + 12}px`);
    };
    update();
    const ro = banner ? new ResizeObserver(update) : null;
    if (banner && ro) ro.observe(banner);
    window.addEventListener("resize", update);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [height]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const h = scrolled ? shrunk : height;
  return (
    <div className={`sticky z-40 ${className}`} style={{ top, height }}>
      <header
        className={`backdrop-blur-md ${barClassName} ${reduce ? "" : "transition-[height,box-shadow] duration-300 ease-out"} ${scrolled ? "shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)]" : ""}`}
        style={{ height: h }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">{children}</div>
      </header>
    </div>
  );
}

/* ---------- reveal ---------- */

type Tag = "div" | "section" | "article" | "li" | "ul" | "ol" | "figure" | "header" | "p" | "h2" | "h3";

export function Reveal({ children, className, delay = 0, as = "div", y = 24 }: { children: ReactNode; className?: string; delay?: number; as?: Tag; y?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.6, ease: EASE, delay }}>
      {children}
    </M>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

export function Stagger({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);
  const M = motion[as];
  return (
    <M className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);
  const M = motion[as];
  return (
    <M className={className} variants={item}>
      {children}
    </M>
  );
}

/* ---------- hero ---------- */

const heroContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } };
const heroItem: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

/** Hero entrance on load: wrap the hero text; each <HeroItem> (headline, subtext, buttons) enters in turn. */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={heroContainer} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={heroItem}>
      {children}
    </motion.div>
  );
}

/**
 * Hero image layer: slow zoom on load and a gentle parallax as the hero scrolls away.
 * Put it inside a `relative overflow-hidden` hero; it fills it absolutely.
 */
export function HeroImage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  if (reduce)
    return (
      <div ref={ref} className={`absolute inset-0 ${className}`}>
        {children}
      </div>
    );
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-[-6%_0]" style={{ y }}>
        <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- count-up ---------- */

/** Counts from 0 to `to` when scrolled into view. Reserve width with tabular numbers so nothing shifts. */
export function CountUp({ to, duration = 1.4, prefix = "", suffix = "", className = "" }: { to: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setValue(to);
    const controls = animate(0, to, { duration, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);
  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`} style={{ minWidth: `${String(to).length + prefix.length + suffix.length}ch` }}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
