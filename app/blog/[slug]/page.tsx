import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import React from "react";

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

En Algérie, le Code de la famille prévoit plusieurs formes de divorce.

**Le divorce judiciaire** est la procédure la plus courante. L'un des époux saisit le tribunal de famille compétent. Le juge tente une conciliation avant de prononcer le divorce.

**Le divorce par consentement mutuel** est possible lorsque les deux époux s'accordent sur toutes les conditions : garde des enfants, pension alimentaire, partage des biens.

**Le khol'** permet à la femme de demander le divorce en contrepartie d'une compensation financière versée au mari.

## Les étapes de la procédure

1. **Dépôt de la requête** auprès du tribunal de famille du lieu de résidence du foyer conjugal.
2. **Tentative de conciliation** obligatoire — deux séances minimum espacées de 30 jours.
3. **Audience de jugement** si la conciliation échoue.
4. **Prononcé du divorce** et fixation des mesures : garde, pension, logement.
5. **Transcription** à l'état civil.

## La garde des enfants

La garde (hadana) est généralement accordée à la mère pour les jeunes enfants. Le père conserve la tutelle légale (wilaya) dans tous les cas.

## La pension alimentaire

Le mari verse une pension alimentaire pendant la période de viduité (idda) de 3 mois après le divorce, et subvient aux besoins des enfants jusqu'à leur majorité.
    `,
  },
  "creer-sarl-algerie": {
    titre: "Créer une SARL en Algérie : guide complet 2026",
    resume:
      "Capital social, statuts, inscription au registre du commerce — tout ce qu'il faut savoir pour créer votre société à responsabilité limitée en Algérie.",
    categorie: "Droit commercial",
    date: "2025-03-15",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: ["licenciement-algerie", "acheter-bien-immobilier-algerie"],
    contenu: `
## SARL ou EURL : quelle différence ?

L'unique différence est le nombre d'associés. L'EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est pour un seul associé. La SARL est pour 2 à 50 associés. Les démarches, le capital minimum, et la fiscalité sont identiques. Si vous créez seul, choisissez l'EURL. Si vous créez à plusieurs, choisissez la SARL.

## Capital social

Le capital minimum recommandé est de 100 000 DZD. Bien que l'obligation légale ait été supprimée, ce montant reste exigé par les banques et partenaires.

## Les étapes au CNRC

1. **Réservation de la dénomination** via la plateforme Sijilcom du CNRC — prévoyez 3 à 4 noms alternatifs.
2. **Rédaction et authentification des statuts** chez un notaire — coût entre 15 000 et 50 000 DZD. Attention : le CNRC rejette environ 1 dossier sur 3 pour des mentions obligatoires manquantes dans les statuts.
3. **Dépôt du capital** sur un compte bancaire bloqué — obtention de l'attestation de blocage.
4. **Publication au BOAL** (Bulletin Officiel des Annonces Légales) — coût entre 3 000 et 6 000 DZD.
5. **Immatriculation au CNRC** — délai de 7 à 15 jours.
6. **Obtention du NIF** à la Direction des Impôts — 48 à 72h. Le capital bloqué est alors débloqué.
7. **Obtention du NIS** auprès de l'ONS — 2 à 4 jours.

## La domiciliation — adresse obligatoire en Algérie

La SARL ou l'EURL doit avoir une adresse physique en Algérie. Trois options : local commercial, domicile du gérant (pour les activités sans accueil de clientèle), ou société de domiciliation commerciale (2 000 à 8 000 DZD/mois à Alger).

## Documents requis pour l'immatriculation au CNRC

- Demande signée sur formulaire fourni par le CNRC
- Justificatif du local : titre de propriété, bail de location, concession de terrain, ou acte d'affectation délivré par un organisme public
- Un exemplaire des statuts authentifiés par le notaire
- Copie de l'avis d'insertion des statuts au BOAL
- Quittance de timbre fiscal (4 000 DA)
- Reçu de versement des droits d'immatriculation au registre du commerce
- Copie de l'autorisation ou agrément provisoire — uniquement pour les activités réglementées

Après immatriculation au CNRC : obtenir le NIF à la Direction des Impôts (48-72h) et le NIS auprès de l'ONS (2-4 jours).

## Coût total

