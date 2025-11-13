"use client"


import React, { useState } from 'react'

export default function CVTimeline({ positions }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {positions.map((position, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            position: 'relative',
          }}
        >
          {/* Date column */}
          <div style={{
            textAlign: 'right',
            paddingTop: '0.15rem',
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--color-primary)',
              lineHeight: '1.3',
            }}>
              {position.startYear}
              {position.endYear && ` – ${position.endYear}`}
              {!position.endYear && ' – Present'}
            </div>
          </div>

          {/* Timeline connector */}
          <div style={{
            position: 'absolute',
            left: '120px',
            top: '6px',
            bottom: index === positions.length - 1 ? 'auto' : '-1.5rem',
            width: '1px',
            background: index === positions.length - 1 ? 'transparent' : 'var(--color-border)',
            marginLeft: '0.75rem',
          }} />

          {/* Timeline dot */}
          <div style={{
            position: 'absolute',
            left: '120px',
            top: '6px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: position.current ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
            border: `2px solid ${position.current ? 'var(--color-primary)' : 'var(--color-border)'}`,
            marginLeft: 'calc(0.75rem - 5px)',
            boxShadow: position.current ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none',
          }} />

          {/* Content column */}
          <div
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '1rem', // symmetrical top and bottom padding
              transition: 'all 0.2s ease',
              width: '80%', // reduce width by 20%
              marginLeft: '0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(3px)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: '600',
              marginTop: 0,
              marginBottom: '0.15rem',
              color: 'var(--color-text)',
            }}>
              {position.title}
            </h3>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.75rem',
              fontStyle: 'italic',
            }}>
              {position.organization}
            </div>
            {position.description && (
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-text)',
                lineHeight: '1.5',
              }}>
                {position.description}
              </div>
            )}
            {position.highlights && position.highlights.length > 0 && (
              <HighlightToggle highlights={position.highlights} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function HighlightToggle({ highlights }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-primary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: show ? '0.5rem' : 0,
        }}
        aria-expanded={show}
      >
        {show ? 'Hide highlights' : 'Show highlights'}
      </button>
      {show && (
        <ul style={{
          paddingLeft: '1.1rem',
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.5',
        }}>
          {highlights.map((highlight, i) => (
            <li key={i} style={{ marginBottom: '0.35rem' }}>{highlight}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
