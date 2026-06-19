import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramètres du compte | Mizan",
  description:
    "Gérez vos informations personnelles, votre mot de passe et vos préférences de compte sur Mizan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
