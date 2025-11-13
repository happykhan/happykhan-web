// Minimalist card grid for education section
export default function EducationCards({ education }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '0.75rem',
      marginBottom: '2.5rem',
    }}>
      {education.map((item, i) => (
        <div key={i} style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          padding: '0.85rem',
        }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>{item.degree}</div>
          <div style={{ fontSize: '0.85rem', color: '#444', marginBottom: '0.15rem' }}>{item.institution}</div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.15rem' }}>{item.period}</div>
          {item.thesis && <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.1rem' }}><em>Thesis:</em> {item.thesis}</div>}
          {item.supervisor && <div style={{ fontSize: '0.8rem', color: '#888' }}><em>Supervisor:</em> {item.supervisor}</div>}
        </div>
      ))}
    </div>
  )
}
