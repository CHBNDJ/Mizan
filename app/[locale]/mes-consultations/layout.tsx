import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mes consultations | Espace Client - MIZAN",
  description:
    "Suivez l'état de vos demandes de consultation auprès des professionnels sur MIZAN.",
  robots: { index: false, follow: false },
};
export default function MesConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
