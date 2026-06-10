// import { AvocatsDatabase, AvocatData, SearchFilters } from "@/types";
// import { createClient } from "@/lib/supabase/client";
// import { SPECIALITES } from "@/utils/constants";
// import { dbToFrontend } from "@/lib/genderUtils";

// export const AVOCATS_DATABASE: AvocatsDatabase = {
//   avocats: [],
//   metadata: {
//     total_avocats: 21,
//     wilayas: [
//       { nom: "Alger", nombre_avocats: 12, villes: ["Alger"] },
//       { nom: "Blida", nombre_avocats: 1, villes: ["Boufarik"] },
//       { nom: "Sétif", nombre_avocats: 8, villes: ["Sétif", "El Eulma"] },
//     ],
//     barreaux: [
//       { nom: "Alger", wilaya: "Alger", nombre_avocats: 12 },
//       { nom: "Blida", wilaya: "Blida", nombre_avocats: 1 },
//       { nom: "Sétif", wilaya: "Sétif", nombre_avocats: 8 },
//     ],
//     statistiques: {
//       avocats_verifies: 21,
//       avocats_non_verifies: 0,
//       pourcentage_verification: 100,
//       sources_verification: {
//         appels_personnels_alger: 12,
//         donnees_barreau_officiel_setif: 8,
//         donnees_barreau_officiel_blida: 1,
//       },
//       moyenne_experience: 20.33,
//       moyenne_rating: 4.35,
//       total_reviews: 224,
//       avocats_avec_rating: 13,
//       repartition_ratings: { alger: 12, oran: 0, annaba: 0, setif: 0 },
//       repartition_genre: { hommes: 12, femmes: 8, pourcentage_femmes: 38.1 },
//       langues_parlees: {
//         Arabe: 21,
//         Français: 21,
//         Anglais: 7,
//         Espagnol: 1,
//         Allemand: 1,
//       },
//       repartition_barreaux: { Alger: 12, Blida: 1, Sétif: 8 },
//     },
//     date_creation: "2025-09-15",
//     date_mise_a_jour: "2025-12-22",
//     version: "2.0",
//     source: "Supabase - Données dynamiques",
//     notes: "Base de données MVP Mizan",
//   },
// };

// export const DOMAINES_PAR_PROFESSION: Record<string, string[]> = {
//   avocat: [...SPECIALITES],
//   notaire: [
//     "Actes immobiliers",
//     "Successions et héritages",
//     "Contrats de mariage",
//     "Donations et libéralités",
//     "Création d'entreprise",
//     "Baux commerciaux",
//     "Partage de biens",
//     "Adoption",
//     "Procurations",
//     "Certificats de propriété",
//   ],
//   huissier: [
//     "Constats d'huissier",
//     "Exécution de jugements",
//     "Significations et notifications",
//     "Recouvrement de créances",
//     "Saisies et inventaires",
//     "Procès-verbaux",
//     "Constat de dégâts",
//     "Constats internet",
//     "Constat d'adultère",
//     "Expulsion",
//   ],
//   comptable: [
//     "Création d'entreprise",
//     "Comptabilité générale",
//     "Déclarations fiscales (IFU, G50, IBS)",
//     "Paie et charges sociales",
//     "Bilan annuel",
//     "Expertise comptable",
//     "Audit et commissariat aux comptes",
//     "Conseil fiscal",
//     "Comptabilité EURL/SARL",
//     "Déclaration CASNOS",
//   ],
// };

// function convertSupabaseToAvocatData(lawyer: any): AvocatData {
//   const capitalizeWords = (str: string) => {
//     if (!str) return str;
//     return str
//       .split(" ")
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
//       .join(" ");
//   };

//   const capitalizeSpecialites = (specs: string[]): string[] => {
//     if (!specs || !Array.isArray(specs)) return [];
//     return specs.map((s) => capitalizeWords(s.trim()));
//   };

//   const userAddress = lawyer.users?.address;
//   const genre = dbToFrontend(lawyer.users?.gender);

//   const ville = userAddress?.city
//     ? capitalizeWords(userAddress.city)
//     : capitalizeWords(lawyer.users?.location || "Alger");

//   const wilaya = userAddress?.wilaya
//     ? capitalizeWords(userAddress.wilaya)
//     : capitalizeWords(lawyer.users?.location || "Alger");

