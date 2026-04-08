import PrintButton from '../cv-print/PrintButton'

// --- Inline Layout Components (same as cv-print) ---

const Section = ({ title, children }) => {
  if (!children) return null
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2 style={{
        fontSize: '12pt',
        textTransform: 'uppercase',
        borderBottom: '1px solid #333',
        paddingBottom: '2px',
        marginBottom: '0.8rem',
        marginTop: '1.5rem',
        letterSpacing: '0.05em',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

const Entry = ({ left, right, title, subtitle, details, titleStyle = {} }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '0.8rem', pageBreakInside: 'avoid' }}>
    <div style={{ fontSize: '9pt', color: '#666', fontWeight: 500 }}>{left}</div>
    <div>
      <div style={{ fontSize: '10pt', fontWeight: 700, color: '#000', ...titleStyle }}>
        {title}
        {right && <span style={{ float: 'right', fontSize: '9pt', fontWeight: 400, color: '#444' }}>{right}</span>}
      </div>
      {subtitle && <div style={{ fontSize: '9pt', fontStyle: 'italic', marginBottom: '0.1rem' }}>{subtitle}</div>}
      {details && <div style={{ fontSize: '9pt', color: '#333' }}>{details}</div>}
    </div>
  </div>
)

// --- Hardcoded Industry Content ---

const PROFILE = 'Senior bioinformatician and software engineer with 15 years of experience building production-grade pipelines and analytical platforms for large-scale genomic data. Developed and deployed tools used by thousands of researchers worldwide, led computational infrastructure for national genomic surveillance programmes, and worked directly with biologists, epidemiologists, and public health agencies to translate sequence data into usable outputs. Background spans Python, JavaScript, NF-core/Nextflow, HPC, cloud infrastructure, and full-stack web development.'

const CONTACT = { email: 'nabil@happykhan.com', website: 'https://happykhan.com', github: 'https://github.com/happykhan', location: 'Oxford, UK' }

const EDUCATION = [
  { period: '2010–2015', degree: 'PhD in Microbiology', institution: 'University of Queensland' },
  { period: '2009', degree: 'BSc (1st Class Hons) in Microbiology', institution: 'University of Queensland' },
]

const POSITIONS = [
  {
    period: '2024–Present',
    title: 'Senior Bioinformatician',
    org: 'Centre for Genomic Pathogen Surveillance, University of Oxford',
    bullets: [
      'Lead development of PathogenWatch, AMRwatch, and vaccines.watch: web platforms integrating over 620,000 pathogen genomes for global AMR surveillance, used by public health agencies in 90+ countries',
      'Build and maintain production ETL pipelines processing genomic, epidemiological, and metadata across heterogeneous data sources',
      'Architect systems for FAIR data delivery: standardised outputs consumable by downstream analytical and reporting tools',
      'Stack: Python, JavaScript, Docker, HPC, cloud (AWS/GCP), Nextflow, NF-core',
    ],
  },
  {
    period: '2018–2023',
    title: 'Bioinformatics Scientific Programmer / Interim Head of Informatics',
    org: 'Quadram Institute Bioscience',
    bullets: [
      'Ran computational infrastructure for a team of 20+ scientists; responsible for pipeline deployment, HPC cluster management, and cloud migration (CLIMB-BIG-DATA, £1.9M MRC)',
      'Built high-throughput processing pipelines for COG-UK: released 80,000+ SARS-CoV-2 genomes through infrastructure I designed and maintained; results contributed to UK government briefings',
      'Developed CoronaHiT (Genome Medicine 2021), an Illumina-based SARS-CoV-2 sequencing workflow adopted nationally; developed RonaQC, a QC pipeline for national surveillance',
      'Led automated testing, CI/CD, and containerisation (Docker/Singularity) standards across the informatics team',
    ],
  },
  {
    period: '2014–2018',
    title: 'Senior Research Fellow / Research Fellow in Pathogen Bioinformatics',
    org: 'University of Warwick',
    bullets: [
      'Built comparative genomics pipelines for Salmonella, E. coli, and Campylobacter at population scale',
      'Co-developed EnteroBase: analytical infrastructure for 400,000+ bacterial genomes; co-developed GrapeTree (Genome Research 2018), a visualisation tool for large-scale population structure',
    ],
  },
]

const PROJECTS = [
  { name: 'COG-UK pipeline (CoronaHiT / RonaQC)', scale: '80,000+ genomes', stack: 'Python, Nextflow, Docker, HPC', outcome: 'National SARS-CoV-2 surveillance' },
  { name: 'AMRwatch', scale: '620,000+ genomes', stack: 'Python, JS, PostgreSQL, cloud', outcome: 'Used by WHO/ECDC-adjacent agencies' },
  { name: 'EnteroBase', scale: '400,000+ genomes', stack: 'Python, HPC, web', outcome: 'Standard tool in molecular epidemiology' },
  { name: 'BRIG', scale: '94,000+ downloads', stack: 'Java', outcome: '3,000+ citations, taught in universities' },
  { name: 'PathogenWatch', scale: 'Multi-pathogen, cloud', stack: 'JS, Python, cloud', outcome: 'Production platform, CGPS flagship' },
]

const SKILLS = [
  { category: 'Pipeline development', detail: 'Nextflow, NF-core, Snakemake, shell scripting' },
  { category: 'Languages', detail: 'Python (expert), JavaScript (proficient), R, Bash, Java' },
  { category: 'Infrastructure', detail: 'HPC (SLURM), Docker, Singularity, AWS, GCP, Linux server admin' },
  { category: 'Data', detail: 'PostgreSQL, ETL design, FAIR data principles, REST APIs' },
  { category: 'Dev practices', detail: 'Git, CI/CD (GitHub Actions), automated testing (pytest), code review, Agile' },
  { category: 'Bioinformatics', detail: 'Genome assembly, read mapping, phylogenetics, population genomics, metagenomics, transcriptomics' },
]

const PUBLICATIONS = [
  { authors: 'Alikhan et al.', title: 'CoronaHiT: high-throughput sequencing of SARS-CoV-2 genomes', journal: 'Genome Medicine', year: '2021' },
  { authors: 'Page et al.', title: 'GrapeTree: visualisation of core genomes at scale', journal: 'Genome Research', year: '2018' },
  { authors: 'Alikhan et al.', title: 'BRIG: BLAST Ring Image Generator', journal: 'BMC Genomics', year: '2011', note: '3,000+ citations' },
]

// --- Page Component ---

export const metadata = {
  title: 'Industry CV (Print) — Nabil‑Fareed Alikhan',
}

export default function PrintIndCVPage() {
  return (
    <div className="print-cv">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" />
      <style>{`
        body {
          background: white !important;
          color: black !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }
        body > header, body > footer, .mobile-nav, nav.desktop-nav {
          display: none !important;
        }
        @page { margin: 1cm; size: A4; }
        .print-cv {
          max-width: 21cm;
          margin: 0 auto;
          padding: 0;
          background: white;
          font-family: inherit;
          line-height: 1.4;
          color: #000;
        }
        a { text-decoration: none; color: inherit; }
        h1, h2, h3, p { margin: 0; }
        .cv-content { padding: 0 2rem 2rem 2rem; }
        @media print {
          .print-cv { margin: 0; width: 100%; max-width: none; }
          .cv-content { padding: 0 2rem; }
          body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print" style={{
        position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000,
        background: 'white', padding: '1rem', border: '1px solid #ddd',
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <PrintButton />
      </div>

      {/* Header - same dark navy banner as cv-print */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1.2rem 2rem',
        marginBottom: '1.2rem',
        borderBottom: '5px solid #34495e',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Nabil-Fareed Alikhan
          </h1>
          <p style={{ marginTop: '0.4rem', fontSize: '9.5pt', opacity: 0.9, maxWidth: '800px', lineHeight: 1.4, fontWeight: 300 }}>
            {PROFILE}
          </p>
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: '8.5pt',
          borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.6rem',
        }}>
          <span style={{ display: 'inline-flex', gap: '0.4rem' }}><span style={{ opacity: 0.7 }}>Email:</span><span style={{ fontWeight: 500 }}>{CONTACT.email}</span></span>
          <span style={{ display: 'inline-flex', gap: '0.4rem' }}><span style={{ opacity: 0.7 }}>Website:</span><span style={{ fontWeight: 500 }}>{CONTACT.website.replace('https://', '')}</span></span>
          <span style={{ display: 'inline-flex', gap: '0.4rem' }}><span style={{ opacity: 0.7 }}>GitHub:</span><span style={{ fontWeight: 500 }}>{CONTACT.github.replace('https://github.com/', '')}</span></span>
          <span style={{ display: 'inline-flex', gap: '0.4rem' }}><span style={{ opacity: 0.7 }}>Location:</span><span style={{ fontWeight: 500 }}>{CONTACT.location}</span></span>
        </div>
      </header>

      <div className="cv-content">

        <Section title="Education">
          {EDUCATION.map((edu, i) => (
            <Entry key={i} left={edu.period} title={edu.degree} subtitle={edu.institution} />
          ))}
        </Section>

        <Section title="Professional Experience">
          {POSITIONS.map((pos, i) => (
            <div key={i} style={{ marginBottom: '1rem', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <div style={{ fontSize: '9pt', color: '#666', fontWeight: 500, paddingTop: '0.1rem' }}>{pos.period}</div>
                <div>
                  <div style={{ fontSize: '10pt', fontWeight: 700, color: '#000' }}>{pos.title}</div>
                  <div style={{ fontSize: '9pt', fontStyle: 'italic', marginBottom: '0.3rem', color: '#444' }}>{pos.org}</div>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '9pt', color: '#333', lineHeight: 1.55 }}>
                    {pos.bullets.map((b, j) => <li key={j} style={{ marginBottom: '0.15rem' }}>{b}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </Section>

        <Section title="Key Projects">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8.5pt' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ccc' }}>
                {['Project', 'Scale', 'Stack', 'Outcome'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '3px 6px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ padding: '3px 6px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '3px 6px', color: '#555' }}>{p.scale}</td>
                  <td style={{ padding: '3px 6px', color: '#555', fontFamily: 'monospace' }}>{p.stack}</td>
                  <td style={{ padding: '3px 6px', color: '#333' }}>{p.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Technical Skills">
          <ul style={{ fontSize: '9.5pt', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
            {SKILLS.map((s, i) => (
              <li key={i} style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700 }}>{s.category}:</span> {s.detail}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Selected Publications">
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {PUBLICATIONS.map((pub, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', fontSize: '9pt', pageBreakInside: 'avoid' }}>
                <span style={{ fontWeight: 600 }}>{pub.title}</span>. {pub.authors}. <span style={{ fontStyle: 'italic' }}>{pub.journal}</span> ({pub.year}){pub.note ? ` — ${pub.note}` : ''}.
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '8.5pt', color: '#666', marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
            Full list: scholar.google.com/citations?user=qP5cpssAAAAJ · h-index 30, 11,369 citations, 49 publications
          </p>
        </Section>

      </div>
    </div>
  )
}
