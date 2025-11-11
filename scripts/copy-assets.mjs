import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

const pairs = [
  { src: path.join(root, 'content', 'posts'), dest: path.join(process.cwd(), 'public', 'posts') },
  { src: path.join(root, 'content', 'microbinfie'), dest: path.join(process.cwd(), 'public', 'microbinfie') },
  { src: path.join(root, 'content', 'pages'), dest: path.join(process.cwd(), 'public', 'pages') },
  // Static assets are moved permanently by scripts/move-static-to-public.mjs
]

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const ent of entries) {
    const s = path.join(src, ent.name)
    const d = path.join(dest, ent.name)
    if (ent.isDirectory()) {
      await copyDir(s, d)
    } else {
      if (!ent.name.endsWith('.mdx')) {
        const data = await fs.readFile(s)
        await fs.mkdir(path.dirname(d), { recursive: true })
        await fs.writeFile(d, data)
      }
    }
  }
}

async function main() {
  for (const { src, dest } of pairs) {
    try {
      await fs.access(src)
    } catch {
      continue
    }
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src, { withFileTypes: true })
    for (const ent of entries) {
      const p = path.join(src, ent.name)
      if (ent.isDirectory()) {
        await copyDir(p, path.join(dest, ent.name))
      } else if (ent.isFile()) {
        if (!ent.name.endsWith('.mdx')) {
          const data = await fs.readFile(p)
          await fs.writeFile(path.join(dest, ent.name), data)
        }
      }
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
