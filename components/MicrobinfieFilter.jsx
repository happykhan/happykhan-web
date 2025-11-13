'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SoundCloudIcon, DownloadIcon } from './PodcastPlatformIcons'

// Simple markdown to HTML converter for excerpts
function renderMarkdown(text) {
  if (!text) return ''
  
  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Inline code: `code`
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links: [text](url)
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

  // Extract track ID from GUID format: tag:soundcloud,2010:tracks/{trackId}
  const extractTrackId = (guid) => {
    if (!guid) return null
    const match = guid.match(/tracks\/(\d+)/)
    return match ? match[1] : null
  }

  // Pagination
  const EPISODES_PER_PAGE = 10

export default function MicrobinfieFilter({ episodes }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showTags, setShowTags] = useState(false)

  // Initialize from URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlTag = searchParams.get('tag')
    
    if (urlSearch) setSearchTerm(urlSearch)
    if (urlTag) setSelectedTag(urlTag)
  }, [searchParams])

  // Update URL when search or tag changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedTag) params.set('tag', selectedTag)
    
    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : '/microbinfie'
    
    router.replace(newUrl, { scroll: false })
  }, [searchTerm, selectedTag, router])

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set()
    episodes.forEach(episode => {
      if (episode.tags && Array.isArray(episode.tags)) {
        episode.tags.forEach(tag => {
          if (tag && tag.toLowerCase() !== 'microbinfie' && tag.toLowerCase() !== 'podcast') {
            tagSet.add(tag)
          }
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [episodes])

  // Filter episodes by search term and selected tag
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || 
        episode.title?.toLowerCase().includes(searchLower) ||
        episode.subtitle?.toLowerCase().includes(searchLower) ||
        episode.excerpt?.toLowerCase().includes(searchLower) ||
        (episode.tags && episode.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      
      const matchesTag = !selectedTag || 
        (episode.tags && episode.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()))
      
      return matchesSearch && matchesTag
    })
  }, [episodes, searchTerm, selectedTag])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTag])

  // Pagination logic
  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE)
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE
  const endIndex = startIndex + EPISODES_PER_PAGE
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, endIndex)

  return (
    <div>
      {/* Search and filter controls */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search episodes..."
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

        {/* Toggle button for tag chips */}
        {allTags.length > 0 && (
          <button
            onClick={() => setShowTags(!showTags)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              marginBottom: showTags ? '1rem' : '0',
              transition: 'all 0.2s',
            }}
          >
            {showTags ? '▼ Hide Topics' : '▶ Show Topics'}
          </button>
        )}

        {/* Tag chips */}
        {allTags.length > 0 && showTags && (
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
              All Topics
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
        {filteredEpisodes.length === episodes.length 
          ? `Showing all ${episodes.length} episodes` 
          : `Found ${filteredEpisodes.length} of ${episodes.length} episodes`}
        {selectedTag && ` tagged with "${selectedTag}"`}
      </p>

      {/* Episodes list */}
      {paginatedEpisodes.length > 0 ? (
        <>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0,
          }}>
            {paginatedEpisodes.map(episode => (
              <li 
                key={episode.slug}
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  background: 'var(--color-bg-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}>
                  <div style={{ flex: 1 }}>
                    <Link 
                      href={`/microbinfie/${episode.slug}`}
                      style={{
                        textDecoration: 'none',
                        color: 'var(--color-link)',
                      }}
                    >
                      <h3 style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '1.1rem',
                        color: 'inherit',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {episode.title}
                      </h3>
                    </Link>
                    {episode.excerpt && (
                      <p 
                        style={{
                          margin: '0 0 0.5rem 0',
                          color: 'var(--color-text)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                        }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(episode.excerpt) }}
                      />
                    )}
                    {episode.tags && episode.tags.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.4rem', 
                        flexWrap: 'wrap',
                        marginTop: '0.5rem',
                      }}>
                        {episode.tags
                          .filter(tag => tag.toLowerCase() !== 'microbinfie' && tag.toLowerCase() !== 'podcast')
                          .slice(0, 5)
                          .map(tag => (
                            <span
                              key={tag}
                              style={{
                                padding: '0.15rem 0.5rem',
                                fontSize: '0.75rem',
                                background: 'var(--color-bg)',
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
                    {/* SoundCloud mini player */}
                    {(() => {
                      const trackId = extractTrackId(episode.guid)
                      return trackId ? (
                        <div style={{ marginTop: '0.75rem' }}>
                          <iframe
                            width="100%"
                            height="20"
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`}
                          />
                        </div>
                      ) : null
                    })()}
                    {/* Platform icons row */}
                    {episode.link && (
                      <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0 1rem 0', alignItems: 'center', flexWrap: 'wrap' }}>
                        <a href={episode.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-link)', textDecoration: 'none', fontSize: '0.95rem', border: 'none', background: 'none', padding: 0 }}>
                          <SoundCloudIcon size={18} />
                          <span style={{ fontWeight: 500 }}>SoundCloud</span>
                        </a>
                        {episode.audioUrl && (
                          <a href={episode.audioUrl} download style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-link)', textDecoration: 'none', fontSize: '0.95rem', border: 'none', background: 'none', padding: 0 }}>
                            <DownloadIcon size={18} />
                            <span style={{ fontWeight: 500 }}>Download MP3</span>
                          </a>
                        )}
                      </div>
                    )}
                    {/* More info button */}
                    <div style={{ marginTop: '0.75rem' }}>
                      <Link 
                        href={`/microbinfie/${episode.slug}`}
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          color: 'var(--color-link)',
                          border: '1px solid var(--color-link)',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-link)'
                          e.currentTarget.style.color = 'var(--color-bg)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = 'var(--color-link)'
                        }}
                      >
                        More info →
                      </Link>
                    </div>
                  </div>
                  {episode.date && (
                    <time 
                      style={{ 
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                      }}
                      dateTime={episode.date}
                    >
                      {new Date(episode.date).toLocaleDateString('en-GB', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                  )}
                </div>
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
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  background: currentPage === 1 ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
                  color: currentPage === 1 ? 'var(--color-text-secondary)' : 'var(--color-text)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                }}
              >
                ← Previous
              </button>
              
              <span style={{ 
                color: 'var(--color-text-secondary)', 
                padding: '0 0.5rem',
                fontSize: '0.9rem',
              }}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  background: currentPage === totalPages ? 'var(--color-bg-secondary)' : 'var(--color-bg)',
                  color: currentPage === totalPages ? 'var(--color-text-secondary)' : 'var(--color-text)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                }}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      ) : (
        <div style={{
          padding: '3rem 1rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            No episodes found
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
