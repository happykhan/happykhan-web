import { getCVYamlData, getConferencePresentationsData } from '@/lib/content.mjs'
import { getPublications, sortPublications } from '@/lib/publications.mjs'
import PrintButton from './PrintButton'

// --- Formatting Helpers ---

// Clean TeX/BibTeX artifacts
function cleanTex(text) {
    if (!text) return ''
    return text
      .replace(/[\{\}]/g, '') // remove curly braces
      .replace(/\\&/g, '&')
      .replace(/\\%/g, '%')
      .replace(/\\textit/g, '')
      .replace(/\\textbf/g, '')
      .replace(/\\emph/g, '')
      .replace(/\\textbraceleft/g, '')
      .replace(/\\textbraceright/g, '')
      .replace('--', '–')
      .replace('---', '—')
      .replace(/\\['"`^~]/g, '')
}

// Convert "YYYY-MM-DD" to "Jan 2026"
function formatDate(dateStr) {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr // Return original if not a valid date
        return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(date)
    } catch (e) {
        return dateStr
    }
}

// Format "First Last, First Last" -> "First Last, et al." if > 3
function formatAuthors(authorsStr) {
    if (!authorsStr) return ''
    const clean = cleanTex(authorsStr).replace(/ and /g, ', ')
    const authors = clean.split(',').map(a => a.trim())
    
    if (authors.length > 3) {
        return `${authors[0]}, et al.`
    }
    return clean
}

// --- Components for Print Layout ---

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
                letterSpacing: '0.05em'
            }}>
                {title}
            </h2>
            {children}
        </section>
    )
}

const Entry = ({ left, right, title, subtitle, details, titleStyle = {} }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', marginBottom: '0.8rem', pageBreakInside: 'avoid' }}>
            <div style={{ fontSize: '9pt', color: '#666', fontWeight: 500 }}>
                {left}
            </div>
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
}

const PublicationItem = ({ entry }) => {
    const { title, author, journal, year, volume, doi, url } = entry.entryTags
    
    const cleanTitle = cleanTex(title)
    const formattedAuthors = formatAuthors(author)
    const cleanJournal = cleanTex(journal) || entry.entryTags.archivePrefix || 'Preprint'
    
    return (
        <li style={{ marginBottom: '0.6rem', fontSize: '9pt', pageBreakInside: 'avoid' }}>
            <span style={{ fontWeight: 600 }}>{cleanTitle}</span>. {' '}
            {formattedAuthors}. {' '}
            <span style={{ fontStyle: 'italic' }}>{cleanJournal}</span>
            {volume && ` ${volume}`}
            {year && ` (${year})`}.
        </li>
    )
}

// --- Main Page Component ---

