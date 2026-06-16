"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaById } from "@/lib/media";
import { gsap, prefersReducedMotion, revealOnScroll } from "@/lib/gsap";
import { useScrollReady } from "@/components/ui/SmoothScroll";

const portrait =
  getMediaById("event-portrait") ?? getMediaById("brand-shirt-pink");
const accent = getMediaById("fitness-pool") ?? getMediaById("brand-shirt-olive");

export function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const scrollReady = useScrollReady();

  useEffect(() => {
    if (!scrollReady) return;

    const reduced = prefersReducedMotion();
    const section = sectionRef.current;
    const images = imagesRef.current;
    if (!section || !images || reduced) return;

    const ctx = gsap.context(() => {
      revealOnScroll(images, {
        trigger: section,
        start: "top 85%",
        y: 24,
        duration: 0.8,
      });
    }, section);

    return () => ctx.revert();
  }, [scrollReady]);

  return (
    <section
      ref={sectionRef}
      className="bg-background px-5 py-14 md:px-10 md:py-16 lg:px-16"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-12">
        <div className="flex flex-col gap-5">
          <p className="label-caps text-mint">About</p>

          <blockquote className="text-xl font-light leading-snug tracking-[-0.02em] text-accent md:text-3xl">
            &ldquo;Fashion meets discipline — every frame tells a story of
            presence and precision.&rdquo;
          </blockquote>

          <p className="text-sm leading-relaxed text-muted md:text-base">
            Syed Abbas is a Hyderabad-based fashion and fitness model known for
            poise, athletic presence, and editorial versatility.
          </p>

          <div className="flex gap-6 border-t border-border pt-5">
            {[
              { n: "26", label: "Age" },
              { n: "5'11\"", label: "Height" },
              { n: "6+", label: "Brands" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="text-xl font-light text-accent">{n}</p>
                <p className="label-caps mt-0.5 text-muted">{label}</p>
              </div>
            ))}
          </div>

          <Link href="/about" className="btn-ghost w-fit">
            Full story →
          </Link>
        </div>

        {portrait && (
          <div ref={imagesRef} className="grid grid-cols-2 gap-3 sm:gap-4 lg:min-h-[420px] lg:grid-rows-2">
            <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-xl border border-border sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:h-full lg:min-h-0">
              <Image
                src={portrait.src}
                alt={portrait.caption}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-border bg-background/95 px-3 py-1.5 label-caps text-mint shadow-sm backdrop-blur-sm">
                Editorial
              </span>
            </div>

            {accent && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border sm:aspect-auto sm:h-[calc(50%-0.375rem)] lg:min-h-0 lg:h-auto">
                <Image
                  src={accent.src}
                  alt={accent.caption}
                  fill
                  sizes="(max-width: 640px) 45vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-border bg-background/95 px-3 py-1.5 label-caps text-mint shadow-sm backdrop-blur-sm">
                  Fitness
                </span>
              </div>
            )}

            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface sm:block sm:aspect-auto sm:h-[calc(50%-0.375rem)] lg:min-h-0 lg:h-auto">
              <div className="flex h-full flex-col justify-center p-5">
                <p className="label-caps text-mint">Based in</p>
                <p className="mt-2 text-lg font-light text-accent">Hyderabad</p>
                <p className="mt-1 text-xs text-muted">India</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
