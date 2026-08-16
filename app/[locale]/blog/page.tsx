import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Blog juridique — Conseils et droits en Algérie | MIZAN",
  description:
    "Conseils juridiques pratiques pour les particuliers et entreprises en Algérie. Droit de la famille, droit commercial, succession, divorce — rédigés par des experts.",
  keywords: [
    "blog juridique algérie",
    "conseils juridiques algérie",
    "droit algérien",
    "divorce algérie",
    "succession algérie",
    "droit immobilier algérie",
    "droit travail algérie",
  ],
  openGraph: {
    title: "Blog juridique | MIZAN",
    description: "Conseils juridiques pratiques en Algérie.",
    url: "https://mizan-dz.com/blog",
    siteName: "MIZAN",
    type: "website",
  },
  alternates: {
    canonical: "https://mizan-dz.com/blog",
  },
};

const ARTICLE_META = [
  {
    slug: "acheter-appartement-sur-plan-algerie-vsp",
    categorie: "immobilier",
    date: "2026-08-16",
  },
  {
    slug: "exequatur-algerie-jugement-etranger",
    categorie: "famille",
    date: "2026-08-05",
  },
  {
    slug: "comment-divorcer-en-algerie",
    categorie: "famille",
    date: "2025-04-01",
  },
  { slug: "creer-sarl-algerie", categorie: "commercial", date: "2025-03-15" },
  {
    slug: "succession-algerie-depuis-etranger",
    categorie: "famille",
    date: "2025-03-01",
  },
  {
    slug: "droits-locataire-algerie",
    categorie: "immobilier",
    date: "2025-02-15",
  },
  { slug: "licenciement-algerie", categorie: "travail", date: "2025-02-01" },
  {
    slug: "acheter-bien-immobilier-algerie",
    categorie: "immobilier",
    date: "2025-01-15",
  },
];

export default async function BlogPage() {
  const t = await getTranslations("blogPage");
  const locale = await getLocale();
  const dateLocale =
    locale === "ar" ? "ar-EG" : locale === "en" ? "en-US" : "fr-FR";

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#A8A8A6] mb-4">
            <Link
              href="/"
              className="hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-colors"
            >
              {t("home")}
            </Link>
            <span>·</span>
            <span className="text-slate-800 dark:text-[#F5F5F4] font-medium">
              {t("legalBlog")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-[#E8E8E6] max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {ARTICLE_META.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-5 h-full hover:border-teal-200 dark:hover:border-[#6fcf9f]/50 hover:shadow-sm dark:hover:shadow-none transition-all flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f] rounded-full border border-teal-100 dark:border-[#6fcf9f]/20">
                    {t(`categories.${article.categorie}`)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-[#7A7A78]">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString(dateLocale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <h2 className="font-semibold text-slate-800 dark:text-[#F5F5F4] mb-2 leading-snug flex-1">
                  {t(`articles.${article.slug}.titre`)}
                </h2>
                <p className="text-sm text-slate-500 dark:text-[#A8A8A6] leading-relaxed mb-4">
                  {t(`articles.${article.slug}.resume`)}
                </p>
                <div className="flex items-center gap-1 text-sm text-teal-600 dark:text-[#6fcf9f] font-medium mt-auto">
                  {t("readArticle")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-slate-600 dark:text-[#E8E8E6] mb-6 text-sm max-w-md mx-auto">
            {t("ctaDesc")}
          </p>
          <Link href="/search">
            <button className="bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              {t("ctaAction")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
