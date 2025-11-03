import { Merriweather } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import ScrollManager from "@/components/ScrollManager";
import { AuthProvider } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";
import { homeMetadata, siteConfig } from "./metadata";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...homeMetadata,

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: siteConfig.url,
    siteName: "Mizan",
    title: "Mizan - Trouvez votre avocat en Algérie",
    description:
      "Annuaire des meilleurs avocats d'Algérie. Consultations juridiques en ligne, tous domaines de droit.",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mizan - Annuaire des avocats d'Algérie",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@mizan_dz",
    title: "Mizan - Trouvez votre avocat en Algérie",
    description: "Annuaire des meilleurs avocats d'Algérie",
    images: [`${siteConfig.url}/og-image.png`],
  },

  themeColor: "#14b8a6",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mizan",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="W7PDaGtQ4F7JD8rOf8RDI1wmwSrgdMt0ivpebaRSeww"
        />

        {/* SEO Canonical */}
        <link rel="canonical" href={siteConfig.url} />

        {/* Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Schema.org JSON-LD pour SEO */}
        <OrganizationJsonLd />
      </head>

      <body className={`${merriweather.className} antialiased`}>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        <AuthProvider>
          <Navigation />
          <ScrollManager>{children}</ScrollManager>
          <Footer />
        </AuthProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