//   let langues = ["Arabe", "Français"];
//   if (lawyer.users?.languages && Array.isArray(lawyer.users.languages)) {
//     langues = lawyer.users.languages.map((l: string) => capitalizeWords(l));
//   } else if (lawyer.languages && Array.isArray(lawyer.languages)) {
//     langues = lawyer.languages.map((l: string) => capitalizeWords(l));
//   }

//   return {
//     id: lawyer.id,
//     nom: lawyer.users?.last_name?.toUpperCase() || "",
//     prenom: capitalizeWords(lawyer.users?.first_name || ""),
//     avatar_url: lawyer.users?.avatar_url || undefined,
//     titre:
//       lawyer.profession === "notaire" || lawyer.profession === "huissier"
//         ? "Maître"
//         : lawyer.profession === "comptable"
//           ? "M."
//           : "Maître",
//     genre: genre || undefined,
//     specialites: capitalizeSpecialites(lawyer.specializations),
//     barreau: wilaya,
//     wilaya,
//     ville,
//     adresse: {
//       rue: userAddress?.street || "Non spécifié",
//       ville,
//       wilaya,
//       code_postal: userAddress?.postalCode || "",
//     },
//     contact: {
//       telephone: lawyer.users?.phone || "",
//       email: lawyer.users?.professional_email || lawyer.users?.email || "",
//       mobile: lawyer.users?.mobile || lawyer.users?.phone || "",
//       site_web: lawyer.users?.website || null,
//     },
//     experience: {
//       annees: lawyer.experience_years || 0,
//       date_inscription: (
//         new Date().getFullYear() - (lawyer.experience_years || 0)
//       ).toString(),
//     },
//     langues,
//     verified: lawyer.is_verified || false,
//     rating_google: lawyer.rating_google ? Number(lawyer.rating_google) : null,
//     reviews_count_google: lawyer.reviews_count_google || 0,
//     rating_mizan: lawyer.rating_mizan ? Number(lawyer.rating_mizan) : null,
//     reviews_count_mizan: lawyer.reviews_count_mizan || 0,
//     is_claimed: lawyer.is_claimed,
//     claimed_at: lawyer.claimed_at,
//     consultation_price: lawyer.consultation_price,
//     created_at: lawyer.users?.created_at || lawyer.created_at || null,
//     profession: lawyer.profession || "avocat",
//   };
// }

// export async function getSupabaseAvocats(
//   profession?: string
// ): Promise<AvocatData[]> {
//   const supabase = createClient();
//   try {
//     let query = supabase
//       .from("lawyers")
//       .select("*")
//       .eq("is_verified", true)
//       .order("ranking_score", { ascending: false, nullsFirst: false });

//     if (profession) {
//       query = query.eq("profession", profession);
//     }

//     const { data: lawyers, error: lawyersError } = await query;
//     if (lawyersError || !lawyers || lawyers.length === 0) return [];

//     const { data: users, error: usersError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("user_type", "lawyer")
//       .is("deleted_at", null);

//     if (usersError) return [];

//     const combined = lawyers
//       .map((lawyer) => {
//         const user = users?.find((u) => u.id === lawyer.id);
//         return user ? { ...lawyer, users: user } : null;
//       })
//       .filter(Boolean);

//     return combined.map(convertSupabaseToAvocatData);
//   } catch {
//     return [];
//   }
// }

// export async function searchAvocats(
//   filters: SearchFilters,
//   profession?: string
// ): Promise<AvocatData[]> {
//   const prof = profession || filters.profession || undefined;
//   const all = await getSupabaseAvocats(prof);

//   return all.filter((avocat) => {
//     if (filters.specialite && filters.specialite.length > 0) {
//       const hasMatch = avocat.specialites?.some((spec) =>
//         filters.specialite!.some(
//           (f) =>
//             spec === f ||
//             spec.toLowerCase() === f.toLowerCase() ||
//             spec.toLowerCase().replace(/\s+/g, "-") ===
//               f.toLowerCase().replace(/\s+/g, "-")
//         )
//       );
//       if (!hasMatch) return false;
//     }

//     if (filters.wilaya) {
//       const ok =
//         avocat.wilaya === filters.wilaya ||
//         avocat.wilaya?.toLowerCase() === filters.wilaya.toLowerCase();
//       if (!ok) return false;
//     }