Entre 150 000 et 300 000 DZD (environ 1 000 à 2 000€), incluant notaire, capital, frais CNRC et publication BOAL.
    `,
  },
  "succession-algerie-depuis-etranger": {
    titre: "Gérer une succession en Algérie depuis l'étranger",
    resume:
      "Vous habitez en France, au Canada ou en Belgique et vous devez régler une succession en Algérie ? Voici les démarches, documents et pièges à éviter.",
    categorie: "Droit de la famille",
    date: "2025-03-01",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "comment-divorcer-en-algerie",
      "heriter-bien-immobilier-algerie-france",
    ],
    contenu: `
## La loi applicable

Pour les biens immobiliers situés en Algérie, le droit algérien s'applique obligatoirement (lex situs), quel que soit le lieu de résidence du défunt ou des héritiers. La succession est régie par les articles 126 à 201 du Code de la famille algérien.

## La Fredha

La Fredha est l'acte de succession algérien équivalent de l'acte de notoriété français. Elle est délivrée par le notaire algérien du lieu de résidence ou d'inhumation du défunt. Elle désigne les héritiers et leurs parts. C'est le document central — sans elle, aucune démarche sur le bien n'est possible.

## Les étapes principales

1. **Obtenir l'acte de décès algérien** — depuis la France, le consulat algérien compétent peut aider.
2. **Contacter un notaire algérien** pour établir la Fredha.
3. **Inventaire des biens** : immobilier, comptes bancaires, véhicules.
4. **Partage notarié** si tous les héritiers sont d'accord.
5. **Mutation du titre de propriété** à la Conservation foncière.

## Documents à préparer

- Acte de décès traduit en arabe et légalisé
- Actes de naissance de tous les héritiers
- Livret de famille du défunt
- Procuration légalisée si vous mandatez un représentant en Algérie
    `,
  },
  "droits-locataire-algerie": {
    titre: "Les droits du locataire en Algérie",
    resume:
      "Dépôt de garantie, préavis, charges, expulsion — connaissez vos droits en tant que locataire en Algérie selon la législation en vigueur.",
    categorie: "Droit immobilier",
    date: "2025-02-15",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: ["acheter-bien-immobilier-algerie", "creer-sarl-algerie"],
    contenu: `
## Le contrat de location

En Algérie, la location immobilière est régie par la loi 07-05. Tout contrat doit être établi par écrit et enregistré auprès des services fiscaux pour être opposable aux tiers.

## Le dépôt de garantie

Généralement équivalent à un ou deux mois de loyer. Il doit être restitué dans un délai raisonnable après la fin du bail, déduction faite des dommages constatés.

## Le préavis

Un mois pour les locations meublées, trois mois pour les locations vides. Le propriétaire doit également respecter un préavis pour récupérer son bien.

## Les charges

Les charges récupérables doivent être définies dans le contrat. Les grosses réparations (toiture, structure) restent à la charge du propriétaire.

## En cas de litige

Saisir le tribunal de première instance compétent. Un avocat spécialisé en droit immobilier peut vous représenter.
    `,
  },
  "licenciement-algerie": {
    titre: "Licenciement en Algérie : droits et recours",
    resume:
      "Quelles sont les conditions légales d'un licenciement en Algérie ? Indemnités, préavis, recours — guide pratique pour les salariés.",
    categorie: "Droit du travail",
    date: "2025-02-01",
    specialiteSlug: "droit-du-travail-et-social",
    articlesLies: ["creer-sarl-algerie", "acheter-bien-immobilier-algerie"],
    contenu: `
## Le licenciement en Algérie

Le droit du travail est régi par la loi 90-11. Tout licenciement doit être motivé et respecter une procédure précise.

## Les motifs légaux

- **Faute grave** : abandon de poste, vol, violence, manquement grave
- **Insuffisance professionnelle** dûment constatée
- **Raisons économiques** : restructuration, difficultés économiques avérées

## La procédure

1. Convocation à un entretien préalable par lettre recommandée.
2. Entretien préalable — le salarié peut se faire assister.
3. Notification du licenciement avec motifs précis.
4. Respect du préavis selon l'ancienneté.

## Les indemnités

Généralement un mois de salaire par année d'ancienneté. En cas de licenciement abusif, le tribunal peut ordonner la réintégration ou une indemnisation supplémentaire.

## Recours

Saisir l'inspection du travail, puis le tribunal de première instance (chambre sociale) en cas de licenciement abusif.
    `,
  },
  "acheter-bien-immobilier-algerie": {
    titre: "Acheter un bien immobilier en Algérie : ce qu'il faut savoir",
    resume:
      "Acte de vente, taxes, vérification du titre de propriété — tout ce qu'il faut vérifier avant d'acheter un bien immobilier en Algérie.",
    categorie: "Droit immobilier",
    date: "2025-01-15",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: [
      "droits-locataire-algerie",
      "vendre-appartement-algerie-etranger",
    ],
    contenu: `
