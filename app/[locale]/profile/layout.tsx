import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil | MIZAN",
  description:
    "Consultez et gérez votre profil personnel sur MIZAN. Accédez à vos informations, statistiques et paramètres de compte.",
  robots: {
    index: false,
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
