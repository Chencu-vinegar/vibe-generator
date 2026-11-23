# Vibe Generator — agent guide

## Product

A single-page "daily atmosphere generator". The user picks a mood, weather, and up to three keywords. The app produces a deterministic palette, gradient, canvas particles, a short Chinese atmosphere line, a listening note, a share URL, and a downloadable poster.

## Stack

- React 19 + TypeScript + Vite 7
- Plain CSS with CSS custom properties; no UI, animation, or particle library
- Canvas 2D for particles and poster export
- LocalStorage only; no backend, API keys, analytics, or remote assets

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
```

Node 22+ is required. The repository uses pnpm with `nodeLinker: hoisted` in `pnpm-workspace.yaml`.

## Invariants

- `generateVibe(input, seed)` must be pure and deterministic: same input + seed = same visual, copy, and palette.
- Persist only `{ id, seed, input, createdAt }`; never persist generated DOM, palette, or base64.
- Keep the LocalStorage key namespaced: `vibe-generator:v1:...`.
- Save URLs as query parameters (`mood`, `weather`, `kw`, `seed`); do not add a router.
- No network fonts, CDN images, music API, or exposed secrets.
- Particle count must stay bounded; respect `prefers-reduced-motion` and pause when the tab is hidden.
- Keep layout usable at 390px with no horizontal overflow.
- Use CSS variables from `buildSceneStyle()` for all theme colors; do not hardcode scene colors in components.

## File map

- `src/data/vibes.ts` — curated content: moods, weather, palettes, copy, listening, keywords
- `src/lib/generator.ts` — the deterministic generator and scene style variables
- `src/lib/random.ts` — hash + PRNG helpers
- `src/lib/storage.ts` — versioned archive persistence
- `src/lib/export.ts` — canvas poster
- `src/components/` — UI; keep each component focused on one responsibility
- `src/styles.css` — design tokens, atmosphere, layout, responsive states

## Definition of done

- `pnpm build` passes without TypeScript errors.
- Generate → reroll → archive restore → share URL → poster download all work.
- Refreshing a shared URL restores the same vibe.
- 390px viewport has no horizontal overflow.
- New visual behavior degrades under reduced motion.
