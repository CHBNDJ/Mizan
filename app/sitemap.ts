import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mizan-dz.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/howitworks`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const { data: lawyers, error: lawyersError } = await supabase
      .from("lawyers")
      .select("id, updated_at")
      .eq("is_verified", true);

    if (lawyersError) {
      console.error("Erreur récupération lawyers pour sitemap:", lawyersError);
    }

    const lawyerPages: MetadataRoute.Sitemap =
      lawyers?.map((lawyer) => ({
        url: `${baseUrl}/lawyers/${lawyer.id}`,
        lastModified: new Date(lawyer.updated_at || new Date()),
        changeFrequency: "weekly",
        priority: 0.8,
      })) || [];

    const { data: wilayasData, error: wilayasError } = await supabase
      .from("lawyers")
      .select("wilayas")
      .eq("is_verified", true);

    if (wilayasError) {
      console.error("Erreur récupération wilayas pour sitemap:", wilayasError);
    }

    const wilayasSet = new Set<string>();
    wilayasData?.forEach((lawyer) => {
      if (lawyer.wilayas && Array.isArray(lawyer.wilayas)) {
        lawyer.wilayas.forEach((wilaya: string) => {
          if (wilaya) wilayasSet.add(wilaya);
        });
      }
    });

    const wilayaPages: MetadataRoute.Sitemap = Array.from(wilayasSet).map(
      (wilaya) => ({
        url: `${baseUrl}/wilayas/${encodeURIComponent(wilaya)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    return [...staticPages, ...lawyerPages, ...wilayaPages];
  } catch (error) {
    console.error("Erreur génération sitemap:", error);
    return staticPages;
  }
}
