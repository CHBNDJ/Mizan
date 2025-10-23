import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mizan-dz.com"; // ← Changez par votre domaine

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/avocats`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Récupérer tous les avocats pour créer des URLs dynamiques
  const { data: avocats } = await supabase
    .from("avocats")
    .select("id, prenom, nom, updated_at")
    .eq("est_verifie", true);

  const avocatPages =
    avocats?.map((avocat) => ({
      url: `${baseUrl}/avocats/${avocat.id}`,
      lastModified: new Date(avocat.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  return [...staticPages, ...avocatPages];
}
