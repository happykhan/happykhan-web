import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { listMicrobinfie } from '../lib/content.mjs'
import { siteMetadata } from '../siteMetadata.mjs'

// Helper to strip markdown and convert to plain text
function stripMarkdown(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links: [text](url) -> text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images: remove completely
    .replace(/^#+\s+/gm, '') // Headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/__(.+?)__/g, '$1') // Bold alt
    .replace(/_(.+?)_/g, '$1') // Italic alt
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/^```[\s\S]*?```$/gm, '') // Code blocks
    .replace(/^>\s+/gm, '') // Blockquotes
    .replace(/^[-*+]\s+/gm, '') // Unordered lists
    .replace(/^\d+\.\s+/gm, '') // Ordered lists
    .replace(/<[^>]+>/g, '') // HTML tags
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines -> double newline
    .trim()
}

// Helper to extract content and create summary with word limit
function extractContentSummary(markdown, slug, maxWords = 150) {
  // Remove frontmatter
  const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n/, '')
  
  // Remove episode transcript links
  const contentWithoutTranscript = contentWithoutFrontmatter.replace(/\[Episode.*?transcript\].*?\n*/gi, '')
  
  // Strip all markdown formatting
  const plainText = stripMarkdown(contentWithoutTranscript)
  
  // Split into words
  const words = plainText.split(/\s+/).filter(w => w.length > 0)
  
  // If content is short enough, return as-is
  if (words.length <= maxWords) {
    return plainText
  }
  
  // Truncate to max words and add "read more" link
  const truncated = words.slice(0, maxWords).join(' ')
  const episodeUrl = `${siteMetadata.url}/microbinfie/${slug}`
  return `${truncated}... Read more at ${episodeUrl}`
}

async function main() {
  const posts = await listMicrobinfie()
  const items = []
  const microbinfieDir = path.join(process.cwd(), 'content', 'microbinfie')
  
  for (const p of posts) {
    // Read the raw MDX file
    const fullPath = path.join(microbinfieDir, `${p.slug}.mdx`)
    
    try {
      const raw = await fs.readFile(fullPath, 'utf8')
      const { data: frontmatter, content } = matter(raw)
      
      const date = frontmatter.date ? new Date(frontmatter.date).toUTCString() : new Date().toUTCString()
      
      // Extract content summary from MDX (plain text, word limited, with "read more" if needed)
      let contentSummary = extractContentSummary(content, p.slug, 150)
      
      // Fallback to frontmatter if no content
      if (!contentSummary) {
        contentSummary = frontmatter.summary || frontmatter.description || frontmatter.excerpt || ''
      }
      
      // Use frontmatter fields from SoundCloud RSS (populated by sync script)
      items.push({
        title: frontmatter.title || p.slug,
        link: frontmatter.link || (siteMetadata.url + '/microbinfie/' + p.slug),
        guid: frontmatter.guid || (siteMetadata.url + '/microbinfie/' + p.slug),
        pubDate: date,
        description: contentSummary, // Use MDX content (plain text)
        duration: frontmatter.duration || '',
        author: frontmatter.author || 'Microbial Bioinformatics',
        subtitle: frontmatter.subtitle || '',
        summary: contentSummary, // Use same MDX content for iTunes summary
        explicit: frontmatter.explicit || 'no',
        image: frontmatter.image || 'https://i1.sndcdn.com/avatars-zaAfxNNfdHXxZYQz-LNe7Zw-original.jpg',
        audioUrl: frontmatter.audioUrl || '',
        audioLength: frontmatter.audioLength || '',
        audioType: frontmatter.audioType || 'audio/mpeg',
      })
    } catch (err) {
      console.warn(`Could not read ${p.slug}:`, err.message)
    }
  }

  // Escape XML special characters
  const escapeXml = (str) => {
    if (!str) return ''
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  // Build podcast RSS feed (mimicking SoundCloud structure)
  const channelImage = 'https://i1.sndcdn.com/avatars-zaAfxNNfdHXxZYQz-LNe7Zw-original.jpg'
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${siteMetadata.url}/rss-microbinfie.xml" rel="self" type="application/rss+xml"/>
    <title>Micro binfie podcast</title>
    <link>${siteMetadata.url}/microbinfie</link>
    <language>en</language>
    <copyright>All rights reserved</copyright>
    <description>Microbial Bioinformatics is a rapidly changing field marrying computer science and microbiology. Join us as we share some tips and tricks we've learnt over the years. If you're student just getting to grips to the field, or someone who just wants to keep tabs on the latest and greatest - this podcast is for you.</description>
    <itunes:subtitle>Microbial Bioinformatics is a rapidly changing field</itunes:subtitle>
    <itunes:author>Microbial Bioinformatics</itunes:author>
    <itunes:summary>Microbial Bioinformatics is a rapidly changing field marrying computer science and microbiology. Join us as we share some tips and tricks we've learnt over the years. If you're student just getting to grips to the field, or someone who just wants to keep tabs on the latest and greatest - this podcast is for you.</itunes:summary>
    <itunes:owner>
      <itunes:name>Micro Binfie Podcast</itunes:name>
      <itunes:email>microbinfie@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:explicit>no</itunes:explicit>
    <itunes:image href="${channelImage}"/>
    <itunes:category text="Science"/>
${items.map(i => {
    const guidIsPermaLink = i.guid.startsWith('http') ? 'false' : 'false'
    
    return `    <item>
      <guid isPermaLink="${guidIsPermaLink}">${escapeXml(i.guid)}</guid>
      <title>${escapeXml(i.title)}</title>
      <link>${escapeXml(i.link)}</link>
      <pubDate>${i.pubDate}</pubDate>${i.duration ? `
      <itunes:duration>${escapeXml(i.duration)}</itunes:duration>` : ''}
      <itunes:author>${escapeXml(i.author)}</itunes:author>
      <itunes:explicit>${escapeXml(i.explicit)}</itunes:explicit>${i.subtitle ? `
      <itunes:subtitle>${escapeXml(i.subtitle)}</itunes:subtitle>` : ''}
      <itunes:summary>${escapeXml(i.summary)}</itunes:summary>
      <description>${escapeXml(i.description)}</description>${i.audioUrl ? `
      <enclosure type="${escapeXml(i.audioType)}" url="${escapeXml(i.audioUrl)}" length="${escapeXml(i.audioLength)}"/>` : ''}
      <itunes:image href="${escapeXml(i.image)}"/>
    </item>`
  }).join('\n')}
  </channel>
</rss>`

  const outDir = path.join(process.cwd(), 'public')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'rss-microbinfie.xml'), rss, 'utf8')
  console.log(`MicroBinFie RSS feed written with ${items.length} items.`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
