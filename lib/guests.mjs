import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const microbinfieDir = path.join(process.cwd(), 'content', 'microbinfie')

/**
 * Guest object structure:
 * {
 *   name: string,
 *   affiliation?: string,
 *   url?: string,
 * }
 */

/**
 * Get all guests across all episodes with episode counts
 * Returns: Map<guestName, { guest: object, episodes: Array<{slug, title, date}> }>
 */
export async function getAllGuests() {
  const entries = await fs.readdir(microbinfieDir)
  const mdxFiles = entries.filter(f => f.endsWith('.mdx'))
  
  const guestMap = new Map()
  
  for (const file of mdxFiles) {
    const fullPath = path.join(microbinfieDir, file)
    const raw = await fs.readFile(fullPath, 'utf8')
    const { data } = matter(raw)
    
    const slug = file.replace(/\.mdx$/, '')
    const dateTs = data.date ? new Date(data.date).getTime() : 0
    const guests = data.guests || []
    
    if (Array.isArray(guests) && guests.length > 0) {
      for (const guest of guests) {
        if (!guest.name) continue
        
        const guestName = guest.name
        
        if (!guestMap.has(guestName)) {
          guestMap.set(guestName, {
            guest: {
              name: guestName,
              affiliation: guest.affiliation || '',
              url: guest.url || '',
            },
            episodes: [],
            // Track the most recent episode timestamp we used for affiliation/url selection
            _latestTs: dateTs,
          })
        }
        const entry = guestMap.get(guestName)

        // Prefer the affiliation/url from the most recent episode (by date)
        if (dateTs > (entry._latestTs || 0)) {
          entry.guest.affiliation = guest.affiliation || entry.guest.affiliation || ''
          entry.guest.url = guest.url || entry.guest.url || ''
          entry._latestTs = dateTs
        }

        entry.episodes.push({
          slug,
          title: data.title || slug,
          date: data.date || null,
        })
      }
    }
  }
  
  // Sort episodes by date for each guest
  for (const [_, data] of guestMap) {
    data.episodes.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0
      const db = b.date ? new Date(b.date).getTime() : 0
      return db - da
    })
    // Clean internal field
    if ('_latestTs' in data) delete data._latestTs
  }
  
  return guestMap
}

/**
 * Get sorted list of guests by episode count
 */
export async function getGuestsByAppearances() {
  const guestMap = await getAllGuests()
  
  const guests = Array.from(guestMap.values())
  
  // Helper function to extract last name (assumes last word is surname)
  const getLastName = (fullName) => {
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1].toLowerCase()
  }
  
  // Sort by number of appearances (desc), then by last name alphabetically
  guests.sort((a, b) => {
    const countDiff = b.episodes.length - a.episodes.length
    if (countDiff !== 0) return countDiff
    
    const lastNameA = getLastName(a.guest.name)
    const lastNameB = getLastName(b.guest.name)
    return lastNameA.localeCompare(lastNameB)
  })
  
  return guests
}

/**
 * Get guest details by name
 */
export async function getGuestByName(name) {
  const guestMap = await getAllGuests()
  return guestMap.get(name) || null
}
