import { Metadata } from "next";

const VILLES_SEO: Record<string, { label: string }> = {
  alger: { label: "Alger" },
  bejaia: { label: "Béjaïa" },
  oran: { label: "Oran" },
  constantine: { label: "Constantine" },
  annaba: { label: "Annaba" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ wilaya: string }>;
}): Promise<Metadata> {
  const { wilaya } = await params;
  const data = VILLES_SEO[wilaya?.toLowerCase() ?? ""];
  if (!data) return { title: "Avocates en Algérie | MIZAN" };
  return {
    title: `Avocates à ${data.label} — Femmes inscrites au barreau, avis clients | MIZAN`,
    description: `Trouvez une avocate à ${data.label} : femmes inscrites au barreau, profils vérifiés, avis clients et honoraires transparents. Droit de la famille, divorce, immobilier et plus.`,
    keywords: [
      `avocate ${data.label.toLowerCase()}`,
      `avocate femme ${data.label.toLowerCase()}`,
      `femme avocate ${data.label.toLowerCase()}`,
      `avocate droit de la famille ${data.label.toLowerCase()}`,
      `meilleure avocate ${data.label.toLowerCase()}`,
    ],
    openGraph: {
      title: `Avocates à ${data.label} | MIZAN`,
      description: `Trouvez une avocate vérifiée à ${data.label} sur MIZAN.`,
      url: `https://mizan-dz.com/lawyers/femmes/${wilaya}`,
    },
    alternates: {
      canonical: `https://mizan-dz.com/lawyers/femmes/${wilaya}`,
    },
  };
}

export default function AvocatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
