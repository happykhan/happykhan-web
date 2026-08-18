import Image from 'next/image'
import { listMicrobinfie, listPosts } from '@/lib/content.mjs'
import { getDailyItems } from '@/lib/daily-pick.mjs'
import ShareContactButton from '@/components/ShareContactButton'
import { siteMetadata } from '@/siteMetadata'

const profileImage = siteMetadata.image

// Keep the recommendation fresh without requiring a new Netlify deploy.
export const revalidate = 900

const siteDiscoveries = [
  {
    title: 'Science and impact',
    description: 'Pathogen genomics, tools and research',
    href: '/science',
  },
  {
    title: 'MicroBinfie',
    description: 'The microbial bioinformatics podcast',
    href: '/microbinfie',
  },
  {
    title: 'Software I have helped build',
    description: 'Open-source tools for genomic analysis',
    href: '/software',
  },
  {
    title: 'Research notes',
    description: 'Practical guides and longer explanations',
    href: '/posts',
  },
  {
    title: 'Scrapbook',
    description: 'A less formal corner of the site',
    href: '/scrapbook',
  },
  {
    title: 'Publications',
    description: 'Papers, searchable and with full PDFs',
    href: '/publications',
  },
]

const softwareLinks = [
  {
    title: 'BRIGX',
    description: 'Compare bacterial genomes in your browser',
    href: 'https://brigx.genomicx.org/',
  },
  {
    title: 'GrapeTree',
    description: 'Explore genomic relationships interactively',
    href: 'https://achtman-lab.github.io/GrapeTree/MSTree_holder.html',
  },
  {
    title: 'EnteroBase',
    description: 'Population-scale bacterial genomics',
    href: 'https://enterobase.warwick.ac.uk/',
  },
]

export const metadata = {
  title: 'Hello — Nabil-Fareed Alikhan',
  description: 'Contact details and selected links for Nabil-Fareed Alikhan.',
  openGraph: {
    title: 'Nabil-Fareed Alikhan',
    description: 'Bioinformatics, microbial genomics and software.',
    images: [profileImage],
  },
}

