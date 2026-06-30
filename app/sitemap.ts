import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PROFESSIONS = [
  "avocat",
  "notaire",
  "huissier",
  "comptable",
  "expert-comptable",
];

const SPECIALITES_SLUGS = [
  "droit-de-la-famille",
  "droit-commercial",
  "droit-penal",
  "droit-immobilier",
  "droit-du-travail",
  "droit-des-etrangers",
  "droit-fiscal",
  "droit-administratif",
];

const BLOG_SLUGS = [
  "comment-divorcer-en-algerie",
  "creer-sarl-algerie",
  "succession-algerie-depuis-etranger",
  "droits-locataire-algerie",
  "licenciement-algerie",
  "acheter-bien-immobilier-algerie",
  "creer-entreprise-algerie-diaspora",
  "heriter-bien-immobilier-algerie-france",
  "vendre-appartement-algerie-etranger",
];

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
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/howitworks`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
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

  const professionPages: MetadataRoute.Sitemap = PROFESSIONS.map((prof) => ({
    url: `${baseUrl}/${prof}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.95,
  }));

  const specialitePages: MetadataRoute.Sitemap = SPECIALITES_SLUGS.map(
    (slug) => ({
      url: `${baseUrl}/lawyers/specialite/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  );

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  try {
    const { data: lawyers } = await supabase
      .from("lawyers")
      .select("id, updated_at, users!inner(user_type)")
      .eq("is_verified", true)
      .eq("users.user_type", "lawyer");

    const lawyerPages: MetadataRoute.Sitemap = (lawyers || []).map(
      (lawyer) => ({
        url: `${baseUrl}/lawyers/${lawyer.id}`,
        lastModified: new Date(lawyer.updated_at || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    // Pages search par wilaya — URLs propres pour le SEO
    const { data: usersData } = await supabase
      .from("users")
      .select("address")
      .eq("user_type", "lawyer");

    const wilayasSet = new Set<string>();
    usersData?.forEach((u) => {
      if (u.address?.wilaya) wilayasSet.add(u.address.wilaya.toLowerCase());
    });

    const searchWilayaPages: MetadataRoute.Sitemap = Array.from(
      wilayasSet
    ).flatMap((wilaya) =>
      PROFESSIONS.map((prof) => ({
        url: `${baseUrl}/search?profession=${prof}&wilaya=${encodeURIComponent(wilaya)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }))
    );

    return [
      ...staticPages,
      ...professionPages,
      ...specialitePages,
      ...blogPages,
      ...lawyerPages,
      ...searchWilayaPages,
    ];
  } catch {
    return [
      ...staticPages,
      ...professionPages,
      ...specialitePages,
      ...blogPages,
    ];
  }
}
