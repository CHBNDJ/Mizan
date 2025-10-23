import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes consultations | Espace Client - Mizan",
  description:
    "Suivez l'état de vos demandes de consultation auprès des avocats sur Mizan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MesConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
