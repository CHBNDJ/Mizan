"use client";
import { useEffect, useRef } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Scale,
  FileText,
  Briefcase,
  Calculator,
} from "lucide-react";
import {
  PROFESSIONS_DATA,
  PROFESSIONS_LIST,
  ProfessionSlug,
} from "@/lib/professionsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PROF_ICONS: Record<string, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
  "expert-comptable": Calculator,
};
const PROF_COLORS: Record<string, string> = {
  avocat: "from-teal-600 to-teal-800",
  notaire: "from-slate-600 to-slate-800",
  huissier: "from-blue-600 to-blue-800",
  comptable: "from-emerald-600 to-emerald-800",
  "expert-comptable": "from-indigo-600 to-indigo-800",
};

export default function ProfessionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as ProfessionSlug) || "avocat";
  const data = PROFESSIONS_DATA[slug];
  if (!data) notFound();

  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = PROF_ICONS[slug] || Scale;
  const color = PROF_COLORS[slug] || PROF_COLORS.avocat;

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".hero-section",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 }
    ).fromTo(
      ".section-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      "-=0.3"
    );
    gsap.fromTo(
      ".cta-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const otherProfs = PROFESSIONS_LIST.filter((p) => p !== slug);

  return (
    <div
      className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100"
      ref={containerRef}
    >
      <style>{`.hero-section,.section-card,.cta-section{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        {/* Hero */}
        <div
          className={`hero-section bg-gradient-to-br ${color} rounded-2xl p-8 mb-8 text-white`}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                Profession réglementée en Algérie
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {data.label}
              </h1>
            </div>
          </div>
          <p className="text-white/90 text-lg font-medium mb-3 leading-snug">
            {data.tagline}
          </p>
          <p className="text-white/80 text-sm leading-relaxed">{data.intro}</p>
        </div>

        {/* Cadre juridique */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-xs">
              ⚖️
            </span>
            Cadre juridique en Algérie
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {data.cadreJuridique}
          </p>
        </div>

        {/* Missions */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Missions et rôle concret
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.missions.map((m, i) => (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-xl flex-shrink-0">{m.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">
                    {m.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quand faire appel */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            Quand faire appel à un {data.label.toLowerCase()} ?
          </h2>
          <div className="space-y-3">
            {data.quandFaireAppel.map((q, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 border border-slate-100 rounded-xl hover:border-teal-100 transition-all"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5">
                    {q.situation}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {q.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Différences */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-5">
            {data.label} vs autres professionnels
          </h2>
          <div className="space-y-3">
            {data.differences.map((d, i) => (
              <div
                key={i}
                className="p-4 bg-amber-50 border border-amber-100 rounded-xl"
              >
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                  {data.label} vs {d.avec}
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {d.distinction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section bg-teal-600 rounded-2xl p-7 text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">
            Trouvez un {data.label.toLowerCase()} vérifié en Algérie
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            Tous les professionnels sur Mizan sont vérifiés avant activation.
          </p>
          <Link href={`/search?profession=${data.searchProfession}`}>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-700 font-semibold text-sm rounded-xl cursor-pointer transition-all">
              Trouver un {data.label.toLowerCase()}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Autres professions */}
        <div className="section-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Autres professions sur Mizan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherProfs.map((p) => {
              const d = PROFESSIONS_DATA[p];
              const OtherIcon = PROF_ICONS[p];
              return (
                <Link key={p} href={`/professions/${p}`}>
                  <div className="bg-white border border-slate-200 hover:border-teal-200 rounded-xl p-3 text-center cursor-pointer transition-all hover:shadow-sm">
                    <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <OtherIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {d.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
