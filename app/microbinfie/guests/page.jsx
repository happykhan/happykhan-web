import { getGuestsByAppearances } from '@/lib/guests'
import GuestsClient from './GuestsClient'

export const metadata = {
  title: 'Podcast Guests — MicroBinfie',
  description: 'All guests who have appeared on the MicroBinfie podcast',
  openGraph: {
    title: 'MicroBinfie Podcast Guests',
    description: 'All the wonderful people who have joined us on the MicroBinfie podcast',
    type: 'website',
    url: 'https://happykhan.com/microbinfie/guests',
    images: [
      {
        url: 'https://happykhan.com/images/Nabil-FareedAlikhan-portSQ.jpg',
        width: 800,
        height: 800,
        alt: 'MicroBinfie Podcast',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'MicroBinfie Podcast Guests',
    description: 'All the wonderful people who have joined us on the MicroBinfie podcast',
    images: ['https://happykhan.com/images/Nabil-FareedAlikhan-portSQ.jpg'],
  },
}

export default async function GuestsPage() {
  const guests = await getGuestsByAppearances()
  
  return <GuestsClient guests={guests} />
}
