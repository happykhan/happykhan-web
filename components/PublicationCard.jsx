'use client'

import { useState } from 'react'

// Helper function to clean LaTeX/BibTeX formatting from text
function cleanText(text) {
  if (!text) return ''

  let cleaned = text
    .replace(/\\\\/g, '')                 // Remove double backslashes
    .replace(/\\%/g, '%')                 // Replace \% with %
    .replace(/\\&/g, '&')                 // Replace \& with &
    .replace(/\\textasciitilde/g, '~')    // Replace \textasciitilde with ~
    .replace(/\\textasciicircum/g, '^')   // Replace \textasciicircum with ^
    .replace(/\\textgreater/g, '>')       // Replace \textgreater with >
    .replace(/\\textless/g, '<')          // Replace \textless with <
    .replace(/\\textit\{([^}]*)\}/g, '$1')   // \textit{text} -> text
    .replace(/\\textrm\{([^}]*)\}/g, '$1')   // \textrm{text} -> text
    .replace(/\\textbf\{([^}]*)\}/g, '$1')   // \textbf{text} -> text
    .replace(/\\emph\{([^}]*)\}/g, '$1')     // \emph{text} -> text
    .replace(/\\mkern\d+mu/g, '')            // Remove \mkern1mu type spacing commands

  // Handle LaTeX accent macros before stripping braces/commands
  const accentMap = {
    "'": '\\u0301', // acute
    '`': '\\u0300',   // grave
    '"': '\\u0308',  // diaeresis
    '^': '\\u0302',   // circumflex
    '~': '\\u0303',   // tilde
    '=': '\\u0304',   // macron
    '.': '\\u0307',   // dot above
    'u': '\\u0306',   // breve
    'v': '\\u030C',   // caron
    'H': '\\u030B',   // double acute
    'c': '\\u0327',   // cedilla
    'd': '\\u0323',   // dot below
    'b': '\\u0305'    // overline (approx for bar)
  }

  // Patterns: {\'o} and \'{o}
  cleaned = cleaned.replace(/\{\\(["'`^~=.uvHcdb])([A-Za-z])\}/g, (_, accent, letter) => {
    return letter + accentMap[accent]
  })
  cleaned = cleaned.replace(/\\(["'`^~=.uvHcdb])\{([A-Za-z])\}/g, (_, accent, letter) => {
    return letter + accentMap[accent]
  })
  // Simple form: \'o (no braces around letter)
  cleaned = cleaned.replace(/\\(["'`^~=.uvHcdb])([A-Za-z])/g, (_, accent, letter) => {
    // Avoid converting commands like \textbf etc (already handled); ensure accent code in map
    if (!accentMap[accent]) return letter
    return letter + accentMap[accent]
  })

  // Ligatures & special letters
  const specials = {
    // NOTE: Do NOT map \\ss to ß to avoid unintended replacements in English text
    '\\ae': 'æ', '\\AE': 'Æ', '\\oe': 'œ', '\\OE': 'Œ',
    '\\aa': 'å', '\\AA': 'Å'
    // NOTE: Intentionally NOT converting \o, \O, \l, \L, \i, \j to avoid accidental
    // replacement when BibTeX uses these macros stylistically. They were causing
    // unexpected characters like 'ø', 'ł', and dotless 'ı' in plain English titles.
  }
  Object.entries(specials).forEach(([k, v]) => {
    cleaned = cleaned.replace(new RegExp(k, 'g'), v)
  })

  cleaned = cleaned
    .replace(/[{}$]/g, '')                // Remove remaining braces, dollar signs
    .replace(/\\[a-zA-Z]+/g, '')         // Remove other LaTeX commands
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim()

  try {
    cleaned = cleaned.normalize('NFC') // Compose accents
  } catch (_) {
    // ignore if not supported
  }

  // Safety: revert rarely desired accented replacements if they slipped through.
  // (In case upstream data already contained these due to previous processing.)
  cleaned = cleaned
    .replace(/ø/g, 'o')
    .replace(/Ø/g, 'O')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .replace(/ı/g, 'i')
    .replace(/ß/g, 'ss')

  return cleaned
}

// Convert LaTeX accent macros to Unicode characters
function convertLatexAccents(text) {
  if (!text) return ''
  let result = String(text)
  
  // Accent mappings: LaTeX accent command -> Unicode combining character
  const accents = {
    "'": '\u0301',  // acute: á
    '`': '\u0300',  // grave: à
    '^': '\u0302',  // circumflex: â
    '"': '\u0308',  // diaeresis/umlaut: ä
    '~': '\u0303',  // tilde: ñ
    '=': '\u0304',  // macron: ā
    '.': '\u0307',  // dot above: ż
    'u': '\u0306',  // breve: ă
    'v': '\u030C',  // caron: č
    'H': '\u030B',  // double acute: ő
    'c': '\u0327',  // cedilla: ç
    'd': '\u0323',  // dot below: ḍ
    'b': '\u0331',  // bar below: ḇ
    'k': '\u0328',  // ogonek: ą
  }
  
  // Pattern 1: {\'o} - braces around the whole thing
  Object.entries(accents).forEach(([cmd, combining]) => {
    const regex = new RegExp(`\\{\\\\${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([A-Za-z])\\}`, 'g')
    result = result.replace(regex, (_, letter) => letter + combining)
  })
  
  // Pattern 2: \'{o} - braces around the letter
  Object.entries(accents).forEach(([cmd, combining]) => {
    const regex = new RegExp(`\\\\${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\{([A-Za-z])\\}`, 'g')
    result = result.replace(regex, (_, letter) => letter + combining)
  })
  
  // Pattern 3: \'o - no braces (space or non-letter after)
  Object.entries(accents).forEach(([cmd, combining]) => {
    const regex = new RegExp(`\\\\${cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([A-Za-z])`, 'g')
    result = result.replace(regex, (_, letter) => letter + combining)
  })
  
  // Special characters that are full replacements (not combining)
  const specials = {
    '\\ss': 'ß',
    '\\ae': 'æ', '\\AE': 'Æ',
    '\\oe': 'œ', '\\OE': 'Œ',
    '\\aa': 'å', '\\AA': 'Å',
    '\\o': 'ø', '\\O': 'Ø',
    '\\l': 'ł', '\\L': 'Ł',
  }
  
  Object.entries(specials).forEach(([latex, unicode]) => {
    result = result.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode)
  })
  
  // Normalize to composed form (NFC) so combining marks become single characters
  try {
    result = result.normalize('NFC')
  } catch (_) {
    // Ignore if normalize not supported
  }
  
  return result
}

// Minimal normalization that keeps braces and \emph/\textit/\textbf intact for rich rendering
function normalizeLatexBasic(text) {
  if (!text) return ''
  let result = String(text)
  
  // First convert accents to Unicode
  result = convertLatexAccents(result)
  
  // Then handle basic escapes
  return result
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\textasciitilde/g, '~')
    .replace(/\\textasciicircum/g, '^')
    .replace(/\\textgreater/g, '>')
    .replace(/\\textless/g, '<')
    .replace(/\\mkern\d+mu/g, '')
}

// Parse LaTeX formatting (\\emph, \\textit -> <em>; \\textbf -> <strong>; $...$ -> math) into React nodes
function renderLatexRich(text) {
  const input = normalizeLatexBasic(text)
  const nodes = []
  let i = 0

  const pushText = (t) => {
    if (!t) return
    const plain = t
      .replace(/[{}]/g, '')
      .replace(/\\(?!emph|textit|textbf)[a-zA-Z]+/g, '') // remove other commands
    if (plain) nodes.push(plain)
  }
  
  // Greek letters and common math symbols
  const mathSymbols = {
    '\\pi': 'π', '\\Pi': 'Π',
    '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
    '\\epsilon': 'ε', '\\theta': 'θ', '\\lambda': 'λ', '\\mu': 'μ',
    '\\sigma': 'σ', '\\Sigma': 'Σ', '\\omega': 'ω', '\\Omega': 'Ω',
    '\\infty': '∞', '\\pm': '±', '\\times': '×', '\\div': '÷',
    '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈'
  }

  const consumeGroup = (str, start) => {
    // start points to first '{'
    let depth = 0
    for (let j = start; j < str.length; j++) {
      const ch = str[j]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) return j
      }
    }
    return -1
  }

  const macros = [
    { name: '\\emph{', tag: 'em' },
    { name: '\\textit{', tag: 'em' },
    { name: '\\textbf{', tag: 'strong' }
  ]

  while (i < input.length) {
    if (input[i] === '{' || input[i] === '}') { i++; continue }
    
    // Handle inline math: $...$
    if (input[i] === '$') {
      const end = input.indexOf('$', i + 1)
      if (end !== -1) {
        pushText(input.slice(0, i))
        let mathContent = input.slice(i + 1, end)
        // Handle escaped characters in math mode
        mathContent = mathContent.replace(/\\%/g, '%')
        // Replace LaTeX math symbols with Unicode
        Object.entries(mathSymbols).forEach(([latex, unicode]) => {
          mathContent = mathContent.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode)
        })
        nodes.push(<span key={`math-${i}`} style={{ fontStyle: 'italic' }}>{mathContent}</span>)
        i = end + 1
        continue
      }
    }

    // Support an extra opening brace before macro e.g. {\\emph{...}}
    let startIdx = i
    let bracePrefix = false
    const startsWithAny = (idx) => macros.some(m => input.startsWith(m.name, idx))
    if (input[startIdx] === '{' && startsWithAny(startIdx + 1)) {
      bracePrefix = true
      startIdx += 1
    }

    const macro = macros.find(m => input.startsWith(m.name, startIdx))
    if (macro) {
      pushText(input.slice(i, startIdx))
      const groupStart = startIdx + macro.name.length - 1 // points at '{'
      const end = consumeGroup(input, groupStart)
      if (end !== -1) {
        const inner = input.slice(groupStart + 1, end)
        const children = renderLatexRich(inner)
        nodes.push(
          macro.tag === 'em' ? <em key={`em-${i}`}>{children}</em> : <strong key={`st-${i}`}>{children}</strong>
        )
        i = end + (bracePrefix && input[end + 1] === '}' ? 2 : 1)
        continue
      }
    }

    // no macro here, collect until next special token
    let j = i
    while (
      j < input.length &&
      input[j] !== '{' &&
      input[j] !== '}' &&
      input[j] !== '$' &&
      !startsWithAny(j) &&
      !(input[j] === '{' && startsWithAny(j + 1))
    ) {
      j++
    }
    pushText(input.slice(i, j))
    i = j
  }

  return nodes.length ? nodes : [input.replace(/[{}$]/g, '')]
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
  
  // If more than 50 authors, show first 25 and last 25 with ellipsis
  if (formatted.length > 50) {
    const first25 = formatted.slice(0, 25)
    const last25 = formatted.slice(-25)
    return [...first25, '...', ...last25].join(', ')
  }
  
  return formatted.join(', ')
}

export default function PublicationCard({ 
  title, 
  author, 
  year, 
  journal = '', 
  publisher = '',
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
  const richTitle = renderLatexRich(title)
  const cleanAbstract = cleanText(abstract)
  const cleanKeywords = cleanText(keywords)?.replace(/,/g, ', ')
  
  const pdfFilename = `${firstAuthor.toLowerCase().replace(/\s+/g, '')}-${year}-${safeDoi}.pdf`
  const pdfLink = `/papers/${pdfFilename}`
  const doiLink = doi ? `https://doi.org/${doi}` : null
  const pubmedLink = pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}` : null
  const venue = (cleanText(journal) || '').trim() || (cleanText(publisher) || '').trim()
  
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
        {richTitle}
      </h3>
      
      <p style={{ color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
        {firstAuthor} et al. ({year}) {venue} {volume}
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
              {renderLatexRich(formattedAuthorList)}
            </p>
            
            <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Abstract:
            </p>
            <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              {renderLatexRich(abstract)}
            </div>
            
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
