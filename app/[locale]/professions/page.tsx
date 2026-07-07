"use client";
import { Link } from "@/i18n/navigation";
import {
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  ChevronRight,
  Languages,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PROFESSIONS_LIST, ProfessionSlug } from "@/lib/professionsData";
import { use } from "react";

const PROF_ICONS: Record<string, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
  "expert-comptable": TrendingUp,
  traducteur: Languages,
};

const PROF_KEY: Record<ProfessionSlug, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
  traducteur: "traducteur",
};

export const metadata = {
  title: "Les professions juridiques en Algérie | Mizan",
  description:
    "Comprenez le rôle de chaque professionnel juridique en Algérie : avocat, notaire, huissier, comptable agréé, expert-comptable. Missions, cadre légal et quand faire appel.",
  alternates: { canonical: "https://mizan-dz.com/professions" },
};

export default async function ProfessionsPage() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-widest mb-3">
            {t("professionsPage.tag")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4 leading-tight">
            {t("professionsPage.title")}
          </h1>
          <p className="text-slate-500 dark:text-[#A8A8A6] text-base max-w-xl mx-auto leading-relaxed">
            {t("professionsPage.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {PROFESSIONS_LIST.map((slug) => {
            const key = PROF_KEY[slug];
            const data = {
              label: t(`professionsData.${key}.label`),
              tagline: t(`professionsData.${key}.tagline`),
              intro: t(`professionsData.${key}.intro`),
              missions: t.raw(`professionsData.${key}.missions`) as {
                emoji: string;
                title: string;
                desc: string;
              }[],
            };
            const Icon = PROF_ICONS[slug] || Scale;
            return (
              <Link key={slug} href={`/professions/${slug}`}>
                <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] hover:border-teal-300 rounded-2xl p-6 flex items-start gap-5 cursor-pointer transition-all hover:shadow-sm group">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-teal-600 dark:text-[#6fcf9f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h2 className="text-base font-bold text-slate-800 dark:text-[#F5F5F4]">
                        {data.label}
                      </h2>
                      <ChevronRight className="w-4 h-4 text-teal-400 flex-shrink-0 group-hover:text-teal-600 dark:text-[#6fcf9f] transition-colors" />
                    </div>
                    <p className="text-sm text-teal-600 dark:text-[#6fcf9f] font-medium mb-2 leading-snug">
                      {data.tagline}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-[#A8A8A6] leading-relaxed line-clamp-2">
                      {data.intro}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {data.missions.slice(0, 3).map((m, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-[#A8A8A6] bg-slate-50 border border-slate-100 dark:border-[#1c2220] px-2.5 py-1 rounded-full"
                        >
                          <span>{m.emoji}</span> {m.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 bg-teal-600 rounded-2xl p-7 text-center">
          <h2 className="text-lg font-bold text-white mb-2">
            {t("professionsPage.ctaTitle")}
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            {t("professionsPage.ctaDesc")}
          </p>
          <Link href="/search">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-600 dark:text-[#6fcf9f] font-semibold text-sm rounded-xl cursor-pointer transition-all">
              {t("professionsPage.ctaAction")}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
