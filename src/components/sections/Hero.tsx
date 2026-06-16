"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShowreelVideo } from "@/components/sections/ShowreelVideo";
import { getMediaById, type MediaItem } from "@/lib/media";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const NAME = "SYED ABBAS";
const NAME_LINES = ["SYED", "ABBAS"] as const;
const isMediaItem = (item: MediaItem | undefined): item is MediaItem =>
  Boolean(item);
const HERO_FRAMES = [
  getMediaById("lifestyle-airplane"),
  getMediaById("fitness-pool"),
  getMediaById("brand-shirt-luxury"),
].filter(isMediaItem);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const frameRailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    const frameRail = frameRailRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const scrollCue = scrollCueRef.current;

    if (!section || !videoWrap) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(letters, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(letters, { y: "100%", opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(videoWrap, { scale: 0.96, opacity: 0, y: 24, duration: 1.1 }, 0)
        .to(
          letters,
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.035 },
          0.25,
        )
        .from(
          frameRail?.children ?? [],
          { opacity: 0, y: 16, duration: 0.65, stagger: 0.07 },
          0.55,
        )
        .from(scrollCue, { opacity: 0, duration: 0.5 }, 0.9);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/20" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(157,219,182,0.07),transparent_38%,rgba(192,153,107,0.06)_72%,transparent)]" />

      {/* Desktop: faint vertical guide lines */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden
      >
        <div className="mx-auto h-full max-w-7xl px-16">
          <div className="relative h-full border-x border-border/40" />
        </div>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-8 md:px-10 md:pb-14 lg:px-16 lg:pb-16 lg:pt-10"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,520px)] xl:gap-16">
          {/* Copy column */}
          <div className="relative z-20 lg:pt-6 xl:pt-10">
            <p className="label-caps mb-5 text-mint">
              Fashion &amp; Fitness Model
            </p>

            <h1
              className="text-[clamp(3rem,11vw,5.5rem)] font-light leading-[0.86] tracking-[-0.04em] text-accent xl:text-[6.5rem]"
              aria-label={NAME}
            >
              {NAME_LINES.map((line, lineIndex) => (
                <span key={line} className="block">
                  {line.split("").map((char, charIndex) => {
                    const index =
                      charIndex +
                      NAME_LINES.slice(0, lineIndex).join("").length;

                    return (
                      <span key={`${char}-${index}`} className="reveal-mask">
                        <span
                          ref={(el) => {
                            if (el) lettersRef.current[index] = el;
                          }}
                          className="reveal-inner inline-block"
                        >
                          {char}
                        </span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-accent/70 lg:mt-8 lg:text-lg">
              Editorial presence, athletic discipline, and clean brand visuals
              for campaigns, lookbooks, fitness stories, and runway-led shoots.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5">
              <span className="label-caps text-muted">26</span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span className="label-caps text-muted">5&apos;11&quot;</span>
              <span className="h-3 w-px bg-border" aria-hidden />
              <span className="label-caps text-muted">Hyderabad, IN</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/work" className="btn-primary">
                View Work
              </Link>
              <Link href="/contact" className="btn-ghost">
                Book Shoot
              </Link>
            </div>

            <div
              ref={scrollCueRef}
              className="mt-10 hidden items-center gap-3 text-muted lg:flex"
            >
              <span className="label-caps">Scroll</span>
              <span className="h-px w-8 bg-border" />
              <svg
                width="12"
                height="18"
                viewBox="0 0 12 18"
                fill="none"
                className="motion-safe:animate-bounce opacity-50"
                aria-hidden
              >
                <path
                  d="M6 1v12M6 13l-4-4M6 13l4-4"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Video column — dominant on desktop */}
          <div className="relative lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
            <div ref={videoWrapRef}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <p className="label-caps text-mint">01 / Showreel</p>
                <p className="hidden text-[10px] uppercase tracking-[0.18em] text-accent/45 lg:block">
                  Motion portfolio
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-3 border border-mint/15 lg:-inset-4" />
                <div className="pointer-events-none absolute -right-6 top-1/4 hidden h-24 w-px bg-mint/25 xl:block" />
                <ShowreelVideo className="lg:aspect-[3/4] lg:max-h-[min(78vh,720px)]" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent p-5 lg:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="label-caps text-mint">Showreel</p>
                      <p className="mt-1 text-sm text-accent/85 lg:text-base">
                        Campaign-ready motion
                      </p>
                    </div>
                    <span className="rounded-full border border-accent/15 bg-background/75 px-3 py-1.5 text-[10px] uppercase tracking-wider text-accent/70 backdrop-blur-md">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame strip — flows below video, no overlap */}
            <div
              ref={frameRailRef}
              className="mt-5 grid grid-cols-3 gap-3 lg:mt-6"
            >
              {HERO_FRAMES.map((item, i) => (
                <Link
                  key={item.id}
                  href="/work"
                  className={`group relative aspect-[4/5] overflow-hidden border border-accent/10 bg-surface shadow-xl transition-transform duration-500 hover:-translate-y-1 hover:border-mint/30 ${
                    i === 1 ? "lg:translate-y-3" : ""
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 1024px) 30vw, 140px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
