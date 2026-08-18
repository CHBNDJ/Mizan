import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Votre avis nous intéresse | MIZAN",
  description:
    "Partagez votre expérience, suggérez des améliorations ou signalez un problème sur MIZAN. Votre feedback compte.",
  openGraph: {
    title: "Feedback | MIZAN",
    url: "https://mizan-dz.com/feedback",
  },
  alternates: {
    canonical: "https://mizan-dz.com/feedback",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
