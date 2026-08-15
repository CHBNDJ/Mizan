import { Metadata } from "next";

const VILLES_SEO: Record<string, { label: string; description: string }> = {
  alger: {
    label: "Alger",
    description:
      "Trouvez un avocat à Alger inscrit au barreau. Droit de la famille, divorce, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  bejaia: {
    label: "Béjaïa",
    description:
      "Trouvez un avocat à Béjaïa inscrit au barreau. Droit de la famille, divorce, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  oran: {
    label: "Oran",
    description:
      "Trouvez un avocat à Oran inscrit au barreau. Divorce, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  constantine: {
    label: "Constantine",
    description:
      "Trouvez un avocat à Constantine inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  annaba: {
    label: "Annaba",
    description:
      "Trouvez un avocat à Annaba inscrit au barreau. Famille, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  blida: {
    label: "Blida",
    description:
      "Trouvez un avocat à Blida inscrit au barreau. Famille, divorce, immobilier, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  tlemcen: {
    label: "Tlemcen",
    description:
      "Trouvez un avocat à Tlemcen inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  skikda: {
    label: "Skikda",
    description:
      "Trouvez un avocat à Skikda inscrit au barreau. Famille, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  setif: {
    label: "Sétif",
    description:
      "Trouvez un avocat à Sétif inscrit au barreau. Famille, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  batna: {
    label: "Batna",
    description:
      "Trouvez un avocat à Batna inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  "bordj-bou-arreridj": {
    label: "Bordj Bou Arréridj",
    description:
      "Trouvez un avocat à Bordj Bou Arréridj inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  medea: {
    label: "Médéa",
    description:
      "Trouvez un avocat à Médéa inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  "tizi-ouzou": {
    label: "Tizi Ouzou",
    description:
      "Trouvez un avocat à Tizi Ouzou inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  tiaret: {
    label: "Tiaret",
    description:
      "Trouvez un avocat à Tiaret inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  chlef: {
    label: "Chlef",
    description:
      "Trouvez un avocat à Chlef inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  tipaza: {
    label: "Tipaza",
    description:
      "Trouvez un avocat à Tipaza inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  mostaganem: {
    label: "Mostaganem",
    description:
      "Trouvez un avocat à Mostaganem inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  "ain-temouchent": {
    label: "Aïn Témouchent",
    description:
      "Trouvez un avocat à Aïn Témouchent inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  jijel: {
    label: "Jijel",
    description:
      "Trouvez un avocat à Jijel inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  ghardaia: {
    label: "Ghardaïa",
    description:
      "Trouvez un avocat à Ghardaïa inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  laghouat: {
    label: "Laghouat",
    description:
      "Trouvez un avocat à Laghouat inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  bouira: {
    label: "Bouira",
    description:
      "Trouvez un avocat à Bouira inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wilaya: string }>;
}): Promise<Metadata> {
  const { wilaya } = await params;
  const data = VILLES_SEO[wilaya?.toLowerCase() ?? ""];
  if (!data) return { title: "Avocats | Mizan" };
  return {
    title: `Meilleurs avocats à ${data.label} — Vérifiés, avis clients | Mizan`,
    description: data.description,
    keywords: [
      `avocat ${data.label.toLowerCase()}`,
      `meilleur avocat ${data.label.toLowerCase()}`,
      `avocats ${data.label.toLowerCase()} les mieux notés`,
      `avocat divorce ${data.label.toLowerCase()}`,
      `avocat droit de la famille ${data.label.toLowerCase()}`,
      `avocate ${data.label.toLowerCase()}`,
      `avocat bâtonnier ${data.label.toLowerCase()}`,
    ],
    openGraph: {
      title: `Meilleurs avocats à ${data.label} | Mizan`,
      description: data.description,
      url: `https://mizan-dz.com/lawyers/wilaya/${wilaya}`,
    },
    alternates: {
      canonical: `https://mizan-dz.com/lawyers/wilaya/${wilaya}`,
    },
  };
}

export default function VilleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
