import { Hero } from "@/components/sections/Hero";
import { BrandStrip } from "@/components/sections/BrandStrip";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <BrandStrip />
      <FeaturedWork />
      <AboutPreview />
      <ContactCTA />
    </main>
  );
}
