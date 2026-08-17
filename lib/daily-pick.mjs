const londonDateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const millisecondsPerDay = 24 * 60 * 60 * 1000

export function getLondonDateSeed(date = new Date()) {
  const parts = Object.fromEntries(
    londonDateFormatter
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)])
  )

  return parts.year * 10000 + parts.month * 100 + parts.day
}

export function getLondonDayNumber(date = new Date()) {
  const seed = getLondonDateSeed(date)
  const year = Math.floor(seed / 10000)
  const month = Math.floor((seed % 10000) / 100)
  const day = seed % 100

  return Math.floor(Date.UTC(year, month - 1, day) / millisecondsPerDay)
}

function greatestCommonDivisor(a, b) {
  let left = a
  let right = b

  while (right !== 0) {
    const remainder = left % right
    left = right
    right = remainder
  }

  return left
}

function mixInteger(value) {
  let mixed = value | 0
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9f3b)
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9f3b)
  return (mixed ^ (mixed >>> 16)) >>> 0
}

function getRotationStep(length, offset) {
  if (length <= 2) return 1

  let step = (mixInteger(length + offset * 31) % (length - 1)) + 1
  while (greatestCommonDivisor(step, length) !== 1) {
    step = (step % (length - 1)) + 1
  }

  return step
}

export function getDailyItem(items, offset = 0, date = new Date()) {
  if (!items || items.length === 0) return null

  const step = getRotationStep(items.length, offset)
  const start = mixInteger(items.length * 101 + offset) % items.length
  const dayNumber = getLondonDayNumber(date)
  const rotationIndex = (start + (dayNumber + offset) * step) % items.length

  return items[rotationIndex]
}
