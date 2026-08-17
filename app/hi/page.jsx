import Image from 'next/image'
import { listMicrobinfie, listPosts } from '@/lib/content.mjs'
import { getDailyItem } from '@/lib/daily-pick.mjs'

const profileImage = '/images/Nabil-FareedAlikhan-neutral-headshot-square.jpg'

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
    title: 'Science and impact',
    description: 'Pathogen genomics, tools and research',
    href: '/science',
  },
  {
    title: 'MicroBinfie',
    description: 'The microbial bioinformatics podcast',
    href: '/microbinfie',
  },
]

const siteDiscoveries = [
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
  const dailyPost = getDailyItem(posts, 20)
  const dailyPodcast = getDailyItem(podcasts, 21)
  const dailySiteDiscovery = getDailyItem(siteDiscoveries, 22)
  const dailyDiscovery = getDailyItem(
    [
      dailyPost && {
        title: dailyPost.title,
        description: 'Research note',
        href: `/posts/${dailyPost.slug}`,
      },
      dailyPodcast && {
        title: dailyPodcast.title,
        description: 'MicroBinfie episode',
        href: `/microbinfie/${dailyPodcast.slug}`,
      },
      dailySiteDiscovery,
    ].filter(Boolean),
    23
  )

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
        <p className="contact-role">Bioinformatics · Microbial genomics · Software</p>
        <p className="contact-intro">
          I build tools and platforms that help people make sense of pathogen genome data.
        </p>

        <div className="contact-actions">
          <a className="contact-button contact-button-primary" href="/nabil-fareed-alikhan.vcf" download>
            Save my contact
          </a>
          <a className="contact-button contact-button-secondary" href="mailto:nabil@happykhan.com">
            Email me
          </a>
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
              Something interesting today
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

        <a className="contact-home-link" href="/">Explore happykhan.com</a>
      </section>
    </div>
  )
}
