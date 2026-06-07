import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Inscription professionnel | Mizan",
  description:
    "Inscrivez-vous sur Mizan en tant qu'avocat, notaire, huissier ou comptable et rejoignez notre annuaire d'experts juridiques vérifiés.",
  robots: { index: false, follow: false },
};
export default function LawyerRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
