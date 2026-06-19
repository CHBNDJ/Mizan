import { Metadata } from "next";
type Props = { params: Promise<{ wilaya: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wilaya } = await params;
  const nom = decodeURIComponent(wilaya);
  const cap = nom.charAt(0).toUpperCase() + nom.slice(1);
  return {
    title: `Experts juridiques à ${cap} | Mizan Algérie`,
    description: `Trouvez un avocat, notaire, huissier ou comptable vérifié à ${cap}, Algérie. Profils vérifiés, avis clients, contact direct.`,
    keywords: [
      `avocat ${nom}`,
      `notaire ${nom}`,
      `huissier ${nom}`,
      `comptable ${nom}`,
      `expert juridique ${nom}`,
    ],
    openGraph: {
      title: `Experts juridiques à ${cap} | Mizan`,
      description: `Avocats, notaires, huissiers et comptables vérifiés à ${cap}.`,
      url: `https://mizan-dz.com/wilayas/${nom}`,
      type: "website",
    },
    alternates: { canonical: `https://mizan-dz.com/wilayas/${nom}` },
    robots: { index: true, follow: true },
  };
}
export default function WilayaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
