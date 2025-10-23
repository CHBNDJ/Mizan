import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mizan-dz.com";

  // Pages statiques importantes
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/avocats`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Récupérer tous les avocats vérifiés
  try {
    const { data: avocats, error } = await supabase
      .from("avocats")
      .select("id, updated_at")
      .eq("est_verifie", true);

    if (error) {
      console.error("Erreur récupération avocats pour sitemap:", error);
      return staticPages;
    }

    // ✅ URL corrigée : /lawyers/ au lieu de /avocats/
    const avocatPages =
      avocats?.map((avocat) => ({
        url: `${baseUrl}/lawyers/${avocat.id}`,
        lastModified: new Date(avocat.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...avocatPages];
  } catch (error) {
    console.error("Erreur sitemap:", error);
    return staticPages;
  }
}
