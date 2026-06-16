"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS, getMediaById } from "@/lib/media";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const portrait =
  getMediaById("event-portrait") ?? getMediaById("brand-shirt-pink");

const EXPERIENCE = [
  "Adapted poses and expressions based on creative direction, enhancing the overall aesthetic and narrative of high-profile projects.",
  "Maintained professional demeanor in high-pressure environments, ensuring smooth operations during shoots and events.",
  "Conducted fitness assessments to tailor projects aligning with health and wellness trends, promoting a positive lifestyle image.",
  "Collaborated on wardrobe selection to ensure consistency with artistic vision and client expectations.",
  "Fostered strong industry relationships, enhancing market reputation and creating new collaboration opportunities.",
  "Optimized team performance through innovative ideas and cross-functional collaboration.",
];

const STATS = [
  { label: "Age", display: "26", animate: 26, suffix: "" },
  { label: "Height", display: "5'11\"", animate: null, suffix: "" },
  { label: "Brands", display: "6+", animate: 6, suffix: "+" },
] as const;

function AnimatedStat({
  label,
  display,
  animate,
  suffix,
}: {
  label: string;
  display: string;
  animate: number | null;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (animate === null || prefersReducedMotion()) {
      el.textContent = display;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: animate,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.val)}${suffix}`;
      },
    });
  }, [animate, display, suffix]);

  return (
    <div className="flex flex-col gap-2">
      <span
        ref={ref}
        className="font-display text-4xl text-accent md:text-5xl"
      >
        {display}
      </span>
      <span className="text-xs tracking-[0.25em] text-mint">{label}</span>
    </div>
  );
}

export function AboutBio() {
  return (
    <section className="bg-background px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.1fr]">
        {portrait && (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-border lg:mx-0">
            <Image
              src={portrait.src}
              alt={portrait.caption}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-10">
          <div>
            <p className="mb-3 text-xs tracking-[0.35em] text-mint">
              FASHION &amp; FITNESS MODEL
            </p>
            <h1 className="font-display text-5xl text-accent md:text-6xl">
              Syed Abbas
            </h1>
            <p className="mt-4 text-base text-accent/70">
              26 · 5&apos;11&quot; · Hyderabad, IN
            </p>
          </div>

          <blockquote className="border-l-2 border-mint pl-6 font-display text-2xl italic leading-snug text-accent/90">
            &ldquo;Every frame is a collaboration between discipline, presence,
            and creative vision.&rdquo;
          </blockquote>

          <div className="space-y-4 text-base leading-relaxed text-accent/75">
            <p>
              Syed Abbas is a Hyderabad-based fashion and fitness model who
              bridges editorial elegance with athletic authenticity. With
              experience across runway, lifestyle, and brand campaigns, he
              brings a composed energy that elevates every project — from
              high-profile fashion shoots to wellness-driven storytelling.
            </p>
            <p>
              Previously worked with numerous brands including Max Fashion
              India, Coffee Cup Cafe, LEMANZO, Capsule Shirts, Neeru&apos;s
              India, and Fly City Hyderabad. His work reflects a commitment to
              professional excellence, collaborative spirit, and a lifestyle
              image that resonates with contemporary audiences.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-xs tracking-[0.35em] text-mint">
              EXPERIENCE
            </h2>
            <ul className="space-y-3">
              {EXPERIENCE.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 text-sm leading-relaxed text-accent/70"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs tracking-[0.35em] text-mint">BRANDS</h2>
            <p className="text-sm leading-relaxed text-accent/70">
              {BRANDS.join(" · ")}
            </p>
          </div>

          <blockquote className="text-sm italic text-accent/50">
            &ldquo;Presence isn&apos;t performed — it&apos;s prepared.&rdquo;
          </blockquote>

          <Link
            href="https://www.instagram.com/beingsyedabbas_7/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit text-sm tracking-wide text-mint transition-colors hover:text-accent"
          >
            @beingsyedabbas_7 on Instagram →
          </Link>
        </div>
      </div>
    </section>
  );
}
