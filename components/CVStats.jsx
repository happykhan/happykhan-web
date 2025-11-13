'use client'


import { useState, useEffect } from 'react'
import { HIndexIcon, CitationsIcon, ExperienceIcon, CoffeeIcon } from './CVStatIcons'

// Minimalist download icon for software downloads
function DownloadIcon({ size = 16, color = 'var(--card-title)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4v8" />
      <path d="M6 10l4 4 4-4" />
      <rect x="4" y="16" width="12" height="2" rx="1" />
    </svg>
  )
}

export default function CVStats({ stats }) {
  const { hIndex, citations, yearsExperience, softwareDownloads } = stats
  const [coffeesDrunk, setCoffeesDrunk] = useState(0)

  useEffect(() => {
    // Generate random number between 1000 and 10000 on client side
    const randomCoffees = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
    setCoffeesDrunk(randomCoffees)
  }, [])

  const statItems = [
    {
      label: 'H-Index',
      value: hIndex,
      icon: <HIndexIcon size={16} color={'var(--card-title)'} />, 
    },
    {
      label: 'Citations',
      value: citations.toLocaleString(),
      icon: <CitationsIcon size={16} color={'var(--card-title)'} />, 
    },
    {
      label: 'Years Experience',
      value: yearsExperience,
      icon: <ExperienceIcon size={16} color={'var(--card-title)'} />, 
    },
    {
      label: 'Software Downloads',
      value: softwareDownloads ? softwareDownloads.toLocaleString() : '—',
      icon: <DownloadIcon size={16} color={'var(--card-title)'} />, 
    },
    {
      label: 'Coffees Drunk',
      value: coffeesDrunk.toLocaleString(),
      icon: <CoffeeIcon size={16} color={'var(--card-title)'} />, 
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${statItems.length}, minmax(0, 1fr))`,
      gap: '0.5rem',
      marginBottom: '1rem',
      marginTop: '0.5rem',
    }}>
      {statItems.map((item) => (
        <div
          key={item.label}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '6px',
            padding: '0.5rem 0.25rem',
            textAlign: 'center',
            minWidth: 0,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.1rem',
            height: 18,
          }}>
            {item.icon}
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--card-title)',
            marginBottom: '0.05rem',
            lineHeight: 1.1,
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: 'var(--card-meta)',
            fontWeight: 500,
            lineHeight: 1.1,
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
