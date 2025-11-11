'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PublicationCard from '@/components/PublicationCard'

export default function PublicationsClient({ publications }) {
  const searchParams = useSearchParams()
  const [filterText, setFilterText] = useState('')
  
  // Pre-fill search from URL parameter
  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      setFilterText(searchQuery)
    }
  }, [searchParams])
  
  const filteredPubs = publications.filter(record => {
    const tags = record.entryTags
    const searchText = filterText.toLowerCase()
    
    return (
      tags.title?.toLowerCase().includes(searchText) ||
      tags.journal?.toLowerCase().includes(searchText) ||
      tags.year?.toLowerCase().includes(searchText) ||
      tags.abstract?.toLowerCase().includes(searchText) ||
      tags.author?.toLowerCase().includes(searchText)
    )
  })
  
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <h1>Publications</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search publications..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text)'
          }}
        />
      </div>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        Showing {filteredPubs.length} of {publications.length} publications
      </p>
      
      <div>
        {filteredPubs.map((record) => (
          <PublicationCard
            key={record.citationKey}
            {...record.entryTags}
          />
        ))}
      </div>
    </div>
  )
}
