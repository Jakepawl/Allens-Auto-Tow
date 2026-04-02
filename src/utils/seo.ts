import { business } from './business-info';

export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export function buildMeta(page: PageSEO) {
  return {
    title: page.title,
    description: page.description,
    canonical: page.canonical ?? business.url,
    openGraph: {
      basic: {
        title: page.title,
        type: page.type ?? 'website',
        image: page.ogImage ?? `${business.url}/images/og-default.webp`,
      },
      optional: {
        description: page.description,
        locale: 'en_US',
        siteName: business.name,
      },
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: page.title,
      description: page.description,
      image: page.ogImage ?? `${business.url}/images/og-default.webp`,
    },
  };
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.phone.repairTel,
    foundingDate: String(business.foundingYear),
    priceRange: business.priceRange,
    paymentAccepted: business.paymentMethods.join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    areaServed: business.serviceArea.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Auto Repair Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Auto Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brake Service' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Towing & Recovery' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tire Sales & Service' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Repair' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Smog Check' } },
      ],
    },
    sameAs: [business.social.facebook, business.social.googleMaps],
  };
}

export function buildServiceSchema(service: { name: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${business.url}/services/${service.slug}`,
    provider: {
      '@type': 'AutoRepair',
      name: business.name,
      telephone: business.phone.repairTel,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        addressRegion: business.address.state,
        postalCode: business.address.zip,
      },
    },
    areaServed: {
      '@type': 'City',
      name: business.address.city,
    },
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
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
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
