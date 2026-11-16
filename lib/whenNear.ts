/**
 * Run `setup` once `el` comes within `margin` of the viewport (default: one screen away), and return a cleanup
 * that undoes whichever happened. Used to defer scroll-animation setup (GSAP ScrollTriggers, stroke measuring) for
 * sections below the fold, so hydration doesn't pay for forced layouts of the whole page. Setup always runs before
 * the section is visible, so nothing looks different.
 */
export function whenNear(el: Element, setup: () => void | (() => void), margin = "100% 0px"): () => void {
  let cleanup: void | (() => void);
  let done = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (done || !entries.some((e) => e.isIntersecting)) return;
      done = true;
      io.disconnect();
      cleanup = setup();
    },
    { rootMargin: margin }
  );
  io.observe(el);
  return () => {
    io.disconnect();
    if (cleanup) cleanup();
  };
}
