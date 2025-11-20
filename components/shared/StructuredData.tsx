export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '2ndShift',
    alternateName: '2ndShift Technologies Pvt Ltd',
    url: 'https://2ndshift.com',
    logo: 'https://2ndshift.com/logo.png',
    description: 'India\'s first legal, tax-compliant freelance platform for part-time work',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-123-456',
      contactType: 'Customer Service',
      email: 'support@2ndshift.com',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://twitter.com/2ndshift',
      'https://linkedin.com/company/2ndshift',
      'https://facebook.com/2ndshift',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '2ndShift',
    url: 'https://2ndshift.com',
    description: 'India\'s first legal, tax-compliant freelance platform for part-time work',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://2ndshift.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Freelance Platform',
    provider: {
      '@type': 'Organization',
      name: '2ndShift',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Freelance Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tax-Compliant Freelancing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Legal Contract Management',
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
