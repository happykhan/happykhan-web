import Link from 'next/link'
import { listMicrobinfie } from "@/lib/content.mjs"

export const metadata = {
  title: 'MicroBinfie Podcast — Happykhan',
}

const EPISODES_PER_PAGE = 20

export default async function MicrobinfieIndexPage({ searchParams }) {
  const params = await searchParams
  const page = parseInt(params?.page || '1', 10)
  const allEpisodes = await listMicrobinfie()
  
  const totalPages = Math.ceil(allEpisodes.length / EPISODES_PER_PAGE)
  const currentPage = Math.max(1, Math.min(page, totalPages))
  
  const startIndex = (currentPage - 1) * EPISODES_PER_PAGE
  const endIndex = startIndex + EPISODES_PER_PAGE
  const items = allEpisodes.slice(startIndex, endIndex)
  
  return (
    <section>
      <h1>MicroBinfie Podcast</h1>
      
      {/* Podcast Description */}
      <div style={{ 
        backgroundColor: 'var(--color-bg-secondary)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}>
          <img 
            src="/microbinfie/MAIN-LOGO.png" 
            alt="MicroBinfie Podcast Logo"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              flexShrink: 0,
              objectFit: 'cover',
            }}
          />
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Microbial Bioinformatics is a rapidly changing field marrying computer science and microbiology. 
            Join us as we share some tips and tricks we've learnt over the years. If you're a student just 
            getting to grips with the field, or someone who just wants to keep tabs on the latest and 
            greatest — this podcast is for you. 🎙️
          </p>
        </div>
        
        {/* Subscribe Section */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: '600' }}>
            Subscribe & Listen
          </h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem',
          }}>
            <a 
              href="https://soundcloud.com/microbinfie"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-link)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🎵</span>
              SoundCloud
            </a>
            <a 
              href="https://podcasts.apple.com/au/podcast/microbinfie-podcast/id1479852809"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-link)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🎧</span>
              Apple Podcasts
            </a>
            <a 
              href="https://open.spotify.com/show/2zuzT8EVxbU0yOGFDVareK"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-link)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🎶</span>
              Spotify
            </a>
            <a 
              href="/rss-microbinfie.xml"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: 'var(--color-link)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📡</span>
              RSS Feed
            </a>
          </div>
        </div>
        
        {/* Guest Info */}
        <div style={{ 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
        }}>
          <p style={{ 
            fontSize: '0.95rem', 
            color: 'var(--color-text-secondary)',
            marginBottom: '0.75rem',
          }}>
            We've had the privilege of hosting leading experts and established voices in microbial 
            bioinformatics, genomics, and computational biology.
          </p>
          <Link 
            href="/microbinfie/guests"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-link)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
            }}
          >
            View all podcast guests →
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
          Showing {startIndex + 1}–{Math.min(endIndex, allEpisodes.length)} of {allEpisodes.length} episodes
        </p>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.slug}>
            <Link href={`/microbinfie/${item.slug}`}>{item.title}</Link>
            {item.date && <span style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}>({new Date(item.date).toLocaleDateString('en-GB')})</span>}
          </li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <nav style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          alignItems: 'center', 
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          {currentPage > 1 && (
            <Link 
              href={currentPage === 2 ? '/microbinfie' : `/microbinfie?page=${currentPage - 1}`}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              ← Previous
            </Link>
          )}
          
          <span style={{ color: 'var(--color-text-secondary)', padding: '0 0.5rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage < totalPages && (
            <Link 
              href={`/microbinfie?page=${currentPage + 1}`}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </section>
  )
}
