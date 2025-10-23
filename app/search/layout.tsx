import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rechercher un avocat en Algérie | Mizan",
  description:
    "Recherchez et trouvez un avocat en Algérie selon vos besoins. Filtrez par spécialité juridique, ville et expérience. Profils vérifiés et avis clients.",
  keywords: [
    "recherche avocat",
    "trouver avocat algérie",
    "avocat par spécialité",
    "avocat par ville",
    "annuaire avocat",
  ],
  openGraph: {
    title: "Rechercher un avocat | Mizan",
    description: "Trouvez l'avocat qui correspond à vos besoins en Algérie",
    url: "https://mizan-dz.com/search",
  },
  alternates: {
    canonical: "https://mizan-dz.com/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
