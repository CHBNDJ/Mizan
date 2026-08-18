import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mes consultations | Espace Professionnel - MIZAN",
  description:
    "Gérez et répondez aux demandes de consultation de vos clients sur MIZAN.",
  robots: { index: false, follow: false },
};
export default function LawyerConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
