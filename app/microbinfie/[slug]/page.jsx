import { listMicrobinfie, readMicrobinfie } from "@/lib/content.mjs"
import CodeBlockWrapper from '@/components/CodeBlockWrapper'
import GuestCard from '@/components/GuestCard'
import { SoundCloudIcon, ApplePodcastsIcon, SpotifyIcon, RSSIcon, DownloadIcon } from '@/components/PodcastPlatformIcons'

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
  
  // Extract SoundCloud track ID from GUID (format: tag:soundcloud,2010:tracks/679080552)
  let trackId = null
  if (frontmatter.guid) {
    const guidMatch = frontmatter.guid.match(/tracks\/(\d+)/)
    if (guidMatch) {
      trackId = `soundcloud%3Atracks%3A${guidMatch[1]}`
    }
  }
  
  return (
    <article>
      <h1>{frontmatter.title || slug}</h1>
      
      {/* Episode Info Box */}
      <div style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Date and Duration */}
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          flexWrap: 'wrap',
          marginBottom: '1rem',
          fontSize: '0.95rem',
          color: 'var(--color-text-secondary)',
        }}>
          {frontmatter.date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span>
              <span>{new Date(frontmatter.date).toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          )}
          {frontmatter.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⏱️</span>
              <span>{frontmatter.duration}</span>
            </div>
          )}
          {frontmatter.author && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎙️</span>
              <span>{frontmatter.author}</span>
            </div>
          )}
        </div>

        {/* SoundCloud Player */}
        {trackId && (
          <div style={{ marginBottom: '1.5rem' }}>
            <iframe 
              width="100%" 
              height="166" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
              style={{ border: 'none', borderRadius: '4px' }}
            />
          </div>
        )}

        {/* Guests Section */}
        {frontmatter.guests && frontmatter.guests.length > 0 && (
          <div style={{
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>👥</span>
              <span>Guest{frontmatter.guests.length > 1 ? 's' : ''}</span>
            </h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem' 
            }}>
              {frontmatter.guests.map((guest, index) => (
                <GuestCard key={index} guest={guest} />
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)',
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          {frontmatter.link && (
            <a
              href={frontmatter.link}
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
                fontSize: '0.9rem',
              }}
            >
              <SoundCloudIcon size={20} />
              <span>Listen on SoundCloud</span>
            </a>
          )}
          {frontmatter.audioUrl && (
            <a
              href={frontmatter.audioUrl}
              download
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
                fontSize: '0.9rem',
              }}
            >
              <DownloadIcon size={20} />
              <span>Download MP3</span>
            </a>
          )}
          {frontmatter.transcript && (
            <a
              href={frontmatter.transcript}
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
                fontSize: '0.9rem',
              }}
            >
              <span role="img" aria-label="Transcript">📝</span>
              <span>View Transcript</span>
            </a>
          )}
        </div>
      </div>

      {/* Episode Content */}
      <CodeBlockWrapper>
        {content}
      </CodeBlockWrapper>
    </article>
  )
}
