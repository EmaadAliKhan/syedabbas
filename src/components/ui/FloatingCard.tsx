"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  rotation?: number;
  parallax?: number;
}

export default function FloatingCard({
  children,
  className = "",
  rotation = -2,
  parallax = 24,
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const handleMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        x: x * parallax,
        y: y * parallax * 0.6,
        rotate: rotation + x * 4,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const reset = () => {
      gsap.to(card, {
        x: 0,
        y: 0,
        rotate: rotation,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, [parallax, rotation]);

  const style = {
    "--card-rotation": `${rotation}deg`,
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      style={style}
      className={`rounded-[var(--radius-card)] border border-border bg-surface/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm transition will-change-transform md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
