'use client'

import { useState, useCallback } from 'react'
import './introductions.css'

const groups = [
  {
    heading: 'Tool builder',
    intros: [
      "I build software that gives biologists access to genomic data at a scale they couldn't handle before — then I use those platforms to do the biology.",
      "I build open platforms for pathogen genomics. The tools end up in university courses, public health labs, and WHO reports. What I want to do with them is answer questions we couldn't ask before.",
      "I've built tools people still rely on a decade later. The tools are the point of entry — the science is what I'm actually after.",
    ],
  },
  {
    heading: 'Pathogen science',
    intros: [
      "I work on why E. coli causes disease. The categories we use to classify it were built before genome sequencing existed, and they're showing.",
      "I want to understand why the same bacterial strain kills one person and doesn't touch another. We now have a million E. coli genomes — and still can't reliably predict which ones will cause disease.",
      "I study bacterial pathogenesis at population scale. The field has the data. What's missing is a classification system that reflects what the genomes actually show.",
    ],
  },
  {
    heading: 'Public health',
    intros: [
      "I help public health labs use pathogen genomes to make decisions — not just to do research, but to answer questions that come up this week.",
      "During COVID I helped process 80,000 SARS-CoV-2 genomes for the national surveillance programme. What I took from that: genomics is most useful when it's fast, reliable, and built for the people making decisions.",
      "I build genomic infrastructure for public health — making complex sequencing data interpretable by the people who need it, not just the people who generated it.",
    ],
  },
  {
    heading: 'AMR & One Health',
    intros: [
      "I study how antimicrobial resistance spreads through food systems and healthcare — tracing the same resistant strain from farms to hospitals.",
      "I work on AMR from a genomics angle — trying to understand where resistance comes from and where it's going, at a scale that makes patterns visible.",
      "I helped show how vaccine pressure in Brazilian poultry drove serovar replacement toward more drug-resistant Salmonella. The food system creates selection pressure; the genomes record it.",
    ],
  },
  {
    heading: 'Infrastructure & standards',
    intros: [
      "I work on making genomic results defensible — quality frameworks, metadata standards, and tools that ensure the same analysis means the same thing in different labs.",
      "I contribute to international standards for pathogen genomics data. If you want genomic surveillance to be comparable across countries and years, someone has to agree on what good data looks like. That's the work.",
      "I build QC frameworks for bacterial genomics. The goal is making genome-based results reliable enough to act on, not just publish.",
    ],
  },
]

const followUps = [
  {
    label: 'BRIG',
    text: 'the standard tool for comparing bacterial genomes — cited in over 3,000 papers, still used in teaching worldwide, 15 years after I built it',
  },
  {
    label: 'AMRwatch',
    text: 'the largest AMR monitoring dataset anywhere — 620,000 genomes, used by public health agencies and WHO to track resistance trends',
  },
  {
    label: 'EnteroBase',
    text: 'redefined how the field does molecular epidemiology for Salmonella and E. coli — 400,000 genomes, the reference resource for outbreak investigations globally',
  },
  {
    label: 'COG-UK',
    text: 'I processed 80,000 SARS-CoV-2 genomes through the national pandemic surveillance pipeline — analyses that fed into government briefings',
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

function italicise(text) {
  return text
    .replace(/E\. coli/g, '<em>E. coli</em>')
    .replace(/Salmonella/g, '<em>Salmonella</em>')
    .replace(/SARS-CoV-2/g, '<em>SARS-CoV-2</em>')
}

function IntroCard({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  return (
    <div className="intro-card">
      <span dangerouslySetInnerHTML={{ __html: italicise(text) }} />
      <button
        className={`copy-btn${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
      >
        {copied ? <TickIcon /> : <CopyIcon />}
      </button>
    </div>
  )
}

function IntroGroup({ heading, intros }) {
  return (
    <section className="intro-group">
      <h2 className="intro-group-heading">{heading}</h2>
      {intros.map((text, i) => (
        <IntroCard key={i} text={text} />
      ))}
    </section>
  )
}

export default function IntroductionsPage() {
  return (
    <div className="intros-page">
      <h1>Introductions</h1>
      <p>Copy-paste professional introductions grouped by angle.</p>

      {groups.map((group, i) => (
        <IntroGroup key={i} heading={group.heading} intros={group.intros} />
      ))}

      <section className="followup-section">
        <h2 className="followup-heading">If they say &ldquo;tell me more&rdquo;</h2>
        <div className="followup-list">
          {followUps.map((item, i) => (
            <div key={i} className="followup-item">
              <span className="followup-label">{item.label}:</span>{' '}
              <span className="followup-text" dangerouslySetInnerHTML={{ __html: italicise(item.text) }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
