import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'

// Transform remark directives (:::tip, :::note, etc) into styled divs
function remarkAdmonitions() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        const type = node.name.toLowerCase()
        
        // Handle collapsible details directive
        if (type === 'details' && node.type === 'containerDirective') {
          const title = node.attributes?.title || 'Details'
          
          data.hName = 'details'
          data.hProperties = {
            className: ['admonition-details']
          }
          
          // Add summary element as first child
          node.children.unshift({
            type: 'paragraph',
            data: {
              hName: 'summary',
              hProperties: { className: ['admonition-summary'] }
            },
            children: [
              { type: 'text', value: title }
            ]
          })
        } else {
          // Regular admonitions
          const tagName = node.type === 'textDirective' ? 'span' : 'div'
          
          // Map directive types to emoji/icons
          const icons = {
            note: '📝',
            tip: '💡',
            warning: '⚠️',
            danger: '🚫',
            info: 'ℹ️',
            thanks: '🙏',
            exercise: '✏️',
            question: '❓'
          }
          
          const icon = icons[type] || '📌'
          const title = node.attributes?.title || node.name
          
          // Special handling for question type
          if (type === 'question' && node.type === 'containerDirective') {
            data.hName = tagName
            data.hProperties = {
              className: ['exercise-question']
            }
            // Don't add a title for questions, content is the question
          } else {
            data.hName = tagName
            data.hProperties = {
              className: ['admonition', `admonition-${type}`],
              'data-type': type
            }
            
            // Add title with icon if it's a container
            if (node.type === 'containerDirective') {
              node.children.unshift({
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: ['admonition-title'] }
                },
                children: [
                  { type: 'text', value: `${icon} ${title}` }
                ]
              })
            }
          }
        }
      }
    })
  }
}

// MDX components to use optimized Next.js Image
// This will be passed from the page component to avoid circular dependencies
export function getMDXComponents(customComponents = {}) {
  return {
    ...customComponents,
  }
}

function rehypeRewriteRelativeUrls(basePath, contentType, slug) {
  return () => (tree) => {
    function walk(node) {
      if (node && node.type === 'element') {
        const tag = node.tagName
        const props = node.properties || {}
        if (tag === 'img' && typeof props.src === 'string') {
          const src = props.src
          if (src.startsWith('./') || src.startsWith('../')) {
            const cleaned = src.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '')
            props.src = `${basePath}/${cleaned}`
            
            // Note: We can't get dimensions synchronously in rehype plugin
            // The Next.js Image component will handle this at runtime
            // Or dimensions can be added manually in MDX if needed
            
            node.properties = props
          }
        }
      }
      if (node && Array.isArray(node.children)) {
        for (const child of node.children) {
          walk(child)
        }
      }
    }
    walk(tree)
  }
}


// Root content folders from project root
const CONTENT_ROOT = path.join(process.cwd(), 'content')

export const microbinfieDir = path.join(CONTENT_ROOT, 'microbinfie')
export const postsDir = path.join(CONTENT_ROOT, 'posts')
export const pagesDir = path.join(CONTENT_ROOT, 'pages')

function preprocessSource(src) {
  let out = src
  // Unwrap outer quadruple-fenced blocks that accidentally wrap whole file
  // e.g. starts with ````mdx and ends with ```` on its own line
  if (/^````[a-zA-Z]*\s/.test(out) && /\n````\s*$/.test(out)) {
    out = out.replace(/^````[a-zA-Z]*\s*\n/, '')
    out = out.replace(/\n````\s*$/, '\n')
  }
  // Convert angle-bracket autolinks to standard markdown links
  out = out.replace(/<((?:https?:)\/\/[^>]+)>/g, '[$1]($1)')
  // Downgrade unknown code fence languages to plain fences
  out = out.replace(/^```(?:mail|maths)\b/gm, '```')
  // Sometimes leading numerals before JSX can break parsing; ensure space after list markers
  out = out.replace(/^(\d+)\.(\S)/gm, '$1. $2')
  // Guard against lone numeric lines being treated as jsx by wrapping in paragraph
  out = out.replace(/^(\d+)$/gm, '$1')
  // Ensure code fences have language or are plain triple backticks
  out = out.replace(/^```\s*$/gm, '```')
  return out
}

export async function listMicrobinfie() {
  const entries = await fs.readdir(microbinfieDir)
  const mdxFiles = entries.filter(f => f.endsWith('.mdx'))
  const items = await Promise.all(
    mdxFiles.map(async (file) => {
      const fullPath = path.join(microbinfieDir, file)
      const raw = await fs.readFile(fullPath, 'utf8')
      const { data } = matter(raw)
      const slug = file.replace(/\.mdx$/, '')
      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        tags: data.tags || [],
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : null,
      }
    })
  )

  // sort by date desc if present, else by filename desc
  items.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da || b.slug.localeCompare(a.slug)
  })

  return items
}

