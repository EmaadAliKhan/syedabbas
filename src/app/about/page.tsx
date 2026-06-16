import { AboutBio } from "@/components/sections/AboutBio";

export const metadata = {
  title: "About — Syed Abbas",
  description:
    "Learn about Syed Abbas — fashion and fitness model based in Hyderabad.",
};

export default function AboutPage() {
  return (
    <main className="bg-background">
      <AboutBio />
    </main>
  );
}
