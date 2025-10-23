import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Votre avis nous intéresse | Mizan",
  description:
    "Partagez votre expérience, suggérez des améliorations ou signalez un problème sur Mizan. Votre feedback compte.",
  openGraph: {
    title: "Feedback | Mizan",
    url: "https://mizan-dz.com/feedback",
  },
  alternates: {
    canonical: "https://mizan-dz.com/feedback",
  },
  robots: {
    index: false, // Pas besoin d'indexer le feedback
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
