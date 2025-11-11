import { Suspense } from 'react'
import { getPublications } from '@/lib/publications.mjs'
import PublicationsClient from '@/components/PublicationsClient'

export const metadata = {
  title: 'Publications - Happy Khan',
  description: 'Academic publications and research papers'
}

export default async function PublicationsPage() {
  const publications = await getPublications()
  
  // Sort by year descending (most recent first)
  const sorted = publications.sort((a, b) => {
    const yearA = parseInt(a.entryTags?.year || '0')
    const yearB = parseInt(b.entryTags?.year || '0')
    return yearB - yearA
  })
  
  return (
    <Suspense fallback={<div>Loading publications…</div>}>
      <PublicationsClient publications={sorted} />
    </Suspense>
  )
}
