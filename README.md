# BulkBuk Web

BulkBuk Web — concise book summaries, notes, and audio overviews. A lightweight React + Vite demo showcasing a local-first book library UI with admin tools for adding summaries, tags, categories, and audio overviews.

This repository contains a small, polished UI prototype intended for demos and early previews. It includes a themeable design (light/dark), seeded demo content, and components wired for a simple local-storage backed workflow.

## Short description

Concise book summaries and audio overviews — a lightweight React + Vite app for discovering and managing short-form book summaries.

---

## Features

- Clean, responsive UI built with React and Framer Motion for subtle animations
- Light/Dark theming with persistent user preference
- Local-first data (LocalStorage) with seeded demo books on first run
- Admin editor for creating and editing books (title, author, summary, categories, tags, notes, cover, audio)
- Audio overview playback and simple notes list
- Tailwind utility classes via CDN for rapid prototyping

## Quick start

Prerequisites: Node.js 18+ and npm installed.

1. Install dependencies

```powershell
cd "C:\path\to\bulkbuk"
npm install
```

2. Run the dev server (HMR)

```powershell
npm run dev
```

Open http://localhost:3000/ in your browser.

3. Build for production

```powershell
npx vite build
npx vite preview
```

## Project structure

- `index.html` — HTML entry, fonts, and Tailwind Play CDN included for quick styling
- `src/` — application source
	- `main.jsx` — React entry
	- `App.jsx` — app wrapper that mounts `BulkBukApp`
	- `BulkBukApp.jsx` — main UI and components wiring
	- `components/ui/` — lightweight UI primitives (button, input, card, badge, etc.)

## Design & theming

The app uses CSS variables to provide a light and dark theme. The header includes a theme toggle that persists the choice to `localStorage`. Colors use a calm teal/cyan primary with an amber accent to create a focused, study-friendly aesthetic.

## Deployment notes

- The project currently uses the Tailwind Play CDN for quick prototyping. For production, install Tailwind locally and set up a purge step to remove unused CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Verify the production build with `npx vite build` before deploying to your host of choice (Vercel, Netlify, GitHub Pages).

## Contributing

If you'd like to extend this project:

- Add type safety with TypeScript
- Replace CDN Tailwind with a compiled Tailwind build for smaller CSS
- Add backend sync (Firebase/Hasura/Node) to persist books and audio assets
- Improve accessibility and add test coverage (React Testing Library)

## Recommended next steps I can help with

- Convert Tailwind CDN usage to a full Tailwind setup and purge pipeline
- Add CI (GitHub Actions) to build and deploy to Vercel/Netlify automatically
- Improve accessibility and keyboard navigation

If you'd like me to implement any of those, tell me which one and I'll add a plan and make the changes.

---

Generated README for the `Bulkbuk web` repository.
