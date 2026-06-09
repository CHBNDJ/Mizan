import { Metadata } from "next";

export const siteConfig = {
  name: "Mizan",
  description:
    "Plateforme de mise en relation avec des experts juridiques vérifiés en Algérie. Avocats, notaires, huissiers, comptables.",
  url: "https://mizan-dz.com",
  ogImage: "https://mizan-dz.com/og-image.png",
};

export const homeMetadata: Metadata = {
  title: "Mizan — Trouvez votre expert juridique en Algérie",
  description:
    "Trouvez rapidement un avocat, notaire, huissier ou comptable vérifié en Algérie. Experts vérifiés dans toutes les wilayas. Que vous soyez en Algérie ou à l'étranger. Alger, Oran, Constantine, Annaba, Sétif.",
  keywords: [
    "avocat algérie",
    "notaire algérie",
    "huissier algérie",
    "comptable algérie",
    "expert juridique algérie",
    "consultant juridique algérie",
    "avocat alger",
    "avocat oran",
    "avocat constantine",
    "consultation juridique algérie",
    "annuaire juridique algérie",
    "محامي الجزائر",
    "موثق الجزائر",
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
    title: "Mizan — Trouvez votre expert juridique en Algérie",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Mizan — Experts juridiques Algérie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan — Experts juridiques Algérie",
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
  alternates: { canonical: siteConfig.url },
};

export const searchMetadata: Metadata = {
  title: "Rechercher un expert juridique | Mizan Algérie",
  description:
    "Recherchez un avocat, notaire, huissier ou comptable vérifié en Algérie. Filtrez par wilaya et domaine d'intervention. Profils détaillés et avis clients.",
  keywords: [
    "rechercher avocat algérie",
    "trouver notaire",
    "huissier algérie",
    "comptable algérie",
    "annuaire juridique",
  ],
  openGraph: {
    title: "Rechercher un expert juridique | Mizan",
    description: "Trouvez votre expert juridique vérifié en Algérie.",
    url: `${siteConfig.url}/search`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/search` },
};

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
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export const howItWorksMetadata: Metadata = {
  title: "Comment ça marche | Mizan",
  description:
    "Découvrez comment Mizan vous aide à trouver le bon expert juridique en Algérie en 3 étapes simples.",
  openGraph: {
    title: "Comment ça marche | Mizan",
    description: "Trouvez votre expert en 3 étapes simples.",
    url: `${siteConfig.url}/howitworks`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/howitworks` },
};

export const faqMetadata: Metadata = {
  title: "Questions Fréquentes (FAQ) | Mizan",
  description:
    "Toutes vos questions sur Mizan : avocats, notaires, huissiers, comptables vérifiés en Algérie. Comment ça marche ? Est-ce gratuit ?",
  openGraph: {
    title: "FAQ | Mizan",
    description: "Toutes vos questions sur Mizan.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/faq` },
};

export const cguMetadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Mizan",
  description: "Conditions générales d'utilisation de la plateforme Mizan.",
  openGraph: {
    title: "CGU | Mizan",
    description: "Conditions d'utilisation de Mizan.",
    url: `${siteConfig.url}/cgu`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/cgu` },
  robots: { index: false, follow: true },
};

export const privacyMetadata: Metadata = {
  title: "Politique de Confidentialité | Mizan",
  description:
    "Politique de confidentialité de Mizan. Comment nous collectons, utilisons et protégeons vos données.",
  openGraph: {
    title: "Confidentialité | Mizan",
    description: "Protection de vos données sur Mizan.",
    url: `${siteConfig.url}/privacy`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/privacy` },
  robots: { index: false, follow: true },
};

export const legalMetadata: Metadata = {
  title: "Mentions Légales | Mizan",
  description: "Mentions légales de la plateforme Mizan.",
  openGraph: {
    title: "Mentions Légales | Mizan",
    description: "Informations légales sur Mizan.",
    url: `${siteConfig.url}/legal`,
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/legal` },
  robots: { index: false, follow: true },
};

const PROF_META: Record<
  string,
  { singular: string; plural: string; numLabel: string }
> = {
  avocat: {
    singular: "Avocat",
    plural: "Avocats",
    numLabel: "inscrit au barreau",
  },
  notaire: {
    singular: "Notaire",
    plural: "Notaires",
    numLabel: "inscrit à la chambre des notaires",
  },
  huissier: {
    singular: "Huissier",
    plural: "Huissiers",
    numLabel: "assermenté",
  },
  comptable: {
    singular: "Comptable",
    plural: "Comptables",
    numLabel: "agréé ONEC/ONCA",
  },
};

export function generateProfessionalMetadata(
  pro: {
    prenom: string;
    nom: string;
    specialites?: string[];
    ville: string;
    barreau: string;
    bio?: string;
    profession?: string;
  },
  proId?: string
): Metadata {
  const prof = PROF_META[pro.profession || "avocat"] || PROF_META.avocat;
  const fullName = `${pro.prenom} ${pro.nom}`;
  const spec = pro.specialites?.[0] || prof.singular;
  const title = `Maître ${fullName} - ${spec} à ${pro.ville} | Mizan`;
  const desc = pro.bio
    ? `${pro.bio.substring(0, 150)}...`
    : `Consultez le profil de Maître ${fullName}, ${prof.singular.toLowerCase()} spécialisé en ${spec}, ${prof.numLabel} de ${pro.barreau}. Contactez via Mizan.`;
  const url = proId
    ? `${siteConfig.url}/lawyers/${proId}`
    : `${siteConfig.url}/lawyers`;
  return {
    title,
    description: desc,
    keywords: [
      `${prof.singular.toLowerCase()} ${spec.toLowerCase()}`,
      `${prof.singular.toLowerCase()} ${pro.ville.toLowerCase()}`,
      fullName,
      `maître ${pro.nom.toLowerCase()}`,
    ],
    openGraph: {
      title: `Maître ${fullName} - ${spec}`,
      description: desc,
      url,
      type: "profile",
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export const generateAvocatMetadata = generateProfessionalMetadata;

export function generateWilayaMetadata(
  wilaya: string,
  profession = "avocat"
): Metadata {
  const prof = PROF_META[profession] || PROF_META.avocat;
  return {
    title: `${prof.plural} à ${wilaya} | Mizan Algérie`,
    description: `Trouvez les meilleurs ${prof.plural.toLowerCase()} vérifiés à ${wilaya}, Algérie. Profils détaillés, avis clients, contact direct.`,
    keywords: [
      `${prof.singular.toLowerCase()} ${wilaya.toLowerCase()}`,
      `${prof.plural.toLowerCase()} ${wilaya.toLowerCase()}`,
      `consultation juridique ${wilaya.toLowerCase()}`,
    ],
    openGraph: {
      title: `${prof.plural} à ${wilaya} | Mizan`,
      description: `${prof.plural} vérifiés à ${wilaya}.`,
      url: `${siteConfig.url}/wilayas/${wilaya}`,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${prof.plural} à ${wilaya} - Mizan`,
        },
      ],
    },
    alternates: { canonical: `${siteConfig.url}/wilayas/${wilaya}` },
    robots: { index: true, follow: true },
  };
}
