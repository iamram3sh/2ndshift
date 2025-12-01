import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

// Inter - The industry standard for professional SaaS
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: '2ndShift - Enterprise Talent Platform | Tax-Compliant Contract Workforce',
  description: 'India\'s premier platform for compliant contract workforce. Access 5,000+ verified professionals. Automatic TDS, GST compliance, and professional contracts. Trusted by 500+ companies.',
  keywords: 'contract workforce india, compliant freelancing, enterprise talent platform, TDS compliance, GST freelance, verified professionals, staff augmentation india',
  authors: [{ name: '2ndShift Technologies' }],
  creator: '2ndShift',
  publisher: '2ndShift Technologies',
  robots: 'index, follow',
  metadataBase: new URL('https://2ndshift.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://2ndshift.com',
    title: '2ndShift - Enterprise Talent Platform',
    description: 'India\'s premier platform for compliant contract workforce. Trusted by 500+ companies.',
    siteName: '2ndShift',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '2ndShift - Enterprise Talent Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2ndShift - Enterprise Talent Platform',
    description: 'India\'s premier platform for compliant contract workforce.',
    creator: '@2ndshift',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://2ndshift.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
