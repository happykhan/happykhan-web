import { readPage } from '@/lib/content.mjs'

export const metadata = {
  title: 'CV — Nabil‑Fareed Alikhan',
}

export default async function CVPage() {
  const { frontmatter, content } = await readPage('cv')
  return (
    <article>
      <h1>{frontmatter.title || 'Curriculum Vitae'}</h1>
      {content}
    </article>
  )
}
