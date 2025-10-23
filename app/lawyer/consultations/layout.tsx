import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes consultations | Espace Avocat - Mizan",
  description:
    "Gérez et répondez aux demandes de consultation de vos clients sur Mizan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LawyerConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
