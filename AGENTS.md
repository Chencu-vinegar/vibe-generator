# Vibe Generator — agent guide

## Product

A single-page "daily atmosphere generator". The app auto-detects the user's weather from browser geolocation (with a network-location fallback), the user picks a mood and up to three keywords, and the app produces a deterministic palette, gradient, canvas particles, a short Chinese atmosphere line, a listening note, a share URL, and a downloadable poster. The result also exposes a "generation notes" sheet explaining the actual mapping, and the archive drawer summarizes local history.

## Stack

- React 19 + TypeScript + Vite 7
- Plain CSS with CSS custom properties; no UI, animation, or particle library
- Canvas 2D for particles and poster export
- LocalStorage only; no backend, API keys, analytics, or remote images/fonts
- Live weather APIs: wttr.in (primary), Open-Meteo (fallback), BigDataCloud (reverse geocoding)

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
```

Node 22+ is required. The repository uses pnpm with `nodeLinker: hoisted` in `pnpm-workspace.yaml`.

## Invariants

- `generateVibe(input, seed)` must be pure and deterministic: same input + seed = same visual, copy, and palette.
- Persist only `{ id, seed, input, createdAt }`; never persist generated DOM, palette, base64, coordinates, city, or temperature.
- The persisted input contains only the mapped weather id (`clear | rain | mist | snow | night`), never coordinates.
- Keep the LocalStorage key namespaced: `vibe-generator:v1:...`.
- Save URLs as query parameters (`mood`, `weather`, `kw`, `seed`); do not add a router.
- No network fonts, CDN images, music API, or exposed secrets. Weather API calls are allowed only in `src/lib/weather.ts`.
- Geolocation belongs to the composer only; opening a shared result must not request location.
- Always keep a manual weather fallback and a retry path if location or weather fails.
- Particle count must stay bounded; respect `prefers-reduced-motion` and pause when the tab is hidden.
- Keep layout usable at 390px with no horizontal overflow.
- Use CSS variables from `buildSceneStyle()` for all theme colors; do not hardcode scene colors in components.
- Generation notes must be derived from the actual generator inputs/parameters, never fabricated presentation copy.
- Archive statistics must be computed locally from existing history; no analytics or network calls.

## File map

- `src/data/vibes.ts` — curated content: moods, weather, palettes, copy, listening, keywords
- `src/lib/generator.ts` — the deterministic generator and scene style variables
- `src/lib/random.ts` — hash + PRNG helpers
- `src/lib/storage.ts` — versioned archive persistence
- `src/lib/export.ts` — canvas poster
- `src/lib/weather.ts` — geolocation, weather providers, reverse geocoding
- `src/hooks/useLiveWeather.ts` — weather request lifecycle and refresh interval
- `src/components/LiveWeatherPanel.tsx` — live weather card, manual fallback
- `src/components/ReasoningSheet.tsx` — “why this vibe” generation notes
- `src/components/HistoryDrawer.tsx` — archive list, local stats, 14-day color strip
- `src/components/` — other UI; keep each component focused on one responsibility
- `src/styles.css` — design tokens, atmosphere, layout, responsive states

## Definition of done

- `pnpm build` passes without TypeScript errors.
- Generate → reroll → archive restore → share URL → poster download all work.
- “Why this vibe” opens, explains the actual generation parameters, and closes with Escape/backdrop.
- Archive summary counts, top mood, top color, and the 14-day strip are correct; a colored day restores its latest vibe.
- Live weather works with geolocation allowed; denying permission falls back to network weather or manual selection without blocking generation.
- Refreshing a shared URL restores the same vibe and does not prompt for location.
- 390px viewport has no horizontal overflow.
- New visual behavior degrades under reduced motion.
