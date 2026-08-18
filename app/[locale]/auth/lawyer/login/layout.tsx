import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | MIZAN",
  description:
    "Connectez-vous à votre compte MIZAN pour accéder à votre espace personnel.",
  robots: {
    index: false,
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
