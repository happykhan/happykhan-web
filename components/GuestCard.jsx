'use client'

export default function GuestCard({ guest }) {
  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: 'var(--color-bg)',
      borderRadius: '6px',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
        {guest.url ? (
          <a 
            href={guest.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-link)',
              textDecoration: 'underline',
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'none'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'underline'}
          >
            {guest.name}
          </a>
        ) : (
          <span style={{ color: 'var(--color-text)' }}>
            {guest.name}
          </span>
        )}
      </div>
      {guest.affiliation && (
        <div style={{ 
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
        }}>
          {guest.affiliation}
        </div>
      )}
    </div>
  )
}
