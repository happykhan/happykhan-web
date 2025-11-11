'use client'

import { useEffect } from 'react'

export default function ImageLoader() {
  useEffect(() => {
    // Handle all images on the page
    const handleImageLoad = (img) => {
      img.setAttribute('data-loaded', 'true')
    }

    // Find all images
    const images = document.querySelectorAll('img')
    
    images.forEach((img) => {
      if (img.complete) {
        // Image already loaded
        handleImageLoad(img)
      } else {
        // Wait for image to load
        img.addEventListener('load', () => handleImageLoad(img))
      }
    })

    // Observer for dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'IMG') {
            const img = node
            if (img.complete) {
              handleImageLoad(img)
            } else {
              img.addEventListener('load', () => handleImageLoad(img))
            }
          }
          // Check for images inside added elements
          if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach((img) => {
              if (img.complete) {
                handleImageLoad(img)
              } else {
                img.addEventListener('load', () => handleImageLoad(img))
              }
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  return null
}
