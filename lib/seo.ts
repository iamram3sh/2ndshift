// SEO Utilities and Meta Tag Configurations

export const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://2ndshift.in'

export const defaultSEO = {
  title: '2ndShift - India\'s First Legal, Tax-Compliant Freelance Platform',
  description: 'Join 5000+ professionals earning legally on 2ndShift. 100% tax-compliant with automatic TDS, GST, and Form 16A. Find verified work or hire top talent.',
  keywords: 'freelance platform India, tax compliant freelancing, part-time work India, TDS compliance, Form 16A, legal freelancing, verified freelancers',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    siteName: '2ndShift',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: '2ndShift - Legal Freelance Platform',
      },
    ],
  },
  twitter: {
    handle: '@2ndshift',
    site: '@2ndshift',
    cardType: 'summary_large_image',
  },
}

export const pageSEO = {
  home: {
    title: '2ndShift - Legal, Tax-Compliant Freelance Platform | Find Work or Hire Talent',
    description: 'India\'s first 100% legal freelance platform. Automatic TDS, GST compliance, instant payments. Join 5000+ workers earning safely.',
    keywords: 'freelance jobs India, part-time work, tax compliant freelancing, hire freelancers India',
  },
  
  about: {
    title: 'About 2ndShift - Our Mission to Make Freelancing Legal in India',
    description: 'Learn about 2ndShift\'s mission to provide fully compliant, legal freelance opportunities. Tax compliance, worker protection, and fair compensation.',
    keywords: 'about 2ndshift, freelance compliance, legal freelancing India',
  },
  
  workers: {
    title: 'For Workers - Earn Extra Income Legally | 2ndShift',
    description: 'Find verified part-time projects. Automatic TDS, instant payments, professional contracts. Keep 90% of project value. Join 5000+ workers.',
    keywords: 'freelance work India, part-time jobs, extra income, online work India',
  },
  
  employers: {
    title: 'For Employers - Hire Verified Talent with Complete Compliance | 2ndShift',
    description: 'Access 5000+ verified professionals. Automatic TDS & GST compliance, legal contracts, escrow protection. Post jobs for free.',
    keywords: 'hire freelancers India, find contractors, verified talent India',
  },
  
  pricing: {
    title: 'Pricing - Simple, Transparent Fees | 2ndShift',
    description: 'Workers: Free to join. Employers: 10% + GST per hire. All compliance included. No hidden fees. Enterprise plans available.',
    keywords: '2ndshift pricing, freelance platform fees, transparent pricing',
  },
  
  howItWorks: {
    title: 'How It Works - Simple 4-Step Process | 2ndShift',
    description: 'For Workers: Sign up → Get verified → Browse projects → Get paid. For Employers: Post job → Review proposals → Hire → Track work.',
    keywords: 'how freelancing works, project process, hiring process',
  },
  
  faq: {
    title: 'FAQ - Frequently Asked Questions | 2ndShift',
    description: 'Get answers about tax compliance, TDS, payments, Form 16A, contracts, and more. Complete guide to using 2ndShift safely.',
    keywords: 'freelance faq, TDS questions, tax compliance help',
  },
  
  contact: {
    title: 'Contact Us - Get in Touch with 2ndShift Support',
    description: 'Have questions? Contact our team. Email support (24h response), phone support (9 AM - 6 PM IST), or visit our Bangalore office.',
    keywords: 'contact 2ndshift, customer support, help center',
  },
  
  careers: {
    title: 'Careers - Join Our Mission | 2ndShift',
    description: 'Join our team building India\'s most trusted freelance platform. Open positions in engineering, design, marketing, and more.',
    keywords: 'jobs at 2ndshift, careers, hiring, remote work',
  },
  
  login: {
    title: 'Sign In to Your Account | 2ndShift',
    description: 'Access your 2ndShift dashboard. Manage projects, track earnings, view contracts, and more.',
  },
  
  register: {
    title: 'Create Your Free Account | 2ndShift',
    description: 'Join as a worker to find projects or as an employer to hire talent. 100% free registration. Get verified in 24 hours.',
  },
  
  projects: {
    title: 'Browse Projects - Find Your Next Opportunity | 2ndShift',
    description: 'Explore verified projects across tech, design, marketing, and more. Filter by skills, budget, and timeline.',
  },
}

// Generate structured data for SEO
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '2ndShift',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  sameAs: [
    'https://twitter.com/2ndshift',
    'https://linkedin.com/company/2ndshift',
    'https://instagram.com/2ndshift',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-80712-34567',
    contactType: 'customer service',
    email: 'support@2ndshift.in',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
})

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${baseUrl}${item.url}`,
  })),
})

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})
