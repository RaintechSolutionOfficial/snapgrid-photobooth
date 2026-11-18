# Snapgrid Photobooth

A polished, browser-based photobooth studio with an animated landing page and a full capture suite. Everything runs on-device — no backend, no uploads, no sign-in.

## Features

- **4 capture modes** — Photo, Grid, Video and Boomerang (real ping-pong playback)
- **1×1 → 10×10 grid builder** with presets and a live shot-by-shot overlay
- **Countdown** (off / 3s / 5s / 10s) with animated ring, beeps and screen flash
- **Try-on effects** — sombrero, cap, cowboy, graduation, crown, party hat, wizard, pirate, santa, cat ears, bunny ears, devil horns, halo, flower crown, headphones, sunglasses, mustache, clown nose, beard, blush, eye patch and emoji effects
- **Per-shot assignment** — apply every effect to all shots, rotate across shots, or randomize
- **Drag-to-place** effects on the live camera preview with position, size and tilt controls
- **5 collage templates** — Grid, Strip, Filmstrip, Mosaic and scattered Polaroid
- **10 background themes** plus a custom color picker
- **8 filters** and brightness / contrast / saturation sliders
- **Frames, text & stickers** — 5 frame styles, event title, caption, date and emoji stickers
- **Local gallery** — every capture is saved to `localStorage`, with search, lightbox, details and storage usage
- **Exports** — PNG, ZIP, print-ready A4 and QR share links
- **Kiosk-ready** — fullscreen mode and keyboard shortcuts (Space, Esc, G, F)
- **Theme-aware** — light and dark BrewedOps-inspired design system

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The camera requires `localhost` or HTTPS; without permission the app falls back to generated demo frames so every feature remains usable.

## Build

```bash
npm run build   # type-check + production bundle into dist/
npm run preview
```

## Stack

Vite · React 18 · TypeScript · Tailwind CSS v4 · Zustand · JSZip · qrcode · lucide-react

All imagery is generated in the browser with `<canvas>` — there are no external image assets.

## Privacy

Camera frames, effects and photos never leave the browser. Captures are stored only in this origin's `localStorage` (compressed to fit the quota) and can be cleared at any time from the gallery.
