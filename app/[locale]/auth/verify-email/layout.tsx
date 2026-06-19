import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérification email | Mizan",
  description: "Vérifiez votre adresse email pour activer votre compte Mizan.",
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