export async function readMicrobinfie(slug) {
  const fullPath = path.join(microbinfieDir, `${slug}.mdx`)
  const source = preprocessSource(await fs.readFile(fullPath, 'utf8'))
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions],
        rehypePlugins: [rehypeSlug, rehypePrism, rehypeRewriteRelativeUrls(`/microbinfie/${slug}`, 'microbinfie', slug)],
      },
    },
    components: getMDXComponents(),
  })
  return { frontmatter, content }
}

// Posts helpers (folder-per-post with index.mdx)
export async function listPosts() {
  const entries = await fs.readdir(postsDir, { withFileTypes: true })
  const candidates = []
  for (const ent of entries) {
    if (ent.isDirectory()) {
      candidates.push({ slug: ent.name, fullPath: path.join(postsDir, ent.name, 'index.mdx') })
    } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
      const slug = ent.name.replace(/\.mdx$/, '')
      candidates.push({ slug, fullPath: path.join(postsDir, ent.name) })
    }
  }

  const items = []
  for (const c of candidates) {
    try {
      const raw = await fs.readFile(c.fullPath, 'utf8')
      const { data } = matter(raw)
      items.push({
        slug: c.slug,
        title: data.title || c.slug,
        date: data.date || null,
        tags: data.tags || [],
        excerpt: typeof data.excerpt === 'string' ? data.excerpt : null,
        module: data.module || null,
      })
    } catch (e) {
      // ignore missing index.mdx
    }
  }

  items.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0
    const db = b.date ? new Date(b.date).getTime() : 0
    return db - da || b.slug.localeCompare(a.slug)
  })

  return items
}

export async function readPost(slug) {
  let fullPath = path.join(postsDir, slug, 'index.mdx')
  try {
    await fs.access(fullPath)
  } catch {
    fullPath = path.join(postsDir, `${slug}.mdx`)
  }
  const source = preprocessSource(await fs.readFile(fullPath, 'utf8'))
  try {
    const { content, frontmatter } = await compileMDX({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions],
          rehypePlugins: [rehypeSlug, rehypePrism, rehypeRewriteRelativeUrls(`/posts/${slug}`, 'posts', slug)],
        },
      },
      components: getMDXComponents(),
    })
    return { frontmatter, content }
  } catch (err) {
    // Fallback: plain markdown render to HTML string
    const { data, content } = matter(source)
    const file = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content)
    return { frontmatter: data, fallbackHtml: String(file) }
  }
}

// Pages helpers
export async function listPages() {
  const items = []
  let entries = []
  try {
    entries = await fs.readdir(pagesDir, { withFileTypes: true })
  } catch {
    return items
  }
  for (const ent of entries) {
    if (ent.isDirectory()) {
      const mdxPath = path.join(pagesDir, ent.name, 'index.mdx')
      try {
        await fs.access(mdxPath)
      } catch { continue }
      try {
        const raw = await fs.readFile(mdxPath, 'utf8')
        const { data } = matter(raw)
        items.push({ slug: ent.name, title: data.title || ent.name, date: data.date || null })
      } catch {/* ignore unreadable */}
    } else if (ent.isFile() && ent.name.endsWith('.mdx')) {
      try {
        const full = path.join(pagesDir, ent.name)
        const raw = await fs.readFile(full, 'utf8')
        const { data } = matter(raw)
        const slug = ent.name.replace(/\.mdx$/, '')
        items.push({ slug, title: data.title || slug, date: data.date || null })
      } catch {/* ignore */}
    }
  }
  return items
}

export async function readPage(slug) {
  let full = path.join(pagesDir, slug, 'index.mdx')
  let isFolder = true
  try {
    await fs.access(full)
  } catch {
    full = path.join(pagesDir, `${slug}.mdx`)
    isFolder = false
  }
  const source = preprocessSource(await fs.readFile(full, 'utf8'))
  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        // For single-file pages, don't add slug to path since assets are in /pages/ not /pages/slug/
        rehypePlugins: [rehypeSlug, rehypePrism, rehypeRewriteRelativeUrls(`/pages`, 'pages', isFolder ? slug : '')],
      },
    },
    components: getMDXComponents(),
  })
  return { frontmatter, content }
}
