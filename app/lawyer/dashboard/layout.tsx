import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord | Espace Avocat - Mizan",
  description:
    "Gérez vos consultations, suivez vos statistiques et administrez votre profil professionnel sur Mizan.",
  robots: {
    index: false, // ← Page privée, NE PAS indexer
    follow: false,
  },
};

export default function LawyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
