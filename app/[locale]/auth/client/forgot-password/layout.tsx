import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié | Mizan",
  description: "Réinitialisez votre mot de passe Mizan.",
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