//     if (filters.genre && avocat.genre !== filters.genre) return false;

//     if (filters.experience_min && filters.experience_min > 0) {
//       if ((avocat.experience?.annees || 0) < filters.experience_min)
//         return false;
//     }

//     if (filters.langues) {
//       const ok = avocat.langues?.some((l) =>
//         l.toLowerCase().includes(filters.langues!.toLowerCase())
//       );
//       if (!ok) return false;
//     }

//     return true;
//   });
// }

// export async function getAvocats(profession?: string): Promise<AvocatData[]> {
//   try {
//     return await getSupabaseAvocats(profession);
//   } catch {
//     return [];
//   }
// }

// export async function getStatistiques() {
//   try {
//     const all = await getSupabaseAvocats();
//     const verifies = all.filter((a) => a.verified).length;
//     const wilayas = new Set(all.map((a) => a.wilaya));
//     return {
//       total_avocats: all.length,
//       avocats_verifies: verifies,
//       avocats_non_verifies: all.length - verifies,
//       pourcentage_verification:
//         all.length > 0 ? Math.round((verifies / all.length) * 100) : 0,
//       wilayas_couvertes: wilayas.size,
//     };
//   } catch {
//     return {
//       total_avocats: 0,
//       avocats_verifies: 0,
//       avocats_non_verifies: 0,
//       pourcentage_verification: 0,
//       wilayas_couvertes: 0,
//     };
//   }
// }

// export async function getWilayas(): Promise<string[]> {
//   try {
//     const all = await getSupabaseAvocats();
//     const set = new Set<string>();
//     all.forEach((a) => {
//       if (a.wilaya) set.add(a.wilaya);
//     });
//     return Array.from(set).sort();
//   } catch {
//     return [];
//   }
// }

// export async function getTopRatedAvocats(
//   limit = 10,
//   profession?: string
// ): Promise<AvocatData[]> {
//   try {
//     const all = await getSupabaseAvocats(profession);
//     return all
//       .filter(
//         (a) =>
//           (a.rating_google && a.rating_google > 0) ||
//           (a.rating_mizan && a.rating_mizan > 0)
//       )
//       .sort(
//         (a, b) =>
//           Math.max(b.rating_google || 0, b.rating_mizan || 0) -
//           Math.max(a.rating_google || 0, a.rating_mizan || 0)
//       )
//       .slice(0, limit);
//   } catch {
//     return [];
//   }
// }

// export function getSpecialites(profession?: string): string[] {
//   if (profession && DOMAINES_PAR_PROFESSION[profession]) {
//     return [...DOMAINES_PAR_PROFESSION[profession]].sort();
//   }
//   return [...SPECIALITES].sort();
// }

// export function getVilles(): string[] {
//   return [];
// }
// export function getBarreaux(): string[] {
//   return [];
// }
// export function getVillesByWilaya(_: string): string[] {
//   return [];
// }
// export function searchAvocatsByText(_: string): AvocatData[] {
//   return [];
// }
// export function getMostExperiencedAvocats(_: number = 10): AvocatData[] {
//   return [];
// }
// export function getAvocatsByGenre(_: "homme" | "femme"): AvocatData[] {
//   return [];
// }
// export function getVerifiedAvocats(): AvocatData[] {
//   return [];
// }
// export function getAvocatsBySpecialite(_: string): AvocatData[] {
//   return [];
// }
// export function getRandomAvocats(_: number): AvocatData[] {
//   return [];
// }

// export async function getAvocatsByWilaya(
//   wilaya: string
// ): Promise<AvocatData[]> {
//   const all = await getSupabaseAvocats();
//   return all.filter((a) => a.wilaya.toLowerCase() === wilaya.toLowerCase());
// }

// export async function getAvocatById(id: string): Promise<AvocatData | null> {
//   const supabase = createClient();
//   try {
//     const { data: lawyer, error: lawyerError } = await supabase
//       .from("lawyers")
//       .select(
//         "id, bar_number, specializations, experience_years, consultation_price, is_verified, is_claimed, claimed_at, rating_google, reviews_count_google, rating_mizan, reviews_count_mizan, updated_at, created_at, profession, bio"
//       )
//       .eq("id", id)
//       .eq("is_verified", true)
//       .maybeSingle();

//     if (lawyerError || !lawyer) return null;

