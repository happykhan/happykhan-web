import { listMicrobinfie, readMicrobinfie } from "@/lib/content.mjs"
import CodeBlockWrapper from '@/components/CodeBlockWrapper'

export async function generateStaticParams() {
  const items = await listMicrobinfie()
  return items.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { frontmatter } = await readMicrobinfie(slug)
  return {
    title: frontmatter.title || slug,
    description: frontmatter.description || frontmatter.excerpt || 'MicroBinFie article.'
  }
}

export default async function MicrobinfiePostPage({ params }) {
  const { slug } = await params
  const { frontmatter, content } = await readMicrobinfie(slug)
  return (
    <article>
      <h1>{frontmatter.title || slug}</h1>
      {frontmatter.date && <p style={{ color: 'var(--color-text-secondary)' }}>{new Date(frontmatter.date).toLocaleDateString('en-GB')}</p>}
      <CodeBlockWrapper>
        {content}
      </CodeBlockWrapper>
    </article>
  )
}