## Vérifier le titre de propriété

Avant tout achat, vérifiez que le vendeur est bien le propriétaire légal. Consultez le titre foncier à la Conservation foncière compétente. Vérifiez l'absence d'hypothèques, saisies, ou litiges en cours. Exigez toujours un prix 100% déclaré au notaire — refusez tout paiement partiel "au noir".

## Les étapes de la transaction

1. **Compromis de vente** — engage les deux parties.
2. **Versement d'un acompte** (généralement 10 à 20% du prix).
3. **Acte de vente définitif** devant notaire algérien.
4. **Enregistrement et publication foncière** à la Conservation foncière — délai 1 à 3 mois.

## Les frais

Frais de notaire entre 2 et 5% du prix, droits d'enregistrement, et frais de conservation foncière.

## Depuis l'étranger

Procuration établie au consulat algérien de votre pays de résidence, reconnue directement par les notaires algériens. Les non-résidents bénéficient d'exonérations fiscales sur certaines transactions.
    `,
  },
  "creer-entreprise-algerie-diaspora": {
    titre:
      "Créer une entreprise en Algérie depuis la diaspora : le guide complet 2026",
    resume:
      "Vous vivez en France, en Belgique, au Canada ou en Suisse et vous voulez lancer votre projet en Algérie ? Ce guide vous explique les trois statuts possibles et les démarches exactes.",
    categorie: "Droit commercial",
    date: "2026-05-28",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "vendre-appartement-algerie-etranger",
    ],
    contenu: `
## Les trois statuts disponibles

En Algérie, trois formes juridiques s'adaptent à la majorité des projets de la diaspora : l'auto-entrepreneur via l'ANAE, l'EURL, et la SARL.

## Statut 1 — Auto-entrepreneur via l'ANAE

Créé par la loi 22-23 du 18 décembre 2022, ce statut s'obtient exclusivement en ligne sur anae.dz. Aucun registre de commerce n'est requis.

Documents requis : CNI recto/verso, justificatif de domicile de moins de 3 mois, photo d'identité fond blanc. Aucun casier judiciaire demandé.

Plafonds de chiffre d'affaires : 5 millions de DZD pour les services, 10 millions de DZD pour le commerce. Taux d'imposition : IFU à 0,5% libératoire. Affiliation obligatoire à la CASNOS sous 10 jours (cotisations environ 32 000 DZD/an). Ce statut ne permet pas d'embaucher des salariés.

Délai : 2 à 5 jours de validation, puis retrait de la carte au bureau de poste sur notification SMS (coût : 1 200 DZD). Délai total moyen : 7 à 15 jours.

Idéal pour : freelances, consultants, prestataires de services, petits commerces en ligne.

## Statut 2 — EURL (Entreprise Unipersonnelle à Responsabilité Limitée)

L'EURL est la forme société pour un associé unique. Si vous créez seul, c'est le statut naturel. Les démarches sont identiques à une SARL et passent par le CNRC.

## Statut 3 — SARL (Société à Responsabilité Limitée)

La SARL est pour 2 à 50 associés. Si vous avez des partenaires ou prévoyez d'en avoir, choisissez directement la SARL plutôt qu'une EURL à transformer plus tard.

## Les démarches EURL/SARL via le CNRC

Pour créer une EURL ou une SARL, toutes les démarches passent par le CNRC (Centre National du Registre du Commerce).

1. **Réservation de la dénomination** via Sijilcom (plateforme en ligne du CNRC) — prévoyez 3 à 4 noms alternatifs.
2. **Rédaction et authentification des statuts** chez un notaire — coût entre 15 000 et 50 000 DZD. Attention : le CNRC rejette environ 1 dossier sur 3 pour des mentions manquantes dans les statuts.
3. **Dépôt du capital** sur un compte bancaire bloqué (minimum recommandé : 100 000 DZD) — attestation de blocage requise.
4. **Publication au BOAL** (Bulletin Officiel des Annonces Légales) — coût entre 3 000 et 6 000 DZD.
5. **Immatriculation au CNRC** — extrait RC délivré en 7 à 15 jours.
6. **Obtention du NIF** à la Direction des Impôts — 48 à 72h.
7. **Obtention du NIS** auprès de l'ONS — 2 à 4 jours.
8. **Ouverture du compte bancaire professionnel** — le capital bloqué est débloqué après obtention du NIF.

