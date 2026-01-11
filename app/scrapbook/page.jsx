import { readPage } from '@/lib/content.mjs'
import CodeBlockWrapper from '@/components/CodeBlockWrapper'

export const metadata = {
  title: 'Science Scrapbook — Nabil‑Fareed Alikhan',
}

export default async function ScrapbookPage() {
  const { frontmatter, content } = await readPage('scrapbook')
  return (
    <article>
      <h1>{frontmatter.title || 'Science Scrapbook'}</h1>
      <CodeBlockWrapper>
        {content}
      </CodeBlockWrapper>
    </article>
  )
}