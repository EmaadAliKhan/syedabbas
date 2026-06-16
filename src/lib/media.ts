export type MediaCategory =
  | "fashion"
  | "fitness"
  | "editorial"
  | "brand"
  | "video";

export interface MediaItem {
  id: string;
  src: string;
  category: MediaCategory;
  caption: string;
  featured?: boolean;
  showInGallery?: boolean;
  type: "image" | "video";
  poster?: string;
}

/**
 * IMG_1082.HEIC was not converted — ffmpeg unavailable and HEIC
 * requires libheif for sharp conversion. Add lifestyle-01.jpg when ready.
 */
export const MEDIA_PIPELINE_NOTES = [
  "IMG_1082.HEIC skipped: ffmpeg unavailable; install ffmpeg or convert manually to lifestyle-01.jpg",
  "Videos copied without transcoding: ffmpeg unavailable for scale/crf optimization",
  "hero-showreel-poster.jpg present on disk (placeholder if not extracted via ffmpeg)",
] as const;

export const mediaItems: MediaItem[] = [
  {
    id: "lifestyle-airplane",
    src: "/media/lifestyle-airplane.jpg",
    category: "editorial",
    caption: "In transit — editorial lifestyle moment",
    featured: true,
    type: "image",
  },
  {
    id: "brand-shirt-olive",
    src: "/media/brand-shirt-olive.jpg",
    category: "brand",
    caption: "Olive capsule shirt — brand collaboration",
    featured: true,
    type: "image",
  },
  {
    id: "fitness-pool",
    src: "/media/fitness-pool.jpg",
    category: "fitness",
    caption: "Poolside conditioning — fitness editorial",
    featured: true,
    type: "image",
  },
  {
    id: "event-portrait",
    src: "/media/event-portrait.jpg",
    category: "fashion",
    caption: "Event portrait — fashion presence",
    type: "image",
  },
  {
    id: "brand-shirt-mint",
    src: "/media/brand-shirt-mint.png",
    category: "brand",
    caption: "Mint tailored shirt — studio brand look",
    type: "image",
  },
  {
    id: "brand-shirt-floral",
    src: "/media/brand-shirt-floral.png",
    category: "brand",
    caption: "Floral print shirt — seasonal brand campaign",
    type: "image",
  },
  {
    id: "brand-shirt-pink",
    src: "/media/brand-shirt-pink.png",
    category: "brand",
    caption: "Pink statement shirt — bold brand styling",
    type: "image",
  },
  {
    id: "brand-shirt-luxury",
    src: "/media/brand-shirt-luxury.png",
    category: "brand",
    caption: "Luxury shirt edit — premium brand direction",
    featured: true,
    type: "image",
  },
  {
    id: "hero-showreel",
    src: "/media/hero-showreel.mp4",
    category: "video",
    caption: "Showreel — motion portfolio highlight",
    featured: true,
    showInGallery: false,
    type: "video",
    poster: "/media/hero-showreel-poster.jpg",
  },
  {
    id: "clip-portrait",
    src: "/media/clip-portrait.mp4",
    category: "video",
    caption: "Portrait clip — behind-the-scenes motion",
    type: "video",
    poster: "/media/lifestyle-airplane.jpg",
  },
];

export function getMediaById(id: string): MediaItem | undefined {
  return mediaItems.find((item) => item.id === id);
}

/** Gallery excludes hero showreel (home only). Videos sorted first. */
export const galleryItems = mediaItems
  .filter(
    (item) => item.showInGallery !== false && item.id !== "hero-showreel",
  )
  .sort((a, b) => {
    if (a.type === "video" && b.type !== "video") return -1;
    if (b.type === "video" && a.type !== "video") return 1;
    return 0;
  });

/** Primary work-page lead video */
export const workLeadVideo =
  getMediaById("clip-portrait") ??
  galleryItems.find((item) => item.type === "video");

export const featuredMedia = mediaItems.filter((item) => item.featured);

export function getMediaByCategory(category: MediaCategory): MediaItem[] {
  return mediaItems.filter((item) => item.category === category);
}

export const BRANDS = [
  "Max Fashion India",
  "Neeru's India",
  "Capsule Shirts",
  "LEMANZO",
  "Coffee Cup Cafe",
  "Fly City Hyderabad",
] as const;

export const HERO_SHOWREEL = {
  poster: "/media/hero-showreel-poster.jpg",
  webm: "/media/hero-showreel.webm",
  mp4: "/media/hero-showreel.mp4",
} as const;
