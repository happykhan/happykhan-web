'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const POSTS_PER_PAGE = 5

export default function FieldNotesFilter({ posts }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Extract modules from posts
  const modules = useMemo(() => {
    const moduleMap = new Map()
    posts.forEach(post => {
      if (post.module && post.module.slug) {
        const slug = post.module.slug
        if (!moduleMap.has(slug)) {
          moduleMap.set(slug, {
            name: post.module.name,
            slug: post.module.slug,
            description: post.module.description || '',
            posts: []
          })
        }
        moduleMap.get(slug).posts.push({
          slug: post.slug,
          title: post.title,
          order: post.module.order || 999
        })
      }
    })
    
    // Sort posts within each module by order
    moduleMap.forEach(module => {
      module.posts.sort((a, b) => a.order - b.order)
    })
    
    return Array.from(moduleMap.values())
  }, [posts])

  // Extract all unique tags except "Posts"
  const allTags = useMemo(() => {
    const tagSet = new Set()
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && tag.toLowerCase() !== 'posts') {
            tagSet.add(tag)
          }
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filter posts by search term and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTag = !selectedTag || 
        (post.tags && post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()))
      
      return matchesSearch && matchesTag
    })
  }, [posts, searchTerm, selectedTag])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTag])

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return (
    <div>
      {/* Modules section */}
      {modules.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Series
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {modules.map(module => (
              <Link 
                key={module.slug}
                href={`/posts/${module.posts[0].slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{
                  padding: '1.5rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-bg-secondary)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.25rem',
                    color: 'var(--color-primary)',
                  }}>
                    {module.name}
                  </h3>
                  <p style={{
                    margin: '0 0 1rem 0',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}>
                    {module.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                  }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'var(--color-primary)',
                      color: 'var(--color-bg)',
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}>
                      {module.posts.length} {module.posts.length === 1 ? 'part' : 'parts'}
                    </span>
                    <span>→ Start guide</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Separator and All Field Notes header */}
      <div style={{ 
        marginBottom: '2rem',
        paddingTop: modules.length > 0 ? '2rem' : '0',
        borderTop: modules.length > 0 ? '2px solid var(--color-border)' : 'none',
      }}>
        {modules.length > 0 && (
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            color: 'var(--color-text)',
          }}>
            All Research Notes
          </h2>
        )}
      </div>

      {/* Search and filter controls */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search research notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            marginBottom: '1rem',
            fontFamily: 'inherit',
          }}
        />

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                border: selectedTag === null ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: '20px',
                background: selectedTag === null ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                color: selectedTag === null ? 'var(--color-bg)' : 'var(--color-text)',
                cursor: 'pointer',
                fontWeight: selectedTag === null ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.85rem',
                  border: selectedTag === tag ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: '20px',
                  background: selectedTag === tag ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                  color: selectedTag === tag ? 'var(--color-bg)' : 'var(--color-text)',
                  cursor: 'pointer',
                  fontWeight: selectedTag === tag ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        {filteredPosts.length === posts.length 
          ? `Showing ${startIndex + 1}–${Math.min(endIndex, posts.length)} of ${posts.length} research notes`
          : `Found ${filteredPosts.length} of ${posts.length} research notes — showing ${startIndex + 1}–${Math.min(endIndex, filteredPosts.length)}`
        }
      </p>

      {/* Posts list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {paginatedPosts.map(post => (
          <li 
            key={post.slug}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <Link 
              href={`/posts/${post.slug}`}
              style={{ 
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              <h3 style={{ 
                margin: '0 0 0.5rem 0',
                fontSize: '1.25rem',
                color: 'var(--color-primary)',
              }}>
                {post.title}
              </h3>
              {post.date && (
                <time style={{ 
                  color: 'var(--color-text-secondary)', 
                  fontSize: '0.9rem',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}>
                  {new Date(post.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </time>
              )}
              {post.excerpt && (
                <p style={{ 
                  margin: '0.5rem 0 0 0',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {post.excerpt}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '0.4rem', 
                  flexWrap: 'wrap',
                  marginTop: '0.75rem',
                }}>
                  {post.tags
                    .filter(tag => tag.toLowerCase() !== 'posts')
                    .map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.75rem',
                          background: 'var(--color-bg-secondary)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '12px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          alignItems: 'center', 
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            >
              ← Previous
            </button>
          )}
          
          <span style={{ color: 'var(--color-text-secondary)', padding: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            >
              Next →
            </button>
          )}
        </nav>
      )}

      {filteredPosts.length === 0 && (
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--color-text-secondary)',
          padding: '2rem',
        }}>
          No research notes found matching your criteria.
        </p>
      )}
    </div>
  )
}
