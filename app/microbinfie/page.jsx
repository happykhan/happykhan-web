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
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        Showing {startIndex + 1}–{Math.min(endIndex, allEpisodes.length)} of {allEpisodes.length} episodes
      </p>
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
