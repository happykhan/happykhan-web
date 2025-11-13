export default function InfoCard({ title, subtitle, meta, children }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '0.7rem',
      padding: '0.55rem 0.8rem',
      marginBottom: '0.7rem',
      boxShadow: '0 1px 4px 0 rgba(60,60,60,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.13rem',
    }}>
      <div style={{ fontWeight: 500, fontSize: '0.93rem', color: 'var(--card-title)', lineHeight: 1.25 }}>
        {title}
        {subtitle && <span style={{ color: 'var(--card-sub)', fontWeight: 400 }}> &nbsp;|&nbsp; {subtitle}</span>}
      </div>
      {meta && <div style={{ fontSize: '0.87rem', color: 'var(--card-meta)', lineHeight: 1.18 }}>{meta}</div>}
      {children}
    </div>
  )
}