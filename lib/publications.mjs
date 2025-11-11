import bibtexParse from 'bibtex-parse-js'

/**
 * Fetch and parse BibTeX citations from GitHub
 */
export async function getPublications() {
  const citationsUrl = 'https://raw.githubusercontent.com/happykhan/citations/main/ME.bib'
  
  try {
    const response = await fetch(citationsUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch publications: ${response.status}`)
    }
    
    const bibtext = await response.text()
    const bibJson = bibtexParse.toJSON(bibtext)
    
    return bibJson
  } catch (error) {
    console.error('Error fetching publications:', error)
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
