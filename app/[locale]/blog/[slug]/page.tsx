import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Calendar, ArrowRight } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import React from "react";

const ARTICLE_META: Record<
  string,
  {
    categorieKey: string;
    date: string;
    specialiteSlug: string;
    articlesLies: string[];
  }
> = {
  "comment-divorcer-en-algerie": {
    categorieKey: "famille",
    date: "2025-04-01",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "succession-algerie-depuis-etranger",
      "droits-locataire-algerie",
    ],
  },
  "creer-sarl-algerie": {
    categorieKey: "commercial",
    date: "2025-03-15",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: ["licenciement-algerie", "acheter-bien-immobilier-algerie"],
  },
  "succession-algerie-depuis-etranger": {
    categorieKey: "famille",
    date: "2025-03-01",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "comment-divorcer-en-algerie",
      "heriter-bien-immobilier-algerie-france",
    ],
  },
  "droits-locataire-algerie": {
    categorieKey: "immobilier",
    date: "2025-02-15",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: ["acheter-bien-immobilier-algerie", "creer-sarl-algerie"],
  },
  "licenciement-algerie": {
    categorieKey: "travail",
    date: "2025-02-01",
    specialiteSlug: "droit-du-travail-et-social",
    articlesLies: ["creer-sarl-algerie", "acheter-bien-immobilier-algerie"],
  },
  "acheter-bien-immobilier-algerie": {
    categorieKey: "immobilier",
    date: "2025-01-15",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: [
      "droits-locataire-algerie",
      "vendre-appartement-algerie-etranger",
    ],
  },
  "creer-entreprise-algerie-diaspora": {
    categorieKey: "commercial",
    date: "2026-05-28",
    specialiteSlug: "droit-commercial-et-des-affaires",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "vendre-appartement-algerie-etranger",
    ],
  },
  "heriter-bien-immobilier-algerie-france": {
    categorieKey: "famille",
    date: "2026-05-28",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "vendre-appartement-algerie-etranger",
      "succession-algerie-depuis-etranger",
    ],
  },
  "vendre-appartement-algerie-etranger": {
    categorieKey: "immobilier",
    date: "2026-05-28",
    specialiteSlug: "droit-de-l-immobilier",
    articlesLies: [
      "heriter-bien-immobilier-algerie-france",
      "acheter-bien-immobilier-algerie",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLE_META[slug];
  if (!meta) return { title: "Article | Mizan" };
  const t = await getTranslations("blogArticles");
  const titre = t(`${slug}.titre`);
  const resume = t(`${slug}.resume`);
  return {
    title: `${titre} | Mizan`,
    description: resume,
    openGraph: {
      title: titre,
      description: resume,
      url: `https://mizan-dz.com/blog/${slug}`,
    },
    alternates: { canonical: `https://mizan-dz.com/blog/${slug}` },
  };
}

export async function generateStaticParams() {
  return Object.keys(ARTICLE_META).map((slug) => ({ slug }));
}

const renderContenu = (contenu: string) => {
  const lines = contenu.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-slate-800 mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="font-semibold text-slate-800 mt-3 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={key++}
          className="text-slate-600 leading-relaxed ms-4 list-disc"
        >
          {line.replace("- ", "")}
        </li>
      );
    } else if (/^\d+\./.test(line)) {
      elements.push(
        <li
          key={key++}
          className="text-slate-600 leading-relaxed ms-4 list-decimal"
        >
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={key++} className="text-slate-600 leading-relaxed">
          {line}
        </p>
      );
    }
  }
  return elements;
};

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const meta = ARTICLE_META[slug];
  if (!meta) notFound();

  const t = await getTranslations();
  const locale = await getLocale();
  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";

  const titre = t(`blogArticles.${slug}.titre`);
  const resume = t(`blogArticles.${slug}.resume`);
  const contenu = t(`blogArticles.${slug}.contenu`);
  const categorie = t(`blogPage.categories.${meta.categorieKey}`);

  const articlesLies = meta.articlesLies
    .map((s) => {
      const m = ARTICLE_META[s];
      if (!m) return null;
      return {
        slug: s,
        titre: t(`blogArticles.${s}.titre`),
        resume: t(`blogArticles.${s}.resume`),
        categorie: t(`blogPage.categories.${m.categorieKey}`),
      };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            {t("blogArticleDetail.home")}
          </Link>
          <span>·</span>
          <Link href="/blog" className="hover:text-teal-600 transition-colors">
            {t("blogArticleDetail.blog")}
          </Link>
          <span>·</span>
          <span className="text-slate-800 font-medium truncate">{titre}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
              {categorie}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {new Date(meta.date).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 leading-tight">
            {titre}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed mb-8 pb-8 border-b border-slate-100">
            {resume}
          </p>
          <div className="prose-like space-y-2">{renderContenu(contenu)}</div>
        </div>

        <div className="bg-teal-600 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            {t("blogArticleDetail.ctaTitle")}
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            {t("blogArticleDetail.ctaDesc")}
          </p>
          <Link href={`/avocats/specialite/${meta.specialiteSlug}`}>
            <button className="bg-white hover:bg-teal-50 text-teal-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              {t("blogArticleDetail.ctaAction")}
            </button>
          </Link>
        </div>

        {articlesLies.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {t("blogArticleDetail.relatedArticles")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articlesLies.map(
                (a) =>
                  a && (
                    <Link
                      key={a.slug}
                      href={`/blog/${a.slug}`}
                      className="h-full"
                    >
                      <div className="h-full bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all flex flex-col">
                        <span className="text-xs font-medium text-teal-600 mb-1">
                          {a.categorie}
                        </span>
                        <h3 className="font-semibold text-slate-800 text-sm mb-2 leading-snug flex-1">
                          {a.titre}
                        </h3>
                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {a.resume}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 font-medium pt-3 border-t border-slate-100">
                          {t("blogArticleDetail.read")}{" "}
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
