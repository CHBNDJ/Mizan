import { Metadata } from "next";

export const siteConfig = {
  name: "Mizan",
  description:
    "Plateforme de mise en relation avec des avocats vérifiés en Algérie. Trouvez l'avocat qui vous convient selon votre besoin juridique.",
  url: "https://mizan-dz.com",
  ogImage: "https://mizan-dz.com/og-image.png",
};

export const homeMetadata: Metadata = {
  title:
    "Mizan - Trouvez votre avocat en Algérie | Consultation juridique en ligne",
  description:
    "Trouvez rapidement un avocat qualifié en Algérie. Consultation juridique en ligne, avocats vérifiés spécialisés en droit des affaires, divorce, immobilier, succession. Que vous soyez en Algérie ou à l'étranger. Alger, Oran, Constantine, Annaba, Sétif.",
  keywords: [
    // Core Algérie
    "avocat algérie",
    "avocat alger",
    "avocat oran",
    "avocat constantine",
    "avocat annaba",
    "consultation juridique algérie",
    "avocat en ligne algérie",
    "trouver avocat algérie",

    // International
    "avocat algérien",
    "consultation juridique en ligne",
    "avocat distance",
    "cabinet avocat alger",

    // Spécialités
    "avocat divorce algérie",
    "avocat immobilier algérie",
    "avocat succession algérie",
    "avocat droit affaires algérie",

    // Arabe
    "محامي الجزائر",
    "محامي عبر الإنترنت",
    "استشارة قانونية الجزائر",
  ],
  authors: [{ name: "Mizan" }],
  creator: "Mizan",
  publisher: "Mizan",

  other: {
    "geo.region": "DZ",
    "geo.placename": "Algérie",
    "geo.position": "36.7538;3.0588",
  },

  openGraph: {
    type: "website",
    locale: "fr_DZ",
    alternateLocale: ["fr_FR", "ar_DZ", "en_US"],
    url: siteConfig.url,
    title: "Mizan - Trouvez votre avocat en Algérie",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Mizan - Plateforme juridique Algérie",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mizan - Trouvez votre avocat en Algérie",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteConfig.url,
  },
};

export const searchMetadata: Metadata = {
  title: "Rechercher un Avocat | Mizan Algérie",
  description:
    "Recherchez et trouvez un avocat vérifié en Algérie. Filtrez par ville (Alger, Oran, Constantine, Annaba, Sétif) et spécialité juridique. Profils détaillés et avis clients.",
  keywords: [
    "rechercher avocat algérie",
    "trouver avocat",
    "avocat alger",
    "avocat oran",
    "avocat constantine",
    "avocat spécialisé",
    "annuaire avocat algérie",
  ],
  openGraph: {
    title: "Rechercher un Avocat | Mizan Algérie",
    description: "Recherchez et trouvez un avocat vérifié en Algérie.",
    url: `${siteConfig.url}/search`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/search`,
  },
};

export const contactMetadata: Metadata = {
  title: "Contactez-nous | Mizan",
  description:
    "Besoin d'aide ? Contactez l'équipe Mizan. Nous sommes là pour répondre à vos questions sur notre plateforme juridique.",
  keywords: [
    "contact mizan",
    "aide mizan",
    "support client",
    "contacter mizan",
  ],
  openGraph: {
    title: "Contactez-nous | Mizan",
    description: "Besoin d'aide ? Contactez l'équipe Mizan.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export const howItWorksMetadata: Metadata = {
  title: "Comment ça marche | Mizan",
  description:
    "Découvrez comment Mizan vous aide à trouver le bon avocat en Algérie en 3 étapes simples. Consultations juridiques en ligne, recherche par spécialité et localisation.",
  keywords: [
    "comment ça marche mizan",
    "trouver avocat étapes",
    "utiliser mizan",
    "consultation en ligne",
  ],
  openGraph: {
    title: "Comment ça marche | Mizan",
    description: "Trouvez votre avocat en 3 étapes simples.",
    url: `${siteConfig.url}/howitworks`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/howitworks`,
  },
};

