// Minimalist black and white SVG icons for CVStats
export function HIndexIcon({ size = 20, color = 'var(--card-title)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="3"/>
      <path d="M7 13V7M7 10h6M13 13V7"/>
    </svg>
  )
}

export function CitationsIcon({ size = 20, color = 'var(--card-title)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="12" height="12" rx="2"/>
      <path d="M7 8h6M7 12h4"/>
    </svg>
  )
}

export function ExperienceIcon({ size = 20, color = 'var(--card-title)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/>
      <path d="M10 5v5l3 3"/>
    </svg>
  )
}

export function CoffeeIcon({ size = 20, color = 'var(--card-title)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="10" height="6" rx="3"/>
      <path d="M14 10a3 3 0 0 0 3 3"/>
      <path d="M7 8V6m3 2V6"/>
    </svg>
  )
}
