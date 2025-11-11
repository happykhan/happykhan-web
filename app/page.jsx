import { listPosts } from '@/lib/content.mjs'
import { listMicrobinfie } from '@/lib/content.mjs'
import { getPublications } from '@/lib/publications.mjs'
import Image from 'next/image'

const baseBtn = {
  display: 'inline-block',
  padding: '0.6rem 1rem',
  borderRadius: 8,
  textDecoration: 'none',
  fontWeight: 600,
  border: '1px solid var(--color-border)',
  transition: 'all 0.2s',
};

const primaryBtn = {
  ...baseBtn,
  background: 'var(--color-primary)',
  color: 'var(--color-bg)',
  border: 'none',
};

const secondaryBtn = {
  ...baseBtn,
  background: 'transparent',
  color: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
};

const iconLink = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  transition: 'all 0.2s',
};

// Seeded random number generator using date
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get a random item from array based on date seed
function getRandomItemByDate(items, offset = 0) {
  if (!items || items.length === 0) return null;
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + offset;
  const randomIndex = Math.floor(seededRandom(seed) * items.length);
  return items[randomIndex];
}

export default async function HomePage() {
  // Fetch all content
  const posts = await listPosts()
  const podcasts = await listMicrobinfie()
  const publications = await getPublications()
  
  // Get random featured items (using different offsets for variety)
  const featuredPost = getRandomItemByDate(posts, 0)
  const featuredPodcast = getRandomItemByDate(podcasts, 1)
  const featuredPaper = getRandomItemByDate(publications, 2)

  return (
    <section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }} className="home-layout">
        <div>
          <header style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              {/* Circular cartoon avatar */}
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <Image 
                  src="/images/avatar-cartoon.png"
                  alt="Nabil-Fareed Alikhan cartoon avatar"
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '1.15rem', lineHeight: '1.7' }}>
                Bioinformatics researcher and software developer specialising in microbial genomics. I build widely used open-source tools, publish peer-reviewed research, and co-host the MicroBinfie podcast. My work is recognised across the bacterial genomics community for its focus on practical, open science.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <a href="/software" style={secondaryBtn}>Software</a>
              <a href="/cv" style={secondaryBtn}>CV</a>
              <a href="/science" style={secondaryBtn}>Science</a>
            </div>

            {/* Social Links - Mobile inline */}
            <div className="social-inline" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="https://github.com/happykhan" aria-label="GitHub" style={iconLink}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.05.66-3.69-1.3-3.69-1.3-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.07-.67.07-.67 1.1.08 1.68 1.12 1.68 1.12.98 1.66 2.57 1.18 3.19.9.1-.71.38-1.18.69-1.45-2.43-.28-4.99-1.21-4.99-5.39 0-1.19.43-2.16 1.12-2.92-.11-.28-.48-1.42.11-2.95 0 0 .91-.29 2.98 1.11.86-.24 1.78-.36 2.7-.36s1.84.12 2.7.36c2.07-1.4 2.98-1.11 2.98-1.11.59 1.53.22 2.67.11 2.95.69.76 1.12 1.73 1.12 2.92 0 4.19-2.57 5.11-5.01 5.39.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.03 0 .29.2.64.76.53A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/>
                </svg>
              </a>
              <a href="https://mstdn.science/@happykhan" aria-label="Mastodon" rel="me" style={iconLink}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M23.193 7.879c0-5.206-3.411-6.732-3.411-6.732C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.411 1.526-3.411 6.732 0 1.192-.023 2.618.015 4.129.124 5.092.934 10.109 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.15 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.517-2.665.475-6.507.475-6.507zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.801.776-1.801 2.312v3.349h-2.483v-3.35c0-1.536-.601-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.944v6.119H4.832V8.284c0-1.289.328-2.313.987-3.07.679-.757 1.568-1.146 2.673-1.146 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.043c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.389 2.673 1.146.658.757.986 1.781.986 3.07v6.304z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/nabil-fareed-alikhan/" aria-label="LinkedIn" style={iconLink}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M6.94 8.56H4.17v8.37h2.77V8.56zM5.55 7.07a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69A1.69 1.69 0 0 0 3.86 5.4c0 .93.76 1.68 1.69 1.68zM19.62 16.93v-4.93c0-2.64-1.42-3.86-3.32-3.86-1.53 0-2.22.84-2.6 1.43v-1.22h-2.79v8.58h2.79v-4.76c0-1.26.24-2.48 1.8-2.48 1.53 0 1.55 1.43 1.55 2.56v4.68h2.57z"/>
                </svg>
              </a>
            </div>
          </header>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: 0 }}>What's on this site</h2>
        <ul style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
          <li><strong><a href='posts/'>Research notes</a></strong> – My technical guides and essays on bioinformatics and microbial genomics, including popular posts on <a href="/posts/binfie-guide-serovar"><i>Salmonella</i> serotyping</a> and <a href="/posts/ggtree-start">phylogenetic visualization with R (ggtree)</a></li>
          <li><strong><a href='microbinfie/'>MicroBinfie podcast</a></strong> – A searchable catalogue of past episodes. The podcast explores the fast-evolving field of microbial bioinformatics — where computer science meets microbiology — sharing insights, tips, and trends for both newcomers and experts.</li>
          <li><strong><a href='publications/'>Publications</a></strong> – My peer-reviewed research papers. Searchable, with full PDfs</li>
          <li><strong><a href='software/'>Software</a></strong> – Free and open-source tools for genomic analysis I have co-developed</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', marginTop: 0 }}>Today's picks</h2>
        <div style={{ display: 'grid', gap: '1.25rem' }} className="picks-grid">
          
          {/* Featured Post */}
          {featuredPost && (
            <a href={`/posts/${featuredPost.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                height: '100%',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                background: 'var(--color-bg)',
              }}
              className="feature-card">
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Research Note
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
                  {featuredPost.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  {featuredPost.date && new Date(featuredPost.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </a>
          )}

          {/* Featured Podcast */}
          {featuredPodcast && (
            <a href={`/microbinfie/${featuredPodcast.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                height: '100%',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                background: 'var(--color-bg)',
              }}
              className="feature-card">
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  MicroBinfie Podcast
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
                  {featuredPodcast.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  {featuredPodcast.date && new Date(featuredPodcast.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </a>
          )}

          {/* Featured Paper */}
          {featuredPaper && featuredPaper.entryTags && (
            <a href={`/publications?search=${encodeURIComponent(
              featuredPaper.entryTags.title
                ?.replace(/[{}]/g, '')
                .split(' ')
                .slice(0, 3)
                .join(' ')
            )}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                height: '100%',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                background: 'var(--color-bg)',
              }}
              className="feature-card">
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Publication
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>
                  {featuredPaper.entryTags.title?.replace(/[{}]/g, '')}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  {featuredPaper.entryTags.journal} ({featuredPaper.entryTags.year})
                </p>
              </div>
            </a>
          )}

            </div>
          </div>
        </div>

        {/* Social Media Links Sidebar - Desktop only */}
        <div className="social-sidebar" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem',
          padding: '1rem',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          background: 'var(--color-bg)',
          alignSelf: 'start',
          position: 'sticky',
          top: '1rem'
        }}>
          <a href="https://github.com/happykhan" aria-label="GitHub" style={iconLink}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.05.66-3.69-1.3-3.69-1.3-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.07-.67.07-.67 1.1.08 1.68 1.12 1.68 1.12.98 1.66 2.57 1.18 3.19.9.1-.71.38-1.18.69-1.45-2.43-.28-4.99-1.21-4.99-5.39 0-1.19.43-2.16 1.12-2.92-.11-.28-.48-1.42.11-2.95 0 0 .91-.29 2.98 1.11.86-.24 1.78-.36 2.7-.36s1.84.12 2.7.36c2.07-1.4 2.98-1.11 2.98-1.11.59 1.53.22 2.67.11 2.95.69.76 1.12 1.73 1.12 2.92 0 4.19-2.57 5.11-5.01 5.39.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.03 0 .29.2.64.76.53A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/>
            </svg>
          </a>
          <a href="https://mstdn.science/@happykhan" aria-label="Mastodon" rel="me" style={iconLink}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M23.193 7.879c0-5.206-3.411-6.732-3.411-6.732C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.411 1.526-3.411 6.732 0 1.192-.023 2.618.015 4.129.124 5.092.934 10.109 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.15 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.517-2.665.475-6.507.475-6.507zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.801.776-1.801 2.312v3.349h-2.483v-3.35c0-1.536-.601-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.944v6.119H4.832V8.284c0-1.289.328-2.313.987-3.07.679-.757 1.568-1.146 2.673-1.146 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.043c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.389 2.673 1.146.658.757.986 1.781.986 3.07v6.304z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/nabil-fareed-alikhan/" aria-label="LinkedIn" style={iconLink}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M6.94 8.56H4.17v8.37h2.77V8.56zM5.55 7.07a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69A1.69 1.69 0 0 0 3.86 5.4c0 .93.76 1.68 1.69 1.68zM19.62 16.93v-4.93c0-2.64-1.42-3.86-3.32-3.86-1.53 0-2.22.84-2.6 1.43v-1.22h-2.79v8.58h2.79v-4.76c0-1.26.24-2.48 1.8-2.48 1.53 0 1.55 1.43 1.55 2.56v4.68h2.57z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

