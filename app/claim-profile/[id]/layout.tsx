import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réclamer mon profil avocat | Mizan",
  description:
    "Réclamez votre profil d'avocat sur Mizan et gérez vos informations professionnelles.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClaimProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
