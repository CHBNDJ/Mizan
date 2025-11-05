import { AvocatsDatabase, AvocatData, SearchFilters } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { SPECIALITES } from "@/utils/constants";
import { dbToFrontend } from "@/lib/genderUtils";

export const AVOCATS_DATABASE: AvocatsDatabase = {
  avocats: [],

  metadata: {
    total_avocats: 32,
    wilayas: [
      {
        nom: "Alger",
        nombre_avocats: 12,
        villes: ["Alger", "Boufarik"],
      },
      {
        nom: "Oran",
        nombre_avocats: 5,
        villes: ["Oran", "Es-Sénia"],
      },
      {
        nom: "Annaba",
        nombre_avocats: 5,
        villes: ["Annaba"],
      },
      {
        nom: "Sétif",
        nombre_avocats: 10,
        villes: ["Sétif", "El Eulma"],
      },
    ],
    barreaux: [
      {
        nom: "Alger",
        wilaya: "Alger",
        nombre_avocats: 11,
      },
      {
        nom: "Blida",
        wilaya: "Alger",
        nombre_avocats: 1,
      },
      {
        nom: "Oran",
        wilaya: "Oran",
        nombre_avocats: 5,
      },
      {
        nom: "Annaba",
        wilaya: "Annaba",
        nombre_avocats: 5,
      },
      {
        nom: "Sétif",
        wilaya: "Sétif",
        nombre_avocats: 10,
      },
    ],
    statistiques: {
      avocats_verifies: 32,
      avocats_non_verifies: 0,
      pourcentage_verification: 100,
      sources_verification: {
        appels_personnels_alger: 12,
        donnees_barreau_officiel_setif: 10,
        verification_internet_oran: 5,
        verification_internet_annaba: 5,
      },
      moyenne_experience: 20.6,
      moyenne_rating: 4.18,
      total_reviews: 311,
      avocats_avec_rating: 20,
      repartition_ratings: {
        alger: 12,
        oran: 5,
        annaba: 3,
        setif: 0,
      },
      repartition_genre: {
        hommes: 20,
        femmes: 12,
        pourcentage_femmes: 37.5,
      },
      langues_parlees: {
        Arabe: 32,
        Français: 32,
        Anglais: 8,
        Espagnol: 1,
        Allemand: 1,
      },
      repartition_barreaux: {
        Alger: 11,
        Blida: 1,
        Oran: 5,
        Annaba: 5,
        Sétif: 10,
      },
    },
    date_creation: "2025-09-15",
    date_mise_a_jour: "2025-09-19",
    version: "1.3",
    source:
      "Collecte manuelle - sources publiques légales + vérifications directes",
    notes:
      "Base de données MVP Mizan - 32 avocats individuels 100% vérifiés dans 4 wilayas stratégiques. Ajout du genre et données complètes pour tous les avocats.",
  },
};

