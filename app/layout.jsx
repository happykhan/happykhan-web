import './globals.css'
import { siteMetadata } from '@/siteMetadata'
import ImageLoader from '@/components/ImageLoader'
import MobileNav from '@/components/MobileNav'
import DarkModeToggle from '@/components/DarkModeToggle'
import { Libre_Franklin, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: siteMetadata.title,
    template: '%s | Happykhan',
  },
  description: siteMetadata.description,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteMetadata.url,
    siteName: 'Happykhan',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: new URL(siteMetadata.image, siteMetadata.url).toString(),
        width: 800,
        height: 800,
        alt: 'Nabil-Fareed Alikhan portrait',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteMetadata.twitterUsername,
    creator: siteMetadata.twitterUsername,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [new URL(siteMetadata.image, siteMetadata.url).toString()],
  },
  alternates: {
    types: {
      'application/atom+xml': '/feed.atom',
      'application/rss+xml': '/rss.xml',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreFranklin.className} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash of unstyled content: set initial theme before CSS paints */}
        <meta name="color-scheme" content="light dark" />
        {/* Feed discovery - Atom (preferred) */}
        <link rel="alternate" type="application/atom+xml" title="Research Notes — Happykhan" href="/feed.atom" />
        {/* Feed discovery - RSS 2.0 (legacy compatibility) */}
        <link rel="alternate" type="application/rss+xml" title="Research Notes — Happykhan (RSS)" href="/rss.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
  const ls = localStorage.getItem('theme');
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const theme = ls ? ls : (mql.matches ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = theme;
} catch {} })();`,
          }}
        />
        <ImageLoader />
      </head>
      <body>
        <header style={{ 
          marginBottom: '3rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--color-border)'
        }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <a href="/" style={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      display: 'inline-block'
                    }}>
                      <h1 style={{ 
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: 700
                      }}>
                        Nabil-Fareed Alikhan
                      </h1>
                    </a>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <DarkModeToggle />
                      <MobileNav />
                    </div>
                  </div>
                  <p style={{ 
                    marginTop: '0.25rem',
                    marginBottom: '1rem',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.95rem'
                  }}>
                    Bioinformatics · Microbial Genomics · Software Development
                  </p>
                  <nav 
                    className="desktop-nav"
                    style={{ 
                      display: 'flex',
                      gap: '1.5rem',
                      flexWrap: 'wrap',
                      fontSize: '0.95rem'
                    }}
                  >
                    <a href="/" style={{ fontWeight: 500 }}>Home</a>
                    <a href="/about" style={{ fontWeight: 500 }}>About</a>
                    <a href="/software" style={{ fontWeight: 500 }}>Software</a>
                    <a href="/publications" style={{ fontWeight: 500 }}>Publications</a>
                    <a href="/microbinfie" style={{ fontWeight: 500 }}>MicroBinfie Podcast</a>
                    <a href="/posts" style={{ fontWeight: 500 }}>Research Notes</a>
                  </nav>
                </div>
        </header>
        <main style={{ flex: '1 0 auto' }}>
          {children}
        </main>
        <footer style={{ 
          marginTop: '5rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <a href="/rss.xml">RSS (Research Notes)</a>
            <a href="/rss-microbinfie.xml">RSS (MicroBinfie)</a>
            <a href="https://github.com/happykhan" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://mstdn.science/@happykhan" target="_blank" rel="me noopener noreferrer">Mastodon</a>
          </div>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Nabil-Fareed Alikhan
          </p>
        </footer>
      </body>
    </html>
  )
}
