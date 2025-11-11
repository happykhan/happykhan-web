'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Custom Image component for MDX content
 * Wraps Next.js Image with progressive loading and blur placeholder
 */
export default function MDXImage({ src, alt, width, height, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // For external URLs, use regular img tag (can't blur external images easily)
  if (src?.startsWith('http://') || src?.startsWith('https://')) {
    return <img src={src} alt={alt || ''} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} {...props} />
  }
  
  // Simple gray blur placeholder SVG
  const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJiIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMiIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiBmaWx0ZXI9InVybCgjYikiLz48L3N2Zz4="
  
  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    transition: 'opacity 0.5s ease-in-out',
    opacity: isLoaded ? 1 : 0
  }
  
  // If dimensions are provided (from rehype plugin), use them
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        style={imageStyle}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    )
  }
  
  // Otherwise use standard dimensions with responsive styling
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={800}
      height={600}
      style={imageStyle}
      placeholder="blur"
      blurDataURL={blurDataURL}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  )
}
