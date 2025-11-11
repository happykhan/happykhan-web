export const metadata = {
  title: 'Software - Happy Khan',
  description: 'My Software Projects'
}

const softwareList = [
  {
    title: "Enterobase",
    description:
      "EnteroBase aims to establish a world-class, one-stop, user-friendly, backwards-compatible but forward-looking genome database, Enterobase – together with a set of web-based tools, EnteroBase Backend Pipeline – to enable bacteriologists to identify, analyse, quantify and visualise genomic variation",
    url: "https://enterobase.warwick.ac.uk/",
  },
  {
    title: "GrapeTree",
    description:
      "GrapeTree is a stand-alone program that provides bioinformaticians with a tool for rapidly investigating the relationships of genomes of interest by NJ or minimal spanning trees of SNPs or MLST data.",
    url: "https://github.com/achtman-lab/GrapeTree",
  },
  {
    title: "BLAST Ring Image Generator (BRIG)",
    description:
      "BRIG is a free cross-platform (Windows/Mac/Unix) application that can display circular comparisons between a large number of genomes, with a focus on handling genome assembly data.",
    url: "http://brig.sourceforge.net/",
  },
]

export default function SoftwarePage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <h1>Software</h1>
      
      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
        {softwareList.map((software) => (
          <div 
            key={software.title}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg-secondary)'
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>
              <a 
                href={software.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
              >
                {software.title}
              </a>
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
              {software.description}
            </p>
            <a 
              href={software.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-bg)',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              Visit website
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
