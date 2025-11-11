import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { listPosts } from '../lib/content.mjs'
import { siteMetadata } from '../siteMetadata.mjs'

// Helper to extract first paragraph from markdown
function extractFirstParagraph(markdown) {
  // Remove frontmatter
  const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n/, '')
  
  // Split by double newlines to get paragraphs
  const paragraphs = contentWithoutFrontmatter.split(/\n\n+/)
  
  // Find first non-empty paragraph that's not a heading or code block
  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('```') &&
        !trimmed.startsWith('![') &&
        !trimmed.startsWith('|') &&
        trimmed.length > 20) {
      // Clean up markdown formatting
      return trimmed
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/[*_`]/g, '') // Remove emphasis markers
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .substring(0, 500) // Limit length
        .trim()
    }
  }
  return ''
}

async function main() {
  const posts = await listPosts()
  const items = []
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  
  for (const p of posts) {
    // Read the raw MDX file
    let fullPath = path.join(postsDir, p.slug, 'index.mdx')
    try {
      await fs.access(fullPath)
    } catch {
      fullPath = path.join(postsDir, `${p.slug}.mdx`)
    }
    
    const raw = await fs.readFile(fullPath, 'utf8')
    const { data: frontmatter, content } = matter(raw)
    
    // Only include those tagged Posts
    const tags = frontmatter.tags || []
    if (!tags.includes('Posts')) continue
    
    const date = frontmatter.date ? new Date(frontmatter.date).toUTCString() : new Date().toUTCString()
    
    // Get description from frontmatter or extract from content
    let description = frontmatter.excerpt || frontmatter.description || ''
    if (!description) {
      description = extractFirstParagraph(content)
    }
    
    items.push({
      title: frontmatter.title || p.slug,
      link: siteMetadata.url + '/posts/' + p.slug,
      guid: siteMetadata.url + '/posts/' + p.slug,
      pubDate: date,
      description: description,
    })
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>${siteMetadata.title}</title>\n<link>${siteMetadata.url}</link>\n<description>${siteMetadata.description}</description>\n${items.map(i => {
    // Escape XML special characters
    const escapeXml = (str) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
    
    return `<item>
<title>${escapeXml(i.title)}</title>
<link>${i.link}</link>
<guid>${i.guid}</guid>
<pubDate>${i.pubDate}</pubDate>
<description>${escapeXml(i.description)}</description>
</item>`
  }).join('\n')}\n</channel>\n</rss>`

  const outDir = path.join(process.cwd(), 'public')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'rss.xml'), rss, 'utf8')
  console.log(`RSS feed written with ${items.length} items.`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
