import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment fonctionne MIZAN ? | Guide complet",
  description:
    "Découvrez comment utiliser MIZAN pour trouver un avocat, notaire, huissier ou comptable en Algérie. Guide étape par étape pour clients et professionnels.",
  keywords: [
    "comment utiliser MIZAN",
    "trouver avocat algérie",
    "trouver notaire algérie",
    "trouver huissier algérie",
    "trouver comptable algérie",
    "guide MIZAN",
    "fonctionnement plateforme juridique",
  ],
  openGraph: {
    title: "Comment fonctionne MIZAN ?",
    description:
      "Guide complet d'utilisation de la plateforme MIZAN — avocats, notaires, huissiers, comptables",
    url: "https://mizan-dz.com/howitworks",
  },
  alternates: { canonical: "https://mizan-dz.com/howitworks" },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
