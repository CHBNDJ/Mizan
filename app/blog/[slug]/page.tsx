import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

const ARTICLES: Record<
  string,
  {
    titre: string;
    resume: string;
    categorie: string;
    date: string;
    contenu: string;
    specialiteSlug: string;
    articlesLies: string[];
  }
> = {
  "comment-divorcer-en-algerie": {
    titre: "Comment divorcer en Algérie : les étapes à suivre",
    resume:
      "Le divorce en Algérie est régi par le Code de la famille. Découvrez les différentes procédures, les délais et les droits de chaque partie.",
    categorie: "Droit de la famille",
    date: "2025-04-01",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "succession-algerie-depuis-etranger",
      "droits-locataire-algerie",
    ],
    contenu: `
## Les formes de divorce en Algérie

En Algérie, le Code de la famille prévoit plusieurs formes de divorce :

**Le divorce judiciaire** est la procédure la plus courante. L'un des époux saisit le tribunal de famille compétent. Le juge tente une conciliation avant de prononcer le divorce.

**Le divorce par consentement mutuel** est possible lorsque les deux époux s'accordent sur toutes les conditions : garde des enfants, pension alimentaire, partage des biens.

**Le khol'** permet à la femme de demander le divorce en contrepartie d'une compensation financière versée au mari, généralement le remboursement de la dot.

## Les étapes de la procédure

1. **Dépôt de la requête** auprès du tribunal de famille du lieu de résidence du foyer conjugal.
2. **Tentative de conciliation** obligatoire par le juge — deux séances minimum espacées de 30 jours.
3. **Audience de jugement** si la conciliation échoue.
4. **Prononcé du divorce** et fixation des mesures accessoires (garde, pension, logement).
5. **Transcription** de la décision à l'état civil.

## La garde des enfants

En Algérie, la garde (hadana) est généralement accordée à la mère pour les jeunes enfants. Elle peut être attribuée au père si l'intérêt de l'enfant le justifie. Le père conserve la tutelle légale (wilaya) dans tous les cas.

## La pension alimentaire

Le mari est tenu de verser une pension alimentaire (nafaqa) à son épouse pendant la période de viduité (idda) de 3 mois après le divorce. Il doit également subvenir aux besoins des enfants jusqu'à leur majorité.

## Besoin d'un avocat ?

Une procédure de divorce, même par consentement mutuel, est plus sécurisée avec l'accompagnement d'un avocat spécialisé en droit de la famille. Il peut vous conseiller sur vos droits, négocier les conditions et représenter vos intérêts devant le tribunal.
    `,
  },
  "creer-sarl-algerie": {
    titre: "Créer une SARL en Algérie : guide complet 2025",
    resume:
      "Capital social, statuts, inscription au registre du commerce — tout ce qu'il faut savoir pour créer votre société à responsabilité limitée en Algérie.",
    categorie: "Droit commercial",
    date: "2025-03-15",
    specialiteSlug: "droit-commercial",
    articlesLies: ["licenciement-algerie", "acheter-bien-immobilier-algerie"],
    contenu: `
## Qu'est-ce qu'une SARL en Algérie ?

La Société à Responsabilité Limitée (SARL) est la forme juridique la plus répandue pour les PME en Algérie. Les associés ne sont responsables des dettes sociales qu'à hauteur de leurs apports.

## Capital social minimum

Depuis les réformes récentes, le capital social minimum d'une SARL en Algérie est de **100 000 DA**. Il peut être libéré en totalité lors de la constitution ou de manière échelonnée.

## Les étapes de création

1. **Rédaction des statuts** — document fondateur qui définit l'objet social, le capital, la répartition des parts et les règles de fonctionnement.
2. **Dépôt du capital** sur un compte bancaire bloqué au nom de la société en formation.
3. **Publication dans un journal d'annonces légales** (JAL) — obligatoire pour informer les tiers.
4. **Inscription au Centre National du Registre du Commerce (CNRC)** — obtention du numéro de registre du commerce.
5. **Immatriculation fiscale** auprès de la Direction des Impôts.
6. **Affiliation à la CNAS** (Caisse Nationale des Assurances Sociales) si vous employez du personnel.

## Documents requis

- Copie de la carte nationale d'identité des associés
- Justificatif de domicile du siège social
- Attestation de dépôt du capital
- Statuts signés et légalisés
- Certificat de résidence du gérant

## Faire appel à un avocat

La rédaction des statuts est une étape cruciale. Des clauses mal rédigées peuvent créer des blocages entre associés ou nuire à vos intérêts en cas de litige. Un avocat spécialisé en droit commercial peut sécuriser votre projet dès le départ.
    `,
  },
  "succession-algerie-depuis-etranger": {
    titre: "Gérer une succession en Algérie depuis l'étranger",
    resume:
      "Vous habitez en France, au Canada ou en Belgique et vous devez régler une succession en Algérie ? Voici les démarches, documents et pièges à éviter.",
    categorie: "Droit de la famille",
    date: "2025-03-01",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: ["comment-divorcer-en-algerie", "droits-locataire-algerie"],
    contenu: `
## La succession en Algérie pour les Algériens de l'étranger

La gestion d'une succession en Algérie depuis l'étranger est l'un des cas d'usage les plus fréquents sur Mizan. Les étapes peuvent être longues et complexes sans un accompagnement local.

## La loi applicable

Pour les ressortissants algériens, c'est le droit algérien qui s'applique pour les successions concernant des biens situés en Algérie, quel que soit le lieu de résidence du défunt ou des héritiers.

En Algérie, la succession est régie par le **Code de la famille algérien**, qui s'inspire du droit islamique (fiqh malékite). Les parts héréditaires sont fixes et déterminées par la loi.

## Les étapes principales

1. **Déclaration du décès** auprès de l'état civil algérien si le décès a eu lieu à l'étranger.
2. **Obtention d'un acte de décès algérien** traduit et légalisé.
3. **Établissement du tableau des héritiers** par le notaire ou le tribunal.
4. **Inventaire des biens** (immobilier, comptes bancaires, véhicules).
5. **Partage et actes notariés** pour les biens immobiliers.
6. **Transfert des fonds** si des liquidités sont à rapatrier.

## Documents à préparer depuis l'étranger

- Acte de décès traduit en arabe et apostillé
- Actes de naissance des héritiers
- Livret de famille du défunt
- Procuration légalisée si vous mandatez un représentant en Algérie

## Pourquoi faire appel à un avocat algérien ?

Un avocat basé en Algérie peut représenter vos intérêts sur place, coordonner avec le notaire, et s'assurer que vos droits d'héritier sont respectés. C'est particulièrement utile quand les héritiers sont dispersés entre plusieurs pays.
    `,
  },
  "droits-locataire-algerie": {
    titre: "Les droits du locataire en Algérie",
    resume:
      "Dépôt de garantie, préavis, charges, expulsion — connaissez vos droits en tant que locataire en Algérie selon la législation en vigueur.",
    categorie: "Droit immobilier",
    date: "2025-02-15",
    specialiteSlug: "droit-immobilier",
    articlesLies: ["acheter-bien-immobilier-algerie", "creer-sarl-algerie"],
    contenu: `
## Le contrat de location en Algérie

En Algérie, la location immobilière est régie par la loi 07-05. Tout contrat de location doit être établi par écrit et enregistré auprès des services fiscaux pour être opposable aux tiers.

## Le dépôt de garantie

Le propriétaire peut demander un dépôt de garantie, généralement équivalent à un ou deux mois de loyer. Il doit être restitué dans un délai raisonnable après la fin du bail, déduction faite des éventuels dommages constatés.

## Le préavis

En cas de départ du locataire, un préavis doit être respecté, généralement d'un mois pour les locations meublées et de trois mois pour les locations vides. Le propriétaire doit également respecter un préavis s'il souhaite récupérer son bien.

## Les charges locatives

Les charges récupérables (eau, électricité des parties communes, entretien) doivent être clairement définies dans le contrat. Les grosses réparations (toiture, structure) restent à la charge du propriétaire.

## En cas de litige

Si un désaccord survient avec votre propriétaire — refus de restitution du dépôt, tentative d'expulsion abusive — vous pouvez saisir le tribunal de première instance compétent. Un avocat spécialisé en droit immobilier peut vous représenter et défendre vos intérêts.
    `,
  },
  "licenciement-algerie": {
    titre: "Licenciement en Algérie : droits et recours",
    resume:
      "Quelles sont les conditions légales d'un licenciement en Algérie ? Indemnités, préavis, recours aux prud'hommes — guide pratique pour les salariés.",
    categorie: "Droit du travail",
    date: "2025-02-01",
    specialiteSlug: "droit-du-travail",
    articlesLies: ["creer-sarl-algerie", "acheter-bien-immobilier-algerie"],
    contenu: `
## Le licenciement en Algérie

En Algérie, le droit du travail est régi par la loi 90-11 relative aux relations de travail. Tout licenciement doit être motivé et respecter une procédure précise.

## Les motifs légaux de licenciement

Un employeur peut licencier un salarié pour :
- **Faute grave** : abandon de poste, vol, violence, manquement grave aux obligations
- **Insuffisance professionnelle** dûment constatée
- **Raisons économiques** : restructuration, difficultés économiques avérées

## La procédure à respecter

1. **Convocation à un entretien préalable** par lettre recommandée.
2. **Entretien préalable** au cours duquel le salarié peut se faire assister.
3. **Notification du licenciement** par lettre recommandée avec motifs précis.
4. **Respect du préavis** selon l'ancienneté du salarié.

## Les indemnités de licenciement

Le salarié licencié a droit à une indemnité calculée selon son ancienneté, généralement équivalente à un mois de salaire par année d'ancienneté. En cas de licenciement abusif, le tribunal peut ordonner la réintégration ou une indemnisation supplémentaire.

## Recours en cas de licenciement abusif

Si vous estimez que votre licenciement est injustifié, vous pouvez saisir l'inspection du travail dans un premier temps, puis le tribunal de première instance (chambre sociale). Un avocat spécialisé en droit du travail peut vous conseiller sur vos chances de succès et vous représenter.
    `,
  },
  "acheter-bien-immobilier-algerie": {
    titre: "Acheter un bien immobilier en Algérie : ce qu'il faut savoir",
    resume:
      "Acte de vente, taxes, vérification du titre de propriété — tout ce qu'il faut vérifier avant d'acheter un bien immobilier en Algérie.",
    categorie: "Droit immobilier",
    date: "2025-01-15",
    specialiteSlug: "droit-immobilier",
    articlesLies: [
      "droits-locataire-algerie",
      "succession-algerie-depuis-etranger",
    ],
    contenu: `
## L'achat immobilier en Algérie

L'achat d'un bien immobilier en Algérie est une transaction importante qui nécessite de nombreuses vérifications. Des erreurs à cette étape peuvent avoir des conséquences juridiques et financières graves.

## Vérifier le titre de propriété

Avant tout achat, il est indispensable de vérifier que le vendeur est bien le propriétaire légal du bien. Demandez la consultation du titre foncier (certificat de propriété) auprès de la Conservation foncière compétente.

Vérifiez également l'absence de :
- Hypothèques ou saisies
- Servitudes non déclarées
- Litiges en cours

## Les étapes de la transaction

1. **Compromis de vente** (promesse synallagmatique) — engage les deux parties.
2. **Versement d'un acompte** (généralement 10-20% du prix).
3. **Acte de vente définitif** devant notaire.
4. **Enregistrement** auprès de la Conservation foncière pour opposabilité aux tiers.

## Les taxes et frais

Prévoyez en plus du prix d'achat :
- Frais de notaire : environ 2-3% du prix
- Droits d'enregistrement et taxes diverses
- Frais de conservation foncière

## L'achat depuis l'étranger

Les Algériens résidant à l'étranger peuvent acheter un bien en Algérie. Ils peuvent mandater un représentant via procuration légalisée et apostillée. Les fonds peuvent être transférés depuis l'étranger sous certaines conditions réglementaires.

## Pourquoi consulter un avocat ?

Un avocat spécialisé en droit immobilier peut vérifier tous les documents, détecter les vices cachés juridiques et sécuriser votre acquisition. C'est un investissement qui peut vous éviter des pertes bien plus importantes.
    `,
  },
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = ARTICLES[params.slug];
  if (!article) return { title: "Article | Mizan" };

  return {
    title: `${article.titre} | Mizan`,
    description: article.resume,
    openGraph: {
      title: article.titre,
      description: article.resume,
      url: `https://mizan-dz.com/blog/${params.slug}`,
    },
    alternates: {
      canonical: `https://mizan-dz.com/blog/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

const renderContenu = (contenu: string) => {
  const lines = contenu.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-slate-800 mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="font-semibold text-slate-800 mt-3 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={key++}
          className="text-slate-600 leading-relaxed ml-4 list-disc"
        >
          {line.replace("- ", "")}
        </li>
      );
    } else if (/^\d+\./.test(line)) {
      elements.push(
        <li
          key={key++}
          className="text-slate-600 leading-relaxed ml-4 list-decimal"
        >
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={key++} className="text-slate-600 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return elements;
};

import React from "react";

export default function BlogArticlePage({ params }: Props) {
  const article = ARTICLES[params.slug];
  if (!article) notFound();

  const articlesLies = article.articlesLies
    .map((slug) => ({ slug, ...ARTICLES[slug] }))
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Accueil
          </Link>
          <span>·</span>
          <Link href="/blog" className="hover:text-teal-600 transition-colors">
            Blog
          </Link>
          <span>·</span>
          <span className="text-slate-800 font-medium truncate">
            {article.titre}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 leading-tight">
            {article.titre}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-8 pb-8 border-b border-slate-100">
            {article.resume}
          </p>

          <div className="prose-like space-y-2">
            {renderContenu(article.contenu)}
          </div>
        </div>

        <div className="bg-teal-600 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            Besoin d'un avocat spécialisé ?
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            Trouvez et contactez directement un avocat inscrit au barreau via
            Mizan.
          </p>
          <Link href={`/avocats/specialite/${article.specialiteSlug}`}>
            <button className="bg-white hover:bg-teal-50 text-teal-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              Trouver un avocat spécialisé
            </button>
          </Link>
        </div>

        {articlesLies.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Articles liés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articlesLies.map(
                (a) =>
                  a && (
                    <Link key={a.slug} href={`/blog/${a.slug}`}>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all">
                        <span className="text-xs font-medium text-teal-600">
                          {a.categorie}
                        </span>
                        <h3 className="font-semibold text-slate-800 text-sm mt-1 mb-2 leading-snug">
                          {a.titre}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-teal-600 font-medium">
                          Lire <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
