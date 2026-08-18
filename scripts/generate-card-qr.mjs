import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import QRCode from 'qrcode'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const cardUrl = 'https://happykhan.com/hi'
const portraitPath = path.join(
  projectRoot,
  'public/images/Nabil-FareedAlikhan-smile-headshot-square.jpg'
)
const outputPath = path.join(projectRoot, 'public/images/happykhan-hi-qr.svg')

const portrait = await sharp(portraitPath)
  .resize(220, 220, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84, chromaSubsampling: '4:4:4' })
  .toBuffer()

const portraitDataUri = `data:image/jpeg;base64,${portrait.toString('base64')}`
const qrSvg = await QRCode.toString(cardUrl, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 4,
  width: 800,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
})

const portraitOverlay = `
  <defs>
    <clipPath id="portrait-clip">
      <circle cx="18.5" cy="18.5" r="4.6"/>
    </clipPath>
  </defs>
  <circle cx="18.5" cy="18.5" r="5.2" fill="#ffffff"/>
  <image
    href="${portraitDataUri}"
    x="13.9"
    y="13.9"
    width="9.2"
    height="9.2"
    preserveAspectRatio="xMidYMid slice"
    clip-path="url(#portrait-clip)"
  />
  <circle cx="18.5" cy="18.5" r="4.6" fill="none" stroke="#ffffff" stroke-width="0.35"/>
`

const brandedQrSvg = qrSvg.replace('</svg>', `${portraitOverlay}</svg>`)

await fs.writeFile(outputPath, brandedQrSvg)
console.log(`Generated ${path.relative(projectRoot, outputPath)}`)
