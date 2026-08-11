import { Metadata } from "next";

const VILLES_SEO: Record<string, { label: string; description: string }> = {
  alger: {
    label: "Alger",
    description:
      "Trouvez un avocat à Alger inscrit au barreau. Droit de la famille, divorce, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
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
  setif: {
    label: "Sétif",
    description:
      "Trouvez un avocat à Sétif inscrit au barreau. Famille, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  blida: {
    label: "Blida",
    description:
      "Trouvez un avocat à Blida inscrit au barreau. Famille, divorce, immobilier, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  annaba: {
    label: "Annaba",
    description:
      "Trouvez un avocat à Annaba inscrit au barreau. Famille, immobilier, travail, pénal — profils vérifiés, avis et honoraires transparents.",
  },
  bejaia: {
    label: "Béjaïa",
    description:
      "Trouvez un avocat à Béjaïa inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
  },
  "tizi-ouzou": {
    label: "Tizi Ouzou",
    description:
      "Trouvez un avocat à Tizi Ouzou inscrit au barreau. Famille, immobilier, pénal, affaires — profils vérifiés, avis et honoraires transparents.",
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
    title: `Avocat à ${data.label} — Trouvez un avocat vérifié | Mizan`,
    description: data.description,
    keywords: [
      `avocat ${data.label.toLowerCase()}`,
      `meilleur avocat ${data.label.toLowerCase()}`,
      `avocat divorce ${data.label.toLowerCase()}`,
      `avocat droit de la famille ${data.label.toLowerCase()}`,
      `avocate ${data.label.toLowerCase()}`,
    ],
    openGraph: {
      title: `Avocat à ${data.label} | Mizan`,
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
