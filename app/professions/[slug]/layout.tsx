import { PROFESSIONS_DATA, ProfessionSlug } from "@/lib/professionsData";
import { Metadata } from "next";
import { siteConfig } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug as ProfessionSlug;
  const data = PROFESSIONS_DATA[slug];

  if (!data) {
    return {
      title: "Profession | Mizan",
      description: "Découvrez les professions juridiques en Algérie sur Mizan.",
    };
  }

  const descriptions: Record<string, string> = {
    avocat:
      "Découvrez le rôle officiel de l'avocat en Algérie, ses missions selon la loi n°13-07, quand faire appel à lui et en quoi il se distingue du notaire ou de l'huissier.",
    notaire:
      "Découvrez le rôle officiel du notaire en Algérie, ses missions selon la loi n°06-02, quand faire appel à lui pour vos actes immobiliers, successions ou mariages.",
    huissier:
      "Découvrez le rôle officiel de l'huissier de justice en Algérie, ses missions selon la loi n°06-03 modifiée par la loi n°23-13, significations, constats et recouvrement.",
    comptable:
      "Découvrez le rôle officiel du comptable agréé en Algérie (ONCA), ses missions selon la loi n°10-01, déclarations fiscales, bilans et création d'entreprise.",
    "expert-comptable":
      "Découvrez le rôle officiel de l'expert-comptable en Algérie (ONEC), ses missions selon la loi n°10-01, audit légal, évaluation d'entreprise et due diligence.",
  };

  const keywords: Record<string, string[]> = {
    avocat: [
      "avocat algérie",
      "rôle avocat",
      "loi 13-07",
      "barreau algérie",
      "quand faire appel avocat",
    ],
    notaire: [
      "notaire algérie",
      "rôle notaire",
      "loi 06-02",
      "acte notarié algérie",
      "succession notaire algérie",
    ],
    huissier: [
      "huissier justice algérie",
      "rôle huissier",
      "loi 06-03",
      "constat huissier",
      "recouvrement créance algérie",
    ],
    comptable: [
      "comptable agréé algérie",
      "ONCA",
      "déclaration fiscale algérie",
      "bilan annuel",
      "comptable EURL SARL",
    ],
    "expert-comptable": [
      "expert comptable algérie",
      "ONEC",
      "audit légal algérie",
      "évaluation entreprise",
      "commissariat aux comptes",
    ],
  };

  const title = `${data.label} en Algérie — Rôle, missions et quand faire appel | Mizan`;
  const url = `${siteConfig.url}/professions/${slug}`;

  return {
    title,
    description: descriptions[slug] || data.tagline,
    keywords: keywords[slug] || [],
    openGraph: {
      title,
      description: descriptions[slug] || data.tagline,
      url,
      type: "article",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${data.label} en Algérie - Mizan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descriptions[slug] || data.tagline,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function ProfessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
