import { listPages, readPage } from "@/lib/content.mjs"

export async function generateStaticParams() {
  const items = await listPages()
  return items.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { frontmatter } = await readPage(slug)
  return {
    title: frontmatter.title || slug,
    description: frontmatter.description || frontmatter.excerpt || 'Page'
  }
}

export default async function StaticPage({ params }) {
  const { slug } = await params
  const { frontmatter, content } = await readPage(slug)
  return (
    <article>
      <h1>{frontmatter.title || slug}</h1>
      {content}
    </article>
  )
}
