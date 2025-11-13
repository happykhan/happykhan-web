
import CVSectionToggle from '@/components/CVSectionToggle.jsx'
import { getCVYamlData } from '@/lib/content.mjs'
import { getConferencePresentationsData } from '@/lib/content.mjs'

import CVStats from '@/components/CVStats'
import CVTimeline from '@/components/CVTimeline'
import SkillRatings from '@/components/SkillRatings'
import EducationCards from '@/components/EducationCards'
import ConferenceCard from '@/components/ConferenceCard.jsx'
import InfoCard from '@/components/InfoCard.jsx'

export const metadata = {
  title: 'CV — Nabil‑Fareed Alikhan',
}

  export default async function Page() {
    const cv = await getCVYamlData()
    const { description, stats, education, positions, skills, grants, invited_speakers, service, publications_link, contact, teaching } = cv
  
    // Load conference presentations YAML via server utility
  const confYaml = await getConferencePresentationsData()
  const oralPresentations = confYaml.oral_presentations || []
  const conferencePosters = confYaml.conference_posters || []
  const organisedMeetings = confYaml.organised_meetings || []
  const attendance = confYaml.attendance || []
  
    return (
      <article>
        <h1>Curriculum Vitae</h1>

      {/* Contact info at the top */}
      {contact && (
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--card-meta)' }}>
            <span style={{ marginRight: '1.2rem' }}><b>Email:</b> <a href={`mailto:${contact.email}`} style={{ color: 'var(--card-title)' }}>{contact.email}</a></span>
            <span style={{ marginRight: '1.2rem' }}><b>Website:</b> <a href={contact.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--card-title)' }}>{contact.website.replace('https://', '')}</a></span>
            <span><b>GitHub:</b> <a href={contact.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--card-title)' }}>{contact.github.replace('https://github.com/', '')}</a></span>
          </div>
        </div>
      )}

      {/* Publication link stat/line */}
      {publications_link && (
        <div style={{ marginBottom: '1.2rem', fontSize: '1rem', color: 'var(--card-title)', fontWeight: 500 }}>
          <span role="img" aria-label="publications" style={{ filter: 'var(--icon-filter)' }}>📄</span> See my <a href={publications_link} style={{ color: 'var(--card-title)', textDecoration: 'underline' }}>publications</a>
        </div>
      )}

      {description && (
        <p style={{
          fontSize: '1.05rem',
          lineHeight: '1.6',
          color: 'var(--color-text-secondary)',
          marginBottom: '1.5rem',
        }}>{description}</p>
      )}

      <CVStats stats={stats} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Education</h2>
      <EducationCards education={education} />

      <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Employment</h2>
      <CVTimeline positions={positions} />

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>Skills</h2>
      <SkillRatings skills={skills} />

  <CVSectionToggle title="Grants">
    {grants && grants.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {grants.map((grant, i) => (
          <InfoCard
            key={i}
            title={grant.title}
            subtitle={grant.funder}
            meta={`${grant.year}${grant.amount ? ` | ${grant.amount}` : ''}${grant.role ? ` | ${grant.role}` : ''}`}
          />
        ))}
      </div>
    )}
  </CVSectionToggle>

  <CVSectionToggle title="Invited Talks & Keynotes">
    {invited_speakers && invited_speakers.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {invited_speakers.map((talk, i) => (
          <InfoCard
            key={i}
            title={talk.title}
            subtitle={talk.event}
            meta={`${talk.location}${talk.date ? ` | ${typeof talk.date === 'string' ? talk.date : ''}` : ''}`}
          />
        ))}
      </div>
    )}
  </CVSectionToggle>

  <CVSectionToggle title="Service">
    {service && service.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {service.map((item, i) => (
          <InfoCard
            key={i}
            title={item.role}
            subtitle={item.org}
            meta={item.years}
          />
        ))}
      </div>
    )}
  </CVSectionToggle>

  <CVSectionToggle title="Teaching & Supervision">
    {teaching && teaching.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {teaching.map((item, i) => (
          <InfoCard
            key={i}
            title={item.description}
            meta={item.year}
          />
        ))}
      </div>
    ) : (
      <div style={{ color: '#888', fontSize: '0.97rem', marginBottom: '2rem' }}>
        No teaching or supervision records found.
      </div>
    )}
  </CVSectionToggle>

  {organisedMeetings.length > 0 && (
    <CVSectionToggle title="Organised Meetings">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {organisedMeetings.map((item, i) => (
          <ConferenceCard key={i} title={item.title} location={item.location} date={item.date} />
        ))}
      </div>
    </CVSectionToggle>
  )}
  {oralPresentations.length > 0 && (
    <CVSectionToggle title="Oral Presentations">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {oralPresentations.map((item, i) => (
          <ConferenceCard key={i} title={item.title} event={item.event} location={item.location} date={item.date} />
        ))}
      </div>
    </CVSectionToggle>
  )}
  {conferencePosters.length > 0 && (
    <CVSectionToggle title="Conference and Symposium Posters">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {conferencePosters.map((item, i) => (
          <ConferenceCard key={i} title={item.title} event={item.event} location={item.location} date={item.date} />
        ))}
      </div>
    </CVSectionToggle>
  )}
  {attendance.length > 0 && (
    <CVSectionToggle title="Other Attendance">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '1.1rem' }}>
        {attendance.map((item, i) => (
          <ConferenceCard key={i} title={item.title} location={item.location} date={item.date} />
        ))}
      </div>
    </CVSectionToggle>
  )}


    </article>
  )
}
