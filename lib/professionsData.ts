export type ProfessionSlug =
  | "avocat"
  | "notaire"
  | "huissier"
  | "comptable"
  | "expert-comptable";

export const PROFESSIONS_DATA: Record<
  ProfessionSlug,
  {
    slug: string;
    label: string;
    labelPlural: string;
    tagline: string;
    intro: string;
    cadreJuridique: string;
    missions: { title: string; desc: string; emoji: string }[];
    quandFaireAppel: { situation: string; detail: string }[];
    differences: { avec: string; distinction: string }[];
    searchProfession: string;
  }
> = {
  avocat: {
    slug: "avocat",
    label: "Avocat",
    labelPlural: "Avocats",
    tagline: "Le défenseur de vos droits devant les juridictions algériennes",
    intro:
      "L'avocat est un auxiliaire de justice inscrit au barreau de sa wilaya. Il est le seul professionnel habilité à représenter et défendre les parties devant les juridictions algériennes — tribunaux, cours d'appel, Conseil d'État et Cour Suprême. Il peut également conseiller, rédiger des contrats et accompagner toute démarche juridique, que vous soyez en Algérie ou à l'étranger.",
    cadreJuridique:
      "L'avocat exerce sous le régime de la loi n°13-07 du 29 octobre 2013 portant organisation de la profession d'avocat (JO n°55 du 30 octobre 2013, page 3). Il est obligatoirement inscrit au tableau du barreau de sa wilaya, sous le contrôle de l'Union Nationale des Ordres des Avocats Algériens (UNOA). Selon l'article 9 de cette loi, les principes directeurs sont l'indépendance, la probité, la loyauté, le désintéressement, la courtoisie et la confraternité. Son secret professionnel est absolu.",
    missions: [
      {
        emoji: "⚖️",
        title: "Représentation en justice",
        desc: "Il plaide devant le tribunal, la cour d'appel, la Cour Suprême ou le Conseil d'État. Sans avocat, vous ne pouvez pas être valablement représenté dans la plupart des procédures civiles, pénales ou administratives.",
      },
      {
        emoji: "📋",
        title: "Conseil juridique",
        desc: "Il analyse votre situation, identifie vos droits et obligations, et vous indique la marche à suivre — avant même qu'un litige ne survienne. C'est souvent moins coûteux que d'attendre d'être en procès.",
      },
      {
        emoji: "📝",
        title: "Rédaction de contrats et actes sous seing privé",
        desc: "Il rédige des contrats de travail, conventions entre associés, baux commerciaux, protocoles d'accord, ou tout acte qui n'exige pas l'intervention d'un notaire.",
      },
      {
        emoji: "🏢",
        title: "Droit des affaires",
        desc: "Création de sociétés, litiges commerciaux, recouvrement de créances, contentieux fiscal, droit du travail — l'avocat accompagne les entrepreneurs à chaque étape.",
      },
      {
        emoji: "👨‍👩‍👧",
        title: "Droit de la famille",
        desc: "Divorce, garde d'enfants, pension alimentaire, succession litigieuse, kafala — ces matières nécessitent un avocat dès lors qu'elles sont contestées ou complexes.",
      },
      {
        emoji: "🌍",
        title: "Diaspora et droit international",
        desc: "Pour tout ce qui touche au droit algérien depuis l'étranger : héritage, acquisition immobilière, litige, nationalité — un avocat basé en Algérie est indispensable.",
      },
    ],
    quandFaireAppel: [
      {
        situation: "Vous avez reçu une convocation judiciaire",
        detail:
          "Que ce soit au civil ou au pénal, faites appel à un avocat immédiatement. Il vous représente et vous défend.",
      },
      {
        situation: "Vous voulez créer une société",
        detail:
          "Un avocat peut rédiger les statuts et sécuriser les rapports entre associés, en complément du notaire pour les actes officiels.",
      },
      {
        situation: "Un contrat important est en jeu",
        detail:
          "Avant de signer, faites relire par un avocat. Surtout pour les baux commerciaux, les cessions de fonds de commerce, les contrats de partenariat.",
      },
      {
        situation: "Un litige avec un tiers",
        detail:
          "Voisin, employeur, partenaire commercial, administration — dès qu'un conflit se précise, un avocat peut souvent le résoudre avant le tribunal.",
      },
      {
        situation: "Vous vivez à l'étranger et avez des affaires en Algérie",
        detail:
          "Pour suivre un dossier en votre absence, un avocat peut agir par procuration et vous représenter à toutes les audiences.",
      },
    ],
    differences: [
      {
        avec: "Notaire",
        distinction:
          "Le notaire établit des actes officiels qui ont force exécutoire (ventes immobilières, successions). L'avocat représente et défend dans les litiges. Les deux peuvent être nécessaires : un notaire pour la succession, un avocat si elle est contestée.",
      },
      {
        avec: "Huissier",
        distinction:
          "L'huissier exécute les décisions de justice. L'avocat les obtient. Après un jugement favorable, l'huissier est chargé de le faire appliquer.",
      },
      {
        avec: "Expert-comptable",
        distinction:
          "Pour un contentieux fiscal ou social, l'expert-comptable prépare les chiffres, l'avocat fiscaliste défend devant les juridictions compétentes.",
      },
    ],
    searchProfession: "avocat",
  },

  notaire: {
    slug: "notaire",
    label: "Notaire",
    labelPlural: "Notaires",
    tagline: "L'officier public qui sécurise vos actes les plus importants",
    intro:
      "Le notaire est un officier public ministériel nommé par l'État algérien. Il authentifie les actes juridiques les plus importants de la vie — ventes immobilières, successions, mariages, donations, création d'entreprise. Sa signature donne à ces actes une force légale que les simples contrats n'ont pas : ils sont inattaquables, exécutoires et conservés définitivement.",
    cadreJuridique:
      "Le notaire exerce sous le régime de la loi n°06-02 du 20 février 2006 relative à l'organisation de la profession de notaire. Il est nommé par décret présidentiel, rattaché à la Chambre des Notaires de sa wilaya et supervisé par l'Union Nationale des Notaires d'Algérie (UNNA). Ses actes sont authentiques — ils ont la même valeur qu'un jugement définitif et peuvent être exécutés directement.",
    missions: [
      {
        emoji: "🏠",
        title: "Transactions immobilières",
        desc: "Toute vente, achat, donation ou échange de bien immobilier en Algérie doit obligatoirement passer par un notaire. Il rédige l'acte, vérifie les titres de propriété, collecte les droits d'enregistrement et procède à la transcription au niveau des services fonciers.",
      },
      {
        emoji: "👨‍👩‍👧‍👦",
        title: "Successions et héritages",
        desc: "Il établit l'acte de notoriété qui reconnaît officiellement les héritiers, partage les biens selon la loi algérienne et les règles du droit musulman, et assure la transcription des transferts de propriété aux héritiers.",
      },
      {
        emoji: "💍",
        title: "Actes de mariage et contrats matrimoniaux",
        desc: "Il authentifie les actes de mariage, rédige les contrats de séparation de biens ou de communauté, et enregistre les actes qui ont une incidence sur le patrimoine du couple.",
      },
      {
        emoji: "🎁",
        title: "Donations et libéralités",
        desc: "Toute donation de bien immobilier ou de valeur importante doit être notariée pour être valide. Il sécurise le transfert et s'assure que les droits des héritiers réservataires sont respectés.",
      },
      {
        emoji: "🏢",
        title: "Création et cession d'entreprise",
        desc: "Statuts de SARL, EURL ou SPA, cessions de parts sociales, augmentations de capital, dissolution de société — les actes constitutifs exigent souvent l'intervention du notaire.",
      },
      {
        emoji: "✅",
        title: "Procurations officielles",
        desc: "Pour représenter légalement quelqu'un en Algérie, notamment pour la diaspora qui gère ses biens à distance, le notaire établit des procurations authentiques reconnues par toutes les administrations.",
      },
    ],
    quandFaireAppel: [
      {
        situation: "Vous achetez ou vendez un bien immobilier",
        detail:
          "Obligatoire. Aucune transaction immobilière en Algérie n'est valide sans acte notarié. C'est une exigence légale, pas un choix.",
      },
      {
        situation: "Vous êtes héritier d'un bien en Algérie",
        detail:
          "Le notaire établit l'acte de notoriété et organise le partage successoral, même si vous vivez à l'étranger. Il peut opérer par procuration.",
      },
      {
        situation: "Vous voulez faire une donation à vos enfants",
        detail:
          "Pour éviter les contestations futures, une donation notariée est la seule solution sécurisée, surtout pour les biens immobiliers.",
      },
      {
        situation: "Vous créez une société formelle",
        detail:
          "Pour les SPA et certains actes de SARL, l'intervention du notaire est obligatoire. Il garantit la légalité des statuts.",
      },
      {
        situation: "Vous vivez à l'étranger et devez agir en Algérie",
        detail:
          "Le notaire établit une procuration authentique qui vous permet de déléguer la gestion d'un bien ou d'une succession à une personne de confiance en Algérie.",
      },
    ],
    differences: [
      {
        avec: "Avocat",
        distinction:
          "L'avocat défend et conseille. Le notaire authentifie et sécurise. Pour une succession contestée, vous avez besoin des deux : le notaire pour le partage officiel, l'avocat si un héritier conteste.",
      },
      {
        avec: "Huissier",
        distinction:
          "Le notaire crée des actes officiels. L'huissier exécute des décisions ou constate des faits. Ils interviennent à des étapes différentes.",
      },
      {
        avec: "Avocat pour les contrats",
        distinction:
          "Un contrat rédigé par un avocat est un acte sous seing privé. Un acte notarié est authentique — il a force exécutoire sans jugement préalable.",
      },
    ],
    searchProfession: "notaire",
  },

  huissier: {
    slug: "huissier",
    label: "Huissier de Justice",
    labelPlural: "Huissiers de Justice",
    tagline: "L'auxiliaire de justice qui constate, signifie et exécute",
    intro:
      "L'huissier de justice est un officier ministériel assermenté dont le rôle est d'agir là où les décisions et les faits doivent être officiellement constatés ou exécutés. Il est le bras armé de la justice — il signifie les actes judiciaires, exécute les jugements et établit des constats qui font foi devant toute juridiction.",
    cadreJuridique:
      "L'huissier de justice exerce sous le régime de la loi n°06-03 du 20 février 2006 portant organisation de la profession d'huissier de justice (JO n°14), modifiée et complétée par la loi n°23-13 du 5 août 2023 (JO n°52) qui redéfinit ses conditions d'exercice, ses missions et ses obligations — et qui intègre désormais les attributions de commissaire-priseur dans la profession (art. 10). Selon l'article 4 de la loi 06-03, il est un officier public mandaté par l'autorité publique, nommé par arrêté du ministre de la Justice. Ses quatre missions officielles sont définies à l'article 12 : signification des actes et exploits, exécution des décisions de justice civiles, recouvrement amiable ou judiciaire de créances, et constatations. Il est placé sous le contrôle du Procureur de la République et supervisé par la Chambre Nationale des Huissiers de Justice.",
    missions: [
      {
        emoji: "📬",
        title: "Signification d'actes judiciaires",
        desc: "Il notifie officiellement les convocations, jugements, mises en demeure et actes de procédure aux parties concernées. Sans signification par huissier, un acte judiciaire n'est pas légalement opposable.",
      },
      {
        emoji: "🔨",
        title: "Exécution des jugements",
        desc: "Quand un tribunal condamne quelqu'un à payer ou à faire quelque chose, l'huissier est chargé de faire appliquer la décision : saisie de compte bancaire, saisie de véhicule, expulsion, etc.",
      },
      {
        emoji: "📸",
        title: "Constats officiels",
        desc: "Il dresse des procès-verbaux de constat qui font foi en justice : état d'un bien loué, malfaçons de construction, affichage publicitaire non autorisé, contenu d'un site internet, état des lieux contradictoire.",
      },
      {
        emoji: "💰",
        title: "Recouvrement de créances",
        desc: "Pour les impayés de loyers, factures commerciales, prêts entre particuliers — l'huissier peut engager une procédure d'injonction de payer et procéder aux saisies si nécessaire.",
      },
      {
        emoji: "📋",
        title: "Inventaires et prisées",
        desc: "Il établit l'inventaire officiel des biens d'une succession, d'une liquidation judiciaire ou d'une saisie. Sa valorisation fait référence pour le partage.",
      },
      {
        emoji: "🏢",
        title: "Constats commerciaux",
        desc: "Pour les entreprises : constat de concurrence déloyale, de contrefaçon, de non-respect d'un contrat, d'état d'un chantier — le procès-verbal d'huissier est la preuve la plus solide.",
      },
    ],
    quandFaireAppel: [
      {
        situation: "Vous avez un jugement favorable non respecté",
        detail:
          "L'huissier est chargé de l'exécution. Il procède aux saisies et aux mesures d'exécution forcée pour vous faire payer ce qui vous est dû.",
      },
      {
        situation: "Vous avez un locataire qui ne paie plus",
        detail:
          "L'huissier délivre la mise en demeure, entame la procédure d'injonction de payer et peut procéder à l'expulsion après jugement.",
      },
      {
        situation: "Vous avez un impayé commercial",
        detail:
          "Pour les créances certaines, l'huissier peut obtenir une injonction de payer rapidement sans procédure longue, puis procéder à la saisie des avoirs du débiteur.",
      },
      {
        situation: "Vous devez prouver un fait de façon irréfutable",
        detail:
          "Un constat d'huissier est la preuve la plus forte devant un tribunal : état d'un bien avant travaux, contenu d'un email ou d'un site web, non-respect d'une obligation contractuelle.",
      },
      {
        situation: "Vous avez reçu un acte de justice",
        detail:
          "Vérifiez qu'il a bien été signifié par huissier — c'est la condition pour que les délais légaux de recours commencent à courir.",
      },
    ],
    differences: [
      {
        avec: "Avocat",
        distinction:
          "L'avocat obtient les décisions de justice. L'huissier les exécute. Après votre victoire au tribunal, c'est l'huissier qui fait appliquer le jugement.",
      },
      {
        avec: "Notaire",
        distinction:
          "Le notaire crée des actes préventivement pour sécuriser des droits. L'huissier intervient après coup pour constater ou exécuter.",
      },
      {
        avec: "Police et justice",
        distinction:
          "L'huissier n'est pas un agent de l'État — c'est un officier ministériel libéral. Il agit sur mandat judiciaire ou à la demande d'un particulier pour des constats.",
      },
    ],
    searchProfession: "huissier",
  },

  comptable: {
    slug: "comptable",
    label: "Comptable Agréé",
    labelPlural: "Comptables Agréés",
    tagline:
      "Le gestionnaire de votre comptabilité quotidienne et de vos obligations fiscales",
    intro:
      "Le comptable agréé est un professionnel inscrit à l'Ordre National des Comptables Agréés (ONCA). Il prend en charge la comptabilité courante de l'entreprise, établit les déclarations fiscales et sociales obligatoires, et assure la conformité de votre dossier vis-à-vis de l'administration algérienne. Pour toute entreprise algérienne, avoir un comptable agréé est la première décision de gestion saine.",
    cadreJuridique:
      "Le comptable agréé exerce sous le régime de la loi n°10-01 du 29 juin 2010 relative aux professions d'expert-comptable, de commissaire aux comptes et de comptable agréé. Il est inscrit au tableau de l'Organisation Nationale des Comptables Agréés (ONCA), régie par le décret exécutif n°11-27 du 27 janvier 2011, qui contrôle l'exercice de la profession et définit les règles déontologiques applicables.",
    missions: [
      {
        emoji: "📊",
        title: "Tenue de la comptabilité",
        desc: "Il enregistre toutes les opérations financières de l'entreprise selon le Système Comptable Financier (SCF) algérien : achats, ventes, salaires, charges, amortissements. C'est la base de tout le reste.",
      },
      {
        emoji: "🧾",
        title: "Déclarations fiscales",
        desc: "Il établit et dépose toutes les déclarations obligatoires : TAP (Taxe sur l'Activité Professionnelle), IBS (Impôt sur les Bénéfices des Sociétés), IFU (Impôt Forfaitaire Unique), G50 mensuel, TVA. Un retard ou une erreur expose à des pénalités.",
      },
      {
        emoji: "👥",
        title: "Paie et charges sociales",
        desc: "Il calcule les salaires, établit les fiches de paie, déclare les cotisations CNAS et CASNOS, et assure la conformité du dossier social de l'entreprise.",
      },
      {
        emoji: "📅",
        title: "Bilan annuel",
        desc: "À la clôture de l'exercice, il établit le bilan, le compte de résultat et les annexes — documents obligatoires pour toute EURL ou SARL. Ces états financiers servent aussi pour les demandes de crédits bancaires.",
      },
      {
        emoji: "🏢",
        title: "Création d'entreprise",
        desc: "Il vous accompagne dans les formalités de création d'une EURL ou SARL : domiciliation, inscription au registre du commerce, ouverture de compte professionnel, choix du régime fiscal.",
      },
      {
        emoji: "📋",
        title: "Déclaration CASNOS",
        desc: "Pour les indépendants et gérants non-salariés, la déclaration CASNOS annuelle est obligatoire. Le comptable la prépare et vous évite les pénalités de retard.",
      },
    ],
    quandFaireAppel: [
      {
        situation: "Vous venez de créer votre EURL ou SARL",
        detail:
          "Dès la création, un comptable agréé est indispensable pour tenir les livres légaux et déposer vos premières déclarations dans les délais.",
      },
      {
        situation: "Vous avez reçu un avis de vérification fiscale",
        detail:
          "Un comptable bien informé prépare votre dossier, répond aux demandes de l'administration et vous représente lors des entretiens avec le vérificateur.",
      },
      {
        situation: "Vous avez des salariés",
        detail:
          "La gestion de la paie, des déclarations CNAS et des contrats de travail requiert une compétence comptable et sociale que le comptable agréé maîtrise.",
      },
      {
        situation: "Vous demandez un crédit bancaire",
        detail:
          "La banque exige un bilan certifié pour tout financement professionnel. Le comptable établit les états financiers qui appuient votre dossier.",
      },
      {
        situation:
          "Vous êtes de la diaspora et gérez une entreprise en Algérie à distance",
        detail:
          "Un comptable agréé de confiance gère vos obligations fiscales et administratives en votre absence, vous évitant amendes et pénalités.",
      },
    ],
    differences: [
      {
        avec: "Expert-comptable",
        distinction:
          "Le comptable agréé gère la comptabilité courante et les déclarations fiscales. L'expert-comptable peut en plus signer des bilans certifiés destinés à des tiers, réaliser des audits et des évaluations d'entreprise. Pour une PME standard, le comptable agréé est souvent suffisant.",
      },
      {
        avec: "Gestionnaire interne",
        distinction:
          "Un employé comptable n'est pas agréé et n'engage pas sa responsabilité professionnelle. Un comptable agréé est réglementé, assuré et responsable pénalement et civilement de ses actes.",
      },
      {
        avec: "Expert fiscal",
        distinction:
          "Pour un contentieux fiscal complexe devant les juridictions, un avocat fiscaliste est nécessaire. Le comptable gère les déclarations, l'avocat plaide les litiges.",
      },
    ],
    searchProfession: "comptable",
  },

  "expert-comptable": {
    slug: "expert-comptable",
    label: "Expert Comptable",
    labelPlural: "Experts Comptables",
    tagline: "L'expert en audit, évaluation et conseil financier avancé",
    intro:
      "L'expert-comptable est le plus haut niveau de la profession comptable en Algérie. Inscrit à l'Ordre National des Experts-Comptables (ONEC), il maîtrise non seulement la comptabilité et la fiscalité, mais aussi l'audit légal, l'évaluation d'entreprise, la consolidation des comptes et la due diligence financière. Il intervient là où la complexité financière dépasse le cadre de la gestion courante.",
    cadreJuridique:
      "L'expert-comptable exerce sous le régime de la loi n°10-01 du 29 juin 2010. Il est inscrit au tableau de l'Ordre National des Experts-Comptables (ONEC), après une formation longue sanctionnée par un diplôme d'État et un stage professionnel. Son titre est protégé — seul un membre de l'ONEC peut se qualifier d'expert-comptable. La même loi n°10-01 crée également la Chambre Nationale des Commissaires aux Comptes (CNCC), corps distinct qui encadre l'exercice du commissariat aux comptes. L'ONEC est membre de l'IFAC (International Federation of Accountants) depuis 2017 et de l'IASB depuis 2024. En 2026, l'Institut d'Enseignement Supérieur des Professions Comptables (IESPC) ouvre sa première promotion d'experts-comptables. Il peut également exercer comme commissaire aux comptes après habilitation spécifique.",
    missions: [
      {
        emoji: "🔍",
        title: "Audit légal et contractuel",
        desc: "Il examine les comptes d'une entreprise de façon indépendante et émet une opinion sur leur sincérité et régularité. L'audit contractuel est commandé par les dirigeants ou actionnaires pour sécuriser une décision stratégique.",
      },
      {
        emoji: "💼",
        title: "Évaluation d'entreprise",
        desc: "Pour une cession, une entrée au capital, une fusion ou une succession, l'expert-comptable détermine la valeur de l'entreprise selon des méthodes reconnues : multiples sectoriels, actualisation des flux, actif net réévalué.",
      },
      {
        emoji: "📊",
        title: "Consolidation des comptes",
        desc: "Pour les groupes de sociétés, il établit les comptes consolidés qui donnent une vision globale de la situation financière de l'ensemble, conformément aux normes applicables.",
      },
      {
        emoji: "🔎",
        title: "Due diligence financière",
        desc: "Avant une acquisition ou un investissement, il passe au crible les comptes historiques, identifie les risques cachés, vérifie la qualité des actifs et des passifs.",
      },
      {
        emoji: "🏗️",
        title: "Restructuration financière",
        desc: "Pour les entreprises en difficulté ou en transformation, il diagnostique la situation financière, propose un plan de restructuration et accompagne sa mise en œuvre.",
      },
      {
        emoji: "📋",
        title: "Conseil fiscal avancé",
        desc: "Optimisation fiscale légale, montages juridico-fiscaux, assistance lors de contrôles fiscaux complexes, recours devant les commissions de recours fiscaux.",
      },
    ],
    quandFaireAppel: [
      {
        situation: "Vous voulez vendre ou acheter une entreprise",
        detail:
          "L'expert-comptable valorise l'entreprise cible, examine ses comptes et vous donne une base chiffrée solide pour la négociation.",
      },
      {
        situation: "Vous avez des investisseurs ou actionnaires",
        detail:
          "Ils exigeront des comptes certifiés par un expert-comptable. C'est une exigence standard de tout investisseur institutionnel ou fonds d'investissement.",
      },
      {
        situation: "Vous faites face à un contrôle fiscal sérieux",
        detail:
          "Pour les redressements importants, l'expert-comptable prépare votre défense chiffrée et vous accompagne devant les commissions de recours.",
      },
      {
        situation: "Vous dirigez un groupe de sociétés",
        detail:
          "La consolidation des comptes et le suivi financier d'un groupe nécessitent l'expertise d'un professionnel ONEC.",
      },
      {
        situation: "Vous cherchez un financement important",
        detail:
          "Pour les levées de fonds, emprunts obligataires ou financements structurés, un rapport d'expert-comptable est exigé par les banques et les marchés.",
      },
    ],
    differences: [
      {
        avec: "Comptable agréé",
        distinction:
          "Le comptable agréé gère la comptabilité courante et les déclarations fiscales. L'expert-comptable peut certifier des bilans destinés à des tiers, évaluer des entreprises et réaliser des audits — missions qui engagent sa responsabilité professionnelle de façon beaucoup plus étendue.",
      },
      {
        avec: "Commissaire aux Comptes",
        distinction:
          "L'expert-comptable travaille pour le client qui le mandate. Le commissaire aux comptes est mandaté par les actionnaires pour contrôler les dirigeants — il est indépendant de la direction. Un même professionnel ne peut pas être les deux pour la même entreprise.",
      },
      {
        avec: "Avocat fiscaliste",
        distinction:
          "L'expert-comptable prépare et chiffre la défense fiscale. L'avocat fiscaliste la plaide devant les juridictions. Les deux travaillent souvent ensemble sur les dossiers complexes.",
      },
    ],
    searchProfession: "expert-comptable",
  },
};

export const PROFESSIONS_LIST: ProfessionSlug[] = [
  "avocat",
  "notaire",
  "huissier",
  "comptable",
  "expert-comptable",
];
