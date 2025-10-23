import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil | Mizan",
  description:
    "Consultez et gérez votre profil personnel sur Mizan. Accédez à vos informations, statistiques et paramètres de compte.",
  robots: {
    index: false, // ← Page privée, NE PAS indexer
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
