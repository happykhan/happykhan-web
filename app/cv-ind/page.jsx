import { generalIndustryCv as cv } from './generalIndustryCv'

export const metadata = {
  title: 'Industry CV | Nabil-Fareed Alikhan',
  description: cv.profile,
}

const sectionStyle = { marginTop: '2.4rem' }
const headingStyle = { marginBottom: '1rem', paddingBottom: '0.35rem', borderBottom: '2px solid var(--card-border)' }
const listStyle = { margin: 0, paddingLeft: '1.25rem', lineHeight: 1.65, color: 'var(--color-text-secondary)' }

function ContactLine() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem 1.15rem', fontSize: '0.9rem', color: 'var(--card-meta)' }}>
      {cv.contact.map((item) => (
        <span key={item.label}>
          <strong>{item.label}:</strong>{' '}
          {item.href ? (
            <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
              {item.value}
            </a>
          ) : item.value}
        </span>
      ))}
    </div>
  )
}

function LabelledList({ items }) {
  return (
    <ul style={listStyle}>
      {items.map((item) => (
        <li key={item.title} style={{ marginBottom: '0.55rem' }}>
          <strong style={{ color: 'var(--color-text)' }}>{item.title}:</strong> {item.text}
          {item.href && <> <a href={item.href} target="_blank" rel="noopener noreferrer">{item.linkLabel}</a></>}
        </li>
      ))}
    </ul>
  )
}

export default function IndustryCVPage() {
  return (
    <article>
      <div style={{ marginBottom: '1.2rem', fontSize: '0.9rem' }}>
        <a href="/cv-ind-print">Print / PDF version</a>
        {' · '}
        <a href="/cv">Full academic CV</a>
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.35rem' }}>{cv.name}</h1>
        <p style={{ margin: '0 0 0.9rem', color: 'var(--card-title)', fontWeight: 700 }}>{cv.strapline}</p>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{cv.profile}</p>
        <ContactLine />
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Expertise</h2>
        <LabelledList items={cv.expertise} />
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Experience</h2>
        {cv.experience.map((role) => (
          <div key={`${role.title}-${role.period}`} style={{ marginBottom: '1.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{role.title}</h3>
              <strong style={{ color: 'var(--card-meta)', fontSize: '0.9rem' }}>{role.period}</strong>
            </div>
            <p style={{ margin: '0.2rem 0 0.55rem', color: 'var(--card-meta)', fontStyle: 'italic' }}>
              {role.organisation} | {role.location}
            </p>
            <ul style={listStyle}>
              {role.bullets.map((bullet) => <li key={bullet} style={{ marginBottom: '0.35rem' }}>{bullet}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Software portfolio</h2>
        <LabelledList items={cv.software} />
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Professional leadership and engagement</h2>
        <LabelledList items={cv.leadership} />
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Education</h2>
        <ul style={listStyle}>
          {cv.education.map((item) => (
            <li key={item.qualification} style={{ marginBottom: '0.45rem' }}>
              <strong style={{ color: 'var(--color-text)' }}>{item.qualification}</strong>, {item.institution}, {item.period}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
