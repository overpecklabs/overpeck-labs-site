"use client";

/**
 * Shared motion for every demo (clients/{slug}/ and flagships/{slug}/ demo/page-content.tsx).
 *
 *   <MotionRoot>            wrap the whole page: smooth in-page scrolling + reduced-motion handling
 *   <StickyHeader>          sticky header under the demo banner that shrinks and gains a shadow on scroll
 *   <HeroIntro> + <HeroItem>  hero entrance: headline, then subtext, then buttons
 *   <HeroImage>             hero photo with a slow zoom + gentle parallax (background only)
 *   <Parallax>              fixed-size photo box whose image drifts gently on scroll (never wrap text/forms)
 *   <Reveal>                fade-and-rise when scrolled into view
 *   <Stagger> + <StaggerItem>  same, staggered for grids
 *   <CountUp to={21} />     counts up when visible (use only for TRUE numbers)
 *   className="demo-lift"   hover lift for cards/buttons (CSS, see motion.css)
 *
 * All effects turn off under prefers-reduced-motion. Parallax is halved under 768px. Animations use
 * transform/opacity only, inside fixed boxes: no layout shift.
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
  topBar,
  topBarHeight = 0,
}: {
  children: ReactNode;
  height?: number;
  shrunk?: number;
  className?: string;
  barClassName?: string;
  /** Optional slim strip above the header bar (fixed height `topBarHeight`), e.g. "24/7 Emergency? Tap to call". */
  topBar?: ReactNode;
  topBarHeight?: number;
}) {
  const [top, setTop] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const banner = document.querySelector<HTMLElement>("[data-demo-banner]");
    const update = () => {
      const h = banner?.offsetHeight ?? 0;
      setTop(h);
      document.documentElement.style.setProperty("--demo-offset", `${h + topBarHeight + height + 12}px`);
    };
    update();
    const ro = banner ? new ResizeObserver(update) : null;
    if (banner && ro) ro.observe(banner);
    window.addEventListener("resize", update);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [height, topBarHeight]);

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
    <div className={`sticky z-40 ${className}`} style={{ top, height: topBarHeight + height }}>
      {topBar && <div style={{ height: topBarHeight }}>{topBar}</div>}
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

/* ---------- parallax ---------- */

/** Movement scale: 1 on desktop, 0.5 under 768px. Starts at 1 for SSR; no transform is applied before scrolling. */
function useParallaxScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setScale(mq.matches ? 0.5 : 1);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return scale;
}

/**
 * Image-only parallax: a fixed-size box (give it an aspect-* class, or absolute inset-0) with the image inside
 * drifting up to `amount`% of the box height as the box crosses the viewport. Never wrap text, buttons or forms.
 */
export function Parallax({ children, className = "", amount = 10 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Same markup on server and client (hydration-safe); reduced motion is read after mount and pins the layer at 0.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduce(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const scale = useParallaxScale();
  const amp = useRef(amount * scale);
  amp.current = amount * scale;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // -amp/2 .. +amp/2 of the box height; the image layer is taller by `amount`% on each side so edges never show
  const y = useTransform(scrollYProgress, (v) => `${((v - 0.5) * amp.current) / (1 + (2 * amount) / 100)}%`);
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className);
  return (
    <div ref={ref} className={`${positioned ? "" : "relative "}overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 will-change-transform" style={{ y: reduce ? 0 : y, top: `-${amount}%`, bottom: `-${amount}%` }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Hero background layer: slow zoom on load and a gentle parallax (about 10% of the hero height, halved on
 * phones) as the hero scrolls away. Put it inside a `relative overflow-hidden` hero; it fills it absolutely.
 * Only the photo moves: the headline and form stay in normal flow.
 */
export function HeroImage({ children, className = "", amount = 10 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const scale = useParallaxScale();
  const amp = useRef(amount * scale);
  amp.current = amount * scale;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, (v) => `${(v * amp.current) / (1 + amount / 100)}%`);
  if (reduce)
    return (
      <div ref={ref} className={`absolute inset-0 ${className}`}>
        {children}
      </div>
    );
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 will-change-transform" style={{ y, top: `-${amount / 2}%`, bottom: `-${amount / 2}%` }}>
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
