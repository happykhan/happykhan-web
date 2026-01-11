'use client'

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}
    >
      Print to PDF
    </button>
  )
}
