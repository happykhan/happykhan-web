// Minimalist skill section with 1-5 dot ratings, fully controlled by frontmatter
export default function SkillRatings({ skills }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {skills.map((section) => (
        <div key={section.name}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem', letterSpacing: '0.01em' }}>{section.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {section.items.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                <span style={{ fontSize: '0.98rem', flex: 1, color: 'var(--card-title)' }}>{item.label}</span>
                <span style={{ display: 'flex', gap: '0.15rem' }}>
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: n <= item.rating ? 'var(--card-title)' : 'var(--card-border)',
                      opacity: n <= item.rating ? 1 : 0.5,
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
