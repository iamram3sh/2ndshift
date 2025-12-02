import type { Metadata } from 'next'
import { WorkerPageContent } from './WorkerPageContent'

export const metadata: Metadata = {
  title: 'Find Remote Work in India | 2ndShift',
  description: 'Earn from anywhere with verified remote jobs. Get paid within 24 hours. Zero platform fees. TDS & GST handled automatically.',
  keywords: 'remote work india, freelance jobs, part-time work, work from home, remote jobs india, freelance opportunities',
  openGraph: {
    title: 'Find Remote Work in India | 2ndShift',
    description: 'Earn from anywhere with verified remote jobs. Get paid within 24 hours. Zero platform fees.',
    url: 'https://2ndshift.com/work',
    type: 'website',
  },
  alternates: {
    canonical: 'https://2ndshift.com/work',
  },
}

export default function WorkerPage() {
  return <WorkerPageContent initialRole="worker" />
}

