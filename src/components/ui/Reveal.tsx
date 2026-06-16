"use client";

import {
  createElement,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  delay?: number;
}

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: RevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(inner, { y: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      inner,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, [delay]);

  return createElement(
    Tag,
    { ref: containerRef, className: `reveal-mask ${className}` },
    <span ref={innerRef} className="reveal-inner">
      {children}
    </span>,
  );
}
