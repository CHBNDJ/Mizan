import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { generateAvocatMetadata } from "@/app/metadata";

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
      .select("*")
      .eq("id", id)
      .single();

    if (!lawyer) {
      return {
        title: "Avocat non trouvé | Mizan",
        description: "Cet avocat n'existe pas ou son profil a été supprimé.",
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
        title: "Avocat non trouvé | Mizan",
        description: "Cet avocat n'existe pas ou son profil a été supprimé.",
      };
    }

    const specialite = lawyer.specializations?.[0] || "Droit général";

    const ville = lawyer.wilayas?.[0] || "Algérie";

    return generateAvocatMetadata(
      {
        prenom: user.first_name || "",
        nom: user.last_name || "",
        specialite: specialite,
        ville: ville,
        barreau: ville,
        bio: lawyer.bio,
      },
      id
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
