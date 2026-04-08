
import CVStats from '@/components/CVStats'
import CVTimeline from '@/components/CVTimeline'
import SkillRatings from '@/components/SkillRatings'
import EducationCards from '@/components/EducationCards'

export const metadata = {
  title: 'Industry CV — Nabil‑Fareed Alikhan',
}

const CONTACT = {
  email: 'nabil@happykhan.com',
  website: 'https://happykhan.com',
  github: 'https://github.com/happykhan',
}

const STATS = {
  hIndex: 30,
  citations: 11369,
  yearsExperience: 15,
  softwareDownloads: 94150,
}

const EDUCATION = [
  {
    degree: 'PhD in Microbiology',
    institution: 'University of Queensland',
    period: '2010–2015',
  },
  {
    degree: 'BSc (1st Class Hons) in Microbiology',
    institution: 'University of Queensland',
    period: '2009',
  },
]

const POSITIONS = [
  {
    startYear: 2024,
    endYear: null,
    current: true,
    title: 'Senior Bioinformatician',
    organization: 'Centre for Genomic Pathogen Surveillance, University of Oxford',
    description: 'Lead development of PathogenWatch, AMRwatch, and vaccines.watch: web platforms integrating over 620,000 pathogen genomes for global AMR surveillance, used by public health agencies in 90+ countries. Build and maintain production ETL pipelines processing genomic, epidemiological, and metadata across heterogeneous data sources. Architect systems for FAIR data delivery.',
    highlights: [
      'PathogenWatch / AMRwatch / vaccines.watch — 620,000+ genomes, 90+ countries',
      'Production ETL pipelines across heterogeneous genomic and metadata sources',
      'Stack: Python, JavaScript, Docker, HPC, AWS/GCP, Nextflow, NF-core',
    ],
  },
  {
    startYear: 2018,
    endYear: 2023,
    current: false,
    title: 'Bioinformatics Scientific Programmer / Interim Head of Informatics',
    organization: 'Quadram Institute Bioscience',
    description: 'Ran computational infrastructure for a team of 20+ scientists. Built high-throughput pipelines for COG-UK: released 80,000+ SARS-CoV-2 genomes through infrastructure I designed and maintained. Developed CoronaHiT (Genome Medicine 2021) and RonaQC for national surveillance. Managed grants and infrastructure totalling over £5M.',
    highlights: [
      'COG-UK pipeline: 80,000+ SARS-CoV-2 genomes released, results fed UK government briefings',
      'CoronaHiT sequencing workflow adopted nationally (Genome Medicine 2021)',
      'HPC cluster management and cloud migration to CLIMB-BIG-DATA (£1.9M MRC)',
      'Led CI/CD, automated testing, and containerisation (Docker/Singularity) standards',
    ],
  },
  {
    startYear: 2014,
    endYear: 2018,
    current: false,
    title: 'Senior Research Fellow / Research Fellow in Pathogen Bioinformatics',
    organization: 'University of Warwick',
    description: 'Built comparative genomics pipelines for Salmonella, E. coli, and Campylobacter at population scale. Co-developed EnteroBase: analytical infrastructure for 400,000+ bacterial genomes. Co-developed GrapeTree (Genome Research 2018), a visualisation tool for large-scale population structure.',
    highlights: [
      'EnteroBase: 400,000+ bacterial genomes, standard tool in molecular epidemiology',
      'GrapeTree: population structure visualisation (Genome Research 2018)',
      'Comparative genomics pipelines at national surveillance scale',
    ],
  },
]

const SKILLS = [
  {
    name: 'Pipeline Development',
    items: [
      { label: 'Nextflow / NF-core', rating: 5 },
      { label: 'Snakemake', rating: 4 },
      { label: 'Shell scripting', rating: 5 },
    ],
  },
  {
    name: 'Languages',
    items: [
      { label: 'Python', rating: 5 },
      { label: 'JavaScript', rating: 4 },
      { label: 'Bash', rating: 5 },
      { label: 'R', rating: 3 },
      { label: 'Java', rating: 3 },
    ],
  },
  {
    name: 'Infrastructure',
    items: [
      { label: 'HPC (SLURM)', rating: 5 },
      { label: 'Docker / Singularity', rating: 5 },
      { label: 'AWS', rating: 4 },
      { label: 'GCP', rating: 3 },
      { label: 'Linux admin', rating: 5 },
    ],
  },
  {
    name: 'Data & Dev Practices',
    items: [
      { label: 'PostgreSQL / ETL', rating: 4 },
      { label: 'REST APIs', rating: 4 },
      { label: 'Git / GitHub Actions', rating: 5 },
      { label: 'pytest / CI', rating: 4 },
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

const PROFILE = 'Senior bioinformatician and software engineer with 15 years of experience building production-grade pipelines and analytical platforms for large-scale genomic data. I have developed and deployed tools used by thousands of researchers worldwide, led computational infrastructure for national genomic surveillance programmes, and worked directly with biologists, epidemiologists, and public health agencies to translate sequence data into usable outputs. My background spans Python, JavaScript, NF-core/Nextflow, HPC, cloud infrastructure, and full-stack web development.'

export default function IndustryCVPage() {
  return (
    <article>
      <h1>Industry CV</h1>

      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--card-meta)' }}>
          <span style={{ marginRight: '1.2rem' }}><b>Email:</b> <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--card-title)' }}>{CONTACT.email}</a></span>
          <span style={{ marginRight: '1.2rem' }}><b>Website:</b> <a href={CONTACT.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--card-title)' }}>{CONTACT.website.replace('https://', '')}</a></span>
          <span><b>GitHub:</b> <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--card-title)' }}>{CONTACT.github.replace('https://github.com/', '')}</a></span>
        </div>
      </div>

      <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
        {PROFILE}
      </p>

      <CVStats stats={STATS} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Education</h2>
      <EducationCards education={EDUCATION} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Experience</h2>
      <CVTimeline positions={POSITIONS} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Key Projects</h2>
      <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--card-border)' }}>
              {['Project', 'Scale', 'Stack', 'Outcome'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--card-title)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--card-border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: 'var(--card-title)' }}>{p.name}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--card-meta)' }}>{p.scale}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--card-meta)', fontFamily: 'monospace', fontSize: '0.82rem' }}>{p.stack}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{p.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>Technical Skills</h2>
      <SkillRatings skills={SKILLS} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Selected Publications</h2>
      <ul style={{ fontSize: '0.9rem', lineHeight: '1.7', paddingLeft: '1.2rem', color: 'var(--color-text-secondary)' }}>
        <li>Alikhan et al. CoronaHiT: high-throughput sequencing of SARS-CoV-2 genomes. <em>Genome Medicine</em> 2021</li>
        <li>Page et al. GrapeTree: visualisation of core genomes at scale. <em>Genome Research</em> 2018</li>
        <li>Alikhan et al. BRIG: BLAST Ring Image Generator. <em>BMC Genomics</em> 2011 — 3,000+ citations</li>
      </ul>

      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--card-meta)' }}>
        Full publication list: <a href="https://scholar.google.com/citations?user=qP5cpssAAAAJ" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--card-title)' }}>Google Scholar</a>
        {' · '}
        <a href="/cv" style={{ color: 'var(--card-title)' }}>Full academic CV</a>
        {' · '}
        <a href="/cv-print-ind" style={{ color: 'var(--card-title)' }}>Print version</a>
      </p>
    </article>
  )
}
