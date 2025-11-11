import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { listPosts } from '../lib/content.mjs'
import { siteMetadata } from '../siteMetadata.mjs'

// Escape XML special characters
function escapeXml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Convert date to RFC3339 format (required by Atom)
function toRFC3339(date) {
  return new Date(date).toISOString()
}

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
  
  let mostRecentDate = new Date(0) // Track most recent update
  
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
    
    const pubDate = frontmatter.date ? new Date(frontmatter.date) : new Date()
    const updatedDate = frontmatter.updated ? new Date(frontmatter.updated) : pubDate
    
    // Track most recent date for feed updated timestamp
    if (updatedDate > mostRecentDate) {
      mostRecentDate = updatedDate
    }
    
    // Get description from frontmatter or extract from content
    let description = frontmatter.excerpt || frontmatter.description || ''
    if (!description) {
      description = extractFirstParagraph(content)
    }
    
    // Use absolute URLs throughout
    const postUrl = `${siteMetadata.url}/posts/${p.slug}`
    
    items.push({
      title: frontmatter.title || p.slug,
      link: postUrl,
      id: postUrl, // Use permalink as ID (globally unique, never changes)
      published: toRFC3339(pubDate),
      updated: toRFC3339(updatedDate),
      summary: description,
      content: content, // Include full content
    })
  }

  // Build Atom feed (preferred format per best practices)
  const feedUrl = `${siteMetadata.url}/feed.atom`
  
  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteMetadata.title)}</title>
  <id>${escapeXml(siteMetadata.url)}</id>
  <link rel="alternate" href="${escapeXml(siteMetadata.url)}"/>
  <link rel="self" href="${escapeXml(feedUrl)}"/>
  <updated>${toRFC3339(mostRecentDate)}</updated>
  <author>
    <name>${escapeXml(siteMetadata.author)}</name>
  </author>
${items.map(item => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(item.link)}"/>
    <id>${escapeXml(item.id)}</id>
    <published>${item.published}</published>
    <updated>${item.updated}</updated>
    <summary type="text">${escapeXml(item.summary)}</summary>
    <content type="html">${escapeXml(item.content)}</content>
  </entry>`).join('\n')}
</feed>`

  const outDir = path.join(process.cwd(), 'public')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'feed.atom'), atom, 'utf8')
  
  // Also generate legacy RSS 2.0 for compatibility (as rss.xml)
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(siteMetadata.title)}</title>
  <link>${escapeXml(siteMetadata.url)}</link>
  <description>${escapeXml(siteMetadata.description)}</description>
  <atom:link href="${escapeXml(feedUrl.replace('feed.atom', 'rss.xml'))}" rel="self" type="application/rss+xml"/>
${items.map(item => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <guid isPermaLink="true">${escapeXml(item.id)}</guid>
    <pubDate>${new Date(item.published).toUTCString()}</pubDate>
    <description>${escapeXml(item.summary)}</description>
  </item>`).join('\n')}
</channel>
</rss>`

  await fs.writeFile(path.join(outDir, 'rss.xml'), rss, 'utf8')
  
  console.log(`Atom feed written with ${items.length} items (feed.atom)`)
  console.log(`RSS 2.0 feed written with ${items.length} items (rss.xml)`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
