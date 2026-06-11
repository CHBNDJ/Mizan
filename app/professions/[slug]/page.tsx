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
  TrendingUp,
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
  "expert-comptable": TrendingUp,
};

export default function ProfessionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as ProfessionSlug) || "avocat";
  const data = PROFESSIONS_DATA[slug];
  if (!data) notFound();

  const Icon = PROF_ICONS[slug] || Scale;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".pf-hero",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
    gsap.fromTo(
      ".pf-section",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
      }
    );
    gsap.fromTo(
      ".pf-cta",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".pf-cta",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const otherProfs = PROFESSIONS_LIST.filter((p) => p !== slug);

  return (
    <div className="min-h-screen pt-16 bg-white" ref={ref}>
      <style>{`.pf-hero,.pf-section,.pf-cta{opacity:0;}`}</style>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Retour */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 mb-8 text-sm font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* ── Hero ── */}
        <div className="pf-hero bg-teal-600 rounded-2xl p-7 sm:p-8 mb-6 text-white">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Profession réglementée · Algérie
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {data.label}
              </h1>
              <p className="text-teal-100 text-sm mt-1.5 leading-snug">
                {data.tagline}
              </p>
            </div>
          </div>

          {/* Pills missions rapides */}
          <div className="flex flex-wrap gap-2 mt-4">
            {data.missions.slice(0, 4).map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full"
              >
                <span className="text-xs">{m.emoji}</span>
                <span className="text-xs font-medium text-white">
                  {m.title}
                </span>
              </div>
            ))}
            {data.missions.length > 4 && (
              <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
                <span className="text-xs text-teal-100">
                  +{data.missions.length - 4} autres
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Cadre juridique ── */}
        <div className="pf-section bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-xs">
              ⚖️
            </span>
            Cadre juridique en Algérie
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {data.cadreJuridique}
          </p>
        </div>

        {/* ── Missions détaillées ── */}
        <div className="pf-section bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-5">
            Missions et rôle concret
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.missions.map((m, i) => (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-lg flex-shrink-0">{m.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-800 mb-1">
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

        {/* ── Quand faire appel ── */}
        <div className="pf-section bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-bold text-teal-900 mb-4">
            Quand faire appel à un {data.label.toLowerCase()} ?
          </h2>
          <div className="space-y-3">
            {data.quandFaireAppel.map((q, i) => (
              <div
                key={i}
                className="flex gap-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 mb-0.5">
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

        {/* ── Différences ── */}
        <div className="pf-section bg-white border border-slate-200 rounded-2xl p-6 mb-7 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            {data.label} vs autres professionnels
          </h2>
          <div className="space-y-3">
            {data.differences.map((d, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 border-l-4 border-teal-400 rounded-r-xl"
              >
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">
                  {data.label} vs {d.avec}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {d.distinction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="pf-cta bg-teal-600 rounded-2xl p-7 text-center mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            Trouvez un {data.label.toLowerCase()} vérifié en Algérie
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            Tous les professionnels sur Mizan sont vérifiés avant activation.
          </p>
          <Link href={`/${data.searchProfession}`}>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold text-sm rounded-xl cursor-pointer transition-all">
              Trouver un {data.label.toLowerCase()}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* ── Autres professions ── */}
        <div className="pf-section">
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
