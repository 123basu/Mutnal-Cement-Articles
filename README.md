# Mutnal Cement Articles — Website

Corporate website for a cement brick manufacturer. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **next-intl** (i18n), **Leaflet** (delivery map), and **MDX** (blog). No database — content lives in the repo (MDX posts + `data/deliveries.json`).

## Features
- Multi-language (English / Kannada / Hindi) via locale-prefixed routing (`/en`, `/kn`, `/hi`)
- Pages: Home, About, Products, Contact, Deliveries map, Blog
- Interactive delivery history map (Leaflet) with hover/click popups; government deliveries get a premium gold card
- Blog with MDX posts (static generation + per-post SEO metadata)
- Password-protected admin panel (`/[locale]/admin`) to edit deliveries; writes to GitHub and triggers a redeploy
- Sitemap, robots, hreflang alternates

## Getting started
```bash
npm install
cp .env.example .env.local   # fill values
npm run dev                  # http://localhost:3000  (redirects to /en)
```

## Environment variables (Vercel)
See `.env.example`. Required for the admin panel:
- `ADMIN_PASSWORD` — login password
- `ADMIN_SESSION_SECRET` — signs the session cookie (long random string)
- `GITHUB_TOKEN` — classic token with `repo` (Contents read/write) scope
- `GITHUB_REPO` — `owner/repo`
- `GITHUB_BRANCH` — branch containing `src/data/deliveries.json` (default `main`)
- `NEXT_PUBLIC_SITE_URL` — absolute URL for sitemap/OG

## Deploy (Vercel)
1. Push repo to GitHub.
2. Import in Vercel, framework preset = Next.js.
3. Add the env vars above.
4. Deploy. Admin edits commit `src/data/deliveries.json` → Vercel redeploys automatically.

## Editing content
- **Blog:** add `src/content/blog/*.mdx` with the frontmatter contract in `src/lib/types.ts`.
- **Deliveries:** use `/[locale]/admin` (preferred) or edit `src/data/deliveries.json` directly.
- **Translations:** mirror keys in `src/messages/{en,kn,hi}.json`.

## Notes
- Next.js 16 renamed Middleware to **Proxy** (`src/proxy.ts`).
- Leaflet is loaded client-side only via `dynamic(ssr:false)`.
