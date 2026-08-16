import { Metadata } from "next";

const SPECIALITES_SEO: Record<string, { label: string; description: string }> =
  {
    "droit-de-la-famille": {
      label: "Droit de la famille",
      description:
        "Trouvez un avocat spécialisé en droit de la famille en Algérie. Divorce, garde d'enfants, succession, pension alimentaire — profils vérifiés, avis clients.",
    },
    "droit-commercial": {
      label: "Droit commercial et des affaires",
      description:
        "Trouvez un avocat spécialisé en droit commercial en Algérie. Création d'entreprise, contrats commerciaux, litiges — profils vérifiés, avis clients.",
    },
    "droit-penal": {
      label: "Droit pénal",
      description:
        "Trouvez un avocat spécialisé en droit pénal en Algérie. Défense pénale, procédure pénale, garde à vue — profils vérifiés, avis clients.",
    },
    "droit-immobilier": {
      label: "Droit de l'immobilier",
      description:
        "Trouvez un avocat spécialisé en droit immobilier en Algérie. Achat, vente, VSP, location, litiges — profils vérifiés, avis clients.",
    },
    "droit-du-travail": {
      label: "Droit du travail et social",
      description:
        "Trouvez un avocat spécialisé en droit du travail en Algérie. Licenciement, contrat de travail, harcèlement — profils vérifiés, avis clients.",
    },
    "droit-des-etrangers": {
      label: "Droit des étrangers et immigration",
      description:
        "Trouvez un avocat spécialisé en droit des étrangers en Algérie. Visa, titre de séjour, nationalité, regroupement familial — profils vérifiés, avis clients.",
    },
    "droit-fiscal": {
      label: "Droit fiscal",
      description:
        "Trouvez un avocat spécialisé en droit fiscal en Algérie. Contentieux fiscal, optimisation, déclarations — profils vérifiés, avis clients.",
    },
    "droit-administratif": {
      label: "Droit administratif",
      description:
        "Trouvez un avocat spécialisé en droit administratif en Algérie. Recours contre l'administration, marchés publics, permis — profils vérifiés, avis clients.",
    },
  };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialite: string }>;
}): Promise<Metadata> {
  const { specialite } = await params;
  const data = SPECIALITES_SEO[specialite?.toLowerCase() ?? ""];
  if (!data) return { title: "Avocats | Mizan" };
  return {
    title: `Avocat ${data.label} en Algérie — Vérifiés, avis clients | Mizan`,
    description: data.description,
    keywords: [
      `avocat ${data.label.toLowerCase()}`,
      `avocat ${data.label.toLowerCase()} algérie`,
      `meilleur avocat ${data.label.toLowerCase()}`,
    ],
    openGraph: {
      title: `Avocat ${data.label} en Algérie | Mizan`,
      description: data.description,
      url: `https://mizan-dz.com/lawyers/specialite/${specialite}`,
    },
    alternates: {
      canonical: `https://mizan-dz.com/lawyers/specialite/${specialite}`,
    },
  };
}

export default function SpecialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