export const faqMetadata: Metadata = {
  title: "Questions Fréquentes (FAQ) | Mizan",
  description:
    "Toutes vos questions sur Mizan : Comment trouver un avocat ? Comment ça marche ? Est-ce gratuit ? Avocats vérifiés en Algérie.",
  keywords: [
    "faq mizan",
    "questions fréquentes",
    "aide mizan",
    "comment trouver avocat",
  ],
  openGraph: {
    title: "Questions Fréquentes (FAQ) | Mizan",
    description: "Toutes vos questions sur Mizan.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
};

export const cguMetadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Mizan",
  description:
    "Conditions générales d'utilisation de la plateforme Mizan. Droits et obligations des utilisateurs et des avocats.",
  openGraph: {
    title: "Conditions Générales d'Utilisation | Mizan",
    description: "Conditions d'utilisation de Mizan.",
    url: `${siteConfig.url}/cgu`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/cgu`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export const privacyMetadata: Metadata = {
  title: "Politique de Confidentialité | Mizan",
  description:
    "Politique de confidentialité de Mizan. Comment nous collectons, utilisons et protégeons vos données personnelles.",
  openGraph: {
    title: "Politique de Confidentialité | Mizan",
    description: "Protection de vos données sur Mizan.",
    url: `${siteConfig.url}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export const legalMetadata: Metadata = {
  title: "Mentions Légales | Mizan",
  description:
    "Mentions légales de la plateforme Mizan. Éditeur, hébergeur et informations légales.",
  openGraph: {
    title: "Mentions Légales | Mizan",
    description: "Informations légales sur Mizan.",
    url: `${siteConfig.url}/legal`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/legal`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export function generateAvocatMetadata(
  avocat: {
    prenom: string;
    nom: string;
    specialites?: string[];
    ville: string;
    barreau: string;
    bio?: string;
  },
  lawyerId?: string
): Metadata {
  const fullName = `${avocat.prenom} ${avocat.nom}`;
  const specialite = avocat.specialites?.[0] || "Avocat";
  const title = `Maître ${fullName} - ${specialite} à ${avocat.ville} | Mizan`;
  const description = avocat.bio
    ? `${avocat.bio.substring(0, 150)}...`
    : `Consultez le profil de Maître ${fullName}, avocat spécialisé en ${specialite} inscrit au barreau de ${avocat.barreau}. Prenez rendez-vous en ligne sur Mizan.`;

  const profileUrl = lawyerId
    ? `${siteConfig.url}/lawyers/${lawyerId}`
    : `${siteConfig.url}/lawyers`;

  return {
    title,
    description,
    keywords: [
      `avocat ${specialite.toLowerCase()}`,
      `avocat ${avocat.ville.toLowerCase()}`,
      fullName,
      `maître ${avocat.nom.toLowerCase()}`,
      `barreau ${avocat.barreau.toLowerCase()}`,
    ],
    openGraph: {
      title: `Maître ${fullName} - ${specialite}`,
      description,
      url: profileUrl,
      type: "profile",
    },
    alternates: {
      canonical: profileUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateWilayaMetadata(wilaya: string): Metadata {
  return {
    title: `Avocats à ${wilaya} | Mizan Algérie`,
    description: `Trouvez les meilleurs avocats vérifiés à ${wilaya}, Algérie. Consultez les profils, spécialités juridiques et avis clients. Consultations en ligne disponibles.`,
    keywords: [
      `avocat ${wilaya.toLowerCase()}`,
      `avocats ${wilaya.toLowerCase()}`,
      `consultation juridique ${wilaya.toLowerCase()}`,
      `cabinet avocat ${wilaya.toLowerCase()}`,
      `trouver avocat ${wilaya.toLowerCase()}`,
      `barreau ${wilaya.toLowerCase()}`,
    ],
    openGraph: {
      title: `Avocats à ${wilaya} | Mizan Algérie`,
      description: `Trouvez les meilleurs avocats vérifiés à ${wilaya}.`,
      url: `${siteConfig.url}/wilayas/${wilaya}`,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `Avocats à ${wilaya} - Mizan`,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.url}/wilayas/${wilaya}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
