export const metadata = {
  title: 'Contact card — Nabil-Fareed Alikhan',
  description: 'Scan to connect with Nabil-Fareed Alikhan.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function CardPage() {
  return (
    <div className="contact-page contact-page-card">
      <section className="contact-card-shell" aria-labelledby="card-name">
        <h1 id="card-name" className="contact-card-name">Nabil-Fareed Alikhan</h1>
        <p className="contact-card-role">Bioinformatics · Pathogen genomics</p>

        <a className="contact-qr-link" href="/hi" aria-label="Open Nabil-Fareed Alikhan's contact page">
          <img
            className="contact-qr"
            src="/images/happykhan-hi-qr.svg"
            alt="QR code with Nabil-Fareed Alikhan's portrait, linking to happykhan.com/hi"
            width="800"
            height="800"
            data-loaded="true"
          />
        </a>

        <p className="contact-scan-label">Scan to open my contact page</p>
        <a className="contact-card-url" href="/hi">happykhan.com/hi</a>
      </section>
    </div>
  )
}
