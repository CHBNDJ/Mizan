import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | MIZAN",
  description:
    "Mentions légales de la plateforme MIZAN : éditeur, hébergement, propriété intellectuelle et responsabilités.",
  openGraph: {
    title: "Mentions Légales | MIZAN",
    url: "https://mizan-dz.com/legal",
  },
  alternates: { canonical: "https://mizan-dz.com/legal" },
  robots: { index: false, follow: true },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
