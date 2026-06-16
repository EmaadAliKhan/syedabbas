#!/usr/bin/env node
/**
 * Build-time media compression.
 * Configure via media.config.json or env overrides:
 *   MEDIA_COMPRESS=false  — skip entirely
 *   MEDIA_IMAGE_QUALITY=82
 *   MEDIA_VIDEO_CRF=28
 *   MEDIA_VIDEO_MAX_WIDTH=1080
 */

import { readFileSync, promises as fs } from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);

function loadConfig() {
  const configPath = path.join(root, "media.config.json");
  const raw = JSON.parse(readFileSync(configPath, "utf-8"));

  if (process.env.MEDIA_COMPRESS === "false") {
    raw.enabled = false;
  }
  if (process.env.MEDIA_IMAGE_QUALITY) {
    raw.images.quality = Number(process.env.MEDIA_IMAGE_QUALITY);
  }
  if (process.env.MEDIA_VIDEO_CRF) {
    raw.videos.crf = Number(process.env.MEDIA_VIDEO_CRF);
  }
  if (process.env.MEDIA_VIDEO_MAX_WIDTH) {
    raw.videos.maxWidth = Number(process.env.MEDIA_VIDEO_MAX_WIDTH);
  }

  return raw;
}

function hasFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], {
    stdio: "ignore",
    shell: true,
  });
  return result.status === 0;
}

async function compressImage(src, dest, config) {
  const ext = path.extname(dest).toLowerCase();
  let pipeline = sharp(src, { failOn: "none" }).rotate();

  const meta = await pipeline.metadata();
  if (meta.width && meta.width > config.images.maxWidth) {
    pipeline = pipeline.resize({
      width: config.images.maxWidth,
      withoutEnlargement: true,
    });
  }

  if (config.images.webp && ext !== ".png") {
    await pipeline.webp({ quality: config.images.quality }).toFile(dest);
    return;
  }

  if (ext === ".png") {
    await pipeline
      .png({ quality: config.images.pngQuality, compressionLevel: 9 })
      .toFile(dest);
  } else {
    await pipeline
      .jpeg({ quality: config.images.quality, mozjpeg: true })
      .toFile(dest);
  }
}

function compressVideo(src, dest, config) {
  const args = [
    "-y",
    "-i",
    src,
    "-vf",
    `scale='min(${config.videos.maxWidth},iw)':-2`,
    "-c:v",
    "libx264",
    "-crf",
    String(config.videos.crf),
    "-preset",
    config.videos.preset,
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    dest,
  ];
  const result = spawnSync("ffmpeg", args, { stdio: "inherit", shell: true });
  return result.status === 0;
}

function extractPoster(videoPath, posterPath, frame) {
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", videoPath, "-ss", frame, "-vframes", "1", "-q:v", "2", posterPath],
    { stdio: "ignore", shell: true },
  );
  return result.status === 0;
}

async function copyFallback(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function main() {
  const config = loadConfig();

  if (!config.enabled) {
    console.log("[media] Compression disabled (media.config.json or MEDIA_COMPRESS=false)");
    return;
  }

  const sourceDir = path.join(root, config.sourceDir);
  const outputDir = path.join(root, config.outputDir);
  const ffmpegOk = hasFfmpeg();

  await fs.mkdir(outputDir, { recursive: true });

  console.log("[media] Compressing assets…");
  console.log(`[media] Source: ${sourceDir}`);
  console.log(`[media] Output: ${outputDir}`);
  console.log(`[media] ffmpeg: ${ffmpegOk ? "available" : "not found — videos copied as-is"}`);

  const entries = Object.entries(config.mapping);
  let heroVideoPath = null;

  for (const [sourceName, outputName] of entries) {
    const src = path.join(sourceDir, sourceName);
    const dest = path.join(outputDir, outputName);

    try {
      await fs.access(src);
    } catch {
      console.warn(`[media] Skip missing: ${sourceName}`);
      continue;
    }

    const ext = path.extname(sourceName).toLowerCase();

    if (IMAGE_EXT.has(ext)) {
      try {
        await compressImage(src, dest, config);
        const stat = await fs.stat(dest);
        console.log(`[media] Image  ${outputName} (${Math.round(stat.size / 1024)} KB)`);
      } catch (err) {
        console.warn(`[media] Image fallback copy ${outputName}:`, err.message);
        await copyFallback(src, dest);
      }
    } else if (VIDEO_EXT.has(ext)) {
      if (config.videos.enabled && ffmpegOk) {
        const ok = compressVideo(src, dest, config);
        if (!ok) await copyFallback(src, dest);
      } else {
        await copyFallback(src, dest);
      }
      const stat = await fs.stat(dest);
      console.log(`[media] Video  ${outputName} (${Math.round(stat.size / 1024)} KB)`);
      if (outputName === "hero-showreel.mp4") heroVideoPath = dest;
    }
  }

  const posterPath = path.join(outputDir, "hero-showreel-poster.jpg");
  const posterExists = await fs.access(posterPath).then(() => true).catch(() => false);

  if (!posterExists) {
    if (heroVideoPath && ffmpegOk) {
      extractPoster(heroVideoPath, posterPath, config.videos.posterFrame);
      console.log("[media] Poster hero-showreel-poster.jpg extracted");
    } else {
      const fallback = path.join(outputDir, "event-portrait.jpg");
      try {
        await fs.copyFile(fallback, posterPath);
        console.log("[media] Poster copied from event-portrait.jpg");
      } catch {
        console.warn("[media] No poster generated");
      }
    }
  }

  console.log("[media] Done.");
}

main().catch((err) => {
  console.error("[media] Failed:", err);
  process.exit(1);
});
