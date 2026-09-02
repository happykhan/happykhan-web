import PrintButton from '../cv-print/PrintButton'
import { generalIndustryCv as cv } from '../cv-ind/generalIndustryCv'

export const metadata = {
  title: 'Industry CV (Print) | Nabil-Fareed Alikhan',
  description: cv.profile,
}

function Section({ title, children, className = '' }) {
  return (
    <section className={`cv-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function LabelledList({ items }) {
  return (
    <ul className="labelled-list">
      {items.map((item) => (
        <li key={item.title}>
          <strong>{item.title}:</strong> {item.text}
          {item.href && <> <a href={item.href}>{item.linkLabel}</a></>}
        </li>
      ))}
    </ul>
  )
}

export default function PrintIndCVPage() {
  return (
    <div className="print-cv">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" />
      <style>{`
        body {
          background: #eceff1 !important;
          color: #17202a !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }
        body > header, body > footer, .mobile-nav, nav.desktop-nav { display: none !important; }
        .print-cv {
          width: 210mm;
          margin: 1.25rem auto;
          background: #fff;
          font-family: 'Libre Franklin', Arial, sans-serif;
          font-size: 8.45pt;
          line-height: 1.37;
          color: #26323d;
          box-shadow: 0 5px 24px rgba(20, 35, 50, 0.16);
        }
        .cv-header {
          background: #2d4052;
          color: #fff;
          padding: 11mm 13mm 8mm;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cv-header h1 { margin: 0; font-size: 23pt; line-height: 1.06; letter-spacing: -0.035em; font-weight: 700; }
        .strapline { margin: 3mm 0 3.5mm; font-size: 10pt; font-weight: 600; }
        .profile { margin: 0; max-width: 175mm; font-size: 8.8pt; line-height: 1.42; color: rgba(255,255,255,0.94); }
        .contact-line {
          display: flex;
          align-items: center;
          gap: 2.2mm 4.5mm;
          margin-top: 5mm;
          padding-top: 3.5mm;
          border-top: 1px solid rgba(255,255,255,0.28);
          white-space: nowrap;
          font-size: 7.35pt;
        }
        .contact-line span { display: inline-flex; gap: 1.2mm; }
        .contact-line b { color: rgba(255,255,255,0.68); font-weight: 500; }
        .contact-line a, .contact-line span { color: #fff; text-decoration: none; }
        .cv-body { padding: 7mm 13mm 11mm; }
        .cv-section { margin: 0 0 5mm; }
        .cv-section h2 {
          margin: 0 0 2.6mm;
          padding-bottom: 1.4mm;
          border-bottom: 1.5px solid #607d8b;
          color: #2d4052;
          font-size: 10.5pt;
          line-height: 1.15;
          text-transform: uppercase;
          letter-spacing: 0.055em;
        }
        ul { margin: 0; padding-left: 4.5mm; }
        li { margin: 0 0 1.2mm; padding-left: 0.6mm; }
        li::marker { color: #607d8b; }
        a { color: #315f7b; text-decoration: none; }
        .labelled-list strong { color: #2d4052; }
        .role { margin-bottom: 3.5mm; break-inside: avoid; page-break-inside: avoid; }
        .role-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 5mm; }
        .role h3 { margin: 0; color: #182733; font-size: 9.2pt; line-height: 1.2; }
        .role-period { flex: none; color: #596873; font-size: 7.8pt; font-weight: 600; }
        .role-meta { margin: 0.7mm 0 1.5mm; color: #596873; font-size: 7.9pt; font-style: italic; }
        .software-section, .leadership-section, .education-section { break-inside: avoid; page-break-inside: avoid; }
        .education-list { list-style: none; padding: 0; }
        .education-list li { display: grid; grid-template-columns: 1fr auto; gap: 5mm; margin-bottom: 1.5mm; padding: 0; }
        .education-list strong { color: #2d4052; }
        .education-period { color: #596873; font-weight: 600; }
        .no-print {
          position: fixed; top: 1rem; right: 1rem; z-index: 1000;
          background: white; padding: 1rem; border: 1px solid #ddd;
          border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        @page { size: A4; margin: 0; }
        @media print {
          body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-cv { width: 210mm; margin: 0; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print"><PrintButton /></div>

      <header className="cv-header">
        <h1>{cv.name}</h1>
        <p className="strapline">{cv.strapline}</p>
        <p className="profile">{cv.profile}</p>
        <div className="contact-line">
          {cv.contact.map((item) => (
            <span key={item.label}>
              <b>{item.label}</b>
              {item.href ? <a href={item.href}>{item.value}</a> : item.value}
            </span>
          ))}
        </div>
      </header>

      <main className="cv-body">
        <Section title="Expertise"><LabelledList items={cv.expertise} /></Section>
        <Section title="Experience">
          {cv.experience.map((role) => (
            <article className="role" key={`${role.title}-${role.period}`}>
              <div className="role-heading">
                <h3>{role.title}</h3>
                <span className="role-period">{role.period}</span>
              </div>
              <p className="role-meta">{role.organisation} | {role.location}</p>
              <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </article>
          ))}
        </Section>
        <Section title="Software portfolio" className="software-section"><LabelledList items={cv.software} /></Section>
        <Section title="Professional leadership and engagement" className="leadership-section"><LabelledList items={cv.leadership} /></Section>
        <Section title="Education" className="education-section">
          <ul className="education-list">
            {cv.education.map((item) => (
              <li key={item.qualification}>
                <span><strong>{item.qualification}</strong>, {item.institution}</span>
                <span className="education-period">{item.period}</span>
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </div>
  )
}
