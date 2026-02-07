# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo containing an Angular 20 responsive image gallery library (`angular2-image-gallery`) and its demo application. The library is published to npm and handles high-resolution image display with multi-resolution support.

## Commands

- **Dev server**: `npm start` (or `npm run start-net` for network access)
- **Build library**: `npm run lib` (builds via ng-packagr, copies convert script and README to dist)
- **Build demo app**: `npm run build`
- **Run tests**: `npm test`
- **Lint**: `npm run lint`
- **E2E tests**: `npm run e2e`

The demo app depends on the built library (`"angular2-image-gallery": "file:dist/angular2-image-gallery"`), so you must run `npm run lib` before `npm start` if the library hasn't been built yet.

## Architecture

### Two-project structure

- **`projects/angular2-image-gallery/`** - The reusable library (built with ng-packagr)
  - `gallery/` - Grid layout component with responsive row-based image arrangement
  - `viewer/` - Full-screen image viewer with keyboard/touch navigation and quality selection
  - `services/image.service.ts` - RxJS Subject-based state management (image list, selected index, viewer visibility)
  - `data/image-metadata.ts` - TypeScript type for image metadata
  - Public API exported via `public_api.ts`

- **`src/app/`** - Demo application consuming the library
  - `demo.component.ts` - Showcases gallery with interactive sliders for configuration

### Image processing pipeline

`scripts/build/convert.js` uses GraphicsMagick to generate 7 resolution variants (375px to original) from source images, producing a `data.json` metadata file in `assets/img/gallery/`. The viewer dynamically selects resolution based on screen size.

### Key patterns

- tsconfig `paths` alias `angular2-image-gallery` to `dist/angular2-image-gallery` so the demo app imports from the built library output
- Components use `standalone: false` with `Angular2ImageGalleryModule`
- Touch gestures require `hammerjs` (imported globally)
- Observable streams use `$` suffix convention

## Code Style

Prettier enforced: 2-space indent, single quotes, no semicolons, 140 char line width, trailing commas (es5), `bracketSameLine: true`.
