const londonDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function getLondonDateSeed(date = new Date()) {
  const parts = Object.fromEntries(
    londonDateFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)])
  )

  return parts.year * 10000 + parts.month * 100 + parts.day
}

export function getDailyItem(items, offset = 0, date = new Date()) {
  if (!items || items.length === 0) return null

  const seed = getLondonDateSeed(date) + offset
  const randomValue = Math.sin(seed) * 10000
  const randomFraction = randomValue - Math.floor(randomValue)
  const randomIndex = Math.floor(randomFraction * items.length)

  return items[randomIndex]
}
