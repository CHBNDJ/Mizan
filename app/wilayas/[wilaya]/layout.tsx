import { Metadata } from "next";

type Props = {
  params: Promise<{ wilaya: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wilaya } = await params;
  const wilayaNom = decodeURIComponent(wilaya);
  const wilayaCapitalized =
    wilayaNom.charAt(0).toUpperCase() + wilayaNom.slice(1);

  return {
    title: `Avocat à ${wilayaCapitalized} | Trouvez un avocat qualifié - Mizan`,
    description: `Trouvez un avocat qualifié à ${wilayaCapitalized}, Algérie. Consultez les profils d'avocats vérifiés, comparez leurs spécialités et contactez-les directement. Service gratuit.`,
    keywords: [
      `avocat ${wilayaNom.toLowerCase()}`,
      `avocat à ${wilayaNom.toLowerCase()}`,
      `trouver avocat ${wilayaNom.toLowerCase()}`,
      `consultation juridique ${wilayaNom.toLowerCase()}`,
      `avocats ${wilayaNom.toLowerCase()} algérie`,
    ],
    openGraph: {
      title: `Avocats à ${wilayaCapitalized} | Mizan`,
      description: `Trouvez un avocat qualifié à ${wilayaCapitalized}. Profils vérifiés, spécialités variées, contact direct.`,
      url: `https://mizan-dz.com/${wilayaNom.toLowerCase()}`,
      type: "website",
    },
    alternates: {
      canonical: `https://mizan-dz.com/${wilayaNom.toLowerCase()}`,
    },
    robots: {
      index: true, // ✅ Page publique - doit être indexée
      follow: true,
    },
  };
}

export default function WilayaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
