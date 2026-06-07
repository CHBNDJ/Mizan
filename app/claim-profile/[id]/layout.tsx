import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Réclamer mon profil | Mizan",
  description:
    "Réclamez votre profil professionnel sur Mizan et gérez vos informations (avocat, notaire, huissier, comptable).",
  robots: { index: false, follow: false },
};
export default function ClaimProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
