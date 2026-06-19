import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Scale, ArrowRight, Briefcase } from "lucide-react";
import { searchAvocats } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";

const SPECIALITES_MAP: Record<
  string,
  { label: string; description: string; questions: string[] }
> = {
  "droit-de-la-famille": {
    label: "Droit de la famille",
    description:
      "Trouvez un avocat spécialisé en droit de la famille en Algérie. Divorce, garde d'enfants, succession, pension alimentaire — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment divorcer en Algérie ?",
      "Qui a la garde des enfants après un divorce en Algérie ?",
      "Comment régler une succession en Algérie depuis l'étranger ?",
    ],
  },
  "droit-commercial": {
    label: "Droit commercial et des affaires",
    description:
      "Trouvez un avocat spécialisé en droit commercial en Algérie. Création d'entreprise, contrats commerciaux, litiges — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment créer une SARL en Algérie ?",
      "Quels sont les contrats obligatoires pour une entreprise en Algérie ?",
      "Comment résoudre un litige commercial en Algérie ?",
    ],
  },
  "droit-penal": {
    label: "Droit pénal",
    description:
      "Trouvez un avocat spécialisé en droit pénal en Algérie. Défense pénale, procédure pénale, garde à vue — consultez un avocat inscrit au barreau.",
    questions: [
      "Quels sont mes droits lors d'une garde à vue en Algérie ?",
      "Comment se déroule une procédure pénale en Algérie ?",
      "Puis-je choisir mon avocat commis d'office en Algérie ?",
    ],
  },
  "droit-immobilier": {
    label: "Droit immobilier",
    description:
      "Trouvez un avocat spécialisé en droit immobilier en Algérie. Achat, vente, location, litiges de voisinage — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment sécuriser un achat immobilier en Algérie ?",
      "Quels sont les droits du locataire en Algérie ?",
      "Comment régler un litige de voisinage en Algérie ?",
    ],
  },
  "droit-du-travail": {
    label: "Droit du travail et social",
    description:
      "Trouvez un avocat spécialisé en droit du travail en Algérie. Licenciement, contrat de travail, harcèlement — consultez un avocat inscrit au barreau.",
    questions: [
      "Quels sont mes droits en cas de licenciement en Algérie ?",
      "Comment contester une rupture de contrat en Algérie ?",
      "Quelle est la durée légale du préavis en Algérie ?",
    ],
  },
  "droit-des-etrangers": {
    label: "Droit des étrangers et immigration",
    description:
      "Trouvez un avocat spécialisé en droit des étrangers en Algérie. Visa, titre de séjour, nationalité, regroupement familial — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment obtenir la nationalité algérienne ?",
      "Quelles démarches pour un regroupement familial en Algérie ?",
      "Comment régulariser sa situation administrative en Algérie ?",
    ],
  },
  "droit-fiscal": {
    label: "Droit fiscal",
    description:
      "Trouvez un avocat spécialisé en droit fiscal en Algérie. Contentieux fiscal, optimisation fiscale, déclarations — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment contester un redressement fiscal en Algérie ?",
      "Quelles sont les obligations fiscales d'une entreprise en Algérie ?",
      "Comment optimiser la fiscalité de mon entreprise en Algérie ?",
    ],
  },
  "droit-administratif": {
    label: "Droit administratif",
    description:
      "Trouvez un avocat spécialisé en droit administratif en Algérie. Recours contre l'administration, marchés publics, permis de construire — consultez un avocat inscrit au barreau.",
    questions: [
      "Comment contester une décision administrative en Algérie ?",
      "Quels recours contre un refus de permis de construire ?",
      "Comment engager un litige contre l'État algérien ?",
    ],
  },
};