Coût total EURL/SARL : entre 150 000 et 300 000 DZD (environ 1 000 à 2 000€).

## La domiciliation — adresse obligatoire en Algérie

Toute entreprise doit avoir une adresse en Algérie, physique ou virtuelle.

**Local commercial** : solution idéale pour les activités avec accueil de clientèle ou stockage.

**Domicile du gérant** : accepté pour les activités sans accueil de clientèle. Fournir un justificatif de domicile algérien.

**Société de domiciliation commerciale** : adresse professionnelle sans bureau physique, entre 2 000 et 8 000 DZD/mois à Alger. Solution idéale pour les activités 100% en ligne ou les porteurs de projet non encore installés en Algérie.

## Quel statut choisir ?

Seul, CA < 5M DZD, pas de salariés → auto-entrepreneur ANAE. Seul, CA > 5M DZD ou besoin de salariés → EURL via CNRC. Plusieurs associés → SARL via CNRC.

## Questions fréquentes

**Peut-on tout faire à distance ?**
Pour l'ANAE : inscription 100% en ligne, mais la carte se retire physiquement en bureau de poste en Algérie. Pour l'EURL/SARL : certaines étapes nécessitent une présence physique ou un mandataire sur place via procuration consulaire.
    `,
  },
  "heriter-bien-immobilier-algerie-france": {
    titre:
      "Comment hériter d'un bien immobilier en Algérie depuis la France : guide complet 2026",
    resume:
      "Un parent vient de décéder en Algérie et vous vivez en France ? Voici toutes les démarches concrètes pour hériter d'un appartement, d'une maison ou d'un terrain algérien.",
    categorie: "Droit de la famille",
    date: "2026-05-28",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "vendre-appartement-algerie-etranger",
      "succession-algerie-depuis-etranger",
    ],
    contenu: `
## La loi applicable

Pour tout bien immobilier situé en Algérie, le droit algérien s'applique obligatoirement (lex situs), quelle que soit votre nationalité ou votre lieu de résidence. C'est confirmé par le Consulat de France à Alger. La succession est régie par les articles 126 à 201 du Code de la famille algérien.

## La Fredha — document central

La Fredha est l'acte de succession algérien, équivalent de l'acte de notoriété français. Elle est délivrée par le notaire algérien du lieu de résidence ou d'inhumation du défunt. Elle désigne tous les héritiers et leurs parts. Sans la Fredha, aucune démarche sur le bien immobilier n'est possible.

## Les étapes depuis la France

**Étape 1 — Obtenir l'acte de décès algérien**

Si le décès a eu lieu en France, contactez le consulat algérien compétent pour les démarches de déclaration et d'obtention de l'acte.

**Étape 2 — Contacter un notaire algérien**

Le notaire établit la Fredha sur la base des actes d'état civil de tous les héritiers. Si vous ne pouvez pas vous déplacer, donnez une procuration à un proche ou un avocat en Algérie.

**Étape 3 — La fiscalité**

