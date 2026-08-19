import { Metadata } from "next";

export const siteConfig = {
  name: "MIZAN",
  description:
    "Plateforme de mise en relation avec des experts juridiques vérifiés en Algérie. Avocats, notaires, huissiers, comptables, experts-comptables et traducteurs.",
  url: "https://mizan-dz.com",
  ogImage: "https://mizan-dz.com/og-image.png",
};

export const homeMetadata: Metadata = {
  title: "Trouver un avocat en Algérie — notaires, experts-comptables | MIZAN",
  description:
    "Trouvez un avocat, notaire ou expert-comptable en Algérie. Avis clients réels, consultation en ligne depuis l'Algérie ou l'étranger. Contact direct, sans intermédiaire.",
  keywords: [
    "avocat algérie",
    "avocat en ligne algérie",
    "notaire algérie",
    "huissier algérie",
    "comptable algérie",
    "expert comptable algérie",
    "avocat alger",
    "avocat oran",
    "avocat constantine",
    "avocat annaba",
    "avocat sétif",
    "consultation juridique algérie",
    "consultation juridique en ligne algérie",
    "annuaire juridique algérie",
    "annuaire avocat algérie",
    "trouver avocat algérie",
    "expert juridique algérie",
    "droit algérien",
    "avocat algérien étranger",
    "محامي الجزائر",
    "موثق الجزائر",
    "محضر قضائي الجزائر",
    "استشارة قانونية الجزائر",
    "استشارة قانونية اونلاين الجزائر",
    "دليل المحامين الجزائر",
  ],
  authors: [{ name: "MIZAN" }],
  creator: "MIZAN",
  publisher: "MIZAN",
  other: {
    "geo.region": "DZ",
    "geo.placename": "Algérie",
    "geo.position": "36.7538;3.0588",
    "geo.ICBM": "36.7538, 3.0588",
  },
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    alternateLocale: ["fr_FR", "ar_DZ", "en_US"],
    url: siteConfig.url,
    title:
      "Trouver un avocat en Algérie — notaires, experts-comptables | MIZAN",
    description: siteConfig.description,
    siteName: "MIZAN",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "MIZAN — Experts juridiques Algérie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIZAN — Experts juridiques Algérie",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    site: "@mizan_dz",
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
    languages: {
      "fr-DZ": siteConfig.url,
      "ar-DZ": `${siteConfig.url}/ar`,
      "en-US": `${siteConfig.url}/en`,
      "x-default": siteConfig.url,
    },
  },
};

export const searchMetadata: Metadata = {
  title: "Rechercher un expert juridique en Algérie | MIZAN",
  description:
    "Recherchez un avocat, notaire, huissier, comptable ou expert-comptable vérifié en Algérie. Filtrez par wilaya et domaine d'intervention. Résultats vérifiés par MIZAN.",
  keywords: [
    "rechercher avocat algérie",
    "trouver notaire algérie",
    "huissier algérie liste",
    "comptable agréé algérie",
    "expert comptable algérie",
    "annuaire professionnel juridique algérie",
  ],
  openGraph: {
    title: "Rechercher un expert juridique en Algérie | MIZAN",
    description: "Trouvez votre expert juridique vérifié en Algérie.",
    url: `${siteConfig.url}/search`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/search`,
    languages: {
      "fr-DZ": `${siteConfig.url}/search`,
      "ar-DZ": `${siteConfig.url}/ar/search`,
      "en-US": `${siteConfig.url}/en/search`,
      "x-default": `${siteConfig.url}/search`,
    },
  },
};

export const consultationMetadata: Metadata = {
  title: "Consulter un professionnel juridique en ligne | MIZAN",
  description:
    "Choisissez votre mode de consultation — message, téléphone, vidéo ou email — avec un professionnel juridique vérifié sur MIZAN.",
  openGraph: {
    title: "Consulter un professionnel | MIZAN",
    description: "Consultation en ligne avec un expert juridique vérifié.",
    url: `${siteConfig.url}/consultation`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/consultation` },
};