type Props = {
  params: Promise<{ specialite: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { specialite } = await params;
  const specData = SPECIALITES_MAP[specialite?.toLowerCase() ?? ""];
  if (!specData) return { title: "Avocats | Mizan" };

  return {
    title: `Avocat ${specData.label} en Algérie — Trouvez un spécialiste | Mizan`,
    description: specData.description,
    openGraph: {
      title: `Avocat ${specData.label} en Algérie | Mizan`,
      description: specData.description,
      url: `https://mizan-dz.com/lawyers/specialite/${specialite}`,
    },
    alternates: {
      canonical: `https://mizan-dz.com/lawyers/specialite/${specialite}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(SPECIALITES_MAP).map((specialite) => ({ specialite }));
}

export default async function SpecialitePage({ params }: Props) {
  const { specialite } = await params;
  const specData = SPECIALITES_MAP[specialite?.toLowerCase() ?? ""];
  if (!specData) notFound();

  const avocats = await searchAvocats({ specialite: [specData.label] });

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 flex-wrap">
            <Link href="/" className="hover:text-teal-600 transition-colors">
              Accueil
            </Link>
            <span>·</span>
            <Link
              href="/search"
              className="hover:text-teal-600 transition-colors"
            >
              Avocats
            </Link>
            <span>·</span>
            <span className="text-slate-800 font-medium">{specData.label}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Avocat spécialisé en {specData.label} en Algérie
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {specData.description}
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm text-teal-600 font-medium">
            <Briefcase className="w-4 h-4" />
            <span>
              {avocats.length} avocat{avocats.length > 1 ? "s" : ""} spécialisé
              {avocats.length > 1 ? "s" : ""} en {specData.label}
            </span>
          </div>
        </div>

        {avocats.length > 0 ? (
          <div className="space-y-4 mb-12">
            {avocats.map((avocat) => (
              <Link key={avocat.id} href={`/lawyers/${avocat.id}`}>
                <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                    {avocat.avatar_url ? (
                      <img
                        src={avocat.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(avocat.prenom, avocat.nom)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 mb-0.5">
                      {avocat.prenom} {avocat.nom}
                    </div>
                    <div className="text-sm text-slate-500 mb-1">
                      {avocat.ville}, {avocat.wilaya}
                      {avocat.experience?.annees &&
                        ` · ${avocat.experience.annees} ans d'expérience`}
                    </div>
                    <div className="flex items-center gap-3">
                      {avocat.rating_google &&
                        (avocat.reviews_count_google ?? 0) > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-slate-700">
                              {avocat.rating_google.toFixed(1)}
                            </span>
                            <span>({avocat.reviews_count_google} avis)</span>
                          </div>
                        )}
                      {avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="w-3 h-3 fill-teal-500 text-teal-500" />
                            <span className="font-medium text-slate-700">
                              {avocat.rating_mizan.toFixed(1)}
                            </span>
                            <Scale className="w-3 h-3 text-teal-600" />
                          </div>
                        )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center mb-12">
            <p className="text-slate-500 mb-4">
              Aucun avocat spécialisé en {specData.label} pour le moment.
            </p>
            <Link href="/search">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                Voir tous les avocats
              </button>
            </Link>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Questions fréquentes — {specData.label} en Algérie
          </h2>
          <div className="space-y-4">
            {specData.questions.map((question, i) => (
              <div
                key={i}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-800 mb-1 text-sm">
                  {question}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Un avocat spécialisé en {specData.label} inscrit au barreau
                  algérien peut vous accompagner sur cette question. Consultez
                  les profils disponibles sur Mizan et prenez contact
                  directement.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-teal-600 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            Besoin d'un avocat en {specData.label} ?
          </h2>
          <p className="text-teal-100 mb-6 text-sm">
            Comparez les profils, consultez les avis et contactez directement un
            avocat spécialisé.
          </p>
          <Link
            href={`/search?specialite=${encodeURIComponent(specData.label)}`}
          >
            <button className="bg-white hover:bg-teal-50 text-teal-600 px-8 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              Trouver un avocat spécialisé
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
