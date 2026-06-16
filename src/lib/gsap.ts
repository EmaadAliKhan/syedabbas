"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll-triggered reveal — keeps elements visible until the tween runs. */
export function revealOnScroll(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    start?: string;
    y?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
  } = {},
) {
  const {
    trigger = target as Element,
    start = "top 88%",
    y = 32,
    duration = 0.8,
    delay = 0,
    stagger,
  } = options;

  return gsap.from(target, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: {
      trigger,
      start,
      once: true,
    },
  });
}

export { gsap, ScrollTrigger };
