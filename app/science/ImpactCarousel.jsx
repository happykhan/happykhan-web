'use client'

import { useState, useRef, useEffect } from 'react'

// Helper to render markdown-style links [text](url)
const renderWithLinks = (text) => {
  if (typeof text !== 'string') return text;
  
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a 
          key={i} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: 'underline', color: 'inherit' }}
        >
          {match[1]}
        </a>
      );
    }
    return part;
  });
};

export default function ImpactCarousel({ vignettes }) {
  const scrollRef = useRef(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="carousel-container">
      <div className="carousel-controls">
        <button 
          className="control-btn" 
          onClick={() => scroll('left')} 
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          ←
        </button>
        <button 
          className="control-btn" 
          onClick={() => scroll('right')} 
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          →
        </button>
      </div>

      <div className="impact-track" ref={scrollRef}>
        {vignettes.map((item, idx) => (
          <div 
            key={idx} 
            className="impact-card" 
            onClick={() => setSelectedCard(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedCard(item)
                e.preventDefault()
              }
            }}
          >
            <h3 className="impact-title">{item.title}</h3>
            <div className="impact-what">{item.what}</div>
            <div className="impact-why">{item.why}</div>
            <div className="impact-evidence">Evidence: {renderWithLinks(item.evidence)}</div>
            <div className="impact-more">Read more →</div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
            <h3 className="section-title" style={{ marginTop: 0, fontSize: '1.75rem' }}>{selectedCard.title}</h3>
            <p className="lead" style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              {selectedCard.what}
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{selectedCard.why}</p>
            
            <div style={{ background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <strong>Evidence & Impact:</strong>
              <div style={{ fontFamily: 'var(--font-mono)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {renderWithLinks(selectedCard.evidence)}
              </div>
            </div>

            {selectedCard.details && (
              <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' }}>
                {selectedCard.details.map((detail, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{renderWithLinks(detail)}</li>
                ))}
              </ul>
            )}

            {selectedCard.link && (
              <div style={{ marginBottom: '1.5rem' }}>
                <a 
                  href={selectedCard.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                   Visit Link / Project →
                </a>
              </div>
            )}
            
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
               <button className="btn btn-outline" onClick={() => setSelectedCard(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
