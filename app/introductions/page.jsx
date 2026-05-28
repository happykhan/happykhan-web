'use client'

import { useState, useCallback } from 'react'
import './introductions.css'

const introductions = [
  {
    label: 'Networking / coffee / "what do you do?"',
    text: "I build tools for pathogen genomics. What I actually want to figure out: why does the same E. coli strain cause disease in some people and not others.",
  },
  {
    label: 'Fellowship panels / grant applications',
    text: "I work on why E. coli causes disease. The categories we use to classify it were built before genome sequencing existed, and they're showing.",
  },
  {
    label: 'AP job interviews / "what are you known for?"',
    text: "I'm known for genomic tools the field actually relies on — BRIG, EnteroBase, AMRwatch — and I use those platforms to rewrite how we classify pathogens.",
  },
  {
    label: 'Big pitch / mission statement',
    text: "I build tools that give the field access to hundreds of thousands of pathogen genomes. The question I'm actually trying to answer: why does E. coli cause disease in some people and not others.",
  },
  {
    label: 'Follow-up evidence (if they say "tell me more")',
    list: [
      'BRIG: 3,000+ citations',
      'AMRwatch: 620,000 genomes',
      'EnteroBase: 400,000 genomes',
    ],
  },
  {
    label: 'Core identity',
    text: 'I build tools that become research platforms, then use those platforms to answer pathogenesis questions nobody could ask before.',
  },
]

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V3.5a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" />
    </svg>
  )
}

function TickIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  )
}

function IntroBlock({ label, text, list }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const content = text || list.map(item => `- ${item}`).join('\n')
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text, list])

  return (
    <div className="intro-block">
      <div className="intro-label">{label}</div>
      <div className="intro-card">
        {text && <span>{text}</span>}
        {list && (
          <ul>
            {list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
        >
          {copied ? <TickIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  )
}

export default function IntroductionsPage() {
  return (
    <div className="intros-page">
      <h1>Introductions</h1>
      <p>Copy-paste professional introductions for different contexts.</p>
      {introductions.map((intro, i) => (
        <IntroBlock key={i} {...intro} />
      ))}
    </div>
  )
}
