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

export const metadata: Metadata = homeMetadata;

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Schema.org JSON-LD pour SEO */}
        <OrganizationJsonLd />
      </head>

      <body className={`${merriweather.className} antialiased`}>
        {/* Google Analytics (optionnel) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        {/* Votre structure existante */}
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