function convertSupabaseToAvocatData(lawyer: any): AvocatData {
  const capitalizeWords = (str: string) => {
    if (!str) return str;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const capitalizeSpecialites = (specialites: string[]): string[] => {
    if (!specialites || !Array.isArray(specialites)) return [];
    return specialites.map((spec) => capitalizeWords(spec.trim()));
  };

  const location = lawyer.users?.location || "Alger";
  const capitalizedLocation = capitalizeWords(location);
  const userAddress = lawyer.users?.address;

  const userGender = lawyer.users?.gender;
  const genre = dbToFrontend(userGender);

  let langues = ["Arabe", "Français"];
  if (lawyer.users?.languages && Array.isArray(lawyer.users.languages)) {
    langues = lawyer.users.languages.map((lang: string) =>
      capitalizeWords(lang)
    );
  } else if (lawyer.languages && Array.isArray(lawyer.languages)) {
    langues = lawyer.languages.map((lang: string) => capitalizeWords(lang));
  }

  return {
    id: lawyer.id,
    nom: lawyer.users?.last_name?.toUpperCase() || "",
    prenom: capitalizeWords(lawyer.users?.first_name || ""),
    avatar_url: lawyer.users?.avatar_url || undefined,
    titre: "Maître",
    genre: genre || undefined,
    specialites: capitalizeSpecialites(lawyer.specializations),
    barreau: capitalizedLocation,
    wilaya: lawyer.wilayas?.[0]
      ? capitalizeWords(lawyer.wilayas[0])
      : capitalizedLocation,
    ville: capitalizedLocation,
    adresse: {
      rue: userAddress?.street || "Non spécifié",
      quartier: userAddress?.neighborhood || "",
      ville: userAddress?.city || capitalizedLocation,
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
    langues: langues,
    verified: lawyer.is_verified || false,

    rating_google: lawyer.rating_google ? Number(lawyer.rating_google) : null,
    reviews_count_google: lawyer.reviews_count_google || 0,
    rating_mizan: lawyer.rating_mizan ? Number(lawyer.rating_mizan) : null,
    reviews_count_mizan: lawyer.reviews_count_mizan || 0,

    is_claimed: lawyer.is_claimed,
    claimed_at: lawyer.claimed_at,
    consultation_price: lawyer.consultation_price,
  };
}

export async function getSupabaseAvocats(): Promise<AvocatData[]> {
  const supabase = createClient();
  try {
    const { data: lawyers, error: lawyersError } = await supabase
      .from("lawyers")
      .select("*");

    if (lawyersError) {
      console.error("❌ Erreur Supabase lawyers:", lawyersError);
      return [];
    }

    if (!lawyers || lawyers.length === 0) {
      return [];
    }

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .eq("user_type", "lawyer");

    if (usersError) {
      console.error("❌ Erreur Supabase users:", usersError);
      return [];
    }

    const verifiedLawyers = lawyers.filter(
      (lawyer) => lawyer.is_verified === true
    );

    const combinedData = verifiedLawyers
      .map((lawyer) => {
        const user = users?.find((u) => u.id === lawyer.id);
        if (user) {
          return { ...lawyer, users: user };
        }
        return null;
      })
      .filter((item) => item !== null);

    return combinedData.map(convertSupabaseToAvocatData);
  } catch (error) {
    console.error("💥 Erreur critique récupération avocats:", error);
    return [];
  }
}

export async function searchAvocats(
  filters: SearchFilters
): Promise<AvocatData[]> {
  const allAvocats = await getSupabaseAvocats();

  const results = allAvocats.filter((avocat) => {
    if (filters.specialite && filters.specialite.length > 0) {
      const hasMatchingSpeciality = avocat.specialites?.some((avocatSpec) => {
        return filters.specialite!.some((filterSpec) => {
          return (
            avocatSpec === filterSpec ||
            avocatSpec.toLowerCase() === filterSpec.toLowerCase() ||
            avocatSpec.toLowerCase().replace(/\s+/g, "-") ===
              filterSpec.toLowerCase().replace(/\s+/g, "-")
          );
        });
      });

      if (!hasMatchingSpeciality) {
        return false;
      }
    }

    if (filters.wilaya) {
      const matchesWilaya =
        avocat.wilaya === filters.wilaya ||
        avocat.wilaya?.toLowerCase() === filters.wilaya.toLowerCase();

      if (!matchesWilaya) {
        return false;
      }
    }

    if (filters.genre && avocat.genre !== filters.genre) {
      return false;
    }

    if (filters.experience_min !== undefined && filters.experience_min > 0) {
      const yearsExp = avocat.experience?.annees || 0;
      if (yearsExp < filters.experience_min) {
        return false;
      }
    }

    if (filters.langues) {
      const hasLanguage = avocat.langues?.some((lang) =>
        lang.toLowerCase().includes(filters.langues!.toLowerCase())
      );
      if (!hasLanguage) {
        return false;
      }
    }
    return true;
  });
  return results;
}

export async function getAvocats(): Promise<AvocatData[]> {
  try {
    return await getSupabaseAvocats();
  } catch (error) {
    console.error("Erreur récupération avocats:", error);
    return [];
  }
}

export async function getStatistiques() {
  try {
    const allAvocats = await getAvocats();
    const avocatsVerifies = allAvocats.filter(
      (avocat) => avocat.verified
    ).length;
    const wilayasUniques = new Set(allAvocats.map((avocat) => avocat.wilaya));

    return {
      ...AVOCATS_DATABASE.metadata.statistiques,
      total_avocats: allAvocats.length,
      avocats_verifies: avocatsVerifies,
      avocats_non_verifies: allAvocats.length - avocatsVerifies,
      pourcentage_verification:
        allAvocats.length > 0
          ? Math.round((avocatsVerifies / allAvocats.length) * 100)
          : 0,
      wilayas_couvertes: wilayasUniques.size,
    };
  } catch (error) {
    console.error("Erreur calcul statistiques:", error);
    return AVOCATS_DATABASE.metadata.statistiques;
  }
}

export async function getWilayas(): Promise<string[]> {
  try {
    const allAvocats = await getAvocats();
    const wilayas = new Set(allAvocats.map((a) => a.wilaya));
    return Array.from(wilayas).sort();
  } catch (error) {
    console.error("Erreur récupération wilayas:", error);
    const wilayas = new Set(AVOCATS_DATABASE.avocats.map((a) => a.wilaya));
    return Array.from(wilayas).sort();
  }
}

export async function getTopRatedAvocats(
  limit: number = 10
): Promise<AvocatData[]> {
  try {
    const allAvocats = await getAvocats();

    return allAvocats
      .filter((a) => {
        const hasRating =
          (a.rating_google && a.rating_google > 0) ||
          (a.rating_mizan && a.rating_mizan > 0);
        return hasRating;
      })
      .sort((a, b) => {
        const ratingA = Math.max(a.rating_google || 0, a.rating_mizan || 0);
        const ratingB = Math.max(b.rating_google || 0, b.rating_mizan || 0);
        return ratingB - ratingA;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Erreur récupération top avocats:", error);

    return AVOCATS_DATABASE.avocats
      .filter((a) => {
        const hasRating =
          (a.rating_google && a.rating_google > 0) ||
          (a.rating_mizan && a.rating_mizan > 0);
        return hasRating;
      })
      .sort((a, b) => {
        const ratingA = Math.max(a.rating_google || 0, a.rating_mizan || 0);
        const ratingB = Math.max(b.rating_google || 0, b.rating_mizan || 0);
        return ratingB - ratingA;
      })
      .slice(0, limit);
  }
}

export function getVilles(): string[] {
  const villes = new Set(AVOCATS_DATABASE.avocats.map((a) => a.ville));
  return Array.from(villes).sort();
}

export function getSpecialites(): string[] {
  return [...SPECIALITES].sort();
}

export function getBarreaux(): string[] {
  const barreaux = new Set(AVOCATS_DATABASE.avocats.map((a) => a.barreau));
  return Array.from(barreaux).sort();
}

export function getVillesByWilaya(wilaya: string): string[] {
  const villes = new Set(
    AVOCATS_DATABASE.avocats
      .filter((a) => a.wilaya.toLowerCase() === wilaya.toLowerCase())
      .map((a) => a.ville)
  );
  return Array.from(villes).sort();
}

export function searchAvocatsByText(query: string): AvocatData[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return AVOCATS_DATABASE.avocats;

  return AVOCATS_DATABASE.avocats.filter(
    (avocat) =>
      avocat.nom.toLowerCase().includes(searchTerm) ||
      avocat.prenom?.toLowerCase().includes(searchTerm) ||
      avocat.specialites?.some((spec) =>
        spec.toLowerCase().includes(searchTerm)
      ) ||
      avocat.ville.toLowerCase().includes(searchTerm) ||
      avocat.wilaya.toLowerCase().includes(searchTerm)
  );
}

export function getAvocatsByWilaya(wilaya: string): AvocatData[] {
  return AVOCATS_DATABASE.avocats.filter(
    (a) => a.wilaya.toLowerCase() === wilaya.toLowerCase()
  );
}

export function getMostExperiencedAvocats(limit: number = 10): AvocatData[] {
  return AVOCATS_DATABASE.avocats
    .sort((a, b) => b.experience.annees - a.experience.annees)
    .slice(0, limit);
}

export function getAvocatsByGenre(genre: "homme" | "femme"): AvocatData[] {
  return AVOCATS_DATABASE.avocats.filter((a) => a.genre === genre);
}

export function getVerifiedAvocats(): AvocatData[] {
  return AVOCATS_DATABASE.avocats.filter((a) => a.verified === true);
}

export function getAvocatsBySpecialite(specialite: string): AvocatData[] {
  return AVOCATS_DATABASE.avocats.filter((a) =>
    a.specialites?.some((spec) =>
      spec.toLowerCase().includes(specialite.toLowerCase())
    )
  );
}

export function getRandomAvocats(count: number): AvocatData[] {
  const shuffled = [...AVOCATS_DATABASE.avocats].sort(
    () => 0.5 - Math.random()
  );
  return shuffled.slice(0, count);
}

// export async function getAvocatById(id: string): Promise<AvocatData | null> {
//   const supabase = createClient();

//   try {
//     const { data: lawyer, error: lawyerError } = await supabase
//       .from("lawyers")
//       .select(
//         `
//         id,
//         bar_number,
//         specializations,
//         wilayas,
//         experience_years,
//         consultation_price,
//         is_verified,
//         is_claimed,
//         claimed_at,
//         rating_google,
//         reviews_count_google,
//         rating_mizan,
//         reviews_count_mizan
//       `
//       )
//       .eq("id", id)
//       .eq("is_verified", true)
//       .maybeSingle();

//     if (lawyerError || !lawyer) {
//       console.error("Erreur récupération lawyer:", lawyerError);
//       return null;
//     }

//     const { data: user, error: userError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", id)
//       .eq("user_type", "lawyer")
//       .maybeSingle();

//     if (userError || !user) {
//       console.error("Erreur récupération user:", userError);
//       return null;
//     }

//     const combinedData = {
//       ...lawyer,
//       users: user,
//       is_claimed: lawyer.is_claimed,
//       claimed_at: lawyer.claimed_at,
//     };

//     return convertSupabaseToAvocatData(combinedData);
//   } catch (error) {
//     console.error("Erreur récupération avocat par ID:", error);
//     return null;
//   }
// }

export async function getAvocatById(id: string): Promise<AvocatData | null> {
  const supabase = createClient();

  try {
    // ✅ NE SÉLECTIONNER QUE LES COLONNES NÉCESSAIRES
    const { data: lawyer, error: lawyerError } = await supabase
      .from("lawyers")
      .select(
        `
        id,
        bar_number,
        specializations,
        wilayas,
        experience_years,
        consultation_price,
        is_verified,
        is_claimed,
        claimed_at,
        rating_google,
        reviews_count_google,
        rating_mizan,
        reviews_count_mizan
      `
      )
      .eq("id", id)
      .eq("is_verified", true)
      .maybeSingle();

    if (lawyerError) {
      console.error("❌ Erreur récupération lawyer:", lawyerError);
      return null;
    }

    if (!lawyer) {
      console.error("❌ Aucun lawyer trouvé pour id:", id);
      return null;
    }

    // ✅ LOG POUR DEBUG
    console.log("🔍 Données lawyer récupérées:", {
      id: lawyer.id,
      rating_mizan: lawyer.rating_mizan,
      reviews_count_mizan: lawyer.reviews_count_mizan,
    });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("user_type", "lawyer")
      .maybeSingle();

    if (userError || !user) {
      console.error("❌ Erreur récupération user:", userError);
      return null;
    }

    const combinedData = {
      ...lawyer,
      users: user,
      is_claimed: lawyer.is_claimed,
      claimed_at: lawyer.claimed_at,
    };

    return convertSupabaseToAvocatData(combinedData);
  } catch (error) {
    console.error("❌ Erreur récupération avocat par ID:", error);
    return null;
  }
}
