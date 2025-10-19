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

export const metadata = {
  title: "Mizan - Trouvez votre avocat en Algérie",
  description:
    "Plateforme de mise en relation avec des avocats vérifiés en Algérie",
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
