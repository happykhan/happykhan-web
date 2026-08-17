'use client'

import { useEffect, useRef, useState } from 'react'

const cardUrl = 'https://happykhan.com/hi'

export default function ShareContactButton() {
  const [label, setLabel] = useState('Share this card')
  const resetTimer = useRef(null)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const showTemporaryLabel = (nextLabel) => {
    setLabel(nextLabel)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setLabel('Share this card'), 1800)
  }

  const shareCard = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Nabil-Fareed Alikhan',
          text: 'Contact details for Nabil-Fareed Alikhan',
          url: cardUrl,
        })
        return
      }

      await navigator.clipboard.writeText(cardUrl)
      showTemporaryLabel('Link copied')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showTemporaryLabel('Could not share')
      }
    }
  }

  return (
    <button
      className="contact-button contact-button-secondary"
      type="button"
      onClick={shareCard}
      aria-live="polite"
    >
      {label}
    </button>
  )
}