//     const { data: user, error: userError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", id)
//       .eq("user_type", "lawyer")
//       .is("deleted_at", null)
//       .maybeSingle();

//     if (userError || !user) return null;
//     return convertSupabaseToAvocatData({ ...lawyer, users: user });
//   } catch {
//     return null;
//   }
// }

import { AvocatsDatabase, AvocatData, SearchFilters } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { SPECIALITES } from "@/utils/constants";
import { dbToFrontend } from "@/lib/genderUtils";

export const AVOCATS_DATABASE: AvocatsDatabase = {
  avocats: [],
  metadata: {
    total_avocats: 21,
    wilayas: [
      { nom: "Alger", nombre_avocats: 12, villes: ["Alger"] },
      { nom: "Blida", nombre_avocats: 1, villes: ["Boufarik"] },
      { nom: "Sétif", nombre_avocats: 8, villes: ["Sétif", "El Eulma"] },
    ],
    barreaux: [
      { nom: "Alger", wilaya: "Alger", nombre_avocats: 12 },
      { nom: "Blida", wilaya: "Blida", nombre_avocats: 1 },
      { nom: "Sétif", wilaya: "Sétif", nombre_avocats: 8 },
    ],
    statistiques: {
      avocats_verifies: 21,
      avocats_non_verifies: 0,
      pourcentage_verification: 100,
      sources_verification: {
        appels_personnels_alger: 12,
        donnees_barreau_officiel_setif: 8,
        donnees_barreau_officiel_blida: 1,
      },
      moyenne_experience: 20.33,
      moyenne_rating: 4.35,
      total_reviews: 224,
      avocats_avec_rating: 13,
      repartition_ratings: { alger: 12, oran: 0, annaba: 0, setif: 0 },
      repartition_genre: { hommes: 12, femmes: 8, pourcentage_femmes: 38.1 },
      langues_parlees: {
        Arabe: 21,
        Français: 21,
        Anglais: 7,
        Espagnol: 1,
        Allemand: 1,
      },
      repartition_barreaux: { Alger: 12, Blida: 1, Sétif: 8 },
    },
    date_creation: "2025-09-15",
    date_mise_a_jour: "2025-12-22",
    version: "2.0",
    source: "Supabase - Données dynamiques",
    notes: "Base de données MVP Mizan",
  },
};

// ── Domaines par profession ────────────────────────────────────
export const DOMAINES_PAR_PROFESSION: Record<string, string[]> = {
  avocat: [...SPECIALITES],
  notaire: [
    "Actes immobiliers",
    "Successions et héritages",
    "Contrats de mariage",
    "Donations et libéralités",
    "Création d'entreprise",
    "Baux commerciaux",
    "Partage de biens",
    "Adoption",
    "Procurations",
    "Certificats de propriété",
  ],
  huissier: [
    "Constats d'huissier",
    "Exécution de jugements",
    "Significations et notifications",
    "Recouvrement de créances",
    "Saisies et inventaires",
    "Procès-verbaux",
    "Constat de dégâts",
    "Constats internet",
    "Constat d'adultère",
    "Expulsion",
  ],
  comptable: [
    "Création d'entreprise",
    "Comptabilité générale",
    "Déclarations fiscales (IFU, G50, IBS)",
    "Paie et charges sociales",
    "Bilan annuel",
    "Expertise comptable",
    "Audit et commissariat aux comptes",
    "Conseil fiscal",
    "Comptabilité EURL/SARL",
    "Déclaration CASNOS",
  ],
  "expert-comptable": [
    "Expertise comptable et commissariat aux comptes",
    "Audit légal et contractuel",
    "Conseil en gestion et organisation",
    "Consolidation des comptes",
    "Évaluation d'entreprise",
    "Restructuration financière",
    "Conseil fiscal et optimisation",
    "Due diligence financière",
    "Déclarations fiscales (IFU, G50, IBS, TAP)",
    "Comptabilité EURL/SARL/SPA",
    "Bilan et compte de résultat",
    "Déclaration CASNOS",
  ],
};

