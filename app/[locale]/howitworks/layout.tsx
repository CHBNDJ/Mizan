import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment fonctionne Mizan ? | Guide complet",
  description:
    "Découvrez comment utiliser Mizan pour trouver un avocat, notaire, huissier ou comptable en Algérie. Guide étape par étape pour clients et professionnels.",
  keywords: [
    "comment utiliser mizan",
    "trouver avocat algérie",
    "trouver notaire algérie",
    "trouver huissier algérie",
    "trouver comptable algérie",
    "guide mizan",
    "fonctionnement plateforme juridique",
  ],
  openGraph: {
    title: "Comment fonctionne Mizan ?",
    description:
      "Guide complet d'utilisation de la plateforme Mizan — avocats, notaires, huissiers, comptables",
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
