"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.55 + 0.15,
    twinkleSpeed: Math.random() * 0.002 + 0.001,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let stars: Star[] = [];
    let visible = true;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 768 ? 60 : 160;
      stars = createStars(count, width, height);
    };

    const draw = (time: number) => {
      if (!visible) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle =
          0.55 +
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.45;
        context.beginPath();
        context.fillStyle = `rgba(232, 228, 216, ${star.alpha * twinkle})`;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );

    observer.observe(host);
    resize();
    animationFrame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="star-field-host vignette" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
    </div>
  );
}