function convertSupabaseToAvocatData(lawyer: any): AvocatData {
  const capitalizeWords = (str: string) => {
    if (!str) return str;
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const capitalizeSpecialites = (specs: string[]): string[] => {
    if (!specs || !Array.isArray(specs)) return [];
    return specs.map((s) => capitalizeWords(s.trim()));
  };

  const userAddress = lawyer.users?.address;
  const genre = dbToFrontend(lawyer.users?.gender);

  const ville = userAddress?.city
    ? capitalizeWords(userAddress.city)
    : capitalizeWords(lawyer.users?.location || "Alger");

  const wilaya = userAddress?.wilaya
    ? capitalizeWords(userAddress.wilaya)
    : capitalizeWords(lawyer.users?.location || "Alger");

  let langues = ["Arabe", "Français"];
  if (lawyer.users?.languages && Array.isArray(lawyer.users.languages)) {
    langues = lawyer.users.languages.map((l: string) => capitalizeWords(l));
  } else if (lawyer.languages && Array.isArray(lawyer.languages)) {
    langues = lawyer.languages.map((l: string) => capitalizeWords(l));
  }

  return {
    id: lawyer.id,
    nom: lawyer.users?.last_name?.toUpperCase() || "",
    prenom: capitalizeWords(lawyer.users?.first_name || ""),
    avatar_url: lawyer.users?.avatar_url || undefined,
    titre:
      lawyer.profession === "notaire" || lawyer.profession === "huissier"
        ? "Maître"
        : lawyer.profession === "comptable"
          ? "M."
          : "Maître",
    genre: genre || undefined,
    specialites: capitalizeSpecialites(lawyer.specializations),
    barreau: wilaya,
    wilaya,
    ville,
    adresse: {
      rue: userAddress?.street || "Non spécifié",
      ville,
      wilaya,
      code_postal: userAddress?.postalCode || "",
    },
    contact: {
      telephone: lawyer.users?.phone || "",
      email: lawyer.users?.professional_email || lawyer.users?.email || "",
      mobile: lawyer.users?.mobile || lawyer.users?.phone || "",
      site_web: lawyer.users?.website || null,
    },
    experience: {
      annees: lawyer.experience_years || 0,
      date_inscription: (
        new Date().getFullYear() - (lawyer.experience_years || 0)
      ).toString(),
    },
    langues,
    verified: lawyer.is_verified || false,
    rating_google: lawyer.rating_google ? Number(lawyer.rating_google) : null,
    reviews_count_google: lawyer.reviews_count_google || 0,
    rating_mizan: lawyer.rating_mizan ? Number(lawyer.rating_mizan) : null,
    reviews_count_mizan: lawyer.reviews_count_mizan || 0,
    is_claimed: lawyer.is_claimed,
    claimed_at: lawyer.claimed_at,
    consultation_price: lawyer.consultation_price,
    created_at: lawyer.users?.created_at || lawyer.created_at || null,
    profession: lawyer.profession || "avocat",
    is_cour_supreme: lawyer.is_cour_supreme || false,
  };
}

export async function getSupabaseAvocats(
  profession?: string
): Promise<AvocatData[]> {
  const supabase = createClient();
  try {
    let query = supabase
      .from("lawyers")
      .select("*")
      .eq("is_verified", true)
      .order("ranking_score", { ascending: false, nullsFirst: false });

    if (profession) {
      query = query.eq("profession", profession);
    }

    const { data: lawyers, error: lawyersError } = await query;
    if (lawyersError || !lawyers || lawyers.length === 0) return [];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .eq("user_type", "lawyer")
      .is("deleted_at", null);

    if (usersError) return [];

    const combined = lawyers
      .map((lawyer) => {
        const user = users?.find((u) => u.id === lawyer.id);
        return user ? { ...lawyer, users: user } : null;
      })
      .filter(Boolean);

    return combined.map(convertSupabaseToAvocatData);
  } catch {
    return [];
  }
}

export async function searchAvocats(
  filters: SearchFilters,
  profession?: string
): Promise<AvocatData[]> {
  const prof = profession || filters.profession || undefined;
  const all = await getSupabaseAvocats(prof);

  return all.filter((avocat) => {
    if (filters.specialite && filters.specialite.length > 0) {
      const hasMatch = avocat.specialites?.some((spec) =>
        filters.specialite!.some(
          (f) =>
            spec === f ||
            spec.toLowerCase() === f.toLowerCase() ||
            spec.toLowerCase().replace(/\s+/g, "-") ===
              f.toLowerCase().replace(/\s+/g, "-")
        )
      );
      if (!hasMatch) return false;
    }

    if (filters.wilaya) {
      const ok =
        avocat.wilaya === filters.wilaya ||
        avocat.wilaya?.toLowerCase() === filters.wilaya.toLowerCase();
      if (!ok) return false;
    }

    if (filters.genre && avocat.genre !== filters.genre) return false;

    if (filters.experience_min && filters.experience_min > 0) {
      if ((avocat.experience?.annees || 0) < filters.experience_min)
        return false;
    }

    if (filters.langues) {
      const ok = avocat.langues?.some((l) =>
        l.toLowerCase().includes(filters.langues!.toLowerCase())
      );
      if (!ok) return false;
    }

    return true;
  });
}

export async function getAvocats(profession?: string): Promise<AvocatData[]> {
  try {
    return await getSupabaseAvocats(profession);
  } catch {
    return [];
  }
}

export async function getStatistiques() {
  try {
    const all = await getSupabaseAvocats();
    const verifies = all.filter((a) => a.verified).length;
    const wilayas = new Set(all.map((a) => a.wilaya));
    return {
      total_avocats: all.length,
      avocats_verifies: verifies,
      avocats_non_verifies: all.length - verifies,
      pourcentage_verification:
        all.length > 0 ? Math.round((verifies / all.length) * 100) : 0,
      wilayas_couvertes: wilayas.size,
    };
  } catch {
    return {
      total_avocats: 0,
      avocats_verifies: 0,
      avocats_non_verifies: 0,
      pourcentage_verification: 0,
      wilayas_couvertes: 0,
    };
  }
}

export async function getWilayas(): Promise<string[]> {
  try {
    const all = await getSupabaseAvocats();
    const set = new Set<string>();
    all.forEach((a) => {
      if (a.wilaya) set.add(a.wilaya);
    });
    return Array.from(set).sort();
  } catch {
    return [];
  }
}

export async function getTopRatedAvocats(
  limit = 10,
  profession?: string
): Promise<AvocatData[]> {
  try {
    const all = await getSupabaseAvocats(profession);
    return all
      .filter(
        (a) =>
          (a.rating_google && a.rating_google > 0) ||
          (a.rating_mizan && a.rating_mizan > 0)
      )
      .sort(
        (a, b) =>
          Math.max(b.rating_google || 0, b.rating_mizan || 0) -
          Math.max(a.rating_google || 0, a.rating_mizan || 0)
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function getSpecialites(profession?: string): string[] {
  if (profession && DOMAINES_PAR_PROFESSION[profession]) {
    return [...DOMAINES_PAR_PROFESSION[profession]].sort();
  }
  return [...SPECIALITES].sort();
}

export function getVilles(): string[] {
  return [];
}
export function getBarreaux(): string[] {
  return [];
}
export function getVillesByWilaya(_: string): string[] {
  return [];
}
export function searchAvocatsByText(_: string): AvocatData[] {
  return [];
}
export function getMostExperiencedAvocats(_: number = 10): AvocatData[] {
  return [];
}
export function getAvocatsByGenre(_: "homme" | "femme"): AvocatData[] {
  return [];
}
export function getVerifiedAvocats(): AvocatData[] {
  return [];
}
export function getAvocatsBySpecialite(_: string): AvocatData[] {
  return [];
}
export function getRandomAvocats(_: number): AvocatData[] {
  return [];
}

export async function getAvocatsByWilaya(
  wilaya: string
): Promise<AvocatData[]> {
  const all = await getSupabaseAvocats();
  return all.filter((a) => a.wilaya.toLowerCase() === wilaya.toLowerCase());
}

export async function getAvocatById(id: string): Promise<AvocatData | null> {
  const supabase = createClient();
  try {
    const { data: lawyer, error: lawyerError } = await supabase
      .from("lawyers")
      .select(
        "id, bar_number, specializations, experience_years, consultation_price, is_verified, is_claimed, claimed_at, rating_google, reviews_count_google, rating_mizan, reviews_count_mizan, updated_at, created_at, profession"
      )
      .eq("id", id)
      .eq("is_verified", true)
      .maybeSingle();

    if (lawyerError || !lawyer) return null;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("user_type", "lawyer")
      .is("deleted_at", null)
      .maybeSingle();

    if (userError || !user) return null;
    return convertSupabaseToAvocatData({ ...lawyer, users: user });
  } catch {
    return null;
  }
}
