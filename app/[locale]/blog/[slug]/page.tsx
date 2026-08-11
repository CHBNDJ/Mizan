import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import React from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { localizedDigits } from "@/lib/arabicNumerals";

const ARTICLE_META: Record<
  string,
  {
    categorieKey: string;
    date: string;
    specialiteSlug: string;
    articlesLies: string[];
    auteur?: {
      nom: { fr: string; ar: string; en: string };
      slug: string;
      titres: { fr: string[]; ar: string[]; en: string[] };
    };
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
  "exequatur-algerie-jugement-etranger": {
    categorieKey: "famille",
    date: "2026-08-05",
    specialiteSlug: "droit-de-la-famille",
    articlesLies: [
      "comment-divorcer-en-algerie",
      "succession-algerie-depuis-etranger",
    ],
    auteur: {
      nom: {
        fr: "Me Atmani Bilal",
        ar: "الأستاذ أتماني بلال",
        en: "Me Atmani Bilal",
      },
      slug: "bilal-atmani",
      titres: {
        fr: [
          "Professeur des universités en Algérie",
          "Avocat agréé auprès de la Cour suprême et du Conseil d'État",
          "Membre du Conseil de l'Ordre des Avocats au barreau de Béjaïa",
        ],
        ar: [
          "أستاذ جامعي في الجزائر",
          "محامٍ معتمد لدى المحكمة العليا ومجلس الدولة",
          "عضو مجلس منظمة المحامين ببجاية",
        ],
        en: [
          "University professor in Algeria",
          "Lawyer admitted to the Supreme Court and Council of State",
          "Member of the Béjaïa Bar Council",
        ],
      },
    },
  },
};

const UI: Record<
  string,
  { toc: string; by: string; read: string; viewProfile: string }
> = {
  fr: {
    toc: "Dans cet article",
    by: "Par",
    read: "min de lecture",
    viewProfile: "Voir le profil",
  },
  ar: {
    toc: "في هذا المقال",
    by: "بقلم",
    read: "دقيقة قراءة",
    viewProfile: "عرض الملف",
  },
  en: {
    toc: "In this article",
    by: "By",
    read: "min read",
    viewProfile: "View profile",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLE_META[slug];
  if (!meta) return { title: "Article | MIZAN" };
  const t = await getTranslations("blogArticles");
  const titre = t(`${slug}.titre`);
  const resume = t(`${slug}.resume`);
  return {
    title: `${titre} | MIZAN`,
    description: resume,
    openGraph: {
      title: titre,
      description: resume,
      url: `https://mizan-dz.com/blog/${slug}`,
      siteName: "MIZAN",
      type: "article",
    },
    alternates: { canonical: `https://mizan-dz.com/blog/${slug}` },
  };
}

export async function generateStaticParams() {
  return Object.keys(ARTICLE_META).map((slug) => ({ slug }));
}

const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${i++}`}
          className="font-semibold text-slate-800 dark:text-[#F5F5F4]"
        >
          {token.replace(/\*\*/g, "")}
        </strong>
      );
    } else {
      const lm = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (lm) {
        const label = lm[1];
        const url = lm[2];
        if (url.startsWith("/")) {
          nodes.push(
            <Link
              key={`${keyPrefix}-l-${i++}`}
              href={url}
              className="text-teal-600 dark:text-[#6fcf9f] font-medium hover:underline"
            >
              {label}
            </Link>
          );
        } else {
          nodes.push(
            <a
              key={`${keyPrefix}-l-${i++}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-[#6fcf9f] font-medium hover:underline"
            >
              {label}
            </a>
          );
        }
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

const extractHeadings = (contenu: string) => {
  const headings: { id: string; text: string }[] = [];
  let hi = 0;
  for (const line of contenu.trim().split("\n")) {
    if (line.startsWith("## ")) {
      headings.push({ id: `s-${hi}`, text: line.replace("## ", "") });
      hi++;
    }
  }
  return headings;
};

