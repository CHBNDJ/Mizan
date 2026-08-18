import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Créer un compte client | MIZAN",
  description:
    "Inscrivez-vous sur MIZAN pour trouver et contacter des experts juridiques vérifiés en Algérie : avocats, notaires, huissiers, comptables.",
  robots: { index: false, follow: false },
};
export default function ClientRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
