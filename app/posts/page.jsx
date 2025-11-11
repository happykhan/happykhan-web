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

      <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
      <section aria-labelledby="license-heading" style={{ marginTop: '2rem' }}>
        <h2 id="license-heading">License</h2>
        <p>
          Unless otherwise stated, content presented here is under a{' '} 
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0 licence</a>,
          {' '}which basically means you are free to:
        </p>
        <ul>
          <li><strong>Share</strong> — copy and redistribute the material in any medium or format for any purpose, even commercially.</li>
          <li><strong>Adapt</strong> — remix, transform, and build upon the material for any purpose, even commercially.</li>
        </ul>
        <p>On the conditions:</p>
        <ul>
          <li><strong>Attribution</strong> — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.</li>
          <li><strong>ShareAlike</strong> — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.</li>
        </ul>
      </section>
    </section>
  )
}
