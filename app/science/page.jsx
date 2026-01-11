import { readPage } from '@/lib/content.mjs'
import CodeBlockWrapper from '@/components/CodeBlockWrapper'
import ImpactCarousel from './ImpactCarousel'
import './science.css'

export async function generateMetadata() {
  const { frontmatter } = await readPage('science')
  return {
    title: frontmatter.title || 'Science',
    description: frontmatter.description || 'Research vision and impact.',
  }
}

export default async function SciencePage() {
  const { frontmatter, content } = await readPage('science')
  
  return (
    <div className="science-page">

      {/* Main Content from Markdown (Vision) */}
      <section className="vision-section" style={{ borderTop: 'none', padding: '0' }}>
        <CodeBlockWrapper>
          {content}
        </CodeBlockWrapper>
      </section>

      {/* Impact Carousel sourced from Frontmatter */}
      {frontmatter.vignettes && frontmatter.vignettes.length > 0 && (
        <div className="impact-section">
          <h2>Selected Contributions</h2>
          <p>
            A selection of tools, platforms, and projects that make large-scale microbial genomics usable in research, public health, and teaching.
          </p>
          <ImpactCarousel vignettes={frontmatter.vignettes} />
        </div>
      )}

      <footer className="cred-footer">
        <h3>Interested in collaborating?</h3>
        <ul className="cred-collab">
          <li>If you are building national genomic surveillance systems...</li>
          <li>If you need to interpret & visualize complex population datasets...</li>
          <li>If you are looking for experienced bioinformatics leadership...</li>
        </ul>
        <a href="mailto:nabil@happykhan.com" className="btn btn-primary">
          Get in touch
        </a>
        
        <div className="cred-links">
          <a href="https://scholar.google.com/citations?user=BpzrleYAAAAJ&hl" target="_blank" rel="noopener noreferrer">Google Scholar</a>
          <a href="https://github.com/happykhan" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://orcid.org/0000-0002-1243-0767" target="_blank" rel="noopener noreferrer">ORCID</a>
        </div>
      </footer>
    </div>
  )
}