const renderContenu = (contenu: string, expert: boolean, locale: string) => {
  const lines = contenu.trim().split("\n");
  const out: React.ReactNode[] = [];
  let key = 0;
  let headingIdx = 0;
  let bufType: "ul" | "ol" | null = null;
  let bufItems: string[] = [];

  const flush = () => {
    if (!bufType || bufItems.length === 0) {
      bufType = null;
      bufItems = [];
      return;
    }
    const type = bufType;
    const items = bufItems;
    bufType = null;
    bufItems = [];
    const liNodes = items.map((txt, j) =>
      expert ? (
        <li
          key={`li-${key}-${j}`}
          className="flex gap-3 items-baseline text-slate-600 dark:text-[#E8E8E6] leading-relaxed"
        >
          <span className="flex-shrink-0 text-teal-600 dark:text-[#6fcf9f]">
            {type === "ol" ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 dark:bg-[#6fcf9f]/15 text-[11px] font-semibold">
                {localizedDigits(String(j + 1), locale)}
              </span>
            ) : (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#6fcf9f]" />
            )}
          </span>
          <span className="text-sm leading-relaxed">
            {renderInline(txt, `bi-${key}-${j}`)}
          </span>
        </li>
      ) : (
        <li
          key={`li-${key}-${j}`}
          className={`text-slate-600 dark:text-[#A8A8A6] leading-relaxed ms-4 ${type === "ol" ? "list-decimal" : "list-disc"}`}
        >
          {renderInline(txt, `bi-${key}-${j}`)}
        </li>
      )
    );
    if (expert) {
      out.push(
        <div
          key={key++}
          className="bg-slate-50 dark:bg-[#232325] border border-teal-100 dark:border-[#3a3a3d] rounded-xl p-5 my-5"
        >
          <ul className="space-y-2.5">{liNodes}</ul>
        </div>
      );
    } else {
      liNodes.forEach((n) => out.push(n));
    }
  };

  for (const line of lines) {
    const isList = line.startsWith("- ") || /^\d+\./.test(line);
    if (!isList) flush();

    if (line.startsWith("## ")) {
      const id = expert ? `s-${headingIdx++}` : undefined;
      out.push(
        <h2
          key={key++}
          id={id}
          className="text-xl font-bold text-slate-800 dark:text-[#F5F5F4] mt-8 mb-3 scroll-mt-24"
        >
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      out.push(
        <p
          key={key++}
          className="font-semibold text-slate-800 dark:text-[#F5F5F4] mt-4 mb-1"
        >
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.startsWith("- ")) {
      if (bufType !== "ul") flush();
      bufType = "ul";
      bufItems.push(line.replace("- ", ""));
    } else if (/^\d+\./.test(line)) {
      if (bufType !== "ol") flush();
      bufType = "ol";
      bufItems.push(line.replace(/^\d+\.\s*/, ""));
    } else if (line.trim() !== "") {
      out.push(
        <p
          key={key++}
          className="text-slate-600 dark:text-[#A8A8A6] leading-relaxed"
        >
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flush();
  return out;
};

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const meta = ARTICLE_META[slug];
  if (!meta) notFound();

  const t = await getTranslations();
  const locale = await getLocale();
  const dateLocale =
    locale === "ar" ? "ar-EG" : locale === "en" ? "en-US" : "fr-FR";
  const ui = UI[locale] || UI.fr;

  const titre = t(`blogArticles.${slug}.titre`);
  const resume = t(`blogArticles.${slug}.resume`);
  const contenu = t(`blogArticles.${slug}.contenu`);
  const categorie = t(`blogPage.categories.${meta.categorieKey}`);

  const expert = !!meta.auteur;
  let auteurAvatar: string | null = null;
  if (meta.auteur) {
    const supabase = await createClient();
    const { data: lawyerRow } = await supabase
      .from("lawyers")
      .select("id")
      .eq("slug", meta.auteur.slug)
      .single();
    if (lawyerRow?.id) {
      const { data: userRow } = await supabase
        .from("users")
        .select("avatar_url")
        .eq("id", lawyerRow.id)
        .single();
      auteurAvatar = userRow?.avatar_url || null;
    }
  }
  const headings = expert ? extractHeadings(contenu) : [];
  const wordCount = contenu.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 180));

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
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#A8A8A6] mb-6 flex-wrap">
          <Link
            href="/"
            className="hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-colors"
          >
            {t("blogArticleDetail.home")}
          </Link>
          <span>·</span>
          <Link
            href="/blog"
            className="hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-colors"
          >
            {t("blogArticleDetail.blog")}
          </Link>
          <span>·</span>
          <span className="text-slate-800 dark:text-[#F5F5F4] font-medium truncate">
            {titre}
          </span>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-8 sm:p-10 mb-8 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f] rounded-full border border-teal-100 dark:border-[#6fcf9f]/20">
              {categorie}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-[#7A7A78]">
              {expert && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {localizedDigits(String(readingTime), locale)} {ui.read}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(meta.date).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3 leading-tight">
            {titre}
          </h1>

          {meta.auteur && (
            <Link
              href={`/lawyers/${meta.auteur.slug}`}
              className="flex gap-4 mb-6 p-4 rounded-xl border border-teal-100 dark:border-[#3a3a3d] bg-teal-50/50 dark:bg-[#6fcf9f]/5 hover:border-teal-300 dark:hover:border-[#6fcf9f] transition-colors group"
            >
              <div className="flex-shrink-0">
                {auteurAvatar ? (
                  <Image
                    src={auteurAvatar}
                    alt={meta.auteur.nom.fr}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-teal-600 dark:bg-[#0F6E56] text-white flex items-center justify-center text-base font-bold">
                    {meta.auteur.nom.fr
                      .replace(/^Me\s+/, "")
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] group-hover:text-teal-600 dark:group-hover:text-[#6fcf9f] transition-colors">
                  {ui.by}{" "}
                  {meta.auteur.nom[locale as "fr" | "ar" | "en"] ||
                    meta.auteur.nom.fr}
                </span>
                <span className="block mt-1 space-y-0.5">
                  {(
                    meta.auteur.titres[locale as "fr" | "ar" | "en"] ||
                    meta.auteur.titres.fr
                  ).map((titre, i) => (
                    <span
                      key={i}
                      className="block text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed"
                    >
                      {titre}
                    </span>
                  ))}
                </span>
                <span className="inline-flex items-center gap-1 mt-2.5 text-xs font-medium text-teal-600 dark:text-[#6fcf9f]">
                  {ui.viewProfile}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          )}

          <p className="text-slate-500 dark:text-[#A8A8A6] text-base leading-relaxed mb-8 pb-8 border-b border-slate-100 dark:border-[#1c2220]">
            {resume}
          </p>

          {expert && headings.length > 1 && (
            <div className="bg-teal-50/60 dark:bg-[#6fcf9f]/5 border border-teal-100 dark:border-[#3a3a3d] rounded-xl p-5 mb-8">
              <p className="text-xs font-semibold text-teal-700 dark:text-[#6fcf9f] uppercase tracking-wide mb-3">
                {ui.toc}
              </p>
              <ol className="space-y-1.5">
                {headings.map((h, idx) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-colors flex items-start gap-2"
                    >
                      <span className="text-teal-500 dark:text-[#6fcf9f] font-medium">
                        {localizedDigits(String(idx + 1), locale)}.
                      </span>
                      <span>{h.text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="prose-like space-y-2">
            {renderContenu(contenu, expert, locale)}
          </div>
        </div>

        <div className="bg-teal-600 dark:bg-[#0F6E56] rounded-2xl p-8 text-center mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            {t("blogArticleDetail.ctaTitle")}
          </h2>
          <p className="text-teal-100 dark:text-[#6fcf9f] text-sm mb-5">
            {t("blogArticleDetail.ctaDesc")}
          </p>
          <Link href={`/lawyers/specialite/${meta.specialiteSlug}`}>
            <button className="bg-white hover:bg-teal-50 dark:bg-[#1c1c1e] dark:hover:bg-[#26492f] text-teal-600 dark:text-[#6fcf9f] px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer">
              {t("blogArticleDetail.ctaAction")}
            </button>
          </Link>
        </div>

        {articlesLies.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
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
                      <div className="h-full bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-4 hover:border-teal-200 dark:hover:border-[#6fcf9f]/50 hover:shadow-sm dark:hover:shadow-none transition-all flex flex-col">
                        <span className="text-xs font-medium text-teal-600 dark:text-[#6fcf9f] mb-1">
                          {a.categorie}
                        </span>
                        <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4] text-sm mb-2 leading-snug flex-1">
                          {a.titre}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-[#A8A8A6] mb-3 line-clamp-2">
                          {a.resume}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-[#6fcf9f] font-medium pt-3 border-t border-slate-100 dark:border-[#1c2220]">
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
