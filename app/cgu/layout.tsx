import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation (CGU) | Mizan",
  description:
    "Conditions générales d'utilisation de la plateforme Mizan : droits, obligations, responsabilités des utilisateurs et avocats.",
  openGraph: {
    title: "CGU | Mizan",
    url: "https://mizan-dz.com/cgu",
  },
  alternates: {
    canonical: "https://mizan-dz.com/cgu",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CGULayout({ children }: { children: React.ReactNode }) {
  return children;
}
