import fs from 'node:fs/promises'
import path from 'node:path'
import { siteMetadata } from '../siteMetadata.mjs'
import { listPosts, listMicrobinfie, listPages } from '../lib/content.mjs'

// Manually list static top-level routes that are not content-derived
const STATIC_ROUTES = [
  '/',
  '/about',
  '/cv',
  '/science',
  '/software',
  '/publications',
  '/microbinfie',
  '/posts',
  '/pages'
]

function escapeXml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
}

async function main() {
  const base = siteMetadata.url.replace(/\/$/, '')

  const [posts, micro, pages] = await Promise.all([
    listPosts(),
    listMicrobinfie(),
    listPages()
  ])

  const urls = new Set()

  // Static routes
  STATIC_ROUTES.forEach(r => urls.add(r))

  // Dynamic content routes
  posts.forEach(p => urls.add(`/posts/${p.slug}`))
  micro.forEach(m => urls.add(`/microbinfie/${m.slug}`))
  pages.forEach(pg => urls.add(`/pages/${pg.slug}`))

  // Build XML
  const now = new Date().toISOString()
  const urlEntries = [...urls].sort().map(u => {
    // heuristic: higher changefreq for listing routes
    const changefreq = (u === '/posts' || u === '/microbinfie') ? 'daily' : 'monthly'
    const priority = u === '/' ? '1.0' : (u.split('/').length < 3 ? '0.7' : '0.5')
    return `<url><loc>${escapeXml(base + u)}</loc><lastmod>${now}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`

  const outDir = path.join(process.cwd(), 'public')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'sitemap.xml'), xml, 'utf8')
  console.log(`Sitemap written with ${urls.size} URLs.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
