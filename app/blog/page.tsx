import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog juridique — Conseils et droits en Algérie | Mizan",
  description:
    "Conseils juridiques pratiques pour les particuliers et entreprises en Algérie. Droit de la famille, droit commercial, succession, divorce — rédigés par des experts.",
  openGraph: {
    title: "Blog juridique | Mizan",
    description: "Conseils juridiques pratiques en Algérie.",
    url: "https://mizan-dz.com/blog",
  },
  alternates: {
    canonical: "https://mizan-dz.com/blog",
  },
};

const ARTICLES = [
  {
    slug: "comment-divorcer-en-algerie",
    titre: "Comment divorcer en Algérie : les étapes à suivre",
    resume:
      "Le divorce en Algérie est régi par le Code de la famille. Découvrez les différentes procédures, les délais et les droits de chaque partie.",
    categorie: "Droit de la famille",
    date: "2025-04-01",
    specialite: "droit-de-la-famille",
  },
  {
    slug: "creer-sarl-algerie",
    titre: "Créer une SARL en Algérie : guide complet 2025",
    resume:
      "Capital social, statuts, inscription au registre du commerce — tout ce qu'il faut savoir pour créer votre société à responsabilité limitée en Algérie.",
    categorie: "Droit commercial",
    date: "2025-03-15",
    specialite: "droit-commercial",
  },
  {
    slug: "succession-algerie-depuis-etranger",
    titre: "Gérer une succession en Algérie depuis l'étranger",
    resume:
      "Vous habitez en France, au Canada ou en Belgique et vous devez régler une succession en Algérie ? Voici les démarches, documents et pièges à éviter.",
    categorie: "Droit de la famille",
    date: "2025-03-01",
    specialite: "droit-de-la-famille",
  },
  {
    slug: "droits-locataire-algerie",
    titre: "Les droits du locataire en Algérie",
    resume:
      "Dépôt de garantie, préavis, charges, expulsion — connaissez vos droits en tant que locataire en Algérie selon la législation en vigueur.",
    categorie: "Droit immobilier",
    date: "2025-02-15",
    specialite: "droit-immobilier",
  },
  {
    slug: "licenciement-algerie",
    titre: "Licenciement en Algérie : droits et recours",
    resume:
      "Quelles sont les conditions légales d'un licenciement en Algérie ? Indemnités, préavis, recours aux prud'hommes — guide pratique pour les salariés.",
    categorie: "Droit du travail",
    date: "2025-02-01",
    specialite: "droit-du-travail",
  },
  {
    slug: "acheter-bien-immobilier-algerie",
    titre: "Acheter un bien immobilier en Algérie : ce qu'il faut savoir",
    resume:
      "Acte de vente, taxes, vérification du titre de propriété — tout ce qu'il faut vérifier avant d'acheter un bien immobilier en Algérie.",
    categorie: "Droit immobilier",
    date: "2025-01-15",
    specialite: "droit-immobilier",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Accueil
            </Link>
            <span>·</span>
            <span className="text-slate-800 font-medium">Blog juridique</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Conseils juridiques en Algérie
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Guides pratiques et conseils juridiques pour particuliers et
            entreprises en Algérie. Rédigés pour être accessibles, vérifiés par
            des professionnels du droit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <div className="bg-white border border-slate-200 rounded-xl p-5 h-full hover:border-teal-200 hover:shadow-sm transition-all flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                    {article.categorie}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <h2 className="font-semibold text-slate-800 mb-2 leading-snug flex-1">
                  {article.titre}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {article.resume}
                </p>
                <div className="flex items-center gap-1 text-sm text-teal-600 font-medium mt-auto">
                  Lire l'article
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Vous avez une question juridique ?
          </h2>
          <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
            Trouvez un avocat inscrit au barreau, consultez son profil et ses
            avis, et contactez-le directement via Mizan.
          </p>
          <Link href="/search">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              Trouver un avocat
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
