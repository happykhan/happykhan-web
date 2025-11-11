'use client'

import { useState } from 'react'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="mobile-menu-button"
        style={{
          display: 'none', // prevent any layout shift before media CSS applies
          background: 'transparent',
          border: '1px solid var(--color-text)',
          borderRadius: '6px',
          cursor: 'pointer',
          padding: '0.5rem',
          fontSize: '1.25rem',
          lineHeight: 1,
          width: '40px',
          height: '40px',
          color: 'var(--color-text)',
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile nav - overlay menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            className="mobile-nav-backdrop"
          />
          
          {/* Menu */}
          <nav
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '70%',
              maxWidth: '300px',
              backgroundColor: 'white',
              boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              animation: 'slideIn 0.3s ease-out',
            }}
            className="mobile-nav"
          >
            <a 
              href="/" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a 
              href="/about" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a 
              href="/software" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              Software
            </a>
            <a 
              href="/publications" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              Publications
            </a>
            <a 
              href="/microbinfie" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              MicroBinfie Podcast
            </a>
            <a 
              href="/posts" 
              style={{ fontWeight: 500, fontSize: '1.1rem' }}
              onClick={() => setIsOpen(false)}
            >
              Posts
            </a>
          </nav>
        </>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
