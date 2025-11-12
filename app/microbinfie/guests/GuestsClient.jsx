'use client'

import Link from 'next/link'

export default function GuestsClient({ guests }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}>
          Podcast Guests
        </h1>
        <p style={{ 
          fontSize: '1.1rem',
          color: 'var(--color-text-secondary)',
        }}>
          All guests who have appeared on the MicroBinFie podcast
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
      }}>
        {guests.map(({ guest, episodes }) => (
          <div
            key={guest.name}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg-secondary)',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                }}>
                  {guest.url ? (
                    <a 
                      href={guest.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)'
                      }}
                    >
                      {guest.name}
                    </a>
                  ) : (
                    <span>{guest.name}</span>
                  )}
                </h3>
                {guest.affiliation && (
                  <p style={{ 
                    fontSize: '0.9rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.5rem',
                  }}>
                    {guest.affiliation}
                  </p>
                )}
              </div>
              
              <div style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                flexShrink: 0,
                marginLeft: '1rem',
              }}>
                {episodes.length}
              </div>
            </div>

            <details style={{ marginTop: '1rem' }}>
              <summary style={{ 
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span>▸</span>
                {episodes.length} {episodes.length === 1 ? 'appearance' : 'appearances'}
              </summary>
              
              <ul style={{ 
                marginTop: '0.75rem',
                paddingLeft: '1.5rem',
                listStyle: 'none',
              }}>
                {episodes.map((episode) => (
                  <li key={episode.slug} style={{ marginBottom: '0.5rem' }}>
                    <Link 
                      href={`/microbinfie/${episode.slug}`}
                      style={{
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)'
                      }}
                    >
                      {episode.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
        
        {guests.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 1rem',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: '1.1rem' }}>
              No guests have been tagged yet. Add guest information to episode frontmatter to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
