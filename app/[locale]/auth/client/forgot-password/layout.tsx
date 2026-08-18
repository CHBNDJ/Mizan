import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié | MIZAN",
  description: "Réinitialisez votre mot de passe MIZAN.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
