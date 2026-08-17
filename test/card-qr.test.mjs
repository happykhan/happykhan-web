import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'

import jsQR from 'jsqr'
import sharp from 'sharp'

const expectedUrl = 'https://happykhan.com/hi'
const qrPath = new URL('../public/images/happykhan-hi-qr.svg', import.meta.url)

test('portrait QR contains an embedded image', async () => {
  const svg = await fs.readFile(qrPath, 'utf8')

  assert.match(svg, /id="portrait-clip"/)
  assert.match(svg, /href="data:image\/jpeg;base64,/)
})

for (const size of [800, 400, 240, 180]) {
  test(`portrait QR decodes at ${size}px`, async () => {
    const svg = await fs.readFile(qrPath)
    const { data, info } = await sharp(svg)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const result = jsQR(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      { inversionAttempts: 'dontInvert' }
    )

    assert.equal(result?.data, expectedUrl)
  })
}
