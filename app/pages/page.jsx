import Link from 'next/link'
import { listPages } from "@/lib/content.mjs"

export const metadata = {
  title: 'Pages — Happykhan',
}

export default async function PagesIndex() {
  const items = await listPages()
  return (
    <section>
      <h2>Pages</h2>
      <ul>
        {items.map(item => (
          <li key={item.slug}>
            <Link href={`/pages/${item.slug}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
