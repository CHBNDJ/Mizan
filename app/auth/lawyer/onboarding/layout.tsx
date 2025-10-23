import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bienvenue | Espace Avocat - Mizan",
  description:
    "Votre inscription a été enregistrée. Découvrez les prochaines étapes pour activer votre profil d'avocat sur Mizan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LawyerOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
