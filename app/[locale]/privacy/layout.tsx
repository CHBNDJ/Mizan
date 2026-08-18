import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | MIZAN",
  description:
    "Politique de confidentialité et protection des données personnelles sur MIZAN. Comment nous collectons, utilisons et protégeons vos informations.",
  openGraph: {
    title: "Politique de Confidentialité | MIZAN",
    url: "https://mizan-dz.com/privacy",
  },
  alternates: {
    canonical: "https://mizan-dz.com/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
