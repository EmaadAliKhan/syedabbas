"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  /** When true, video only plays while in viewport */
  lazy?: boolean;
  /** Unique id for single-play coordination on mobile */
  playId?: string;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
}

let activePlayId: string | null = null;
const playListeners = new Set<(id: string | null) => void>();

function requestPlay(id: string) {
  activePlayId = id;
  playListeners.forEach((fn) => fn(id));
}

export default function LazyVideo({
  src,
  poster,
  className = "",
  lazy = true,
  playId,
  muted = true,
  loop = true,
  controls = false,
  autoPlay = true,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(!lazy);
  const id = playId ?? src;

  useEffect(() => {
    if (!lazy) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const shouldPlay = inView && autoPlay && (!activePlayId || activePlayId === id);

    if (shouldPlay) {
      requestPlay(id);
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, autoPlay, id]);

  useEffect(() => {
    const onActiveChange = (activeId: string | null) => {
      const video = ref.current;
      if (!video) return;
      if (activeId === id && inView) {
        void video.play().catch(() => undefined);
      } else if (activeId !== id) {
        video.pause();
      }
    };
    playListeners.add(onActiveChange);
    return () => {
      playListeners.delete(onActiveChange);
    };
  }, [id, inView]);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        controls={controls}
        preload="metadata"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
