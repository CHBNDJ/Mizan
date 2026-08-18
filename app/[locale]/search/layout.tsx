import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rechercher un expert juridique en Algérie | MIZAN",
  description:
    "Recherchez un avocat, notaire, huissier ou comptable en Algérie. Filtrez par wilaya et domaine d'intervention. Profils vérifiés, avis clients.",
  keywords: [
    "recherche avocat algérie",
    "trouver notaire algérie",
    "trouver huissier algérie",
    "trouver comptable algérie",
    "expert juridique par wilaya",
    "annuaire juridique algérie",
  ],
  openGraph: {
    title: "Rechercher un expert juridique | MIZAN",
    description:
      "Trouvez l'expert juridique qui correspond à vos besoins en Algérie",
    url: "https://mizan-dz.com/search",
  },
  alternates: { canonical: "https://mizan-dz.com/search" },
};
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