export const contactMetadata: Metadata = {
  title: "Contactez-nous | MIZAN",
  description:
    "Besoin d'aide ? Contactez l'équipe MIZAN. Nous répondons sous 24h.",
  openGraph: {
    title: "Contactez-nous | MIZAN",
    description: "Besoin d'aide ? Contactez l'équipe MIZAN.",
    url: `${siteConfig.url}/contact`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export const howItWorksMetadata: Metadata = {
  title: "Comment ça marche | MIZAN — Experts juridiques Algérie",
  description:
    "Découvrez comment MIZAN vous aide à trouver le bon expert juridique en Algérie en 3 étapes simples. Gratuit pour les clients.",
  openGraph: {
    title: "Comment ça marche | MIZAN",
    description: "Trouvez votre expert juridique en 3 étapes simples.",
    url: `${siteConfig.url}/howitworks`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/howitworks` },
};

export const faqMetadata: Metadata = {
  title: "Questions Fréquentes (FAQ) | MIZAN — Algérie",
  description:
    "Toutes vos questions sur MIZAN : avocats, notaires, huissiers, comptables et experts-comptables vérifiés en Algérie. Réponses claires et rapides.",
  openGraph: {
    title: "FAQ | MIZAN",
    description: "Toutes vos questions sur MIZAN répondues.",
    url: `${siteConfig.url}/faq`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/faq` },
};

export const cguMetadata: Metadata = {
  title: "Conditions Générales d'Utilisation | MIZAN",
  description: "Conditions générales d'utilisation de la plateforme MIZAN.",
  openGraph: {
    title: "CGU | MIZAN",
    description: "Conditions d'utilisation de MIZAN.",
    url: `${siteConfig.url}/cgu`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/cgu` },
  robots: { index: false, follow: true },
};

export const privacyMetadata: Metadata = {
  title: "Politique de Confidentialité | MIZAN",
  description:
    "Politique de confidentialité de MIZAN. Comment nous collectons, utilisons et protégeons vos données personnelles.",
  openGraph: {
    title: "Confidentialité | MIZAN",
    description: "Protection de vos données sur MIZAN.",
    url: `${siteConfig.url}/privacy`,
    siteName: "MIZAN",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/privacy` },
  robots: { index: false, follow: true },
};

export const legalMetadata: Metadata = {
  title: "Mentions Légales | MIZAN",
  description: "Mentions légales de la plateforme MIZAN.",
  openGraph: {
    title: "Mentions Légales | MIZAN",
    description: "Informations légales sur MIZAN.",
    url: `${siteConfig.url}/legal`,
    siteName: "MIZAN",
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
  "expert-comptable": {
    singular: "Expert Comptable",
    plural: "Experts Comptables",
    numLabel: "agréé ONEC",
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
  const title = `Maître ${fullName} — ${spec} à ${pro.ville} | MIZAN`;
  const desc = pro.bio
    ? `${pro.bio.substring(0, 150)}...`
    : `Consultez le profil de Maître ${fullName}, ${prof.singular.toLowerCase()} spécialisé en ${spec}, ${prof.numLabel} de ${pro.barreau}. Contactez via MIZAN.`;
  const url = proId
    ? `${siteConfig.url}/lawyers/${proId}`
    : `${siteConfig.url}/lawyers`;
  return {
    title,
    description: desc,
    keywords: [
      `${prof.singular.toLowerCase()} ${spec.toLowerCase()} algérie`,
      `${prof.singular.toLowerCase()} ${pro.ville.toLowerCase()}`,
      `maître ${fullName.toLowerCase()}`,
      `maître ${pro.nom.toLowerCase()} ${pro.ville.toLowerCase()}`,
      `${prof.singular.toLowerCase()} ${pro.ville.toLowerCase()} algérie`,
    ],
    openGraph: {
      title: `Maître ${fullName} — ${spec} à ${pro.ville}`,
      description: desc,
      url,
      siteName: "MIZAN",
      type: "profile",
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export const generateAvocatMetadata = generateProfessionalMetadata;
