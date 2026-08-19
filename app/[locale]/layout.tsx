import { Merriweather } from "next/font/google";
import "../globals.css";
import { Navigation } from "@/components/Navigation";
import ScrollManager from "@/components/ScrollManager";
import { AuthProvider } from "@/hooks/useAuth";
import Footer from "@/components/layout/Footer";
import { homeMetadata, siteConfig } from "@/app/metadata";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import PushNotificationInit from "@/components/PushNotificationInit";
import ReviewPopup from "@/components/ReviewPopup";
import FeedbackTrigger from "@/components/FeedbackTrigger";
import AcquisitionGate from "@/components/AcquisitionGate";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const merriweather = Merriweather({ subsets: ["latin"], display: "swap" });
const RTL_LOCALES = ["ar"];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#085041" },
    { media: "(prefers-color-scheme: dark)", color: "#6fcf9f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  ...homeMetadata,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: siteConfig.url,
    siteName: "MIZAN",
    title:
      "Trouver un avocat en Algérie — notaires, experts-comptables | MIZAN",
    description:
      "Avocats, notaires, huissiers, comptables, experts-comptables et traducteurs en Algérie. Consultation en ligne depuis l'Algérie ou l'étranger.",
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MIZAN — Experts juridiques Algérie",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mizan_dz",
    title:
      "Trouver un avocat en Algérie — notaires, experts-comptables | MIZAN",
    description:
      "Avocats, notaires, huissiers, experts-comptables et traducteurs en Algérie",
    images: [`${siteConfig.url}/og-image.png`],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MIZAN" },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <meta
          name="google-site-verification"
          content="W7PDaGtQ4F7JD8rOf8RDI1wmwSrgdMt0ivpebaRSeww"
        />
        <link rel="alternate" hrefLang="fr" href={siteConfig.url} />
        <link rel="alternate" hrefLang="ar" href={`${siteConfig.url}/ar`} />
        <link rel="alternate" hrefLang="en" href={`${siteConfig.url}/en`} />
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />
        <OrganizationJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mizan-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${merriweather.className} antialiased overflow-x-hidden`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <PushNotificationInit />
            <Navigation />
            <ReviewPopup />
            <FeedbackTrigger />
            <AcquisitionGate />
            <ScrollManager>{children}</ScrollManager>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
