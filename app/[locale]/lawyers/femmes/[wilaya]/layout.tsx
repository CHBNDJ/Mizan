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

const FAQ_FEMMES = [
  {
    q: "Comment prendre rendez-vous avec une avocate ?",
    a: "Sur MIZAN, chaque avocate dispose d'un profil vérifié avec ses coordonnées et ses modes de consultation. Vous pouvez la contacter directement, en ligne ou par téléphone, sans intermédiaire.",
  },
  {
    q: "Quels domaines du droit traitent les avocates ?",
    a: "Les avocates couvrent l'ensemble des domaines du droit : droit de la famille, divorce, droit immobilier, droit pénal, droit du travail, droit des affaires et bien d'autres. Chaque profil précise les spécialités de l'avocate.",
  },
  {
    q: "Peut-on consulter une avocate à distance ?",
    a: "Oui. De nombreuses avocates proposent des consultations à distance, par message, téléphone ou visioconférence, ce qui est particulièrement adapté aux Algériens vivant à l'étranger.",
  },
  {
    q: "Les avocates sont-elles inscrites au barreau ?",
    a: "Toutes les avocates présentes sur MIZAN sont inscrites au barreau et leur profil est vérifié par notre équipe. Vous consultez uniquement des professionnelles habilitées à exercer.",
  },
];

export default async function AvocatesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ wilaya: string }>;
}) {
  const { wilaya } = await params;
  const data = VILLES_SEO[wilaya?.toLowerCase() ?? ""];
  if (!data) return children;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_FEMMES.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
