import { listPosts } from "@/lib/content.mjs"
import FieldNotesFilter from '@/components/FieldNotesFilter'

export const metadata = {
  title: 'Research Notes — Happykhan',
  description: 'Technical guides and essays about bioinformatics and microbial genomics',
}

export default async function FieldNotesPage() {
  const posts = await listPosts()

  return (
    <section>
      <h1>Research Notes</h1>
      <p style={{ 
        fontSize: '1.1rem', 
        lineHeight: 1.6,
        color: 'var(--color-text-secondary)',
        marginBottom: '2rem',
        borderLeft: '3px solid var(--color-primary)',
        paddingLeft: '1rem',
      }}>
        A knowledge base of technical guides and essays about science, especially bioinformatics and microbial genomics.
      </p>
      
      <FieldNotesFilter posts={posts} />
    </section>
  )
}
