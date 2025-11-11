import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

/**
 * Get dimensions of an image file
 * @param {string} imagePath - Absolute path to the image file
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(imagePath) {
  try {
    const buffer = await fs.readFile(imagePath)
    const metadata = await sharp(buffer).metadata()
    return {
      width: metadata.width || 800,
      height: metadata.height || 600
    }
  } catch (error) {
    console.warn(`Could not read image dimensions for ${imagePath}:`, error.message)
    // Return default dimensions as fallback
    return { width: 800, height: 600 }
  }
}

/**
 * Resolve image path from content directory to public directory
 * @param {string} src - Image source from MDX (e.g., "./image.png")
 * @param {string} contentType - Type of content (e.g., "posts", "microbinfie")
 * @param {string} slug - Content slug
 * @returns {string} - Public URL path
 */
export function resolveImagePath(src, contentType, slug) {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src
  }
  
  // Remove ./ or ../ prefix
  const cleanSrc = src.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '')
  return `/${contentType}/${slug}/${cleanSrc}`
}

/**
 * Get absolute file path for an image in content directory
 * @param {string} src - Image source from MDX (e.g., "./image.png")
 * @param {string} contentType - Type of content (e.g., "posts", "microbinfie")
 * @param {string} slug - Content slug
 * @returns {string} - Absolute file path
 */
export function getImageFilePath(src, contentType, slug) {
  const cleanSrc = src.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '')
  return path.join(process.cwd(), '..', 'content', contentType, slug, cleanSrc)
}
