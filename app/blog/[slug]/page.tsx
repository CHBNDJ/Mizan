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
    titre: "Créer une SARL en Algérie : guide complet 2026",
    resume:
      "Capital social, statuts, inscription au registre du commerce — tout ce qu'il faut savoir pour créer votre société à responsabilité limitée en Algérie.",
    categorie: "Droit commercial",
    date: "2025-03-15",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: ["licenciement-algerie", "acheter-bien-immobilier-algerie"],
    contenu: `
## Qu'est-ce qu'une SARL en Algérie ?

La Société à Responsabilité Limitée (SARL) est la forme juridique la plus répandue pour les PME en Algérie. Elle regroupe de 2 à 50 associés. Les associés ne sont responsables des dettes sociales qu'à hauteur de leurs apports.

## Capital social minimum

Le capital social minimum recommandé est de 100 000 DZD. Bien que l'obligation légale de capital minimum ait été supprimée par la loi 15-20 de 2015, ce montant reste exigé en pratique par les banques et les partenaires commerciaux.

## Les étapes de création

1. **Réservation de la dénomination** auprès du CNRC via la plateforme Sijilcom — prévoyez 3 à 4 noms alternatifs en cas d'indisponibilité.
2. **Rédaction et authentification des statuts** chez un notaire — coût entre 15 000 et 50 000 DZD selon la complexité.
3. **Dépôt du capital** sur un compte bancaire bloqué au nom de la société en formation — obtention de l'attestation de blocage.
4. **Publication au BOAL** (Bulletin Officiel des Annonces Légales) — coût entre 3 000 et 6 000 DZD.
5. **Immatriculation au CNRC** — délai de 7 à 15 jours ouvrables. L'extrait RC (équivalent du K-bis) est remis en plusieurs exemplaires.
6. **Obtention du NIF** (Numéro d'Identification Fiscale) à la Direction des Impôts — délivré en 48 à 72h. Le compte bancaire bloqué est alors débloqué.
7. **Obtention du NIS** (Numéro d'Identification Statistique) auprès de l'ONS — délai 2 à 4 jours.

## Documents requis

- Copie de la carte nationale d'identité de tous les associés
- Justificatif de domicile du siège social (bail commercial, acte de propriété ou contrat de domiciliation)
- Statuts authentifiés par le notaire
- Attestation de dépôt du capital bancaire

## La domiciliation du siège social

Le siège social doit obligatoirement avoir une adresse physique en Algérie. Trois options sont possibles : un local commercial loué ou acheté, le domicile personnel du gérant (autorisé pour les activités sans accueil de clientèle), ou une société de domiciliation commerciale. Les sociétés de domiciliation à Alger pratiquent des tarifs entre 2 000 et 8 000 DZD par mois.

## Coût total de création

Comptez entre 150 000 et 300 000 DZD au total (environ 1 000 à 2 000€), incluant les honoraires du notaire, le capital social, les frais CNRC, et la publication au BOAL.

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

Pour les biens immobiliers situés en Algérie, c'est toujours le droit algérien qui s'applique (principe de la lex situs), quel que soit le lieu de résidence du défunt ou des héritiers. En Algérie, la succession est régie par le Code de la famille algérien. Les parts héréditaires sont fixes et déterminées par la loi.

## Les étapes principales

1. **Déclaration du décès** auprès de l'état civil algérien si le décès a eu lieu à l'étranger.
2. **Obtention d'un acte de décès algérien** traduit et légalisé.
3. **Établissement de la Fredha** — c'est l'acte de succession algérien, équivalent de l'acte de notoriété français. Il est délivré par le notaire algérien du lieu de résidence ou du lieu d'inhumation du défunt. Il désigne les héritiers et les parts de chacun. Document indispensable pour toute la suite.
4. **Inventaire des biens** (immobilier, comptes bancaires, véhicules).
5. **Partage et actes notariés** pour les biens immobiliers.
6. **Mutation du titre de propriété** à la Conservation foncière au nom des nouveaux propriétaires.

## Documents à préparer depuis l'étranger

- Acte de décès traduit en arabe et légalisé
- Actes de naissance des héritiers
- Livret de famille du défunt
- Procuration légalisée si vous mandatez un représentant en Algérie

## Pourquoi faire appel à un avocat algérien ?

Un avocat basé en Algérie peut représenter vos intérêts sur place, coordonner avec le notaire, et s'assurer que vos droits d'héritier sont respectés. C'est particulièrement utile quand les héritiers sont dispersés entre plusieurs pays ou en cas de désaccord entre héritiers.
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
    specialiteSlug: "droit-du-travail-et-social",
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
    specialiteSlug: "droit-de-l-immobilier",
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
- Partie du prix payée "au noir" — exigez toujours un prix 100% déclaré au notaire

## Les étapes de la transaction

1. **Compromis de vente** (promesse synallagmatique) — engage les deux parties.
2. **Versement d'un acompte** (généralement 10-20% du prix).
3. **Acte de vente définitif** devant notaire algérien.
4. **Enregistrement et publication foncière** auprès de la Conservation foncière — délai 1 à 3 mois.

## Les taxes et frais

Prévoyez en plus du prix d'achat :
- Frais de notaire : environ 2 à 5% du prix
- Droits d'enregistrement et taxes diverses
- Frais de conservation foncière

## L'achat depuis l'étranger

Les Algériens résidant à l'étranger peuvent acheter un bien en Algérie. Ils peuvent mandater un représentant via procuration établie au consulat algérien dans leur pays de résidence, légalisée pour être reconnue en Algérie. Les non-résidents bénéficient d'exonérations fiscales sur certaines transactions immobilières.

## Pourquoi consulter un avocat ?

Un avocat spécialisé en droit immobilier peut vérifier tous les documents, détecter les vices cachés juridiques et sécuriser votre acquisition. C'est un investissement qui peut vous éviter des pertes bien plus importantes.
    `,
  },
  "creer-entreprise-algerie-diaspora": {
    titre:
      "Créer une entreprise en Algérie depuis la diaspora : le guide complet 2026",
    resume:
      "Vous vivez en France, en Belgique, au Canada ou en Suisse et vous rêvez de lancer votre projet en Algérie ? Ce guide vous explique tout, étape par étape.",
    categorie: "Droit commercial",
    date: "2026-05-28",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "vendre-appartement-algerie-etranger",
    ],
    contenu: `
## Pourquoi créer une entreprise en Algérie depuis l'étranger

L'Algérie traverse une période de transformation économique importante. Le gouvernement multiplie les réformes pour attirer les investissements de la diaspora — simplification des procédures, guichet unique, statut auto-entrepreneur via l'ANAE. Le marché intérieur de 45 millions de consommateurs reste largement sous-exploité dans de nombreux secteurs : tech, tourisme, agriculture, services, commerce.

## Les deux formes juridiques principales

**Le statut auto-entrepreneur via l'ANAE**

Créé par la loi 22-23 du 18 décembre 2022, le statut auto-entrepreneur en Algérie s'obtient exclusivement en ligne sur le portail anae.dz. Il ne nécessite pas de registre du commerce. Documents requis : carte nationale d'identité recto/verso, justificatif de domicile de moins de 3 mois, photo d'identité fond blanc. Aucun casier judiciaire n'est demandé.

Le plafond de chiffre d'affaires est de 5 millions de DZD pour les services et 10 millions de DZD pour le commerce. Le taux d'imposition est l'IFU à 0,5% libératoire. L'affiliation à la CASNOS est obligatoire sous 10 jours (cotisations environ 32 000 DZD/an). Délai d'obtention de la carte : 7 à 15 jours ouvrables. La carte est retirée physiquement dans un bureau de poste sur notification SMS. Coût : 1 200 DZD.

Ce statut ne permet pas d'embaucher des salariés. Il est idéal pour les freelances, consultants, et petits commerces.

**La SARL (Société à Responsabilité Limitée)**

La SARL nécessite au minimum 2 associés (maximum 50). Capital minimum recommandé : 100 000 DZD. Délai de création : 4 à 6 semaines. Elle est soumise à l'IBS (Impôt sur les Bénéfices des Sociétés) entre 19 et 26% selon le secteur. Voir notre article dédié à la création de SARL en Algérie pour le détail complet des étapes.

## La domiciliation — adresse obligatoire en Algérie

Toute entreprise en Algérie doit avoir une adresse en Algérie, qu'il s'agisse d'une domiciliation physique ou virtuelle. Trois options existent.

**Domiciliation physique** : local commercial loué ou acheté — solution idéale pour les activités avec accueil de clientèle ou stockage de marchandises.

**Domiciliation au domicile** : pour l'auto-entrepreneur ou la SARL sans accueil de clientèle, l'adresse personnelle du gérant en Algérie est acceptée. Il faut fournir un justificatif de domicile (facture d'électricité, de gaz, ou attestation de résidence).

**Domiciliation commerciale virtuelle** : des sociétés spécialisées à Alger proposent une adresse professionnelle sans bureau physique. Tarifs entre 2 000 et 8 000 DZD par mois. Vous recevez votre courrier officiel à cette adresse. Solution idéale pour les activités 100% en ligne ou les porteurs de projet qui ne résident pas encore en Algérie.

## Les étapes concrètes pour l'auto-entrepreneur (ANAE)

1. **Vérifier l'éligibilité de l'activité** sur la liste ANAE (plus de 1 300 activités éligibles).
2. **Créer un compte** sur anae.dz avec une adresse email valide et un numéro de téléphone algérien.
3. **Remplir le formulaire** en ligne avec vos informations personnelles et votre activité.
4. **Soumettre les documents** : CNI recto/verso, justificatif de domicile, photo d'identité.
5. **Validation par l'ANAE** sous 2 à 5 jours.
6. **Retrait de la carte** au bureau de poste sur notification SMS (coût 1 200 DZD).
7. **Affiliation à la CASNOS** obligatoire sous 10 jours.

## Les aides disponibles pour la diaspora

**L'ANADE** (Agence Nationale d'Appui et de Développement de l'Entrepreneuriat) propose des financements sans intérêt, des formations, et un accompagnement pour les nouveaux entrepreneurs.

**Sofinance** est un fonds d'investissement qui peut cofinancer votre projet à hauteur de 49%, sans intérêt, dans le respect des principes de la finance islamique.

**L'ANDI** (Agence Nationale de Développement de l'Investissement) offre des avantages fiscaux et douaniers pour les projets dans certains secteurs prioritaires.

## Les erreurs à éviter

Ne sous-estimez pas les délais administratifs — prévoyez toujours plus de temps que ce qu'on vous annonce. Ne créez pas une SARL si l'auto-entrepreneur ANAE suffit pour votre activité — c'est plus rapide et moins coûteux. Et ne commencez pas à facturer avant d'avoir votre carte ANAE ou votre registre de commerce.

## Questions fréquentes

**Peut-on créer une entreprise en Algérie depuis la France sans se déplacer ?**
Pour l'auto-entrepreneur ANAE, l'inscription est 100% en ligne sur anae.dz, mais la carte doit être retirée physiquement en bureau de poste en Algérie. Pour une SARL, certaines démarches nécessitent une présence physique ou un mandataire sur place.

**Faut-il un casier judiciaire pour créer une entreprise en Algérie ?**
Non — le statut auto-entrepreneur ANAE ne demande pas de casier judiciaire. Pour une SARL, les exigences varient selon les activités. Consultez un avocat pour votre situation spécifique.

**Quelle est la différence entre l'auto-entrepreneur ANAE et le registre de commerce CNRC ?**
L'auto-entrepreneur ANAE est un statut simplifié sans registre de commerce, plafonné en CA, sans possibilité d'employer des salariés. Le registre de commerce CNRC est requis pour les SARL et les activités commerciales qui dépassent ce cadre.
    `,
  },
  "heriter-bien-immobilier-algerie-france": {
    titre:
      "Comment hériter d'un bien immobilier en Algérie depuis la France : guide complet 2026",
    resume:
      "Un parent vient de décéder en Algérie et vous vivez en France ? Voici toutes les démarches pour hériter d'un appartement, d'une maison ou d'un terrain algérien.",
    categorie: "Droit de la famille",
    date: "2026-05-28",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "vendre-appartement-algerie-etranger",
      "succession-algerie-depuis-etranger",
    ],
    contenu: `
## La loi applicable : toujours le droit algérien pour les biens en Algérie

Pour tout bien immobilier situé en Algérie, c'est le droit algérien qui s'applique obligatoirement (principe de la lex situs), même si le défunt vivait en France et même si les héritiers ont la nationalité française. C'est confirmé par le Consulat de France à Alger et le droit international privé algérien.

La succession immobilière algérienne est régie par les articles 126 à 201 du Code de la famille algérien, qui s'inspire du droit islamique malékite. Les parts héréditaires sont fixes et déterminées par la loi — un testament rédigé en France ne peut pas modifier ces parts pour les biens situés en Algérie.

## La Fredha — document central de toute succession algérienne

La Fredha est l'acte de succession algérien, équivalent de l'acte de notoriété français. Elle est délivrée par le notaire algérien du lieu de résidence ou du lieu d'inhumation du défunt. Elle désigne tous les héritiers et les parts que chacun détient. Ce document est indispensable — sans la Fredha, aucune démarche sur le bien immobilier n'est possible.

## Les étapes concrètes depuis la France

**Étape 1 — Obtenir l'acte de décès algérien**

Si le décès a eu lieu en Algérie, l'acte est établi par l'état civil de la commune du décès. Depuis la France, le consulat algérien compétent (celui dont dépendait le lieu de résidence du défunt) peut vous aider à obtenir une copie ou à effectuer les démarches de déclaration si le défunt est décédé en France.

**Étape 2 — Contacter un notaire algérien pour établir la Fredha**

Le notaire algérien établit la Fredha sur la base des actes d'état civil de tous les héritiers. Si vous ne pouvez pas vous déplacer, vous pouvez donner une procuration à un proche ou à un avocat en Algérie pour vous représenter.

**Étape 3 — La déclaration fiscale de succession**

Il n'existe pas de droits de succession au sens strict en Algérie. En revanche, des frais de mutation s'appliquent lors du transfert de propriété des biens immobiliers. En France, si le défunt était résident français, une déclaration de succession doit être déposée auprès des impôts français dans les 6 mois (12 mois si le décès a eu lieu à l'étranger). La convention franco-algérienne de 1999 vise à éviter la double imposition.

**Étape 4 — Le partage du bien**

Si tous les héritiers s'accordent, un acte notarié de partage est rédigé par le notaire algérien. Si un héritier bloque ou est introuvable, un partage judiciaire peut être demandé au tribunal. Un avocat devient indispensable dans cette situation.

**Étape 5 — La mutation du titre de propriété**

Une fois le partage acté, le notaire procède à la mutation du titre de propriété à la Conservation foncière au nom des nouveaux propriétaires.

## Documents nécessaires

- Acte de décès du défunt (traduit en arabe si établi en France)
- Actes de naissance de tous les héritiers
- Livret de famille du défunt
- Titre de propriété du bien si disponible
- Procuration légalisée si vous mandatez un représentant en Algérie

## Les situations difficiles

**Héritiers en désaccord** — Un héritier peut bloquer le partage pendant des années. L'action en partage judiciaire (da'wa al-qisma) devant le tribunal algérien est la solution. Un avocat est indispensable.

**Bien non titré** — De nombreux biens algériens n'ont pas d'acte notarié authentique. Il faut d'abord régulariser le titre auprès de la Conservation foncière avant toute succession.

**Ne rien faire** — C'est la pire option. La succession reste en indivision, aucun héritier ne peut vendre seul, et le nombre d'héritiers se multiplie à chaque génération, rendant la situation de plus en plus complexe.

## Questions fréquentes

**Peut-on hériter en Algérie avec la nationalité française uniquement ?**
Oui. Si le bien est en Algérie, le droit algérien s'applique quelle que soit votre nationalité.

**Faut-il se déplacer en Algérie ?**
Pas obligatoirement — une procuration donnée à un avocat ou un proche en Algérie suffit pour la plupart des démarches.

**Y a-t-il des droits de succession à payer en Algérie ?**
Il n'y a pas de droits de succession au sens strict en Algérie. Des frais de mutation s'appliquent lors du transfert de propriété, mais ils sont modestes par rapport aux droits français.
    `,
  },
  "vendre-appartement-algerie-etranger": {
    titre:
      "Comment vendre un appartement en Algérie depuis l'étranger : guide complet 2026",
    resume:
      "Vous avez un appartement ou une maison en Algérie et souhaitez le vendre depuis la France, la Belgique ou le Canada ? Voici le guide complet, étape par étape.",
    categorie: "Droit immobilier",
    date: "2026-05-28",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "acheter-bien-immobilier-algerie",
    ],
    contenu: `
## Peut-on vendre sans se déplacer en Algérie ?

Oui, c'est possible grâce à la procuration. Vous mandatez une personne de confiance — un proche ou un avocat en Algérie — pour signer l'acte de vente en votre nom. Cette procuration doit être établie auprès du consulat algérien dans votre pays de résidence. L'original de la procuration est généralement exigé par le notaire algérien pour les transactions immobilières.

## Les conditions pour pouvoir vendre

Avant de mettre votre bien en vente, vérifiez les points suivants.

**Titre de propriété valide** : vous devez disposer d'un acte notarié authentique enregistré à la Conservation foncière. Si votre bien n'est pas titré (acte sous seing privé, acte de vente informel), régularisez d'abord la situation — sans titre authentique, aucune vente légale n'est possible.

**Absence d'indivision bloquante** : si le bien est en indivision entre plusieurs héritiers ou copropriétaires, tous doivent consentir à la vente. Un seul héritier ne peut pas vendre sans l'accord des autres.

**Absence de charges** : vérifiez à la Conservation foncière l'absence d'hypothèque, de saisie ou de servitude non déclarée.

## Les étapes de la vente

**Étape 1 — La procuration consulaire**

Rendez-vous au consulat algérien de votre ville de résidence avec votre pièce d'identité algérienne. Le consulat établit la procuration qui autorise votre mandataire à signer tous les actes de vente en votre nom. Ce document est légalisé par le consulat et reconnu directement par les notaires algériens — pas besoin d'apostille supplémentaire pour une procuration consulaire algérienne.

**Étape 2 — Estimation du bien**

Mandatez un agent immobilier ou un avocat en Algérie pour évaluer la valeur marchande actuelle de votre bien. Le marché immobilier algérien a beaucoup évolué. Méfiez-vous des offres avec une partie du prix payée "au noir" — exigez toujours un prix 100% déclaré au notaire.

**Étape 3 — Trouver un acheteur**

Votre mandataire peut gérer les visites sur place. Les plateformes algériennes comme Ouedkniss sont efficaces pour trouver des acheteurs.

**Étape 4 — Le compromis de vente**

Une promesse de vente (ou acte sous seing privé) est signée entre vendeur (via le mandataire) et acheteur. Elle fixe le prix, les conditions et le délai. Un avocat peut sécuriser cette étape.

**Étape 5 — L'acte notarié définitif**

L'acte de vente est rédigé et signé chez le notaire algérien par votre mandataire (grâce à la procuration) et l'acheteur. Le notaire procède ensuite à l'enregistrement et à la publication foncière. Délai entre compromis et acte définitif : 1 à 6 mois selon la complexité.

**Étape 6 — Les frais et taxes**

Les frais de notaire représentent environ 2 à 5% du prix de vente. Les droits d'enregistrement sont partagés entre vendeur et acheteur selon les conventions. Une taxe sur la plus-value peut s'appliquer si vous avez vendu plus cher que le prix d'acquisition déclaré.

## Le rapatriement des fonds depuis l'Algérie

C'est la question la plus délicate. Les transferts de fonds depuis l'Algérie vers l'étranger sont strictement réglementés par la Banque d'Algérie. Les non-résidents qui ont acquis leur bien en devises (transfert légal depuis l'étranger) ont droit au rapatriement des fonds dans les mêmes devises. Pour les biens acquis en dinars ou hérités, les conditions sont différentes. Consultez impérativement un avocat algérien spécialisé pour anticiper cette question avant de vendre.

## Les risques à éviter

**La vente sans notaire** : toute transaction immobilière doit obligatoirement passer par un notaire algérien. Les actes sous seing privé non enregistrés ne sont pas opposables aux tiers et exposent le vendeur à des risques importants.

**Le mandataire non fiable** : la procuration donne des pouvoirs étendus — signez-la uniquement en faveur d'une personne de confiance absolue ou d'un avocat professionnel.

**Les parties informelles** : certains acheteurs proposent de payer une partie du prix en espèces "hors acte". C'est illégal et risqué — refusez systématiquement.

## Questions fréquentes

**Peut-on vendre un bien hérité sans se déplacer ?**
Oui, avec une procuration consulaire donnant pouvoir à un mandataire de signer tous les actes. Tous les cohéritiers doivent cependant donner leur accord.

**Combien de temps prend une vente ?**
Entre 1 et 6 mois selon la complexité du dossier, la disponibilité du notaire, et la rapidité des administrations.

**Faut-il payer des impôts en France sur la vente ?**
Potentiellement oui — une plus-value immobilière réalisée à l'étranger peut être imposable en France si vous êtes résident fiscal français. Consultez un fiscaliste avant de vendre.
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
    alternates: {
      canonical: `https://mizan-dz.com/blog/${slug}`,
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
                        <span className="text-xs font-medium text-teal-600">
                          {a.categorie}
                        </span>
                        <h3 className="font-semibold text-slate-800 text-sm mt-1 mb-auto leading-snug">
                          {a.titre}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 mb-3 line-clamp-2">
                          {a.resume}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 font-medium mt-auto pt-3 border-t border-slate-100">
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
