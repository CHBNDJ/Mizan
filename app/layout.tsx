import { Merriweather } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import ScrollManager from "@/components/ScrollManager";
import { AuthProvider } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
});

// export const metadata = {
//   title: "Mizan - Trouvez votre avocat en Algérie",
//   description:
//     "Plateforme de mise en relation avec des avocats vérifiés en Algérie",
// };

export const metadata = {
  title: "Mizan - Trouvez votre avocat en Algérie",
  description:
    "Mizan est la première plateforme en Algérie qui connecte les citoyens avec des avocats vérifiés selon leurs besoins juridiques et leur wilaya.",
  metadataBase: new URL("https://mizan-dz.com"),
  openGraph: {
    title: "Mizan - Trouvez votre avocat en Algérie",
    description:
      "Recherchez un avocat selon votre spécialité et votre région. Simple, rapide et 100% sécurisé.",
    url: "https://mizan-dz.com",
    siteName: "Mizan",
    images: [
      {
        url: "https://mizan-dz.com/og-image.jpg", // 👉 ajoute une image à ton dossier public/
        width: 1200,
        height: 630,
        alt: "Mizan - Trouvez votre avocat en Algérie",
      },
    ],
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizan - Trouvez votre avocat en Algérie",
    description:
      "Trouvez votre avocat selon votre spécialité et votre wilaya, en toute confiance.",
    images: ["https://mizan-dz.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${merriweather.className} antialiased`}>
        {/* ← Wrappez tout avec AuthProvider */}
        <AuthProvider>
          <Navigation />
          <ScrollManager>{children}</ScrollManager>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
