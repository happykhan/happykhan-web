import Image from 'next/image'
import { listMicrobinfie, listPosts } from '@/lib/content.mjs'
import { getDailyItem } from '@/lib/daily-pick.mjs'
import ShareContactButton from '@/components/ShareContactButton'
import { siteMetadata } from '@/siteMetadata'

const profileImage = siteMetadata.image

// Keep the recommendation fresh without requiring a new Netlify deploy.
export const revalidate = 900

const links = [
  {
    title: 'LinkedIn',
    description: 'Connect with me professionally',
    href: 'https://www.linkedin.com/in/nabil-fareed-alikhan/',
    external: true,
  },
  {
    title: 'GitHub',
    description: 'Code and open-source projects',
    href: 'https://github.com/happykhan',
    external: true,
  },
  {
    title: 'Explore my website',
    description: 'Science, software, writing and podcast',
    href: '/',
  },
]

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
  const dailyDiscovery = getDailyItem(discoveryPool, 23)

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

        <nav className="contact-links" aria-label="Nabil's links">
          {links.map((link) => (
            <a
              className="contact-link"
              href={link.href}
              key={link.title}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span>
                <strong>{link.title}</strong>
                <small>{link.description}</small>
              </span>
              <span className="contact-link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>

        {dailyDiscovery && (
          <aside className="contact-discovery" aria-labelledby="contact-discovery-title">
            <p id="contact-discovery-title" className="contact-discovery-label">
              Today&apos;s rabbit hole
            </p>
            <a className="contact-link contact-link-discovery" href={dailyDiscovery.href}>
              <span>
                <strong>{dailyDiscovery.title}</strong>
                <small>{dailyDiscovery.description}</small>
              </span>
              <span className="contact-link-arrow" aria-hidden="true">→</span>
            </a>
          </aside>
        )}
      </section>
    </div>
  )
}
