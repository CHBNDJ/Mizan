import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Questions Fréquentes (FAQ) | Mizan",
  description:
    "Trouvez des réponses aux questions fréquentes sur Mizan : utilisation, inscription avocats, sécurité, consultations juridiques en Algérie.",
  keywords: [
    "faq mizan",
    "questions fréquentes",
    "aide mizan",
    "support avocat",
    "comment utiliser mizan",
  ],
  openGraph: {
    title: "Questions Fréquentes | Mizan",
    description: "Toutes vos questions sur Mizan et notre plateforme",
    url: "https://mizan-dz.com/faq",
  },
  alternates: {
    canonical: "https://mizan-dz.com/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
