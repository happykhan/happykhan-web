// SVG icons for podcast platforms
export function SoundCloudIcon({ size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#FF5500"/>
      <path d="M7.5 16.5V12.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 16.5V10.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12.5 16.5V8.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 16.5V13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17.5 16.5C19.1569 16.5 20.5 15.1569 20.5 13.5C20.5 11.8431 19.1569 10.5 17.5 10.5C17.5 10.5 17.5 16.5 17.5 16.5Z" fill="#fff"/>
    </svg>
  )
}

export function ApplePodcastsIcon({ size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#FA57C1"/>
      <circle cx="12" cy="12" r="6" stroke="#fff" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2" fill="#fff"/>
      <path d="M12 8V10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function SpotifyIcon({ size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#1ED760"/>
      <path d="M8 15C10.5 14 13.5 14 16 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8.5 12.5C11 11.5 13 11.5 15.5 12.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 10C11.5 9 12.5 9 15 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function RSSIcon({ size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#FFA500"/>
      <circle cx="8" cy="16" r="2" fill="#fff"/>
      <path d="M6 12C10 12 12 14 12 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 8C14 8 18 12 18 18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function DownloadIcon({ size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="24" height="24" rx="6" fill="#888"/>
      <path d="M12 6v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 14l4 4 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="7" y="18" width="10" height="1.5" rx="0.75" fill="#fff"/>
    </svg>
  )
}
