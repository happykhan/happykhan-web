export default function NotFound() {
  return (
    <section>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <a 
        href="/" 
        style={{
          display: 'inline-block',
          padding: '0.6rem 1rem',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 600,
          background: 'var(--color-primary)',
          color: 'var(--color-bg)',
          border: 'none',
          transition: 'all 0.2s',
        }}
      >
        Return Home
      </a>
    </section>
  )
}