export default async function HiPage() {
  const [posts, podcasts] = await Promise.all([listPosts(), listMicrobinfie()])
  const discoveryPool = [
    ...posts.map((post) => ({
      title: post.title,
      description: 'Research note',
      href: `/posts/${post.slug}`,
    })),
    ...podcasts.map((podcast) => ({
      title: podcast.title,
      description: 'MicroBinfie episode',
      href: `/microbinfie/${podcast.slug}`,
    })),
    ...siteDiscoveries,
  ]
  const dailyDiscoveries = getDailyItems(discoveryPool, 3, 23)

  return (
    <div className="contact-page contact-page-hi">
      <section className="contact-shell" aria-labelledby="contact-name">
        <Image
          className="contact-avatar"
          src={profileImage}
          alt="Nabil-Fareed Alikhan"
          width={144}
          height={144}
          priority
        />

        <p className="contact-eyebrow">Hello, I&apos;m</p>
        <h1 id="contact-name" className="contact-name">Nabil-Fareed Alikhan</h1>
        <p className="contact-role">Pathogen genomics · Open science · Software</p>
        <p className="contact-intro">
          I study how pathogens respond to the environments we create, and build open tools that make genome data useful.
        </p>

        <div className="contact-actions">
          <a className="contact-button contact-button-primary" href="/nabil-fareed-alikhan.vcf" download>
            Save my contact
          </a>
          <a className="contact-button contact-button-secondary" href="mailto:nabil@happykhan.com">
            Email me
          </a>
          <ShareContactButton />
        </div>

        <nav className="contact-socials" aria-label="Social profiles">
          <a
            className="contact-social-link"
            href="https://github.com/happykhan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.05.66-3.69-1.3-3.69-1.3-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.07-.67.07-.67 1.1.08 1.68 1.12 1.68 1.12.98 1.66 2.57 1.18 3.19.9.1-.71.38-1.18.69-1.45-2.43-.28-4.99-1.21-4.99-5.39 0-1.19.43-2.16 1.12-2.92-.11-.28-.48-1.42.11-2.95 0 0 .91-.29 2.98 1.11.86-.24 1.78-.36 2.7-.36s1.84.12 2.7.36c2.07-1.4 2.98-1.11 2.98-1.11.59 1.53.22 2.67.11 2.95.69.76 1.12 1.73 1.12 2.92 0 4.19-2.57 5.11-5.01 5.39.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.03 0 .29.2.64.76.53A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/>
            </svg>
          </a>
          <a
            className="contact-social-link"
            href="https://mstdn.science/@happykhan"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="Mastodon"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M23.193 7.879c0-5.206-3.411-6.732-3.411-6.732C18.062.357 15.108.025 12.041 0h-.076c-3.068.025-6.02.357-7.74 1.147 0 0-3.411 1.526-3.411 6.732 0 1.192-.023 2.618.015 4.129.124 5.092.934 10.109 5.641 11.355 2.17.574 4.034.695 5.535.612 2.722-.15 4.25-.972 4.25-.972l-.09-1.975s-1.945.613-4.129.539c-2.165-.074-4.449-.233-4.799-2.891a5.499 5.499 0 0 1-.048-.745s2.125.52 4.817.643c1.646.075 3.19-.097 4.758-.283 3.007-.359 5.625-2.212 5.954-3.905.517-2.665.475-6.507.475-6.507zm-4.024 6.709h-2.497V8.469c0-1.29-.543-1.944-1.628-1.944-1.2 0-1.801.776-1.801 2.312v3.349h-2.483v-3.35c0-1.536-.601-2.312-1.802-2.312-1.085 0-1.628.655-1.628 1.944v6.119H4.832V8.284c0-1.289.328-2.313.987-3.07.679-.757 1.568-1.146 2.673-1.146 1.278 0 2.246.491 2.886 1.474L12 6.585l.622-1.043c.64-.983 1.608-1.474 2.886-1.474 1.104 0 1.994.389 2.673 1.146.658.757.986 1.781.986 3.07v6.304z"/>
            </svg>
          </a>
          <a
            className="contact-social-link"
            href="https://www.linkedin.com/in/nabil-fareed-alikhan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M6.94 8.56H4.17v8.37h2.77V8.56zM5.55 7.07a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69A1.69 1.69 0 0 0 3.86 5.4c0 .93.76 1.68 1.69 1.68zM19.62 16.93v-4.93c0-2.64-1.42-3.86-3.32-3.86-1.53 0-2.22.84-2.6 1.43v-1.22h-2.79v8.58h2.79v-4.76c0-1.26.24-2.48 1.8-2.48 1.53 0 1.55 1.43 1.55 2.56v4.68h2.57z"/>
            </svg>
          </a>
        </nav>

        {dailyDiscoveries.length > 0 && (
          <aside className="contact-discovery" aria-labelledby="contact-discovery-title">
            <p id="contact-discovery-title" className="contact-discovery-label">
              Today&apos;s rabbit holes
            </p>
            <div className="contact-discovery-links">
              {dailyDiscoveries.map((discovery) => (
                <a
                  className="contact-link contact-link-discovery"
                  href={discovery.href}
                  key={discovery.href}
                >
                  <span>
                    <strong>{discovery.title}</strong>
                    <small>{discovery.description}</small>
                  </span>
                  <span className="contact-link-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </aside>
        )}

        <nav className="contact-discovery" aria-labelledby="contact-software-title">
          <p id="contact-software-title" className="contact-discovery-label">Software</p>
          <div className="contact-discovery-links">
            {softwareLinks.map((software) => (
              <a
                className="contact-link"
                href={software.href}
                key={software.title}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <strong>{software.title}</strong>
                  <small>{software.description}</small>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </nav>
      </section>
    </div>
  )
}
