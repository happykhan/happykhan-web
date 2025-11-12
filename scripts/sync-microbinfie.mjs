import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { parseStringPromise } from 'xml2js'

const SOUNDCLOUD_RSS_URL = 'https://feeds.soundcloud.com/users/soundcloud:users:698218776/sounds.rss'
const MICROBINFIE_DIR = path.join(process.cwd(), 'content', 'microbinfie')

// Fetch and parse the SoundCloud RSS feed
async function fetchSoundCloudRSS() {
  const response = await fetch(SOUNDCLOUD_RSS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS: ${response.statusText}`)
  }
  const xml = await response.text()
  const parsed = await parseStringPromise(xml)
  return parsed.rss.channel[0].item || []
}

// Extract episode number from title (e.g., "147 - NextFlow debate 2" => 147)
function extractEpisodeNumber(title) {
  const match = title.match(/^(\d+)\s*[-–]\s*/)
  return match ? parseInt(match[1], 10) : null
}

// Normalize title to "Episode X: [clean title]" format
function normalizeTitle(title) {
  // Remove "MicroBinfie Podcast, " prefix if present
  let cleaned = title.replace(/^MicroBinfie Podcast,?\s*/i, '')
  
  // Try to extract episode number - match various formats:
  // "147 - Title", "147- Title", "147 Title", or just "147Title"
  const episodeMatch = cleaned.match(/^(\d+)\s*[-–]?\s*(.+)/)
  
  if (episodeMatch) {
    const episodeNum = episodeMatch[1]
    let titlePart = episodeMatch[2].trim()
    
    // Remove any remaining separators at the start
    titlePart = titlePart.replace(/^[-–]\s*/, '')
    
    // Capitalize first letter of title
    const capitalizedTitle = titlePart.charAt(0).toUpperCase() + titlePart.slice(1)
    return `Episode ${episodeNum}: ${capitalizedTitle}`
  }
  
  // If no episode number found, return cleaned title with first letter capitalized
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

// Generate slug from title and episode number
function generateSlug(title, episodeNum) {
  if (episodeNum !== null) {
    // Use episode number as primary slug component
    const titlePart = title
      .replace(/^(\d+)\s*[-–]\s*/, '') // Remove episode number prefix
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) // Limit length
    return `mb-${episodeNum.toString().padStart(2, '0')}-${titlePart}`
  }
  // Fallback for episodes without numbers
  return 'mb-' + title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Check if a file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// Find existing file by GUID (handles episode renumbering)
async function findFileByGuid(guid) {
  try {
    const files = await fs.readdir(MICROBINFIE_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx'))
    
    for (const file of mdxFiles) {
      const filePath = path.join(MICROBINFIE_DIR, file)
      const content = await fs.readFile(filePath, 'utf8')
      const { data } = matter(content)
      
      if (data.guid === guid) {
        return filePath
      }
    }
    return null
  } catch (err) {
    return null
  }
}

// Extract fields from RSS item
function extractItemData(item) {
  const getFirst = (obj) => Array.isArray(obj) ? obj[0] : obj
  
  const title = getFirst(item.title)
  const link = getFirst(item.link)
  const pubDate = getFirst(item.pubDate)
  const description = getFirst(item.description) || ''
  const guid = getFirst(item.guid)?._  || getFirst(item.guid) || link
  
  // iTunes namespace fields
  const itunesNS = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
  const itunes = item['itunes:duration'] ? item : (item.itunes || {})
  
  const duration = getFirst(itunes['itunes:duration'] || itunes.duration || '')
  const author = getFirst(itunes['itunes:author'] || itunes.author || 'Microbial Bioinformatics')
  const subtitle = getFirst(itunes['itunes:subtitle'] || itunes.subtitle || '')
  const summary = getFirst(itunes['itunes:summary'] || itunes.summary || description)
  const explicit = getFirst(itunes['itunes:explicit'] || itunes.explicit || 'no')
  const image = getFirst(itunes['itunes:image'] || itunes.image || '')
  const imageHref = image?.$ ? image.$.href : (typeof image === 'string' ? image : '')
  
  // Enclosure (audio file)
  const enclosure = getFirst(item.enclosure)
  const audioUrl = enclosure?.$ ? enclosure.$.url : ''
  const audioLength = enclosure?.$ ? enclosure.$.length : ''
  const audioType = enclosure?.$ ? enclosure.$.type : 'audio/mpeg'
  
  return {
    title,
    link,
    pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    description,
    guid,
    duration,
    author,
    subtitle,
    summary,
    explicit,
    image: imageHref,
    audioUrl,
    audioLength,
    audioType,
  }
}

// Main sync function
async function syncEpisodes() {
  console.log('Fetching SoundCloud RSS feed...')
  const items = await fetchSoundCloudRSS()
  console.log(`Found ${items.length} episodes in RSS feed`)
  
  let created = 0
  let updated = 0
  let skipped = 0
  
  for (const item of items) {
    const data = extractItemData(item)
    const episodeNum = extractEpisodeNumber(data.title)
    const normalizedTitle = normalizeTitle(data.title)
    const slug = generateSlug(data.title, episodeNum)
    const newFilePath = path.join(MICROBINFIE_DIR, `${slug}.mdx`)
    
    // Find existing file by GUID (handles episode renumbering)
    const existingFilePath = await findFileByGuid(data.guid)
    const exists = existingFilePath !== null
    
    if (!exists) {
      // Create new episode file
      const frontmatter = {
        title: normalizedTitle,
        date: data.pubDate,
        link: data.link,
        guid: data.guid,
        duration: data.duration,
        author: data.author,
        subtitle: data.subtitle,
        explicit: data.explicit,
        image: data.image,
        audioUrl: data.audioUrl,
        audioLength: data.audioLength,
        audioType: data.audioType,
        tags: ['microbinfie', 'podcast'],
        guests: [], // User will fill this in manually
      }
      
      const content = `${data.summary || data.description}\n\n[Episode transcript](/microbinfie-transcripts/episode-${episodeNum || 'unknown'}.txt)\n`
      
      const fileContent = matter.stringify(content, frontmatter)
      await fs.writeFile(newFilePath, fileContent, 'utf8')
      console.log(`✅ Created: ${slug}`)
      created++
    } else {
      // Update existing file (preserve only user content and guests)
      const existing = await fs.readFile(existingFilePath, 'utf8')
      const { data: existingFrontmatter, content: existingContent } = matter(existing)
      
      // Check if episode number changed (renumbering) - need to rename file
      const needsRename = existingFilePath !== newFilePath
      
      // Always update ALL metadata from RSS (including title), only preserve content and guests
      const updatedFrontmatter = {
        ...existingFrontmatter,
        // Always update these fields from RSS (including normalized title)
        title: normalizedTitle,
        date: data.pubDate,
        link: data.link,
        guid: data.guid,
        duration: data.duration,
        author: data.author,
        subtitle: data.subtitle,
        explicit: data.explicit,
        image: data.image,
        audioUrl: data.audioUrl,
        audioLength: data.audioLength,
        audioType: data.audioType,
        tags: ['microbinfie', 'podcast'],
        // ONLY preserve these fields (user-managed)
        guests: existingFrontmatter.guests || [],
      }
      
      // Check for changes (compare key fields that should always match RSS)
      const titleChanged = existingFrontmatter.title !== normalizedTitle
      const linkChanged = existingFrontmatter.link !== data.link
      const durationChanged = existingFrontmatter.duration !== data.duration
      
      const hasChanges = titleChanged || linkChanged || durationChanged || needsRename
      
      if (hasChanges || needsRename) {
        const fileContent = matter.stringify(existingContent, updatedFrontmatter)
        await fs.writeFile(newFilePath, fileContent, 'utf8')
        
        // If file was renamed, delete the old one
        if (needsRename) {
          await fs.unlink(existingFilePath)
          console.log(`📝 Renamed: ${path.basename(existingFilePath)} → ${slug}`)
        } else {
          console.log(`� Updated: ${slug}`)
        }
        updated++
      } else {
        skipped++
      }
    }
  }
  
  console.log(`\n✨ Sync complete:`)
  console.log(`   Created: ${created}`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
}

// Run the sync
syncEpisodes().catch(err => {
  console.error('Error syncing episodes:', err)
  process.exit(1)
})
