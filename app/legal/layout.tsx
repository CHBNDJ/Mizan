import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Mizan",
  description:
    "Mentions légales de la plateforme Mizan : informations sur l'éditeur, hébergement, propriété intellectuelle et responsabilités.",
  openGraph: {
    title: "Mentions Légales | Mizan",
    url: "https://mizan-dz.com/legal",
  },
  alternates: {
    canonical: "https://mizan-dz.com/legal",
  },
  robots: {
    index: false, // Pas besoin d'indexer les mentions légales
    follow: true,
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
