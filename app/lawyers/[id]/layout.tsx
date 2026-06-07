import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateProfessionalMetadata } from "@/app/metadata";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PROF_NOT_FOUND: Record<string, string> = {
  avocat: "Avocat non trouvé | Mizan",
  notaire: "Notaire non trouvé | Mizan",
  huissier: "Huissier non trouvé | Mizan",
  comptable: "Comptable non trouvé | Mizan",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;

    const { data: lawyer } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", id)
      .eq("is_verified", true)
      .single();

    if (!lawyer) {
      return {
        title: "Professionnel non trouvé | Mizan",
        description:
          "Ce professionnel n'existe pas ou son profil a été supprimé.",
      };
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("user_type", "lawyer")
      .single();

    if (!user) {
      return {
        title: "Professionnel non trouvé | Mizan",
        description:
          "Ce professionnel n'existe pas ou son profil a été supprimé.",
      };
    }

    const profession = lawyer.profession || "avocat";

    const specialisationsArray: string[] = Array.isArray(lawyer.specializations)
      ? lawyer.specializations
      : [];
    const specialite = specialisationsArray[0] || "Droit général";

    const wilayasArray: string[] = Array.isArray(lawyer.wilayas)
      ? lawyer.wilayas
      : [];
    const ville = wilayasArray[0] || user.location || "Algérie";

    return generateProfessionalMetadata(
      {
        prenom: user.first_name || "",
        nom: user.last_name || "",
        specialites: [specialite],
        ville,
        barreau: ville,
        bio: lawyer.bio,
        profession,
      },
      id
    );
  } catch (error) {
    console.error("Erreur récupération professionnel:", error);
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
