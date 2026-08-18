const accentMap = {
  "'": '\u0301',
  '`': '\u0300',
  '"': '\u0308',
  '^': '\u0302',
  '~': '\u0303',
  '=': '\u0304',
  '.': '\u0307',
  u: '\u0306',
  v: '\u030C',
  H: '\u030B',
  c: '\u0327',
  d: '\u0323',
  b: '\u0305',
}

export function cleanBibtexText(text) {
  if (!text) return ''

  let cleaned = String(text)
    .replace(/\\\\/g, '')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\textasciitilde/g, '~')
    .replace(/\\textasciicircum/g, '^')
    .replace(/\\textgreater/g, '>')
    .replace(/\\textless/g, '<')
    .replace(/\\mkern\d+mu/g, '')

  let previous
  do {
    previous = cleaned
    cleaned = cleaned.replace(/\\(?:emph|textit|textrm|textbf)\{([^{}]*)\}/g, '$1')
  } while (cleaned !== previous)

  cleaned = cleaned.replace(/\{\\(["'`^~=.uvHcdb])([A-Za-z])\}/g, (_, accent, letter) => {
    return letter + accentMap[accent]
  })
  cleaned = cleaned.replace(/\\(["'`^~=.uvHcdb])\{([A-Za-z])\}/g, (_, accent, letter) => {
    return letter + accentMap[accent]
  })
  cleaned = cleaned.replace(/\\(["'`^~=.uvHcdb])([A-Za-z])/g, (_, accent, letter) => {
    return letter + accentMap[accent]
  })

  const specialLetters = {
    '\\ae': 'æ',
    '\\AE': 'Æ',
    '\\oe': 'œ',
    '\\OE': 'Œ',
    '\\aa': 'å',
    '\\AA': 'Å',
  }

  Object.entries(specialLetters).forEach(([latex, character]) => {
    cleaned = cleaned.replaceAll(latex, character)
  })

  return cleaned
    .replace(/[{}$]/g, '')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFC')
}

export function getPublicationSearchTerm(title, wordCount = 3) {
  return cleanBibtexText(title).split(' ').slice(0, wordCount).join(' ')
}

export function publicationMatchesSearch(record, query) {
  const searchText = cleanBibtexText(query).toLocaleLowerCase()
  if (!searchText) return true

  const tags = record?.entryTags || {}
  return ['title', 'journal', 'year', 'abstract', 'author'].some((field) => (
    cleanBibtexText(tags[field]).toLocaleLowerCase().includes(searchText)
  ))
}
