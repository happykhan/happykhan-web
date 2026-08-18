import assert from 'node:assert/strict'
import test from 'node:test'

import {
  cleanBibtexText,
  getPublicationSearchTerm,
  publicationMatchesSearch,
} from '../lib/bibtex-text.mjs'

const title = 'Within-{{Host Diversity}} and {{Vertical Transmission}} of {{Group B}} {{{\\emph{Streptococcus}}}} {{Among Mother-infant Dyads}} in {{The Gambia}}'
const record = {
  entryTags: {
    title,
    year: '2019',
  },
}

test('cleans formatting commands from a BibTeX title', () => {
  assert.equal(
    cleanBibtexText(title),
    'Within-Host Diversity and Vertical Transmission of Group B Streptococcus Among Mother-infant Dyads in The Gambia'
  )
})

test('creates a clean homepage search term', () => {
  assert.equal(getPublicationSearchTerm(title), 'Within-Host Diversity and')
})

test('matches a clean search term against a formatted BibTeX title', () => {
  assert.equal(publicationMatchesSearch(record, 'Within-Host Diversity and'), true)
  assert.equal(publicationMatchesSearch(record, 'Streptococcus'), true)
  assert.equal(publicationMatchesSearch(record, 'unrelated'), false)
})
