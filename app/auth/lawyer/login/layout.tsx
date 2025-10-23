import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | Mizan",
  description:
    "Connectez-vous à votre compte Mizan pour accéder à votre espace personnel.",
  robots: {
    index: false, // ← NE PAS indexer
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
