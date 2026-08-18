import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateProfessionalMetadata } from "@/app/metadata";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;

    const { data: lawyer } = await supabase
      .from("lawyers")
      .select("profession, specializations, experience_years, bio, is_verified")
      .eq("id", id)
      .eq("is_verified", true)
      .single();

    if (!lawyer) {
      return {
        title: "Professionnel non trouvé | MIZAN",
        description:
          "Ce professionnel n'existe pas ou son profil a été supprimé.",
      };
    }

    const { data: user } = await supabase
      .from("users")
      .select("first_name, last_name, location, address, avatar_url")
      .eq("id", id)
      .eq("user_type", "lawyer")
      .single();

    if (!user) {
      return {
        title: "Professionnel non trouvé | MIZAN",
        description:
          "Ce professionnel n'existe pas ou son profil a été supprimé.",
      };
    }

    const profession = lawyer.profession || "avocat";

    const specialisationsArray: string[] = Array.isArray(lawyer.specializations)
      ? lawyer.specializations
      : [];
    const specialite = specialisationsArray[0] || "Droit général";

    const ville = user.address?.wilaya
      ? user.address.wilaya
          .split("-")
          .map(
            (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join(" ")
      : user.location || "Algérie";

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
      title: "Erreur | MIZAN",
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
