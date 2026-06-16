# Syed Abbas Portfolio

Next.js 15 portfolio site with contact form, inquiry storage via Vercel KV, and a password-protected admin inbox.

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env.local` and fill in the values:

   | Variable | Description |
   | --- | --- |
   | `KV_REST_API_URL` | Vercel KV REST API URL |
   | `KV_REST_API_TOKEN` | Vercel KV REST API token |
   | `ADMIN_PASSWORD` | Password for `/admin` login |
   | `SESSION_SECRET` | Random string for signing session cookies (32+ chars) |

3. **Run locally**

   ```bash
   npm run dev
   ```

   - Contact page: [http://localhost:3000/contact](http://localhost:3000/contact)
   - Admin inbox: [http://localhost:3000/admin](http://localhost:3000/admin)

## Vercel KV Setup

1. Create a project on [Vercel](https://vercel.com).
2. Open the project **Storage** tab and create a **KV** database.
3. Connect the KV store to your project — Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
4. Add `ADMIN_PASSWORD` and `SESSION_SECRET` in **Project Settings → Environment Variables**.

Inquiries are stored under:

- `inquiries:list` — Redis list (newest entries pushed first)
- `inquiries:read` — Hash of read inquiry IDs

## Media compression (build time)

Assets are compressed automatically before each build via `scripts/compress-media.mjs`.

Configure in [`media.config.json`](media.config.json):

| Setting | Default | Description |
| --- | --- | --- |
| `images.maxWidth` | 1920 | Max image width in px |
| `images.quality` | 82 | JPEG quality (1–100) |
| `videos.crf` | 28 | H.264 quality (lower = better, larger) |
| `videos.maxWidth` | 1080 | Max video width in px |

**Env overrides:**

```bash
MEDIA_COMPRESS=false          # skip compression
MEDIA_IMAGE_QUALITY=75
MEDIA_VIDEO_CRF=30
MEDIA_VIDEO_MAX_WIDTH=720
```

**Manual run:** `npm run media:compress`

Requires **sharp** (installed) for images and **ffmpeg** on PATH for video transcoding + poster extraction.

## ffmpeg Asset Commands

Use these to prepare portfolio media (adjust paths as needed):

```bash
# Compress a hero video for web (H.264, 1080p max)
ffmpeg -i input.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart public/hero.mp4

# Generate a poster frame from video
ffmpeg -i public/hero.mp4 -ss 00:00:01 -vframes 1 -q:v 2 public/hero-poster.jpg

# Batch resize images to max 1920px wide (run from assets folder)
for f in *.jpg; do ffmpeg -i "$f" -vf "scale='min(1920,iw)':-2" -q:v 3 "../public/gallery/${f}"; done

# Convert image sequence to muted loop for background
ffmpeg -framerate 24 -i frame_%04d.jpg -c:v libx264 -pix_fmt yuv420p -an -movflags +faststart public/loop.mp4
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repo in Vercel (**Add New → Project**).
3. Attach the KV database under **Storage**.
4. Set `ADMIN_PASSWORD` and `SESSION_SECRET` for Production (and Preview if needed).
5. Deploy — Vercel runs `next build` automatically.

After deploy:

- Public site: `https://your-domain.vercel.app`
- Admin: `https://your-domain.vercel.app/admin`

## API Routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/contact` | POST | Submit contact or quick-capture inquiry |
| `/api/admin/login` | POST | Admin login, sets `sa_admin` session cookie |
| `/api/admin/inquiries` | GET | List inquiries (auth required) |
| `/api/admin/inquiries` | PATCH | Mark inquiry as read (auth required) |
