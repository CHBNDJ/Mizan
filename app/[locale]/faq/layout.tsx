import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Questions Fréquentes (FAQ) | MIZAN",
  description:
    "Trouvez des réponses aux questions fréquentes sur MIZAN : avocats, notaires, huissiers, comptables — inscription, sécurité, consultations en Algérie.",
  keywords: [
    "faq mizan",
    "questions fréquentes",
    "aide mizan",
    "avocat algérie faq",
    "notaire algérie faq",
    "comment utiliser mizan",
  ],
  openGraph: {
    title: "Questions Fréquentes | MIZAN",
    description: "Toutes vos questions sur MIZAN et nos 4 catégories d'experts",
    url: "https://mizan-dz.com/faq",
  },
  alternates: { canonical: "https://mizan-dz.com/faq" },
};
export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
