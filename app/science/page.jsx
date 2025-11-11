import { readPage } from '@/lib/content.mjs'
import CodeBlockWrapper from '@/components/CodeBlockWrapper'

export const metadata = {
  title: 'Science — Nabil‑Fareed Alikhan',
}

export default async function SciencePage() {
  const { frontmatter, content } = await readPage('science')
  return (
    <article>
      <h1>{frontmatter.title || 'Science'}</h1>
      <CodeBlockWrapper>
        {content}
      </CodeBlockWrapper>
    </article>
  )
}
