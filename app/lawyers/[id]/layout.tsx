import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateAvocatMetadata } from "@/app/metadata";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Metadata dynamique pour chaque avocat
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // Récupérer l'avocat depuis Supabase
    const { data: lawyer } = await supabase
      .from("users")
      .select("*, avocats(*)")
      .eq("id", params.id)
      .eq("user_type", "lawyer")
      .single();

    if (!lawyer || !lawyer.avocats || lawyer.avocats.length === 0) {
      return {
        title: "Avocat non trouvé | Mizan",
        description: "Cet avocat n'existe pas ou son profil a été supprimé.",
      };
    }

    const avocatData = lawyer.avocats[0];

    // ✅ Utiliser la fonction helper avec l'ID en 2ème paramètre
    return generateAvocatMetadata(
      {
        prenom: lawyer.first_name || "",
        nom: lawyer.last_name || "",
        specialite: avocatData.specialite || "Droit général",
        ville: avocatData.ville || "Algérie",
        barreau: avocatData.barreau || "Algérie",
        bio: avocatData.bio,
      },
      params.id
    );
  } catch (error) {
    console.error("Erreur récupération avocat:", error);
    return {
      title: "Erreur | Mizan",
      description: "Une erreur est survenue lors du chargement du profil.",
    };
  }
}

export default function LawyerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
