<div align="center">

# Happykhan.com

Personal site & knowledge garden: publications, software, bioinformatics notes, podcast (MicroBinfie), long-form posts, and assorted experiments.

[![Netlify Deploy Status](https://img.shields.io/netlify/"?style=flat-square)](https://app.netlify.com/) <!-- Replace with real site ID later -->
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)
![License](https://img.shields.io/badge/Content-Mixed-lightgrey?style=flat-square)
![RSS](https://img.shields.io/badge/RSS-Feeds-orange?style=flat-square)

</div>

---

## Table of Contents

1. Overview
2. Stack & Architecture
3. Local Development
4. Content Sources
5. Updating Citations (Zotero → BibTeX)
6. Updating MicroBinfie Episodes
7. Other Content Workflows
8. Build & Deployment Pipeline
9. Project Structure Cheatsheet
10. Planned Improvements / TODO

---

## 1. Overview

This repository powers https://happykhan.com using Next.js 16 (App Router) with a primarily static export strategy for posts/pages/podcast episodes plus selective dynamic server components. Assets (images, transcripts, PDFs) live in `public/` and are versioned. Pre‑build scripts generate RSS feeds and a sitemap.

## 2. Stack & Architecture

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

## 3. Local Development

```bash
git clone https://github.com/happykhan/happykhan-web.git
cd happykhan-web
npm install
npm run dev
```
Scripts will copy content assets and start the dev server at `http://localhost:3000`.

## 4. Content Sources

| Type | Location | Notes |
|------|----------|-------|
| Posts | `content/posts/` (MD/MDX) -> App routes `/posts/[slug]` |
| Pages | `content/pages/` and app pages -> `/pages/[slug]` / dedicated routes |
| MicroBinfie Episodes | `content/microbinfie/` (MDX) + transcripts in `public/microbinfie-transcripts/` |
| Publications | BibTeX file in external repo (journal) consumed at build |
| Papers PDFs | `public/papers/` served directly |

## 5. Updating Citations

KEEP THIS TEXT

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

## 6. Updating MicroBinfie Episodes

KEEP THIS TEXT

## How to update microbinfie posts

- Run `scripts/import_microbinfie.py`

### Expanded Detail
`scripts/import_microbinfie.py` pulls the feed, creates MDX episode files if missing, and links to transcripts. For summarisation or chunk transcription use `scripts/advanced__import_microbinfie.py` (requires OpenAI credentials in `.credentials`).

Checklist before running advanced script:
- Have OPENAI_API_KEY set (dotenv `.credentials`).
- Ensure `public/microbinfie-transcripts/` exists (build creates it if missing).
- Monitor output; large episodes chunk sequentially.

## 7. Other Content Workflows

| Task | Script / Action |
|------|-----------------|
| Generate RSS feeds | `scripts/gen-rss.mjs`, `scripts/gen-rss-microbinfie.mjs` (auto in build) |
| Generate Sitemap | `scripts/gen-sitemap.mjs` (auto in build) |
| Move legacy static assets | `scripts/move-static-to-public.mjs` |
| Copy misc content assets | `scripts/copy-assets.mjs` |

## 8. Build & Deployment Pipeline

Deployment (Netlify):
- `netlify.toml` sets build command to `npm run build` and publish directory `.next`.
- Pre-build scripts generate feeds and sitemap, ensuring SEO freshness each deploy.
- Dark mode class applied pre-paint to avoid FOUC.

Environment considerations:
- Node 20 (Netlify runtime).  
- No serverless API routes currently; all content pre-rendered.

## 9. Project Structure Cheatsheet

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

## 10. Planned Improvements / TODO

- Add accessibility audit & ARIA refinements.
- Add unit tests around publication parsing & MDX rendering.
- Include a health endpoint listing counts of posts/episodes.
- Progressive enhancement: image blur placeholders for all legacy images.
- Optional: integrate `next-seo` for structured metadata.
- Replace placeholder badge URL with actual Netlify deploy status.

## License & Attribution

Code is available under an MIT-style approach (final decision pending). Written content & images may have mixed licenses—assume © by default unless stated. Please open an issue for reuse questions.

---

Questions or suggestions? Open an issue or reach out via Mastodon.
