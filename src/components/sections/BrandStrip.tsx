"use client";

import { useState } from "react";
import { BRANDS } from "@/lib/media";

export function BrandStrip() {
  const [paused, setPaused] = useState(false);
  const items = [...BRANDS, ...BRANDS];

  return (
    <section
      aria-label="Brand collaborations"
      className="overflow-hidden border-y border-border bg-surface/30 py-4"
    >
      <p className="label-caps mb-4 text-center text-muted">
        Worked with
      </p>
      <div
        className="flex w-max animate-[marquee_36s_linear_infinite] gap-12 px-6 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-4 motion-reduce:[animation:none]"
        style={{ animationPlayState: paused ? "paused" : "running" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="whitespace-nowrap text-sm font-light tracking-[0.08em] text-accent/60 transition-colors hover:text-accent md:text-base"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
