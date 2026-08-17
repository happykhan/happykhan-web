import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getDailyItem,
  getLondonDateSeed,
  getLondonDayNumber,
} from '../lib/daily-pick.mjs'

test('uses the Europe/London calendar date', () => {
  assert.equal(getLondonDateSeed(new Date('2026-08-17T22:59:59Z')), 20260817)
  assert.equal(getLondonDateSeed(new Date('2026-08-17T23:00:00Z')), 20260818)
})

test('London day numbers advance at London midnight', () => {
  const beforeMidnight = getLondonDayNumber(new Date('2026-08-17T22:59:59Z'))
  const afterMidnight = getLondonDayNumber(new Date('2026-08-17T23:00:00Z'))

  assert.equal(afterMidnight, beforeMidnight + 1)
})

test('returns every item once before starting the next rotation', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
  const selections = Array.from({ length: items.length }, (_, index) =>
    getDailyItem(items, 23, new Date(`2026-08-${String(index + 1).padStart(2, '0')}T12:00:00Z`))
  )

  assert.equal(new Set(selections).size, items.length)
  assert.deepEqual([...selections].sort(), items)
})

test('returns a stable item throughout one London day', () => {
  const items = ['a', 'b', 'c']
  const morning = getDailyItem(items, 2, new Date('2026-01-10T01:00:00Z'))
  const evening = getDailyItem(items, 2, new Date('2026-01-10T22:00:00Z'))

  assert.equal(morning, evening)
})

test('returns null for an empty collection', () => {
  assert.equal(getDailyItem([]), null)
  assert.equal(getDailyItem(null), null)
})
