import { listPosts, readPost } from "@/lib/content.mjs"
import Image from 'next/image'
import CodeBlockWrapper from '@/components/CodeBlockWrapper'

export async function generateStaticParams() {
  const items = await listPosts()
  return items.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { frontmatter } = await readPost(slug)
  return {
    title: frontmatter.title || slug,
    description: frontmatter.description || frontmatter.excerpt || 'Post.'
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const data = await readPost(slug)
  const bannerSrc = data.frontmatter.bannerImage?.replace(/^\.\//, `/posts/${slug}/`)
  
  return (
    <article>
      <h1>{data.frontmatter.title || slug}</h1>
      {data.frontmatter.date && (
        <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
          Posted on {new Date(data.frontmatter.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      )}
      {bannerSrc && (
        <figure style={{ margin: '0 0 2rem 0' }}>
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image 
              src={bannerSrc}
              alt={data.frontmatter.bannerDesc || data.frontmatter.title || ''} 
              title={data.frontmatter.bannerDesc || ''}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </div>
        </figure>
      )}
      <CodeBlockWrapper>
        {data.content ? data.content : <div dangerouslySetInnerHTML={{ __html: data.fallbackHtml }} />}
      </CodeBlockWrapper>
    </article>
  )
}
