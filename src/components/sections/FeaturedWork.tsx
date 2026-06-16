"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredMedia } from "@/lib/media";
import { gsap, prefersReducedMotion, revealOnScroll } from "@/lib/gsap";
import { useScrollReady } from "@/components/ui/SmoothScroll";

const FEATURED_IMAGES = featuredMedia
  .filter((item) => item.type === "image")
  .slice(0, 4);

const DESKTOP_LAYOUT = [
  {
    className:
      "lg:col-span-7 lg:row-span-2 lg:-rotate-1 lg:translate-y-2",
    sizes: "(max-width: 1024px) 50vw, 42vw",
  },
  {
    className:
      "lg:col-span-5 lg:row-span-1 lg:rotate-2 lg:-translate-y-1",
    sizes: "28vw",
  },
  {
    className:
      "lg:col-span-4 lg:row-span-1 lg:col-start-9 lg:-rotate-1",
    sizes: "22vw",
  },
  {
    className:
      "lg:col-span-6 lg:col-start-4 lg:row-span-1 lg:rotate-1 lg:-translate-y-3",
    sizes: "32vw",
  },
] as const;

const AUTO_SCROLL_MS = 4500;

export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const activeIndexRef = useRef(0);
  const scrollReady = useScrollReady();

  const scrollToIndex = useCallback((index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = carousel.querySelectorAll<HTMLElement>("[data-carousel-card]");
    const card = cards[index];
    if (!card) return;

    const left =
      card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
    carousel.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timer = window.setInterval(() => {
      if (paused) return;
      activeIndexRef.current =
        (activeIndexRef.current + 1) % FEATURED_IMAGES.length;
      scrollToIndex(activeIndexRef.current);
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(timer);
  }, [paused, scrollToIndex]);

  useEffect(() => {
    if (!scrollReady) return;

    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || !cards.length) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      cards.forEach((card, i) => {
        revealOnScroll(card, {
          trigger: card,
          start: "top 88%",
          y: 36,
          duration: 0.8,
          delay: i * 0.07,
        });
      });
    }, section);

    return () => ctx.revert();
  }, [scrollReady]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-background px-5 py-14 md:px-10 md:py-16 lg:px-16"
    >
      <div className="pointer-events-none absolute right-4 top-16 hidden text-[8rem] font-light leading-none text-accent/[0.03] lg:block">
        04
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4 lg:mb-10">
          <div>
            <p className="label-caps mb-2 text-mint">Portfolio</p>
            <h2 className="text-3xl font-light tracking-[-0.03em] text-accent lg:text-5xl">
              Featured work
            </h2>
          </div>
          <Link href="/work" className="btn-ghost shrink-0 text-[9px]">
            View all →
          </Link>
        </div>

        {/* Mobile carousel */}
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {FEATURED_IMAGES.map((item, i) => (
            <Link
              key={item.id}
              href="/work"
              data-carousel-card
              className={`relative shrink-0 snap-center overflow-hidden rounded-lg border border-border ${
                i === 0 ? "aspect-[3/4] w-[78vw]" : "aspect-[3/4] w-[62vw]"
              }`}
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="80vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/90 to-transparent px-4 pb-4 pt-16">
                <span className="inline-block rounded-full border border-border bg-background/95 px-3 py-1 label-caps text-mint backdrop-blur-sm">
                  {item.category}
                </span>
                <p className="mt-2 text-xs leading-snug text-accent/90">
                  {item.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop editorial mosaic */}
        <div className="hidden lg:grid lg:min-h-[580px] lg:grid-cols-12 lg:grid-rows-[repeat(3,minmax(150px,1fr))] lg:gap-5">
          {FEATURED_IMAGES.map((item, i) => {
            const layout = DESKTOP_LAYOUT[i] ?? DESKTOP_LAYOUT[0];
            return (
              <div
                key={item.id}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className={`group relative min-h-[160px] overflow-hidden rounded-lg border border-border transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:border-mint/35 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${layout.className}`}
              >
                <Link href="/work" className="block h-full w-full">
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    sizes={layout.sizes}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-accent/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-widest text-accent/55 backdrop-blur-md">
                    0{i + 1}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block rounded-full border border-border bg-background/90 px-2.5 py-1 label-caps text-mint backdrop-blur-sm">
                      {item.category}
                    </span>
                    <p className="mt-3 max-w-sm text-lg font-light leading-snug text-accent">
                      {item.caption}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
