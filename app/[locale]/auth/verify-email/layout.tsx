import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérification email | MIZAN",
  description: "Vérifiez votre adresse email pour activer votre compte MIZAN.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
