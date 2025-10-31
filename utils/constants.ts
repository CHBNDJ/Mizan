export const WILAYAS = ["Alger", "Oran", "Sétif", "Annaba"] as const;

export const SPECIALITES = [
  "Droit administratif",
  "Droit bancaire et financier",
  "Droit civil",
  "Droit commercial et des affaires",
  "Droit de la consommation",
  "Droit de la famille",
  "Droit de la propriété intellectuelle",
  "Droit de l'environnement",
  "Droit de l'immobilier",
  "Droit des assurances",
  "Droit des étrangers et immigration",
  "Droit des nouvelles technologies",
  "Droit des sociétés",
  "Droit du travail et social",
  "Droit fiscal",
  "Droit international",
  "Droit maritime",
  "Droit pénal",
  "Droit public",
  "Droit routier",
] as const;

export const BARREAUX = ["Alger", "Oran", "Sétif", "Annaba", "Batna"] as const;

export const URGENCE_OPTIONS = [
  { value: "normal", label: "Normal (48h)", multiplicateur: 1 },
  { value: "urgent", label: "Urgent (24h)", multiplicateur: 1.3 },
  { value: "tres_urgent", label: "Très urgent (6h)", multiplicateur: 1.6 },
] as const;

export const TARIF_RANGES = [
  { label: "Moins de 3 000 DA", min: 0, max: 3000 },
  { label: "3 000 - 5 000 DA", min: 3000, max: 5000 },
  { label: "5 000 - 8 000 DA", min: 5000, max: 8000 },
  { label: "Plus de 8 000 DA", min: 8000, max: 999999 },
] as const;

export const COUNTRIES = [
  { id: "dz", code: "213", name: "Algérie", flag: "🇩🇿" },
  { id: "fr", code: "33", name: "France", flag: "🇫🇷" },
  { id: "ca", code: "1", name: "Canada", flag: "🇨🇦" },
  { id: "us", code: "1", name: "États-Unis", flag: "🇺🇸" },
  { id: "tn", code: "216", name: "Tunisie", flag: "🇹🇳" },
  { id: "ma", code: "212", name: "Maroc", flag: "🇲🇦" },
  { id: "be", code: "32", name: "Belgique", flag: "🇧🇪" },
  { id: "ch", code: "41", name: "Suisse", flag: "🇨🇭" },
  { id: "de", code: "49", name: "Allemagne", flag: "🇩🇪" },
  { id: "it", code: "39", name: "Italie", flag: "🇮🇹" },
  { id: "es", code: "34", name: "Espagne", flag: "🇪🇸" },
  { id: "gb", code: "44", name: "Royaume-Uni", flag: "🇬🇧" },
] as const;

export const LOCATION = [
  { value: "algerie", label: "Algérie" },
  { value: "france", label: "France" },
  { value: "canada", label: "Canada" },
  { value: "belgique", label: "Belgique" },
  { value: "suisse", label: "Suisse" },
  { value: "allemagne", label: "Allemagne" },
  { value: "italie", label: "Italie" },
  { value: "espagne", label: "Espagne" },
  { value: "royaume-uni", label: "Royaume-Uni" },
  { value: "usa", label: "États-Unis" },
  { value: "autre-etranger", label: "Autre pays" },
];

export const LANGUES = [
  "Arabe",
  "Français",
  "Anglais",
  "Tamazight",
  "Espagnol",
];

export const GENRES = [
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
];
