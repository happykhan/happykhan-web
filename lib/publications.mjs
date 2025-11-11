import bibtexParse from 'bibtex-parse-js'
import fs from 'fs/promises'
import path from 'path'

// Simple in-memory cache to avoid re-reading/parsing on each call during a request lifecycle
let _cachedPublications = null

/**
 * Load and parse BibTeX citations from the local repository file `ME.bib`.
 * This avoids any external network dependency and is suitable for SSG/ISR.
 */
export async function getPublications() {
  if (_cachedPublications) return _cachedPublications

  try {
    const filePath = path.join(process.cwd(), 'ME.bib')
    const bibtext = await fs.readFile(filePath, 'utf8')
    const bibJson = bibtexParse.toJSON(bibtext)
    _cachedPublications = bibJson
    return bibJson
  } catch (error) {
    console.error('Error loading publications from ME.bib:', error)
    return []
  }
}

/**
 * Sort publications by year (descending) and first author
 */
export function sortPublications(a, b) {
  const yearA = parseInt(a.entryTags.year) || 0
  const yearB = parseInt(b.entryTags.year) || 0
  
  if (yearB !== yearA) {
    return yearB - yearA
  }
  
  // If same year, sort by first author
  const authorA = a.entryTags.author?.split(',')[0] || ''
  const authorB = b.entryTags.author?.split(',')[0] || ''
  return authorA.localeCompare(authorB)
}
