export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mizan",
    alternateName: "Mizan - Annuaire des Avocats d'Algérie",
    url: "https://mizan-dz.com",
    logo: "https://mizan-dz.com/logo-512.png",
    image: "https://mizan-dz.com/og-image.png",
    description:
      "Plateforme de mise en relation avec des avocats vérifiés en Algérie. Trouvez et contactez les meilleurs avocats selon votre besoin juridique.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressLocality: "Alger",
      addressRegion: "Alger",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["fr", "ar", "en"],
      areaServed: "DZ",
    },
    sameAs: [
      "https://www.facebook.com/mizan",
      "https://www.linkedin.com/company/mizan",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mizan-dz.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LawyerJsonLd({ avocat }: { avocat: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${avocat.prenom} ${avocat.nom}`,
    jobTitle: "Avocat",
    worksFor: {
      "@type": "Organization",
      name: `Barreau de ${avocat.barreau}`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: avocat.ville,
      addressRegion: avocat.wilaya,
      addressCountry: "DZ",
    },
    knowsAbout: avocat.specialites || [],
    ...(avocat.rating &&
      avocat.reviews_count > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: avocat.rating,
          reviewCount: avocat.reviews_count,
          bestRating: "5",
          worstRating: "1",
        },
      }),
    ...(avocat.contact?.site_web && {
      url: avocat.contact.site_web,
    }),
    ...(avocat.contact?.telephone && {
      telephone: avocat.contact.telephone,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
