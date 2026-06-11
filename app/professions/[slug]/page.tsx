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

interface ProfColor {
  heroFrom: string;
  iconBg: string;
  iconText: string;
  checkColor: string;
  diffBg: string;
  diffBorder: string;
  diffLabel: string;
  ctaBg: string;
  ctaHover: string;
  ctaBtnText: string;
  sectionIconBg: string;
  sectionIconText: string;
  hoverBorder: string;
  tagBg: string;
  tagText: string;
}

const PROF_COLORS: Record<string, ProfColor> = {
  avocat: {
    heroFrom: "from-teal-600 to-teal-800",
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    checkColor: "text-teal-500",
    diffBg: "bg-teal-50",
    diffBorder: "border-teal-100",
    diffLabel: "text-teal-800",
    ctaBg: "bg-teal-600",
    ctaHover: "hover:bg-teal-700",
    ctaBtnText: "text-teal-700 hover:text-teal-800",
    sectionIconBg: "bg-teal-50",
    sectionIconText: "text-teal-600",
    hoverBorder: "hover:border-teal-100",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
  },
  notaire: {
    heroFrom: "from-slate-600 to-slate-800",
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    checkColor: "text-slate-500",
    diffBg: "bg-slate-50",
    diffBorder: "border-slate-200",
    diffLabel: "text-slate-800",
    ctaBg: "bg-slate-700",
    ctaHover: "hover:bg-slate-800",
    ctaBtnText: "text-slate-700 hover:text-slate-900",
    sectionIconBg: "bg-slate-100",
    sectionIconText: "text-slate-600",
    hoverBorder: "hover:border-slate-200",
    tagBg: "bg-slate-100",
    tagText: "text-slate-700",
  },
  huissier: {
    heroFrom: "from-blue-600 to-blue-900",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    checkColor: "text-blue-500",
    diffBg: "bg-blue-50",
    diffBorder: "border-blue-100",
    diffLabel: "text-blue-800",
    ctaBg: "bg-blue-600",
    ctaHover: "hover:bg-blue-700",
    ctaBtnText: "text-blue-700 hover:text-blue-900",
    sectionIconBg: "bg-blue-50",
    sectionIconText: "text-blue-600",
    hoverBorder: "hover:border-blue-100",
    tagBg: "bg-blue-50",
    tagText: "text-blue-700",
  },
  comptable: {
    heroFrom: "from-emerald-600 to-emerald-800",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    checkColor: "text-emerald-500",
    diffBg: "bg-emerald-50",
    diffBorder: "border-emerald-100",
    diffLabel: "text-emerald-800",
    ctaBg: "bg-emerald-600",
    ctaHover: "hover:bg-emerald-700",
    ctaBtnText: "text-emerald-700 hover:text-emerald-900",
    sectionIconBg: "bg-emerald-50",
    sectionIconText: "text-emerald-600",
    hoverBorder: "hover:border-emerald-100",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-700",
  },
  "expert-comptable": {
    heroFrom: "from-indigo-600 to-indigo-800",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    checkColor: "text-indigo-500",
    diffBg: "bg-indigo-50",
    diffBorder: "border-indigo-100",
    diffLabel: "text-indigo-800",
    ctaBg: "bg-indigo-600",
    ctaHover: "hover:bg-indigo-700",
    ctaBtnText: "text-indigo-700 hover:text-indigo-900",
    sectionIconBg: "bg-indigo-50",
    sectionIconText: "text-indigo-600",
    hoverBorder: "hover:border-indigo-100",
    tagBg: "bg-indigo-50",
    tagText: "text-indigo-700",
  },
};

export default function ProfessionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as ProfessionSlug) || "avocat";
  const data = PROFESSIONS_DATA[slug];
  if (!data) notFound();

  const c = PROF_COLORS[slug] || PROF_COLORS.avocat;
  const Icon = PROF_ICONS[slug] || Scale;
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen pt-16 bg-white" ref={containerRef}>
      <style>{`.hero-section,.section-card,.cta-section{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Retour — toujours visible */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-8 text-sm font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Hero */}
        <div
          className={`hero-section bg-gradient-to-br ${c.heroFrom} rounded-2xl p-8 mb-6 text-white`}
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                Profession réglementée · Algérie
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {data.label}
              </h1>
            </div>
          </div>
          <p className="text-white/90 text-base font-medium mb-3 leading-snug">
            {data.tagline}
          </p>
          <p className="text-white/75 text-sm leading-relaxed">{data.intro}</p>
        </div>

        {/* Cadre juridique */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span
              className={`w-6 h-6 ${c.sectionIconBg} border rounded-lg flex items-center justify-center text-xs border-slate-200`}
            >
              ⚖️
            </span>
            Cadre juridique en Algérie
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {data.cadreJuridique}
          </p>
        </div>

        {/* Missions */}
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Missions et rôle concret
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.missions.map((m, i) => (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="text-lg flex-shrink-0">{m.emoji}</span>
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
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Quand faire appel à un {data.label.toLowerCase()} ?
          </h2>
          <div className="space-y-2.5">
            {data.quandFaireAppel.map((q, i) => (
              <div
                key={i}
                className={`flex gap-3 p-4 border border-slate-100 rounded-xl transition-all ${c.hoverBorder}`}
              >
                <CheckCircle
                  className={`w-4 h-4 ${c.checkColor} flex-shrink-0 mt-0.5`}
                />
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
        <div className="section-card bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            {data.label} vs autres professionnels
          </h2>
          <div className="space-y-3">
            {data.differences.map((d, i) => (
              <div
                key={i}
                className={`p-4 ${c.diffBg} border ${c.diffBorder} rounded-xl`}
              >
                <p
                  className={`text-xs font-bold ${c.diffLabel} uppercase tracking-wide mb-1`}
                >
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
        <div
          className={`cta-section ${c.ctaBg} rounded-2xl p-7 text-center mb-6`}
        >
          <h2 className="text-lg font-bold text-white mb-2">
            Trouvez un {data.label.toLowerCase()} vérifié en Algérie
          </h2>
          <p className="text-white/80 text-sm mb-5">
            Tous les professionnels sur Mizan sont vérifiés avant activation.
          </p>
          <Link href={`/${data.searchProfession}`}>
            <button
              className={`inline-flex items-center gap-2 px-6 py-3 bg-white ${c.ctaBtnText} font-semibold text-sm rounded-xl cursor-pointer transition-all`}
            >
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
              const oc = PROF_COLORS[p];
              return (
                <Link key={p} href={`/professions/${p}`}>
                  <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-center cursor-pointer transition-all hover:shadow-sm">
                    <div
                      className={`w-9 h-9 ${oc?.iconBg || "bg-slate-50"} border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-2`}
                    >
                      <OtherIcon
                        className={`w-4 h-4 ${oc?.iconText || "text-slate-600"}`}
                      />
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
