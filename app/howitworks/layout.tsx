import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment fonctionne Mizan ? | Guide complet",
  description:
    "Découvrez comment utiliser Mizan pour trouver un avocat en Algérie. Guide étape par étape pour clients et avocats. Simple, rapide et sécurisé.",
  keywords: [
    "comment utiliser mizan",
    "trouver avocat algérie",
    "guide mizan",
    "fonctionnement plateforme juridique",
  ],
  openGraph: {
    title: "Comment fonctionne Mizan ?",
    description: "Guide complet d'utilisation de la plateforme Mizan",
    url: "https://mizan-dz.com/how-it-works",
  },
  alternates: {
    canonical: "https://mizan-dz.com/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
