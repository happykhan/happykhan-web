# Happykhan.com

Personal site & knowledge garden: publications, software, bioinformatics notes, podcast (MicroBinfie), long-form posts, and assorted experiments.

[![Netlify Status](https://api.netlify.com/api/v1/badges/59af396a-a9a8-4c64-b39b-e380233fbb78/deploy-status)](https://app.netlify.com/projects/upbeat-lovelace-083de3/deploys)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)

Source for https://happykhan.com using Next.js 16 (App Router) with a primarily static export strategy for posts/pages/podcast episodes plus selective dynamic server components. Assets (images, transcripts, PDFs) live in `public/` and are versioned. Pre‑build scripts generate RSS feeds and a sitemap.

| Concern | Implementation |
|---------|----------------|
| Framework | Next.js 16 (App Router) |
| Styling | Hand-rolled CSS variables in `app/globals.css` |
| Markdown/MDX | `next-mdx-remote`, `remark` + `rehype-prism-plus` |
| Images | Next `<Image />` with `plaiceholder` / blur placeholders |
| Feeds | Custom Node scripts `gen-rss.mjs`, `gen-rss-microbinfie.mjs` |
| Sitemap | `scripts/gen-sitemap.mjs` |
| Citations | BibTeX parsing (`bibtex-parse-js`) + custom formatting |
| Publications | Data loader `lib/publications.mjs` |
| Podcast Import | `scripts/import_microbinfie.py` + advanced variant |
| Dark Mode | Inline early script + toggle component (`DarkModeToggle.jsx`) |
| Deployment | Netlify using `netlify.toml` and `npm run build` |

### Build Flow
```
npm run build
└─ node scripts/move-static-to-public.mjs
	node scripts/copy-assets.mjs
	node scripts/gen-rss.mjs
	node scripts/gen-rss-microbinfie.mjs
	node scripts/gen-sitemap.mjs
	next build
```

## Local Development

```bash
git clone https://github.com/happykhan/happykhan-web.git
cd happykhan-web
npm install
npm run dev
```
Scripts will copy content assets and start the dev server at `http://localhost:3000`.

## Content Sources

| Type | Location | Notes |
|------|----------|-------|
| Posts | `content/posts/` (MD/MDX) -> App routes `/posts/[slug]` |
| Pages | `content/pages/` and app pages -> `/pages/[slug]` / dedicated routes |
| MicroBinfie Episodes | `content/microbinfie/` (MDX) + transcripts in `public/microbinfie-transcripts/` |
| Publications | BibTeX file in external repo (journal) consumed at build |
| Papers PDFs | `public/papers/` served directly |

## How to update citations

- Add to Zotero library
- Export individual items as `Better BibTex`
- Add to https://github.com/happykhan/journal ME.bib
- Rebuild webiste

### Expanded Detail
1. In Zotero select the new items → Right‑click → Export as Better BibTeX (ensure stable citekeys).  
2. Commit changes to the `journal` repo (`ME.bib`).  
3. Trigger site rebuild (Netlify or `npm run build`).  
4. Publications page will reflect new entries (parsed via `bibtex-parse-js`).

## How to update microbinfie posts

- Run `scripts/import_microbinfie.py`

### Expanded Detail
`scripts/import_microbinfie.py` pulls the feed, creates MDX episode files if missing, and links to transcripts. For summarisation or chunk transcription use `scripts/advanced__import_microbinfie.py` (requires OpenAI credentials in `.credentials`).

Checklist before running advanced script:
- Have OPENAI_API_KEY set (dotenv `.credentials`).
- Ensure `public/microbinfie-transcripts/` exists (build creates it if missing).
- Monitor output; large episodes chunk sequentially.

## Other Content Workflows

| Task | Script / Action |
|------|-----------------|
| Generate RSS feeds | `scripts/gen-rss.mjs`, `scripts/gen-rss-microbinfie.mjs` (auto in build) |
| Generate Sitemap | `scripts/gen-sitemap.mjs` (auto in build) |
| Move legacy static assets | `scripts/move-static-to-public.mjs` |
| Copy misc content assets | `scripts/copy-assets.mjs` |

## Build & Deployment Pipeline

Deployment (Netlify):
- `netlify.toml` sets build command to `npm run build` and publish directory `.next`.
- Pre-build scripts generate feeds and sitemap, ensuring SEO freshness each deploy.
- Dark mode class applied pre-paint to avoid FOUC.

Environment considerations:
- Node 20 (Netlify runtime).  
- No serverless API routes currently; all content pre-rendered.

## Project Structure Cheatsheet

```
app/              # Next.js App Router pages
components/       # Reusable UI components (toggle, images, nav)
content/          # Source markdown/MDX
public/           # Static assets: images, transcripts, papers, feeds (rss*, sitemap.xml)
lib/              # Data loaders (content, publications, images)
scripts/          # Build & import utilities
netlify.toml      # Deployment config
siteMetadata.mjs  # Central site metadata (base URL, title)
```

