import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import OrbitalRings from "@/components/ui/OrbitalRings";
import PageTransition from "@/components/ui/PageTransition";
import SmoothScroll from "@/components/ui/SmoothScroll";
import StarField from "@/components/ui/StarField";
import TopBar from "@/components/ui/TopBar";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://emaadalikhan.github.io/syedabbas";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Syed Abbas — Fashion & Fitness Model",
    template: "%s | Syed Abbas",
  },
  description:
    "Syed Abbas is a fashion and fitness model based in Hyderabad, India. Portfolio, brand collaborations, and booking inquiries.",
  keywords: [
    "Syed Abbas",
    "fashion model",
    "fitness model",
    "Hyderabad model",
    "portfolio",
  ],
  authors: [{ name: "Syed Abbas" }],
  creator: "Syed Abbas",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Syed Abbas",
    title: "Syed Abbas — Fashion & Fitness Model",
    description:
      "Fashion and fitness model based in Hyderabad. Editorial, brand, and wellness-focused portfolio.",
    images: [
      {
        url: "/media/event-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Syed Abbas — fashion portrait",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Abbas — Fashion & Fitness Model",
    description: "Fashion and fitness model based in Hyderabad, India.",
    images: ["/media/event-portrait.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <StarField />
          <OrbitalRings />
          <div className="page-shell">
            <TopBar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
