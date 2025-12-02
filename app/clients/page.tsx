import type { Metadata } from 'next'
import { ClientPageContent } from './ClientPageContent'

export const metadata: Metadata = {
  title: 'Hire Verified Talent Fast | 2ndShift',
  description: 'Get remote workers, micro-teams, and on-demand task execution within hours. All compliance handled automatically. Replacement guarantee.',
  keywords: 'hire freelancers, remote workers, contract workforce, staff augmentation, hire developers india, hire designers india',
  openGraph: {
    title: 'Hire Verified Talent Fast | 2ndShift',
    description: 'Get remote workers, micro-teams, and on-demand task execution within hours. All compliance handled automatically.',
    url: 'https://2ndshift.com/clients',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2ndshift.com/clients',
  },
}

export default function ClientPage() {
  return <ClientPageContent />
}

