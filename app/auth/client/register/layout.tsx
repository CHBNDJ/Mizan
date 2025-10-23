import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte client | Mizan",
  description:
    "Inscrivez-vous sur Mizan pour trouver et contacter des avocats en Algérie.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
