'use client'

import { useState } from 'react'

// Helper function to clean LaTeX/BibTeX formatting from text
function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/\\\\/g, '')                 // Remove double backslashes
    .replace(/\\%/g, '%')                 // Replace \% with %
    .replace(/\\&/g, '&')                 // Replace \& with &
    .replace(/\\textasciitilde/g, '~')    // Replace \textasciitilde with ~
    .replace(/\\textasciicircum/g, '^')   // Replace \textasciicircum with ^
    .replace(/\\textgreater/g, '>')       // Replace \textgreater with >
    .replace(/\\textless/g, '<')          // Replace \textless with <
    .replace(/[{}$]/g, '')                // Remove braces, dollar signs
    .replace(/\\textit\{([^}]*)\}/g, '$1')   // \textit{text} -> text
    .replace(/\\textrm\{([^}]*)\}/g, '$1')   // \textrm{text} -> text
    .replace(/\\textbf\{([^}]*)\}/g, '$1')   // \textbf{text} -> text
    .replace(/\\emph\{([^}]*)\}/g, '$1')     // \emph{text} -> text
    .replace(/\\mkern\d+mu/g, '')         // Remove \mkern1mu type spacing commands
    .replace(/\\[a-zA-Z]+/g, '')          // Remove other LaTeX commands
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim()
}

// Helper function to format author names: "Lastname, Firstname" -> "F. Lastname"
function formatAuthorName(authorString) {
  // Remove curly braces from names like {Al-Jawabreh}
  const cleaned = authorString.replace(/[{}]/g, '').trim()
  
  // Split by comma: "Lastname, Firstname Middlename"
  const parts = cleaned.split(',').map(p => p.trim())
  
  if (parts.length < 2) {
    // No comma, just return as-is
    return cleaned
  }
  
  const lastname = parts[0]
  const firstnames = parts[1]
  
  // Extract initials from first and middle names (condensed, no periods)
  const initials = firstnames
    .split(/[\s-]+/)
    .filter(name => name.length > 0)
    .map(name => name[0].toUpperCase())
    .join('')
  
  return `${initials} ${lastname}`
}

// Format full author list from BibTeX format
function formatAuthorList(authorString) {
  if (!authorString) return 'Unknown'
  
  // Split by " and " to get individual authors
  const authors = authorString.split(' and ')
  
  // Format each author
  const formatted = authors.map(formatAuthorName)
  
  return formatted.join(', ')
}

export default function PublicationCard({ 
  title, 
  author, 
  year, 
  journal = '', 
  volume, 
  number, 
  pages, 
  abstract,
  pmid,
  doi,
  keywords 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const firstAuthor = author?.split(',')[0].replace(/[{}]/g, '') || 'Unknown'
  const formattedAuthorList = formatAuthorList(author)
  const safeDoi = doi?.replace(/\//g, '_') || ''
  const safeTitle = cleanText(title) || 'Untitled'
  const cleanAbstract = cleanText(abstract)
  const cleanKeywords = cleanText(keywords)?.replace(/,/g, ', ')
  
  const pdfFilename = `${firstAuthor.toLowerCase().replace(/\s+/g, '')}-${year}-${safeDoi}.pdf`
  const pdfLink = `/papers/${pdfFilename}`
  const doiLink = doi ? `https://doi.org/${doi}` : null
  const pubmedLink = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}` : null
  
  return (
    <>
      <style jsx>{`
        .has-tooltip {
          position: relative;
        }
        
        .has-tooltip::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 0;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: normal;
          white-space: normal;
          max-width: 400px;
          width: max-content;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.1s, visibility 0.1s;
          pointer-events: none;
          z-index: 1000;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .has-tooltip:hover::after {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
      <div style={{ 
        border: '1px solid var(--color-border)', 
        borderRadius: '8px', 
        padding: '1.5rem', 
        marginBottom: '1rem',
        backgroundColor: 'var(--color-bg-secondary)'
      }}>
      <h3 
        style={{ 
          marginTop: 0, 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          cursor: keywords ? 'help' : 'default',
          position: 'relative',
          display: 'inline-block',
          color: 'var(--color-text)'
        }}
        data-tooltip={cleanKeywords || undefined}
        className={keywords ? 'has-tooltip' : ''}
      >
        {safeTitle}
      </h3>
      
      <p style={{ color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
        {firstAuthor} et al. ({year}) {journal} {volume}
        {number && `:${number} `}
        {pages && pages.replace('--', '-')}
      </p>
      
      {abstract && (
        <details 
          style={{ marginTop: '0.75rem' }}
          onToggle={(e) => setIsExpanded(e.target.open)}
        >
          <summary style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </summary>
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Authors:
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              {formattedAuthorList}
            </p>
            
            <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Abstract:
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              {cleanAbstract}
            </p>
            
            {doi && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                DOI: <a 
                  href={doiLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  {doi}
                </a>
              </p>
            )}
          </div>
        </details>
      )}
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {doiLink && (
          <a href={doiLink} target="_blank" rel="noopener noreferrer" 
             style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            Online Link
          </a>
        )}
        {pubmedLink && (
          <a href={pubmedLink} target="_blank" rel="noopener noreferrer"
             style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            PubMed
          </a>
        )}
        <a href={pdfLink} target="_blank" rel="noopener noreferrer"
           style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
          PDF
        </a>
      </div>
    </div>
    </>
  )
}
