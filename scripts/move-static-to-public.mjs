import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const staticDir = path.join(root, 'static')
const publicDir = path.join(root, 'public')

// Directories and files to move from static/ to public/
const DIRS = ['images', 'microbinfie-transcripts', 'papers', 'pr']
const FILES = [
  'robots.txt',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-128x128.png',
  'android-chrome-512x512.png',
]

async function copyRecursive(src, dest) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })
    for (const ent of entries) {
      const s = path.join(src, ent.name)
      const d = path.join(dest, ent.name)
      if (ent.isDirectory()) {
        await copyRecursive(s, d)
      } else {
        await fs.mkdir(path.dirname(d), { recursive: true })
        const buf = await fs.readFile(s)
        await fs.writeFile(d, buf)
      }
    }
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true })
    const buf = await fs.readFile(src)
    await fs.writeFile(dest, buf)
  }
}

async function main() {
  let copied = []
  // Copy directories
  for (const dir of DIRS) {
    const src = path.join(staticDir, dir)
    try {
      await fs.access(src)
      const dest = path.join(publicDir, dir)
      await copyRecursive(src, dest)
      copied.push(dir + '/**')
    } catch {
      // skip missing
    }
  }
  // Copy files
  for (const f of FILES) {
    const src = path.join(staticDir, f)
    try {
      await fs.access(src)
      const dest = path.join(publicDir, f)
      await copyRecursive(src, dest)
      copied.push(f)
    } catch {
      // skip missing
    }
  }
  console.log(`Moved to public/: ${copied.join(', ')}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
