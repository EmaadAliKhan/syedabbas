"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_SHOWREEL } from "@/lib/media";

interface ShowreelVideoProps {
  className?: string;
  videoClassName?: string;
}

export function ShowreelVideo({
  className = "",
  videoClassName = "",
}: ShowreelVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    setSaveData(
      "connection" in navigator &&
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData === true,
    );
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [saveData]);

  const cardClass = `relative aspect-[3/4] w-full overflow-hidden rounded-[1rem] border border-accent/20 bg-background shadow-[0_32px_80px_rgba(0,0,0,0.65)] ${className}`;

  if (saveData) {
    return (
      <div ref={containerRef} className={cardClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SHOWREEL.poster}
          alt="Syed Abbas showreel poster"
          className={`h-full w-full object-cover ${videoClassName}`}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cardClass}>
      <video
        ref={videoRef}
        className={`h-full w-full object-cover ${videoClassName}`}
        playsInline
        muted
        autoPlay
        loop
        preload="metadata"
        poster={HERO_SHOWREEL.poster}
      >
        <source src={HERO_SHOWREEL.mp4} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
    </div>
  );
}
