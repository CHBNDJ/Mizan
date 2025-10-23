import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription avocat | Mizan",
  description:
    "Inscrivez-vous en tant qu'avocat sur Mizan et rejoingnez notre annuaire d'avocats.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LawyerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
