import { listPosts, readPost } from "@/lib/content.mjs"
import Image from 'next/image'
import CodeBlockWrapper from '@/components/CodeBlockWrapper'
import ModuleNav from '@/components/ModuleNav'

export async function generateStaticParams() {
  const items = await listPosts()
  return items.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { frontmatter } = await readPost(slug)
  return {
    title: frontmatter.title || slug,
    description: frontmatter.description || frontmatter.excerpt || 'Post.',
    openGraph: {
      title: frontmatter.title || slug,
      description: frontmatter.description || frontmatter.excerpt || 'Post.',
      url: postUrl,
      images: bannerSrc ? [siteUrl + bannerSrc] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title || slug,
      description: frontmatter.description || frontmatter.excerpt || 'Post.',
      images: bannerSrc ? [siteUrl + bannerSrc] : [],
    }
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const data = await readPost(slug)
  const bannerSrc = data.frontmatter.bannerImage?.replace(/^\.\//, `/posts/${slug}/`)
  
  // Get module posts if this post is part of a module
  let modulePosts = []
  if (data.frontmatter.module && data.frontmatter.module.slug) {
    const allPosts = await listPosts()
    modulePosts = allPosts
      .filter(p => p.module && p.module.slug === data.frontmatter.module.slug)
      .map(p => ({
        slug: p.slug,
        title: p.title,
        order: p.module.order || 999
      }))
      .sort((a, b) => a.order - b.order)
  }
  
  const siteUrl = 'https://happykhan.com'
  const postUrl = `${siteUrl}/posts/${slug}`
  const datePublished = data.frontmatter.date ? new Date(data.frontmatter.date).toISOString() : new Date().toISOString()
  const dateModified = data.frontmatter.updated ? new Date(data.frontmatter.updated).toISOString() : datePublished
  const images = bannerSrc ? [siteUrl + bannerSrc] : []
  const authors = ['Nabil-Fareed Alikhan']
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.frontmatter.title || slug,
    url: postUrl,
    image: images,
    datePublished,
    dateModified,
    author: authors.map(name => ({ '@type': 'Person', name })),
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'Happykhan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://happykhan.com/images/Nabil-FareedAlikhan-portSQ.jpg',
      },
    },
    description: data.frontmatter.description || data.frontmatter.excerpt || (data.frontmatter.title || slug),
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
      
      {/* Module indicator - compact version at top */}
      {data.frontmatter.module && modulePosts.length > 0 && (
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-primary)',
          borderLeft: '4px solid var(--color-primary)',
          borderRadius: '6px',
          marginBottom: '2rem',
          fontSize: '0.9rem',
        }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Part {modulePosts.findIndex(p => p.slug === slug) + 1} of {modulePosts.length} in the series:{' '}
          </span>
          <strong style={{ color: 'var(--color-primary)' }}>
            {data.frontmatter.module.name}
          </strong>
        </div>
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
      
      {/* Module navigation - full version at bottom */}
      {data.frontmatter.module && modulePosts.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <ModuleNav 
            module={data.frontmatter.module} 
            currentSlug={slug}
            modulePosts={modulePosts}
          />
        </div>
      )}
    </article>
  )
}
