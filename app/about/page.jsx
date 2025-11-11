import { readPage } from '@/lib/content.mjs'

export const metadata = {
  title: 'About - Happy Khan',
  description: 'About Nabil-Fareed Alikhan'
}

export default async function AboutPage() {
  const { frontmatter, content } = await readPage('about')
  const contact = await readPage('contact')
  
  return (
    <div className="about-container">
      <article>
        <h1>{frontmatter.title}</h1>
        {content}
      </article>
      
      <aside 
        className="contact-box"
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: 'var(--color-bg-secondary)',
          position: 'sticky',
          top: '2rem',
          marginTop: '3rem'
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>{contact.frontmatter.title || 'Contact'}</h3>
        <div style={{ fontSize: '0.95rem' }}>
          {contact.content}
        </div>
      </aside>
    </div>
  )
}
