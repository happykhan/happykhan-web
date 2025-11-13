'use client'

export default function SkillBadges({ skills }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      {skills.map((category) => (
        <div key={category.name} style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            {category.name}
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            {category.items.map((skill) => (
              <span
                key={skill}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-text)',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary)'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-secondary)'
                  e.currentTarget.style.color = 'var(--color-text)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
