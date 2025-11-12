import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const MICROBINFIE_DIR = path.join(process.cwd(), 'content', 'microbinfie')

async function removeSummaryFromAllFiles() {
  const files = await fs.readdir(MICROBINFIE_DIR)
  const mdxFiles = files.filter(f => f.endsWith('.mdx'))
  
  let count = 0
  for (const file of mdxFiles) {
    const filePath = path.join(MICROBINFIE_DIR, file)
    const content = await fs.readFile(filePath, 'utf8')
    const { data: frontmatter, content: body } = matter(content)
    
    if ('summary' in frontmatter) {
      delete frontmatter.summary
      const newContent = matter.stringify(body, frontmatter)
      await fs.writeFile(filePath, newContent, 'utf8')
      count++
    }
  }
  
  console.log(`Removed 'summary' field from ${count} files`)
}

removeSummaryFromAllFiles().catch(console.error)
