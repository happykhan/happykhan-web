// Evidence-based skill groups without arbitrary proficiency scores.
export default function SkillRatings({ skills }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {skills.map((section) => (
        <div key={section.name}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>{section.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {section.items.map((item) => (
              <div key={item.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                <span style={{ fontSize: '0.98rem', color: 'var(--card-title)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
