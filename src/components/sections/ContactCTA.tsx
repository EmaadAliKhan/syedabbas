"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { getMediaById } from "@/lib/media";

const backdrop = getMediaById("lifestyle-airplane");

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-24 lg:px-16">
      {backdrop && (
        <div className="absolute inset-0">
          <Image
            src={backdrop.src}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-20 blur-3xl"
            aria-hidden
          />
          <div className="absolute inset-0 bg-background/85" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        <p className="label-caps text-mint">Bookings open</p>
        <h2 className="text-4xl font-light tracking-[-0.04em] text-accent md:text-6xl md:leading-none">
          Let&apos;s create
          <br />
          <span className="text-mint/80">something iconic</span>
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
          Fashion editorials, fitness campaigns, brand collaborations, and
          commercial work across India.
        </p>
        <ButtonLink href="/contact" variant="primary">
          Get in touch
        </ButtonLink>
      </div>
    </section>
  );
}
