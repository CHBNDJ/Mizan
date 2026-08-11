import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const LOCALES = ["fr", "ar", "en"] as const;
const DEFAULT_LOCALE = "fr";
const PROFESSIONS = [
  "avocat",
  "notaire",
  "huissier",
  "comptable",
  "expert-comptable",
  "traducteur",
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
const WILAYAS_SLUGS = [
  "alger",
  "oran",
  "constantine",
  "setif",
  "blida",
  "annaba",
  "bejaia",
  "tizi-ouzou",
];
const BLOG_SLUGS = [
  "exequatur-algerie-jugement-etranger",
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
const baseUrl = "https://mizan-dz.com";
function localeUrl(locale: string, path: string): string {
  return locale === DEFAULT_LOCALE
    ? `${baseUrl}${path || "/"}`
    : `${baseUrl}/${locale}${path}`;
}
function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified: Date = new Date()
): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl(DEFAULT_LOCALE, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, localeUrl(l, path)])
      ),
    },
  };
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    entry("", "daily", 1),
    entry("/search", "daily", 0.9),
    entry("/blog", "weekly", 0.8),
    entry("/howitworks", "monthly", 0.7),
    entry("/faq", "monthly", 0.6),
    entry("/contact", "monthly", 0.6),
    entry("/privacy", "yearly", 0.3),
  ];
  const professionPages = PROFESSIONS.map((prof) =>
    entry(`/${prof}`, "weekly", 0.95)
  );
  const specialitePages = SPECIALITES_SLUGS.map((slug) =>
    entry(`/lawyers/specialite/${slug}`, "weekly", 0.85)
  );
  const wilayaPages = WILAYAS_SLUGS.map((slug) =>
    entry(`/lawyers/wilaya/${slug}`, "weekly", 0.85)
  );
  const blogPages = BLOG_SLUGS.map((slug) =>
    entry(`/blog/${slug}`, "monthly", 0.7)
  );
  try {
    const { data: lawyers } = await supabase
      .from("lawyers")
      .select("id, slug, updated_at, users!inner(user_type)")
      .eq("is_verified", true)
      .eq("users.user_type", "lawyer");
    const lawyerPages = (lawyers || []).map((lawyer) =>
      entry(
        `/lawyers/${lawyer.slug || lawyer.id}`,
        "weekly",
        0.8,
        new Date(lawyer.updated_at || new Date())
      )
    );
    return [
      ...staticPages,
      ...professionPages,
      ...specialitePages,
      ...wilayaPages,
      ...blogPages,
      ...lawyerPages,
    ];
  } catch {
    return [
      ...staticPages,
      ...professionPages,
      ...specialitePages,
      ...wilayaPages,
      ...blogPages,
    ];
  }
}
