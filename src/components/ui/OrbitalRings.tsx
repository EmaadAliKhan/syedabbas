"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function OrbitalRings() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const arcs = svg.querySelectorAll<SVGGElement>("[data-orbit]");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const animations = Array.from(arcs).map((arc, index) =>
      gsap.to(arc, {
        rotation: index % 2 === 0 ? 360 : -360,
        transformOrigin: "50% 50%",
        duration: 28 + index * 6,
        repeat: -1,
        ease: "none",
      }),
    );

    return () => {
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden max-md:opacity-[0.12]"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-30"
      >
        <defs>
          <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ddbb6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e8e4d8" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <g data-orbit>
          <circle
            cx="600"
            cy="400"
            r="280"
            fill="none"
            stroke="url(#orbit-gradient)"
            strokeWidth="1"
            strokeDasharray="120 420"
            strokeLinecap="round"
          />
        </g>

        <g data-orbit className="hidden md:block">
          <circle
            cx="600"
            cy="400"
            r="360"
            fill="none"
            stroke="url(#orbit-gradient)"
            strokeWidth="0.75"
            strokeDasharray="90 520"
            strokeLinecap="round"
          />
        </g>

        <g data-orbit className="hidden lg:block">
          <circle
            cx="600"
            cy="400"
            r="440"
            fill="none"
            stroke="url(#orbit-gradient)"
            strokeWidth="0.5"
            strokeDasharray="70 640"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
