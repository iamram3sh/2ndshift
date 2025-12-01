import './globals.css'
import { Outfit, Sora } from 'next/font/google'
import type { Metadata } from 'next'

// Modern geometric sans-serif for body text
const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

// Bold modern font for headings
const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: '2ndShift - India\'s Legal Freelance Platform | Tax-Compliant Part-Time Work',
  description: 'Connect verified professionals with compliant, legal after-work opportunities. Fully tax-compliant with automatic TDS, GST, and professional contracts. Join 2,500+ professionals earning extra income safely.',
  keywords: 'freelance india, part-time work, tax compliant freelancing, legal freelance platform, TDS compliance, GST freelance, verified professionals, side income india',
  authors: [{ name: '2ndShift Technologies' }],
  creator: '2ndShift',
  publisher: '2ndShift Technologies',
  robots: 'index, follow',
  metadataBase: new URL('https://2ndshift.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://2ndshift.com',
    title: '2ndShift - India\'s Legal Freelance Platform',
    description: 'India\'s first legal, tax-compliant freelance platform for part-time work. Empowering professionals to earn extra income safely and legally.',
    siteName: '2ndShift',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '2ndShift - Legal Freelance Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2ndShift - India\'s Legal Freelance Platform',
    description: 'Connect verified professionals with compliant, legal after-work opportunities.',
    creator: '@2ndshift',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://2ndshift.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${sora.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#05c8b1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${outfit.className} antialiased`}>
        {children}
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fef3c7' }}>
            Please enable JavaScript to use 2ndShift platform.
          </div>
        </noscript>
      </body>
    </html>
  )
}