export default async function PrintCVPage() {
  const cv = await getCVYamlData()
  const { description, stats, education, positions, skills, grants, invited_speakers, service, contact, teaching } = cv

  const confYaml = await getConferencePresentationsData()
  const oralPresentations = confYaml.oral_presentations || []
  const organisedMeetings = confYaml.organised_meetings || []
  const conferencePosters = confYaml.conference_posters || []
  
  const rawPublications = await getPublications()
  const publications = [...rawPublications].sort(sortPublications)

  return (
    <div className="print-cv">
        {/* Load Google Fonts specifically for this page */}
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap"
        />
        <style>{`
            /* Reset Global Layout Constraints */
            body { 
                background: white !important;
                color: black !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important; /* Override flex */
            }
            
            /* Hide Site Chrome */
            body > header, body > footer, .mobile-nav, nav.desktop-nav {
                display: none !important;
            }

            /* Page Specifics */
            @page { margin: 1cm; size: A4; }
            
            .print-cv {
                max-width: 21cm;
                margin: 0 auto;
                /* Removes wrapper padding to allow full-bleed headers. 
                   Content will be padded instead. */
                padding: 0; 
                background: white;
                /* Use default sans-serif or inherited fonts to match site theme more closely */
                font-family: inherit; 
                line-height: 1.4; 
                color: #000;
            }
            
            a { text-decoration: none; color: inherit; }
            
            h1, h2, h3, p { margin: 0; }

            .cv-content {
                padding: 0 2rem 2rem 2rem;
            }

            @media print {
                /* Reset margin/padding for print */
                .print-cv { margin: 0; width: 100%; max-width: none; }
                .cv-content { padding: 0 2rem; } /* Keep side padding */
                body { -webkit-print-color-adjust: exact; padding: 0 !important; margin: 0 !important; }
                .no-print { display: none !important; }
            }
        `}</style>
        
        <div className="no-print" style={{ 
            position: 'fixed', 
            top: '1rem', 
            right: '1rem', 
            zIndex: 1000,
            background: 'white',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
            <PrintButton />
        </div>

        {/* Header - Banner Style */}
        <header className="cv-header" style={{ 
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1.2rem 2rem', /* Compact padding */
            marginBottom: '1.2rem',
            borderBottom: '5px solid #34495e',
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem' /* reduced gap */
        }}>
            <div>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '20pt', /* smaller font */
                    fontWeight: 700, 
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                }}>
                    Nabil-Fareed Alikhan
                </h1>
                {description && (
                    <p style={{ 
                        marginTop: '0.4rem', 
                        fontSize: '9.5pt', 
                        opacity: 0.9,
                        maxWidth: '800px',
                        lineHeight: 1.4,
                        fontWeight: 300
                    }}>
                        {description}
                    </p>
                )}
            </div>

            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '0.5rem 1.5rem',
                fontSize: '8.5pt',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '0.6rem'
            }}>
                <span style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <span style={{ opacity: 0.7 }}>Email:</span>
                    <span style={{ fontWeight: 500 }}>{contact?.email}</span>
                </span>
                <span style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <span style={{ opacity: 0.7 }}>Website:</span>
                    <span style={{ fontWeight: 500 }}>{contact?.website?.replace('https://', '')}</span>
                </span>
                <span style={{ display: 'inline-flex', gap: '0.4rem' }}>
                    <span style={{ opacity: 0.7 }}>GitHub:</span>
                    <span style={{ fontWeight: 500 }}>{contact?.github?.replace('https://github.com/', '')}</span>
                </span>
            </div>
        </header>

        <div className="cv-content">




        <Section title="Education">
            {education.map((edu, i) => (
                <Entry 
                    key={i}
                    left={edu.period}
                    title={edu.degree}
                    subtitle={edu.institution}
                />
            ))}
        </Section>

        <Section title="Professional Experience">
            {positions.map((pos, i) => (
                <Entry
                    key={i}
                    left={`${pos.startYear}–${pos.endYear || 'Present'}`}
                    title={pos.title}
                    subtitle={pos.organization}
                    details={pos.description}
                />
            ))}
        </Section>

        <Section title="Funding & Grants">
            {grants.map((grant, i) => (
                <Entry
                    key={i}
                    left={grant.year}
                    title={grant.title}
                    subtitle={grant.funder}
                    right={grant.amount}
                    details={grant.role !== 'PI' ? `Role: ${grant.role}` : null}
                />
            ))}
        </Section>

        <Section title="Invited Talks">
            {invited_speakers.map((talk, i) => (
                <div key={i} style={{ marginBottom: '0.6rem', display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                    <div style={{ fontSize: '9pt', color: '#666' }}>{formatDate(talk.date)}</div>
                    <div>
                        <div style={{ fontSize: '10pt', fontWeight: 600 }}>{talk.title}</div>
                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>{talk.event} — {talk.location}</div>
                    </div>
                </div>
            ))}
        </Section>

        <Section title="Teaching & Supervision">
             {teaching.map((item, i) => (
                <Entry
                    key={i}
                    left={item.year}
                    title={item.description}
                    titleStyle={{ fontWeight: 400 }}
                />
            ))}
        </Section>

        <Section title="Academic Service">
            {service.map((item, i) => (
                <Entry
                    key={i}
                    left={item.years}
                    title={item.role}
                    subtitle={item.org}
                />
            ))}
        </Section>

        <Section title="Skills">
            <ul style={{ fontSize: '9.5pt', lineHeight: '1.6', paddingLeft: '1.2rem', margin: 0 }}>
                {skills.map((s, i) => (
                    <li key={s.name || i} style={{ marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700 }}>{s.name}:</span> {s.items.map(item => item.label).join(', ')}
                    </li>
                ))}
            </ul>
        </Section>

        <Section title="Organised Meetings">
            {organisedMeetings.map((meeting, i) => (
                <div key={i} style={{ marginBottom: '0.6rem', display: 'grid', gridTemplateColumns: '120px 1fr', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '9pt', color: '#666' }}>{formatDate(meeting.date)}</div>
                    <div>
                        <div style={{ fontSize: '10pt', fontWeight: 600 }}>{meeting.title}</div>
                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>{meeting.location}</div>
                    </div>
                </div>
            ))}
        </Section>


        <div style={{ breakBefore: 'page' }}>
            <Section title="Publications">
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {publications.map((entry, i) => (
                        <PublicationItem key={entry.citationKey || i} entry={entry} />
                    ))}
                </ul>
            </Section>
        </div>


        <Section title="Oral Presentations">
            {oralPresentations.map((talk, i) => (
                <div key={i} style={{ marginBottom: '0.6rem', display: 'grid', gridTemplateColumns: '120px 1fr', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '9pt', color: '#666' }}>{formatDate(talk.date)}</div>
                    <div>
                        <div style={{ fontSize: '10pt', fontWeight: 600 }}>{talk.title}</div>
                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>{talk.event} — {talk.location}</div>
                    </div>
                </div>
            ))}
        </Section>

        <Section title="Conference Posters">
            {conferencePosters.map((poster, i) => (
                <div key={i} style={{ marginBottom: '0.6rem', display: 'grid', gridTemplateColumns: '120px 1fr', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '9pt', color: '#666' }}>{formatDate(poster.date)}</div>
                    <div>
                        <div style={{ fontSize: '10pt', fontWeight: 600 }}>{poster.title}</div>
                        <div style={{ fontSize: '9pt', fontStyle: 'italic' }}>{poster.event} — {poster.location}</div>
                    </div>
                </div>
            ))}
        </Section>

        </div>
    </div>
  )
}
