"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LazyVideo from "@/components/ui/LazyVideo";
import {
  galleryItems,
  workLeadVideo,
  type MediaCategory,
  type MediaItem,
} from "@/lib/media";
import { gsap, prefersReducedMotion, revealOnScroll } from "@/lib/gsap";
import { useScrollReady } from "@/components/ui/SmoothScroll";

type Filter = "All" | "Fashion" | "Fitness" | "Editorial" | "Brand";

const FILTERS: Filter[] = ["All", "Fashion", "Fitness", "Editorial", "Brand"];

const CATEGORY_MAP: Record<Exclude<Filter, "All">, MediaCategory> = {
  Fashion: "fashion",
  Fitness: "fitness",
  Editorial: "editorial",
  Brand: "brand",
};

const CARD_LAYOUTS = [
  "lg:col-span-5 lg:aspect-[4/5]",
  "lg:col-span-4 lg:aspect-[4/3]",
  "lg:col-span-3 lg:aspect-[3/4]",
  "lg:col-span-4 lg:aspect-[3/4]",
  "lg:col-span-5 lg:aspect-[16/10]",
  "lg:col-span-3 lg:aspect-[4/5]",
  "lg:col-span-4 lg:aspect-[3/4]",
  "lg:col-span-4 lg:aspect-[4/5]",
] as const;

function filterItems(filter: Filter): MediaItem[] {
  if (filter === "All") return galleryItems;
  return galleryItems.filter((item) => item.category === CATEGORY_MAP[filter]);
}

function MediaCard({
  item,
  sizes,
  playId,
  lazyVideo = true,
}: {
  item: MediaItem;
  sizes: string;
  playId: string;
  lazyVideo?: boolean;
}) {
  if (item.type === "video") {
    return (
      <LazyVideo
        src={item.src}
        poster={item.poster}
        playId={playId}
        lazy={lazyVideo}
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.caption}
      fill
      sizes={sizes}
      className="object-cover"
    />
  );
}

export function WorkOrbit() {
  const [filter, setFilter] = useState<Filter>("All");
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollReady = useScrollReady();

  const { leadVideo, gridItems } = useMemo(() => {
    const filtered = filterItems(filter);
    const lead =
      filter === "All"
        ? workLeadVideo
        : filtered.find((item) => item.type === "video") ?? null;

    return {
      leadVideo: lead,
      gridItems: lead
        ? filtered.filter((item) => item.id !== lead.id)
        : filtered,
    };
  }, [filter]);

  const closeLightbox = useCallback(() => setActiveItem(null), []);

  useEffect(() => {
    if (!activeItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeItem, closeLightbox]);

  useEffect(() => {
    if (!scrollReady) return;

    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    const lead = leadRef.current;
    const grid = gridRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      if (lead) {
        revealOnScroll(lead, { trigger: lead, y: 28, duration: 0.9 });
      }

      if (grid) {
        const cards = grid.querySelectorAll("[data-work-card]");
        cards.forEach((card, i) => {
          revealOnScroll(card, {
            trigger: card,
            y: 34,
            duration: 0.75,
            delay: (i % 4) * 0.06,
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, [filter, leadVideo?.id, scrollReady]);

  return (
    <section ref={sectionRef} className="bg-background">
      {/* Page header + lead video — unified cinematic block */}
      <div className="border-b border-border px-5 pb-10 pt-10 md:px-10 lg:px-16 lg:pb-14 lg:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label-caps mb-3 text-mint">Portfolio</p>
              <h1 className="text-4xl font-light tracking-[-0.03em] text-accent md:text-6xl lg:text-7xl">
                Work
              </h1>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted lg:text-base">
              Motion-first portfolio — video opens every visit, followed by
              fashion, fitness, editorial, and brand stills.
            </p>
          </div>

          {leadVideo && (
            <div
              ref={leadRef}
              className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center lg:gap-12 xl:gap-16"
            >
              <button
                type="button"
                onClick={() => setActiveItem(leadVideo)}
                className="group relative aspect-[3/4] w-full max-w-none overflow-hidden rounded-lg border border-accent/15 bg-surface text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-[1.005] hover:border-mint/35 lg:aspect-[4/5] lg:max-h-[min(85vh,820px)]"
              >
                <LazyVideo
                  src={leadVideo.src}
                  poster={leadVideo.poster}
                  playId={`lead-${leadVideo.id}`}
                  lazy={false}
                  className="absolute inset-0 h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full border border-mint/25 bg-background/80 px-3 py-1.5 label-caps text-mint backdrop-blur-md">
                  00 / Video
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <p className="text-xl font-light text-accent lg:text-2xl">
                    {leadVideo.caption}
                  </p>
                  <p className="mt-2 text-xs text-accent/55 lg:text-sm">
                    Click to open full-screen with controls
                  </p>
                </div>
              </button>

              <div className="lg:py-4">
                <p className="label-caps text-mint">Motion lead</p>
                <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.03em] text-accent md:text-5xl lg:text-[3.25rem]">
                  Video first,
                  <br />
                  then the stills.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-accent/65 lg:text-base">
                  Casting teams see pacing, presence, and camera confidence
                  before scrolling into campaign photography and brand edits.
                </p>
                <div className="mt-8 grid grid-cols-3 border-y border-border py-5">
                  {[
                    ["01", "showreel"],
                    ["06+", "brands"],
                    ["HYD", "based"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="text-2xl font-light text-accent lg:text-3xl">
                        {value}
                      </p>
                      <p className="label-caps mt-1 text-muted">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="px-5 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-caps text-mint">Gallery</p>
              <p className="mt-2 text-sm text-muted">
                Filter by campaign mood and category.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    filter === f
                      ? "border-mint bg-mint/10 text-mint"
                      : "border-border text-muted hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div ref={gridRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {gridItems.map((item, i) => {
              const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];
              return (
                <button
                  key={item.id}
                  type="button"
                  data-work-card
                  onClick={() => setActiveItem(item)}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface text-left transition-transform duration-500 hover:-translate-y-1 hover:border-mint/35 ${layout}`}
                >
                  <MediaCard
                    item={item}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    playId={`work-${item.id}`}
                    lazyVideo
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-75" />
                  <div className="absolute left-4 top-4 rounded-full border border-accent/10 bg-background/70 px-3 py-1 label-caps text-mint backdrop-blur-md">
                    {item.type === "video" ? "Video" : item.category}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-base font-light text-accent lg:text-lg">
                      {item.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-background/95 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              layoutId={`work-${activeItem.id}`}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-border lg:max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.type === "video" ? (
                <LazyVideo
                  src={activeItem.src}
                  poster={activeItem.poster}
                  playId={`lightbox-${activeItem.id}`}
                  lazy={false}
                  controls
                  autoPlay
                  className="aspect-[3/4] w-full lg:aspect-video lg:max-h-[85vh]"
                />
              ) : (
                <div className="relative aspect-[3/4] w-full lg:aspect-[4/5]">
                  <Image
                    src={activeItem.src}
                    alt={activeItem.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              )}
            </motion.div>
            <button
              type="button"
              onClick={closeLightbox}
              className="tap-target absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-border text-accent/70 hover:text-accent"
              aria-label="Close lightbox"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
