'use client'

import { useEffect } from 'react'

export default function CodeBlockWrapper({ children }) {
  useEffect(() => {
    // Find all pre elements and add copy buttons
    const preElements = document.querySelectorAll('pre')
    
    preElements.forEach((pre) => {
      // Skip if already has a copy button
      if (pre.parentElement?.classList.contains('code-block-container')) {
        return
      }

      // Create wrapper
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-container'
      wrapper.style.position = 'relative'
      wrapper.style.marginBottom = '1.5rem'

      // Create copy button
      const button = document.createElement('button')
      button.textContent = 'Copy'
      button.className = 'copy-button'
      button.setAttribute('aria-label', 'Copy code')
      Object.assign(button.style, {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        padding: '0.4rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        background: '#374151',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        opacity: '0.9',
        transition: 'opacity 0.2s, background 0.2s',
        zIndex: '10',
      })

      button.addEventListener('mouseenter', () => {
        button.style.opacity = '1'
      })

      button.addEventListener('mouseleave', () => {
        button.style.opacity = '0.9'
      })

      button.addEventListener('click', async () => {
        // Get all text content from the pre element
        const code = pre.textContent || ''
        
        // Check if clipboard API is available (browser only)
        if (!navigator.clipboard) {
          console.warn('Clipboard API not available')
          return
        }
        
        try {
          await navigator.clipboard.writeText(code.trim())
          button.textContent = 'Copied!'
          button.style.background = '#10b981'
          
          setTimeout(() => {
            button.textContent = 'Copy'
            button.style.background = '#374151'
          }, 2000)
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      })

      // Wrap the pre element
      pre.parentNode.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(button)
    })
  }, [children])

  return <>{children}</>
}
