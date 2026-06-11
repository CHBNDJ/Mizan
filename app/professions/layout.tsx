import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Professions juridiques en Algérie | Mizan",
    template: "%s | Mizan",
  },
  description:
    "Comprenez le rôle de chaque professionnel juridique en Algérie : avocat, notaire, huissier, comptable agréé, expert-comptable. Cadre légal, missions et quand faire appel.",
  openGraph: {
    siteName: "Mizan",
    locale: "fr_DZ",
    type: "website",
  },
};

export default function ProfessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
