'use client'

import Link from 'next/link'

export default function ModuleNav({ module, currentSlug, modulePosts }) {
  if (!module || !modulePosts || modulePosts.length === 0) {
    return null
  }

  const currentIndex = modulePosts.findIndex(p => p.slug === currentSlug)
  const prevPost = currentIndex > 0 ? modulePosts[currentIndex - 1] : null
  const nextPost = currentIndex < modulePosts.length - 1 ? modulePosts[currentIndex + 1] : null

  return (
    <div style={{
      border: '2px solid var(--color-primary)',
      borderRadius: '12px',
      padding: '1.5rem',
      background: 'var(--color-bg-secondary)',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        <span style={{
          padding: '0.25rem 0.75rem',
          background: 'var(--color-primary)',
          color: 'var(--color-bg)',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Series
        </span>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          color: 'var(--color-text)',
        }}>
          {module.name}
        </h3>
      </div>

      {module.description && (
        <p style={{
          margin: '0 0 1rem 0',
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}>
          {module.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        {modulePosts.map((post, idx) => {
          const isActive = post.slug === currentSlug
          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                padding: '0.75rem',
                borderRadius: '6px',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-bg)' : 'var(--color-text)',
                border: isActive ? 'none' : '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--color-bg)'
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                }
              }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-border)',
                  color: isActive ? 'var(--color-bg)' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                  {post.title}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Previous/Next navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)',
      }}>
        {prevPost ? (
          <Link
            href={`/posts/${prevPost.slug}`}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              textDecoration: 'none',
              color: 'inherit',
              fontSize: '0.85rem',
              background: 'var(--color-bg)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
              ← Previous
            </div>
            <div style={{ fontWeight: 500, lineHeight: 1.3 }}>
              {prevPost.title}
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }}></div>
        )}
        
        {nextPost ? (
          <Link
            href={`/posts/${nextPost.slug}`}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              textDecoration: 'none',
              color: 'inherit',
              fontSize: '0.85rem',
              textAlign: 'right',
              background: 'var(--color-bg)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <div style={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
              Next →
            </div>
            <div style={{ fontWeight: 500, lineHeight: 1.3 }}>
              {nextPost.title}
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }}></div>
        )}
      </div>
    </div>
  )
}
