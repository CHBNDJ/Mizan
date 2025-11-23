import { Merriweather } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import ScrollManager from "@/components/ScrollManager";
import { AuthProvider } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";
import { homeMetadata, siteConfig } from "./metadata";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  ...homeMetadata,

  icons: {
    icon: [
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-192.png?v=2",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-512.png?v=2",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.json?v=2",

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
        url: `${siteConfig.url}/logo-512.png`,
        width: 512,
        height: 512,
        alt: "Logo Mizan",
        type: "image/png",
      },
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mizan - Annuaire des avocats d'Algérie",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@mizan_dz",
    title: "Mizan - Trouvez votre avocat en Algérie",
    description: "Annuaire des meilleurs avocats d'Algérie",
    images: [`${siteConfig.url}/logo-512.png`],
  },

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

        {/* Schema.org JSON-LD pour SEO */}
        <OrganizationJsonLd />
      </head>

      <body
        className={`${merriweather.className} antialiased overflow-x-hidden`}
      >
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
