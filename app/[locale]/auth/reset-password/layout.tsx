import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe | Mizan",
  description: "Créez un nouveau mot de passe pour votre compte Mizan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