Il n'existe pas de droits de succession au sens strict en Algérie. Des frais de mutation s'appliquent lors du transfert de propriété. En France, si le défunt était résident français, une déclaration de succession doit être déposée dans les 6 mois (12 mois si le décès a eu lieu à l'étranger). La convention franco-algérienne de 1999 évite la double imposition.

**Étape 4 — Le partage**

Si tous les héritiers s'accordent, un acte notarié de partage est rédigé. En cas de désaccord ou d'héritier introuvable, un partage judiciaire peut être demandé au tribunal algérien — un avocat est alors indispensable.

**Étape 5 — La mutation du titre**

Le notaire procède à la mutation du titre de propriété à la Conservation foncière au nom des nouveaux propriétaires.

## Documents nécessaires

- Acte de décès (traduit en arabe si établi en France)
- Actes de naissance de tous les héritiers
- Livret de famille du défunt
- Titre de propriété du bien si disponible
- Procuration légalisée si vous mandatez un représentant

## Les situations difficiles

**Bien non titré** : regularisez d'abord le titre à la Conservation foncière — sans acte notarié authentique, aucune succession n'est possible.

**Ne rien faire** : la succession reste en indivision, aucun héritier ne peut vendre seul, et la situation se complique à chaque génération.

## Questions fréquentes

**Faut-il se déplacer en Algérie ?**
Pas obligatoirement — une procuration à un avocat ou un proche suffit pour la plupart des démarches.

**Y a-t-il des droits de succession en Algérie ?**
Non au sens strict. Seulement des frais de mutation lors du transfert de propriété.
    `,
  },
  "vendre-appartement-algerie-etranger": {
    titre:
      "Comment vendre un appartement en Algérie depuis l'étranger : guide complet 2026",
    resume:
      "Vous avez un appartement en Algérie et souhaitez le vendre depuis la France, la Belgique ou le Canada ? Voici le guide complet, étape par étape.",
    categorie: "Droit immobilier",
    date: "2026-05-28",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "acheter-bien-immobilier-algerie",
    ],
    contenu: `
## Peut-on vendre sans se déplacer ?

Oui, grâce à la procuration consulaire. Vous mandatez un proche ou un avocat en Algérie pour signer l'acte de vente en votre nom. Cette procuration est établie au consulat algérien de votre ville de résidence — elle est reconnue directement par les notaires algériens.

## Conditions préalables à la vente

**Titre de propriété valide** : vous devez disposer d'un acte notarié authentique enregistré à la Conservation foncière. Sans titre authentique, aucune vente légale n'est possible.

**Absence d'indivision bloquante** : si le bien est en indivision, tous les copropriétaires ou héritiers doivent consentir à la vente.

**Absence de charges** : vérifiez à la Conservation foncière l'absence d'hypothèque ou de saisie.

## Les étapes

**Étape 1 — La procuration consulaire**

Rendez-vous au consulat algérien avec votre pièce d'identité algérienne. Le consulat établit la procuration autorisant votre mandataire à signer tous les actes. Ce document est légalisé et reconnu directement par les notaires algériens.

**Étape 2 — Estimation et mise en vente**

Mandatez un agent immobilier ou un avocat en Algérie pour évaluer le bien. Exigez toujours un prix 100% déclaré au notaire — refusez tout paiement partiel "au noir".

**Étape 3 — Compromis de vente**

Votre mandataire signe le compromis avec l'acheteur. Un avocat peut sécuriser cette étape.

**Étape 4 — Acte notarié définitif**

L'acte est signé chez le notaire algérien par votre mandataire et l'acheteur. Enregistrement et publication foncière suivent. Délai entre compromis et acte : 1 à 6 mois.

**Étape 5 — Frais et taxes**

Frais de notaire entre 2 et 5% du prix. Une taxe sur la plus-value peut s'appliquer. Si vous êtes résident fiscal en France, la plus-value peut également être imposable en France — consultez un fiscaliste avant de vendre.

## Le rapatriement des fonds

Les transferts de dinars depuis l'Algérie vers l'étranger sont réglementés par la Banque d'Algérie. Les non-résidents ayant acquis leur bien via un transfert légal en devises ont droit au rapatriement dans les mêmes devises. Pour les biens hérités ou acquis en dinars, les conditions sont différentes. Consultez un avocat algérien spécialisé avant de vendre.

## Risques à éviter

Ne vendez jamais sans passer par un notaire. Ne donnez la procuration qu'à une personne de confiance absolue ou un avocat professionnel. Refusez toute transaction avec une partie du prix en espèces non déclarées.

## Questions fréquentes

**Combien de temps prend une vente ?**
Entre 1 et 6 mois selon la complexité du dossier.

**Peut-on vendre un bien hérité ?**
Oui, une fois la Fredha établie et le bien en votre nom ou en indivision avec accord de tous les héritiers.

**Faut-il payer des impôts en France ?**
Potentiellement oui si vous êtes résident fiscal français. Consultez un fiscaliste avant de vendre.
    `,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article | Mizan" };
  return {
    title: `${article.titre} | Mizan`,
    description: article.resume,
    openGraph: {
      title: article.titre,
      description: article.resume,
      url: `https://mizan-dz.com/blog/${slug}`,
    },
    alternates: { canonical: `https://mizan-dz.com/blog/${slug}` },
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

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const articlesLies = article.articlesLies
    .map((s) => ({ slug: s, ...ARTICLES[s] }))
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
                    <Link
                      key={a.slug}
                      href={`/blog/${a.slug}`}
                      className="h-full"
                    >
                      <div className="h-full bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all flex flex-col">
                        <span className="text-xs font-medium text-teal-600 mb-1">
                          {a.categorie}
                        </span>
                        <h3 className="font-semibold text-slate-800 text-sm mb-2 leading-snug flex-1">
                          {a.titre}
                        </h3>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {a.resume}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 font-medium pt-3 border-t border-slate-100">
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
