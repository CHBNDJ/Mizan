import { Metadata } from "next";

export const siteConfig = {
  name: "Mizan",
  description:
    "Plateforme de mise en relation avec des avocats vérifiés en Algérie. Trouvez l'avocat qui vous convient selon votre besoin juridique.",
  url: "https://mizan-dz.com", // ← Changez par votre vrai domaine
  ogImage: "https://mizan-dz.com/og-image.jpg",
};

// Homepage
export const homeMetadata: Metadata = {
  title:
    "Mizan - Trouvez un avocat en Algérie | Consultation juridique en ligne",
  description:
    "Trouvez rapidement un avocat qualifié en Algérie. Consultation juridique en ligne, avocats vérifiés spécialisés en droit des affaires, divorce, immobilier. Alger, Oran, Constantine.",
  keywords: [
    "avocat algérie",
    "avocat alger",
    "consultation juridique",
    "avocat en ligne",
    "trouver avocat",
    "avocat oran",
    "avocat constantine",
  ],
  authors: [{ name: "Mizan" }],
  creator: "Mizan",
  publisher: "Mizan",
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: siteConfig.url,
    title: "Mizan - Trouvez un avocat en Algérie",
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
    title: "Mizan - Trouvez un avocat en Algérie",
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

// Page Avocats
export const avocatsMetadata: Metadata = {
  title: "Nos Avocats Vérifiés | Mizan Algérie",
  description:
    "Consultez notre annuaire d'avocats vérifiés en Algérie. Filtrez par ville (Alger, Oran, Constantine) et spécialité juridique. Profils détaillés et avis clients.",
  keywords: [
    "annuaire avocat",
    "avocats algérie",
    "avocat alger",
    "avocat oran",
    "trouver avocat spécialisé",
  ],
  openGraph: {
    title: "Nos Avocats Vérifiés | Mizan Algérie",
    description: "Consultez notre annuaire d'avocats vérifiés en Algérie.",
    url: `${siteConfig.url}/avocats`,
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/avocats`,
  },
};

// Page Contact
export const contactMetadata: Metadata = {
  title: "Contactez-nous | Mizan",
  description:
    "Besoin d'aide ? Contactez l'équipe Mizan. Nous sommes là pour répondre à vos questions sur notre plateforme juridique.",
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

// Fonction pour générer metadata dynamique pour chaque avocat
export function generateAvocatMetadata(
  avocat: {
    prenom: string;
    nom: string;
    specialite: string;
    ville: string;
    barreau: string;
    bio?: string;
  },
  lawyerId?: string
): Metadata {
  const fullName = `${avocat.prenom} ${avocat.nom}`;
  const title = `Maître ${fullName} - Avocat ${avocat.specialite} à ${avocat.ville} | Mizan`;
  const description = avocat.bio
    ? `${avocat.bio.substring(0, 150)}...`
    : `Consultez le profil de Maître ${fullName}, avocat spécialisé en ${avocat.specialite} inscrit au barreau de ${avocat.barreau}. Prenez rendez-vous en ligne sur Mizan.`;

  // Construire l'URL avec l'ID si fourni
  const profileUrl = lawyerId
    ? `${siteConfig.url}/lawyers/${lawyerId}`
    : `${siteConfig.url}/lawyers`;

  return {
    title,
    description,
    keywords: [
      `avocat ${avocat.specialite.toLowerCase()}`,
      `avocat ${avocat.ville.toLowerCase()}`,
      fullName,
      `maître ${avocat.nom.toLowerCase()}`,
      `barreau ${avocat.barreau.toLowerCase()}`,
    ],
    openGraph: {
      title: `Maître ${fullName} - Avocat ${avocat.specialite}`,
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
