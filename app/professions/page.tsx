import Link from "next/link";
import {
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { PROFESSIONS_DATA, PROFESSIONS_LIST } from "@/lib/professionsData";

const PROF_ICONS: Record<string, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
  "expert-comptable": TrendingUp,
};

export const metadata = {
  title: "Les professions juridiques en Algérie | Mizan",
  description:
    "Comprenez le rôle de chaque professionnel juridique en Algérie : avocat, notaire, huissier, comptable agréé, expert-comptable. Missions, cadre légal et quand faire appel.",
  alternates: { canonical: "https://mizan-dz.com/professions" },
};

export default function ProfessionsPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
            Guide des professions
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            Les professionnels du droit en Algérie
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Avocat, notaire, huissier, comptable — chaque professionnel a un
            rôle précis défini par la loi algérienne. Comprenez qui contacter
            selon votre situation.
          </p>
        </div>

        <div className="space-y-4">
          {PROFESSIONS_LIST.map((slug) => {
            const data = PROFESSIONS_DATA[slug];
            const Icon = PROF_ICONS[slug] || Scale;
            return (
              <Link key={slug} href={`/professions/${slug}`}>
                <div className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-6 flex items-start gap-5 cursor-pointer transition-all hover:shadow-sm group">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h2 className="text-base font-bold text-slate-800">
                        {data.label}
                      </h2>
                      <ChevronRight className="w-4 h-4 text-teal-400 flex-shrink-0 group-hover:text-teal-600 transition-colors" />
                    </div>
                    <p className="text-sm text-teal-600 font-medium mb-2 leading-snug">
                      {data.tagline}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {data.intro}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {data.missions.slice(0, 3).map((m, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full"
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
            Trouvez le bon professionnel
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            Tous vérifiés par Mizan avant activation.
          </p>
          <Link href="/search">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold text-sm rounded-xl cursor-pointer transition-all">
              Rechercher un professionnel <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
