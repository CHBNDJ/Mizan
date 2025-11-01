require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const avocats = [
  {
    id: "TEST999",
    nom: "Avocat",
    prenom: "Test",
    titre: "Maître",
    genre: "homme",
    specialites: ["Droit civil", "Droit pénal"],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "123 Rue Test",
      quartier: "Centre-ville",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 12 34 56 78",
      email: "nadjidemarseille@hotmail.fr",
      site_web: null,
    },
    experience: {
      annees: 5,
      date_inscription: "2020",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.5,
    reviews_count: 5,
  },
  {
    id: "ALG001",
    nom: "YDROUDJ",
    prenom: "Nesrine",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit de la famille",
      "Droit civil",
      "Droit pénal",
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit commercial et des affaires",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "54 Rue Sidi Hassen",
      quartier: "Grand Cheraga",
      ville: "Alger",
      code_postal: "16125",
    },
    contact: {
      telephone: "+213 555 588 337",
      email: "contact@avocat-ydroudj.com",
      site_web: "http://www.avocat-ydroudj.com",
    },
    experience: {
      annees: 8,
      date_inscription: "2015",
    },
    langues: ["Arabe", "Français", "Anglais", "Espagnol"],
    verified: true,
    rating: 4.2,
    reviews_count: 15,
  },
  {
    id: "ALG002",
    nom: "BOULENOIR",
    prenom: "Sarah",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit de la famille",
      "Droit commercial et des affaires",
      "Droit de l'immobilier",
    ],
    barreau: "Blida",
    wilaya: "Alger",
    ville: "Boufarik",
    adresse: {
      rue: "Centre ville",
      quartier: "Boufarik",
      ville: "Boufarik",
      code_postal: "09000",
    },
    contact: {
      telephone: "+213540816448, +213670040160",
      email: "maitreboulenoir@gmail.com",
      site_web: "https://sites.google.com/view/avocat-algerie-droit-justice",
    },
    experience: {
      annees: 15,
      date_inscription: "2008",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.3,
    reviews_count: 18,
  },
  {
    id: "ALG003",
    nom: "BELLOULA",
    prenom: "H. Djamel",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit pénal",
      "Droit de l'immobilier",
      "Droit de la famille",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "1 Rue Abdelmoumène",
      quartier: "Centre-ville",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 23 49 18 37",
      mobile: "+213 661 539 338",
      email: "avocat.djamel@hdbelloula.com",
      site_web: null,
    },
    experience: {
      annees: 18,
      date_inscription: "2005",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.1,
    reviews_count: 12,
  },
  {
    id: "ALG004",
    nom: "TOUALBI",
    prenom: "Issam",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit de la famille",
      "Droit pénal",
      "Droit de l'immobilier",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "59 Appremont",
      quartier: "Rostomia, Bouzareah",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 773 36 91 43",
      email: "contact@toualbi-avocat.net",
      site_web: null,
      linkedin: "https://www.linkedin.com/in/issam-toualbi-00a374290/",
    },
    experience: {
      annees: 10,
      date_inscription: "2013",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 3.9,
    reviews_count: 8,
  },
  {
    id: "ALG005",
    nom: "MERABTI",
    prenom: "Ghania",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit civil",
      "Droit de la famille",
      "Droit commercial et des affaires",
      "Droit des étrangers et immigration",
      "Droit de la propriété intellectuelle",
      "Droit du travail et social",
      "Droit de l'immobilier",
      "Droit pénal",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "54 Sidi Hassen",
      quartier: "Grand Cheraga",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 554 63 40 48",
      email: "ghaniamerabti9@gmail.com",
      site_web: null,
    },
    experience: {
      annees: 7,
      date_inscription: "2016",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
    rating: 4.0,
    reviews_count: 6,
  },
  {
    id: "ALG006",
    nom: "Nait-Abdesselam",
    prenom: "Chabane",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit de la famille",
      "Droit commercial et des affaires",
      "Droit de la propriété intellectuelle",
      "Droit pénal",
      "Droit du travail et social",
      "Droit administratif",
      "Droit international",
      "Droit des nouvelles technologies",
      "Droit bancaire et financier",
      "Droit des étrangers et immigration",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "202 bis rue Mohamed BELOUIZDAD",
      quartier: "Belouizdad",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 784 83 90 89 ",
      mobile: "+33 6 17 34 10 70",
      email: "chabanenaitabdesselam@gmail.com",
      site_web: null,
    },
    experience: {
      annees: 28,
      date_inscription: "1997",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.2,
    reviews_count: 14,
  },
  {
    id: "ALG007",
    nom: "NESSAL",
    prenom: "Younes",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit pénal",
      "Droit public",
      "Droit de la famille",
      "Droit des assurances",
      "Droit bancaire et financier",
      "Droit de l'immobilier",
      "Droit du travail et social",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "Lotissement urbain n 62",
      quartier: "Baba Hassen",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 556 987 552",
      email: "avocat.nessal@yahoo.fr",
      site_web: null,
    },
    experience: {
      annees: 15,
      date_inscription: "2008",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.2,
    reviews_count: 14,
  },
  {
    id: "ALG008",
    nom: "BOUDENNE",
    prenom: "Nesrine",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit civil",
      "Droit de la famille",
      "Droit commercial et des affaires",
      "Droit de la propriété intellectuelle",
      "Droit pénal",
      "Droit du travail et social",
      "Droit de l'immobilier",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "Les Oranges Group A, N25,",
      quartier: "Dar El Beida",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 791 379 810",
      email: "boudennenesrine@outlook.fr",
      site_web: null,
    },
    experience: {
      annees: 8,
      date_inscription: "2015",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.0,
    reviews_count: 11,
  },
  {
    id: "ALG009",
    nom: "Mebarki",
    prenom: "Mohamed Amine",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit fiscal",
      "Droit bancaire et financier",
      "Droit administratif",
      "Droit de la propriété intellectuelle",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "5 Rue Lieutenant Ahmed Garani",
      quartier: "Casbah",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 560 30 36 73",
      email: "amine.mebarki@algerian-business-lawyer.com",
      site_web: "https://algerian-business-lawyer.com/",
    },
    experience: {
      annees: 10,
      date_inscription: "2015",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
    rating: 4.9,
    reviews_count: 56,
  },
  {
    id: "ALG010",
    nom: "BEN ABDERRAHMANE",
    prenom: "Dahmane",
    titre: "Dr.",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit de la famille",
      "Droit commercial et des affaires",
      "Droit de la propriété intellectuelle",
      "Droit pénal",
      "Droit du travail et social",
      "Droit de l'immobilier",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "26 boulevard Zirout",
      quartier: "Youcef",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 21 74 91 32",
      email: "irkiphone.j4@gmail.com",
      site_web: null,
    },
    experience: {
      annees: 30,
      date_inscription: "1995",
    },
    langues: ["Arabe", "Français", "Anglais", "Allemand"],
    verified: true,
    rating: 4.3,
    reviews_count: 16,
  },
  {
    id: "ALG011",
    nom: "AMER BOUAFIA",
    prenom: "Kahina",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit pénal",
      "Droit administratif",
      "Droit civil",
      "Droit de la famille",
      "Droit du travail et social",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "22 Rue Colonel Med chabani, ex Rabah Noe",
      quartier: "Centre",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 770 92 36 79",
      email: "cabinet.maitre.amer.kahina@gmail.com",
      site_web: "https://abkavocat.wixsite.com/website",
    },
    experience: {
      annees: 22,
      date_inscription: "2003",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
    rating: 4.0,
    reviews_count: 10,
  },
  {
    id: "ALG012",
    nom: "BENATALLAH",
    prenom: "Tewfik",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit pénal",
      "Droit administratif",
      "Droit civil",
      "Droit de la famille",
      "Droit du travail et social",
    ],
    barreau: "Alger",
    wilaya: "Alger",
    ville: "Alger",
    adresse: {
      rue: "2 rue Saad Taleb ( Docteur Saadane Salle Ibn Khaldoun)",
      quartier: "Centre",
      ville: "Alger",
      code_postal: "16000",
    },
    contact: {
      telephone: "+213 663 52 02 10",
      email: "benatallahtewfik@hotmail.com",
      site_web: null,
      linkedin: "https://www.linkedin.com/in/tewfik-benatallah-7b4bb6124/",
    },
    experience: {
      annees: 22,
      date_inscription: "2003",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
    rating: 4.0,
    reviews_count: 10,
  },
  {
    id: "ORA001",
    nom: "BOUKADOUM",
    prenom: "Wafa",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit pénal",
      "Droit civil",
      "Droit international",
      "Droit de la famille",
      "Droit commercial et des affaires",
    ],
    barreau: "Oran",
    wilaya: "Oran",
    ville: "Oran",
    adresse: {
      rue: "132 Avenue Larbi Ben Mhidi",
      quartier: "Miramar",
      ville: "Oran",
      code_postal: "31000",
    },
    contact: {
      telephone: "+213 41 40 77 90",
      mobile: "+213 6 68 57 19 73",
      email: "contact@maitre.boukadoum.net",
      site_web: "http://www.avocatoran.net/",
    },
    experience: {
      annees: 26,
      date_inscription: "1998",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.4,
    reviews_count: 22,
  },
  {
    id: "ORA002",
    nom: "HADJ HABIB",
    prenom: "Fahim",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit pénal",
      "Droit civil",
      "Droit international",
      "Droit de la famille",
      "Droit commercial et des affaires",
    ],
    barreau: "Oran",
    wilaya: "Oran",
    ville: "Oran",
    adresse: {
      rue: "4 Rue Mohamed Khemisti",
      quartier: "2ème étage",
      ville: "Oran",
      code_postal: "31000",
    },
    contact: {
      telephone: "+213 41 361 192",
      mobile: "+213 772 160 850",
      email: "habib.fahim@yahoo.fr",
      site_web: null,
    },
    experience: {
      annees: 20,
      date_inscription: "2003",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.5,
    reviews_count: 18,
  },
  {
    id: "ORA003",
    nom: "AISSANI",
    prenom: "Abdelkrim",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit fiscal",
      "Droit international",
      "Droit routier",
      "Droit des assurances",
    ],
    barreau: "Oran",
    wilaya: "Oran",
    ville: "Oran",
    adresse: {
      rue: "16 Rue Larbi Ben M'Hidi",
      quartier: "Centre-ville",
      ville: "Oran",
      code_postal: "31000",
    },
    contact: {
      telephone: "+213 662 16 76 20",
      email: "aissabdelkrim31@gmail.com",
      site_web: null,
    },
    experience: {
      annees: 15,
      date_inscription: "2008",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.2,
    reviews_count: 14,
  },
  {
    id: "ORA004",
    nom: "BELABBES",
    prenom: "Laredj",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit des assurances",
      "Droit civil",
      "Droit de la famille",
      "Droit de l'immobilier",
      "Droit pénal",
      "Droit administratif",
    ],
    barreau: "Oran",
    wilaya: "Oran",
    ville: "Es-Sénia",
    adresse: {
      rue: "49 Rue Zaghloul",
      quartier: "Es-Sénia",
      code_postal: "31000",
    },
    contact: {
      telephone: "+213 792 22 45 72",
      email: "laredj31@hotmail.com",
      site_web: null,
    },
    experience: {
      annees: 12,
      date_inscription: "2011",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.0,
    reviews_count: 10,
  },
  {
    id: "ORA005",
    nom: "Belhadri",
    prenom: "Lahouari",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit pénal",
      "Droit commercial et des affaires",
      "Droit de la famille",
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit fiscal",
    ],
    barreau: "Oran",
    wilaya: "Oran",
    ville: "Oran",
    adresse: {
      rue: "60 Bis Rue Mohamed Khemisti",
      quartier: "Centre-ville",
      code_postal: "31000",
    },
    contact: {
      telephone: "+213 41 33 84 85",
      email: "lahouaribelhadri@yahoo.fr",
      site_web: null,
    },
    experience: {
      annees: 31,
      date_inscription: "1994",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 3.8,
    reviews_count: 7,
  },
  {
    id: "ANN001",
    nom: "CHEBIRA",
    prenom: "Larbi",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit fiscal",
      "Droit international",
      "Droit routier",
      "Droit des assurances",
    ],
    barreau: "Annaba",
    wilaya: "Annaba",
    ville: "Annaba",
    adresse: {
      rue: "8 Place Tarik Ibn Ziad",
      quartier: "Centre-ville",
      ville: "Annaba",
      code_postal: "23000",
    },
    contact: {
      telephone: "+213 38 459 214",
      mobile: "+213 661 378 796",
      email: "chebiramlarbi@yahoo.fr",
      site_web: null,
    },
    experience: {
      annees: 20,
      date_inscription: "2003",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.4,
    reviews_count: 25,
  },
  {
    id: "ANN002",
    nom: "ZERGUINE",
    prenom: "Kouceila",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit civil",
      "Droit de la famille",
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit fiscal",
    ],
    barreau: "Annaba",
    wilaya: "Annaba",
    ville: "Annaba",
    adresse: {
      rue: "14 Rue M'haddar Lakhdar, N°13",
      ville: "Annaba",
      code_postal: "23000",
    },
    contact: {
      telephone: "+213 38 40 14 12",
      mobile: "+213 790 204 412",
      email: "zerguine-kouceila@hotmail.fr",
      site_web: "https://www.kz-avocats.com/",
    },
    experience: {
      annees: 16,
      date_inscription: "2007",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
    rating: 4.6,
    reviews_count: 32,
  },
  {
    id: "ANN003",
    nom: "DALI",
    prenom: "Hichem",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit administratif",
      "Droit commercial et des affaires",
      "Droit de l'immobilier",
      "Droit maritime",
      "Droit civil",
      "Droit pénal",
      "Droit de l'environnement",
      "Droit des sociétés",
      "Droit fiscal",
      "Droit du travail et social",
    ],
    barreau: "Annaba",
    wilaya: "Annaba",
    ville: "Annaba",
    adresse: {
      rue: "4 Rue Lamara Abdelkader",
      quartier: "Centre-ville",
      ville: "Annaba",
      code_postal: "23000",
    },
    contact: {
      telephone: "+213 38 45 18 41",
      email: null,
      site_web: null,
    },
    experience: {
      annees: 26,
      date_inscription: "1999",
    },
    langues: ["Arabe", "Français"],
    verified: true,
    rating: 4.5,
    reviews_count: 28,
  },
  {
    id: "ANN004",
    nom: "BOUACHA",
    prenom: "Hadjer",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit civil",
      "Droit commercial et des affaires",
      "Droit de la famille",
      "Droit de l'immobilier",
      "Droit du travail et social",
      "Droit international",
      "Droit administratif",
      "Droit bancaire et financier",
      "Droit des étrangers et immigration",
      "Droit des nouvelles technologies",
      "Droit des assurances",
    ],
    barreau: "Annaba",
    wilaya: "Annaba",
    ville: "Annaba",
    adresse: {
      rue: "06 rue kaabar adra",
      ville: "Annaba",
      code_postal: "23000",
    },
    contact: {
      mobile: "+213 771 26 79 33",
      email: "almohsen@gmail.com",
      site_web: null,
    },
    experience: {
      annees: 15,
      date_inscription: "2010",
    },
    langues: ["Arabe", "Français", "Anglais"],
    verified: true,
  },
  {
    id: "ANN005",
    nom: "DJELLALI",
    prenom: "Dalel",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit du travail et social",
      "Droit de l'immobilier",
      "Droit commercial et des affaires",
      "Droit de la famille",
    ],
    barreau: "Annaba",
    wilaya: "Annaba",
    ville: "Annaba",
    adresse: {
      rue: "7 Rue Bouzbid Ahmed",
      quartier: "Centre-ville",
      ville: "Annaba",
      code_postal: "23000",
    },
    contact: {
      telephone: "+213 38 80 66 47",
      email: null,
      site_web: null,
    },
    experience: {
      annees: 16,
      date_inscription: "2009",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET001",
    nom: "BOUADAM",
    prenom: "Sacia",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit de la famille",
      "Droit civil",
      "Droit du travail et social",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Cité Amor Deguou Bt C1 N°358",
      quartier: "Cité Amor Deguou",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 044 6809",
      email: "addar.bouadam@yahoo.fr",
    },
    experience: {
      annees: 26,
      date_inscription: "1999-10-03",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET002",
    nom: "SAI",
    prenom: "Ahmed",
    titre: "Maître",
    genre: "homme",
    specialites: ["Droit administratif", "Droit public", "Droit pénal"],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "1 Novembre 1954, Rue Arbi Ben Mehidi",
      quartier: "Centre-ville",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 206 2963",
      email: "batonnier_setif@yahoo.fr",
    },
    experience: {
      annees: 41,
      date_inscription: "1984-11-18",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET003",
    nom: "SOUAKIR",
    prenom: "Barkahoum",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit pénal",
      "Droit civil",
      "Droit des assurances",
      "Droit routier",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Cité Tlidjen 294 Logt Bt C11 N°213",
      quartier: "Cité Tlidjen",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 302 1530",
      email: "maitresouakirbarkahoum@yahoo.fr",
    },
    experience: {
      annees: 28,
      date_inscription: "1997-01-29",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET004",
    nom: "CHITER",
    prenom: "Katia",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit du travail et social",
      "Droit commercial et des affaires",
      "Droit de l'immobilier",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Cité Amar Dagou 331 Logts Rez-de-chaussée N°424",
      quartier: "Cité Amar Dagou",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 79 904 2653",
      email: "katia.chiter@yahoo.fr",
    },
    experience: {
      annees: 16,
      date_inscription: "2009-11-23",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET005",
    nom: "MALKI",
    prenom: "Aboubakeur Seddik",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit commercial et des affaires",
      "Droit fiscal",
      "Droit bancaire et financier",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Avenue Ahmed Aggoune N°1 Escalier 1 Étage 1",
      quartier: "Centre-ville",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 266 8184",
      email: "maitre.malki@yahoo.fr",
    },
    experience: {
      annees: 31,
      date_inscription: "1994-11-02",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET006",
    nom: "BENSALEM",
    prenom: "Hanane Samia",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit de l'immobilier",
      "Droit de la famille",
      "Droit de la propriété intellectuelle",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "El Eulma",
    adresse: {
      rue: "Cité 152 Logts D2/2 1ère Étage",
      quartier: "Cité 152",
      ville: "El Eulma",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 000 6271",
      email: "hanabens.avocat@yahoo.fr",
    },
    experience: {
      annees: 23,
      date_inscription: "2002-12-31",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET007",
    nom: "KERMALI",
    prenom: "Fahima",
    titre: "Maître",
    genre: "femme",
    specialites: [
      "Droit des étrangers et immigration",
      "Droit international",
      "Droit des nouvelles technologies",
      "Droit de l'environnement",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Cité 132 Logts Bizar Bt B4 Étage 1 N°3",
      quartier: "Cité 132",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 044 0990",
      email: "maitre.kermali@yahoo.fr",
    },
    experience: {
      annees: 23,
      date_inscription: "2002-12-31",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET008",
    nom: "LAIFA",
    prenom: "Salah Eddine",
    titre: "Maître",
    genre: "homme",
    specialites: ["Droit maritime", "Droit des sociétés"],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "05 Rue Colonel Amiroche 3ème Étage N°05",
      quartier: "Centre-ville",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 66 923 8289",
      email: "innova1@caramail.com",
    },
    experience: {
      annees: 26,
      date_inscription: "1999-10-03",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET009",
    nom: "DJEDDI",
    prenom: "Saddek",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit public",
      "Droit administratif",
      "Droit de la propriété intellectuelle",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Rue Abacha Amar N°28, Quartier 80 Logts Bir El Ghaïr",
      quartier: "Quartier 80 Logts",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 55 571 1804",
      email: "maitredjeddisetif@yahoo.fr",
    },
    experience: {
      annees: 34,
      date_inscription: "1991-10-29",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
  {
    id: "SET010",
    nom: "GUIDOUM",
    prenom: "Abdelhamid",
    titre: "Maître",
    genre: "homme",
    specialites: [
      "Droit civil",
      "Droit des entreprises",
      "Droit de l'immobilier",
    ],
    barreau: "Sétif",
    wilaya: "Sétif",
    ville: "Sétif",
    adresse: {
      rue: "Cité 128 Logts Bt B N°12",
      quartier: "Cité 128",
      ville: "Sétif",
      code_postal: "19000",
    },
    contact: {
      telephone: "+213 77 199 4217",
      email: "abdelhamid.guidoum@avocat-setif.dz",
    },
    experience: {
      annees: 22,
      date_inscription: "2001-07-15",
    },
    langues: ["Arabe", "Français"],
    verified: true,
  },
];

async function migrate() {
  const { data: testData, error: testError } = await supabase
    .from("users")
    .select("count")
    .limit(1);
  if (testError) {
    console.error("Erreur connexion:", testError.message);
    return;
  }

  let updated = 0,
    created = 0,
    errors = 0;

  for (const avocat of avocats) {
    try {
      const tempEmail = `${avocat.id.toLowerCase()}@mizan-static.local`;

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", tempEmail)
        .maybeSingle();

      let userId;

      if (existingUser) {
        userId = existingUser.id;

        // ✅ UPDATE avec gender et languages
        const { error: updateErr } = await supabase
          .from("users")
          .update({
            phone: avocat.contact?.telephone || null,
            mobile: avocat.contact?.mobile || avocat.contact?.telephone || null,
            location: avocat.wilaya?.toLowerCase() || null,
            professional_email: avocat.contact?.email || null,
            gender: avocat.genre === "femme" ? "female" : "male", // ✅
            languages: avocat.langues || ["Arabe", "Français"], // ✅
            address: {
              street: avocat.adresse?.rue || "",
              neighborhood: avocat.adresse?.quartier || "",
              city: avocat.adresse?.ville || avocat.ville,
              postalCode: avocat.adresse?.code_postal || "",
            },
          })
          .eq("id", userId);

        if (updateErr) throw new Error("Update: " + updateErr.message);
        updated++;
      } else {
        const { data: authUser, error: authError } =
          await supabase.auth.admin.createUser({
            email: tempEmail,
            password: crypto.randomUUID(),
            email_confirm: true,
            user_metadata: {
              first_name: avocat.prenom,
              last_name: avocat.nom,
            },
          });

        if (authError) throw new Error("Auth: " + authError.message);
        userId = authUser.user.id;

        // ✅ INSERT avec gender et languages
        const { error: userErr } = await supabase.from("users").insert({
          id: userId,
          email: tempEmail,
          professional_email: avocat.contact?.email || null,
          first_name: avocat.prenom,
          last_name: avocat.nom,
          phone: avocat.contact?.telephone || null,
          mobile: avocat.contact?.mobile || avocat.contact?.telephone || null,
          user_type: "lawyer",
          location: avocat.wilaya?.toLowerCase() || null,
          gender: avocat.genre === "femme" ? "female" : "male", // ✅
          languages: avocat.langues || ["Arabe", "Français"], // ✅
          address: {
            street: avocat.adresse?.rue || "",
            neighborhood: avocat.adresse?.quartier || "",
            city: avocat.adresse?.ville || avocat.ville,
            postalCode: avocat.adresse?.code_postal || "",
          },
        });

        if (userErr) throw new Error("User: " + userErr.message);
        created++;
      }

      const { data: existingLawyer } = await supabase
        .from("lawyers")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (existingLawyer) {
        const { error: updateLawyerErr } = await supabase
          .from("lawyers")
          .update({
            average_rating: avocat.rating || null,
            total_reviews: avocat.reviews_count || 0,
          })
          .eq("id", userId);

        if (updateLawyerErr)
          throw new Error("Update Lawyer: " + updateLawyerErr.message);
      } else {
        const { error: lawyerErr } = await supabase.from("lawyers").insert({
          id: userId,
          bar_number: avocat.id,
          experience_years: avocat.experience?.annees || 0,
          specializations: avocat.specialites || [],
          wilayas: [avocat.wilaya],
          is_verified: avocat.verified || false,
          average_rating: avocat.rating || null,
          total_reviews: avocat.reviews_count || 0,
        });

        if (lawyerErr) throw new Error("Lawyer: " + lawyerErr.message);
      }

      console.log(`✅ ${avocat.nom} migré avec succès`);
    } catch (err) {
      console.error(`❌ Erreur ${avocat.nom}:`, err.message);
      errors++;
    }
  }

  console.log("\n📊 Résultats:");
  console.log(`✅ ${updated} avocats mis à jour`);
  console.log(`🆕 ${created} nouveaux avocats`);
  console.log(`❌ ${errors} erreurs`);
}

migrate()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n💥 Erreur:", err);
    process.exit(1);
  });
