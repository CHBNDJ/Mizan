"use client";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type UserType = "client" | "professionnel";
type ProfType =
  | "avocat"
  | "notaire"
  | "huissier"
  | "comptable"
  | "expert-comptable";

const PROF_KEY: Record<ProfType, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
};

const PROF_ICONS: { id: ProfType; Icon: any }[] = [
  { id: "avocat", Icon: Scale },
  { id: "notaire", Icon: FileText },
  { id: "huissier", Icon: Briefcase },
  { id: "comptable", Icon: Calculator },
  { id: "expert-comptable", Icon: TrendingUp },
];

const CLAIM_BANNER: Record<ProfType, boolean> = {
  avocat: true,
  notaire: false,
  huissier: false,
  comptable: false,
  "expert-comptable": false,
};

interface Step {
  title: string;
  desc: string;
  points: string[];
}
interface Faq {
  q: string;
  a: string;
}

export default function HowItWorksPage() {
  const t = useTranslations();
  const [userType, setUserType] = useState<UserType>("client");
  const [profType, setProfType] = useState<ProfType>("avocat");

  const PROFS = PROF_ICONS.map((p) => ({
    ...p,
    label: t(`professions.${PROF_KEY[p.id]}.label`),
  }));

  const profKey = PROF_KEY[profType];
  const claimBanner = CLAIM_BANNER[profType];

  const steps: Step[] =
    userType === "client"
      ? (t.raw("howItWorks.client.steps") as Step[])
      : (t.raw(`howItWorks.professions.${profKey}.steps`) as Step[]);

  const faqs: Faq[] =
    userType === "client"
      ? (t.raw("howItWorks.client.faqs") as Faq[])
      : (t.raw(`howItWorks.professions.${profKey}.faqs`) as Faq[]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 }
    )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        ".tabs-row",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      );
    gsap.fromTo(
      ".cta-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".step-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
    gsap.fromTo(
      ".faq-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, [userType, profType]);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.hero-title,.hero-sub,.tabs-row,.step-card,.faq-card,.cta-section{opacity:0;}`}</style>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="hero-title text-3xl sm:text-5xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-5 leading-tight">
            {t("howItWorks.heroTitle")}
          </h1>
          <p className="hero-sub text-base sm:text-xl text-slate-600 dark:text-[#E8E8E6] max-w-2xl mx-auto leading-relaxed">
            {t("howItWorks.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Tabs client / professionnel */}
          <div className="tabs-row flex justify-center gap-3 mb-6">
            {(["client", "professionnel"] as const).map((ut) => (
              <button
                key={ut}
                onClick={() => setUserType(ut)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  userType === ut
                    ? "bg-teal-600 dark:bg-[#0F6E56] text-white shadow-sm"
                    : "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:border-teal-200 dark:hover:border-[#6fcf9f]/30"
                }`}
              >
                {ut === "client"
                  ? t("howItWorks.tabClient")
                  : t("howItWorks.tabPro")}
              </button>
            ))}
          </div>

          {/* Tabs professions */}
          {userType === "professionnel" && (
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {PROFS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfType(p.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    profType === p.id
                      ? "bg-teal-600 dark:bg-[#0F6E56] text-white"
                      : "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:border-teal-300 dark:hover:border-[#6fcf9f]/30"
                  }`}
                >
                  <p.Icon className="w-3.5 h-3.5" /> {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="step-card bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-5 hover:shadow-sm dark:hover:shadow-none transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-[#6fcf9f] flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4]">
                    {step.title}
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-[#A8A8A6] leading-relaxed mb-4">
                  {step.desc}
                </p>
                <div className="space-y-1.5">
                  {step.points.map((pt: string) => (
                    <div
                      key={pt}
                      className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#A8A8A6]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500 dark:text-[#6fcf9f] flex-shrink-0" />
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <p className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-widest mb-4 text-center">
              {t("howItWorks.faqTitle")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-card bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-4 hover:border-teal-100 dark:hover:border-[#6fcf9f]/20 transition-all"
                >
                  <div className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] mb-1.5">
                    {faq.q}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section py-12 px-4 bg-teal-600 dark:bg-[#0F6E56]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {t("howItWorks.ctaTitle")}
          </h2>
          <p className="text-teal-100 dark:text-[#9FE1CB] mb-8">
            {t("howItWorks.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Bouton plein blanc — "Trouver un expert" */}
            <Link href="/" className="flex">
              <button className="flex-1 h-12 px-8 bg-white hover:bg-teal-50 dark:bg-[#1c1c1e] dark:hover:bg-[#26492f] text-teal-600 dark:text-[#6fcf9f] font-semibold rounded-xl cursor-pointer shadow-sm transition-colors whitespace-nowrap">
                {t("howItWorks.ctaFindExpert")}
              </button>
            </Link>
            {/* Bouton outline blanc — "S'inscrire comme professionnel" */}
            <Link href="/auth/lawyer/register" className="flex">
              <button className="flex-1 h-12 px-8 bg-transparent hover:bg-white/10 dark:bg-[#1c1c1e] dark:hover:bg-[#26492f] text-white dark:text-[#6fcf9f] font-semibold rounded-xl border-2 border-white dark:border-[#6fcf9f] cursor-pointer transition-colors whitespace-nowrap">
                {t("howItWorks.ctaJoinAsPro")}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
