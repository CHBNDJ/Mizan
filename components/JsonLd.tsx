export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mizan",
    url: "https://mizan-dz.com",
    logo: "https://mizan-dz.com/logo.png",
    description:
      "Plateforme de mise en relation avec des avocats vérifiés en Algérie",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressLocality: "Alger",
    },
    sameAs: [
      "https://www.facebook.com/mizan",
      "https://www.linkedin.com/company/mizan",
    ],
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
      name: avocat.barreau,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: avocat.ville,
      addressCountry: "DZ",
    },
    knowsAbout: avocat.specialite,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
