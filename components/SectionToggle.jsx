"use client"
import { useState } from 'react'

export default function SectionToggle({ title, children }) {
  const [show, setShow] = useState(false)
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1a4b8a',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: show ? '1rem' : 0,
          padding: 0,
          textAlign: 'left',
          display: 'block',
        }}
        aria-expanded={show}
      >
        {show ? `Hide ${title}` : `Show ${title}`}
      </button>
      {show && (
        <div>{children}</div>
      )}
    </section>
  )
}