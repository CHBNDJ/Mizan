"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { localizedDigits } from "@/lib/arabicNumerals";
import {
  ArrowRight,
  ChevronRight,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  MessageCircle,
  Languages,
} from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AlgeriaMap } from "@/components/AlgeriaMap";
import { FranceMap } from "@/components/FranceMap";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import TestimonialsSection from "@/components/TestimonialsSection";
import {
  getTopRatedAvocats,
  getWilayas,
  getStatistiques,
} from "@/lib/avocatsData";
import { useCountry } from "@/hooks/useCountry";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PROF_KEY: Record<string, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
  traducteur: "traducteur",
};

const PROFESSION_ICONS = [
  { id: "avocat", Icon: Scale },
  { id: "notaire", Icon: FileText },
  { id: "huissier", Icon: Briefcase },
  { id: "comptable", Icon: Calculator },
  { id: "expert-comptable", Icon: TrendingUp },
  { id: "traducteur", Icon: Languages },
];

function ProfCard({ id, Icon, label, desc, size = "normal", country }: any) {
  const href = country === "France" ? `/${id}?pays=france` : `/${id}`;
  return (
    <Link href={href}>
      <div
        className={`prof-card prof-card-btn bg-white dark:bg-[#1c1c1e] rounded-2xl border-2 border-slate-200 dark:border-[#1c2220] cursor-pointer h-full flex flex-col items-center text-center hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:shadow-md transition-all ${size === "big" ? "px-6 py-6 gap-3" : "px-4 py-4 gap-2"}`}
      >
        <div
          className={`flex-shrink-0 rounded-xl bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 flex items-center justify-center ${size === "big" ? "w-12 h-12" : "w-9 h-9"}`}
        >
          <Icon
            className={`text-teal-600 dark:text-[#6fcf9f] ${size === "big" ? "w-6 h-6" : "w-4 h-4"}`}
          />
        </div>
        <div>
          <div
            className={`font-bold text-slate-800 dark:text-[#F5F5F4] ${size === "big" ? "text-base" : "text-sm"}`}
          >
            {label}
          </div>
          <div className="text-xs text-slate-400 dark:text-[#7A7A78] mt-0.5 leading-relaxed line-clamp-2">
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProfCardHorizontal({ id, Icon, label, desc, country }: any) {
  const href = country === "France" ? `/${id}?pays=france` : `/${id}`;
  return (
    <Link href={href}>
      <div className="prof-card prof-card-btn bg-white dark:bg-[#1c1c1e] rounded-2xl border-2 border-slate-200 dark:border-[#1c2220] cursor-pointer flex items-center gap-4 px-4 py-4 hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:shadow-md transition-all">
        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />
        </div>
        <div className="text-start">
          <div className="font-bold text-slate-800 dark:text-[#F5F5F4] text-sm">
            {label}
          </div>
          <div className="text-xs text-slate-400 dark:text-[#7A7A78] mt-0.5 leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const country = useCountry();
  const ld = (s: string) => localizedDigits(s, locale);
  const [topAvocats, setTopAvocats] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({
    total_avocats: 0,
    pourcentage_verification: 100,
  });

  const PROFESSIONS = PROFESSION_ICONS.map((p) => ({
    ...p,
    label: t(`professions.${PROF_KEY[p.id]}.label`),
    desc: t(`professions.${PROF_KEY[p.id]}.desc`),
  }));

  const heroTitle = (
    <>
      {t("home.hero.title1")}
      <br className="hidden sm:block" />{" "}
      <span className="text-teal-600 dark:text-[#6fcf9f]">
        {country === "France"
          ? t("home.hero.title2France")
          : t("home.hero.title2")}
      </span>
    </>
  );

  const howItWorksSteps = t.raw("home.howItWorks.steps") as {
    title: string;
    desc: string;
  }[];

  const statsData = [
    { end: stats.total_avocats, label: t("home.stats.total") },
    {
      end: wilayas.length,
      label:
        country === "France"
          ? t("home.stats.regions")
          : t("home.stats.wilayas"),
    },
    { end: 6, label: t("home.stats.categories") },
    {
      end: stats.pourcentage_verification,
      label: t("home.stats.verification"),
      suffix: "%",
    },
  ];

  const goToWilaya = (wilaya: string) => {
    router.push(
      wilaya
        ? `/search?wilaya=${encodeURIComponent(wilaya)}${country === "France" ? "&pays=france" : ""}`
        : country === "France"
          ? "/search?pays=france"
          : "/search"
    );
  };

  useLayoutEffect(() => {
    getWilayas(undefined, country).then(setWilayas);
    Promise.all([
      getTopRatedAvocats(8, undefined, country),
      getStatistiques(country),
    ]).then(([top, st]) => {
      setTopAvocats(top);
      setStats(st);
    });
  }, [country]);

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const stagger = isMobile ? 0.07 : isTablet ? 0.09 : 0.1;
    const cardDur = isMobile ? 0.4 : 0.5;
    const trigStart = isMobile ? "top 92%" : "top 78%";

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ".prof-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: cardDur, stagger },
        "-=0.4"
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      );

    gsap.fromTo(
      ".prof-roles-link",
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, delay: 1.5, ease: "power2.out" }
    );

    [
      "map-section",
      "steps-section",
      "cta-section",
      "testimonials-section",
      "feedback-cta",
    ].forEach((cls) => {
      gsap.fromTo(
        `.${cls}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: `.${cls}`,
            start: trigStart,
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [country]);
  useLayoutEffect(() => {
    if (!topAvocats.length) return;
    const isMobile = window.innerWidth < 768;
    gsap.fromTo(
      ".avocat-card",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".avocats-section",
          start: isMobile ? "top 95%" : "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [topAvocats]);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none overflow-x-hidden">
      <style>{`
        .hero-title,.hero-sub,.prof-card,.stat-card,.map-section,.steps-section,.avocat-card,.cta-section,.prof-roles-link,.testimonials-section,.feedback-cta { opacity:0; }
        .prof-card-btn { transition:all 0.2s ease; }
        .prof-card-btn:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(13,148,136,0.15); border-color:#0D9488 !important; }
      `}</style>

      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-2xl sm:text-4xl lg:text-6xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-5 leading-tight tracking-tight">
            {heroTitle}
          </h1>
          <p className="hero-sub text-sm sm:text-lg text-slate-500 dark:text-[#A8A8A6] mb-10 sm:mb-14 max-w-xl mx-auto leading-relaxed">
            {t("home.hero.sub1")}
            <br />
            {t("home.hero.sub2")}
          </p>

          <div className="flex flex-col gap-3 max-w-sm mx-auto sm:hidden">
            {PROFESSIONS.map((p) => (
              <ProfCardHorizontal key={p.id} {...p} country={country} />
            ))}
          </div>

          <div className="hidden sm:flex lg:hidden flex-col gap-3 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-3">
              {PROFESSIONS.slice(0, 3).map((p) => (
                <ProfCard key={p.id} {...p} size="normal" country={country} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PROFESSIONS.slice(3, 6).map((p) => (
                <ProfCard key={p.id} {...p} size="normal" country={country} />
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-6 gap-4 max-w-6xl mx-auto">
            {PROFESSIONS.map((p) => (
              <ProfCard key={p.id} {...p} size="normal" country={country} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 pt-0">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/professions" className="prof-roles-link inline-block">
            <span className="text-xs font-medium text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] cursor-pointer transition-colors">
              {t("home.profLink")}
            </span>
          </Link>
        </div>
      </section>

      <section className="px-4 pb-14 sm:pb-20 pt-2">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statsData.map((s) => (
            <div
              key={s.label}
              className="stat-card bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-[#1c2220] p-4 md:p-6 flex flex-col items-center text-center"
            >
              <AnimatedCounter
                end={s.end}
                duration={2000}
                suffix={s.suffix}
                className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-[#6fcf9f] mb-2"
              />
              <div className="text-slate-600 dark:text-[#E8E8E6] text-xs sm:text-sm leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>
      {country !== "France" && (
        <section className="map-section px-4 pb-14 sm:pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
                {t("home.map.title")}
              </h2>
              <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
                {t("home.map.subtitle")}
              </p>
            </div>
            <AlgeriaMap
              selectedWilaya=""
              onSelect={() => {}}
              readOnly
              activeWilayas={wilayas}
            />
          </div>
        </section>
      )}
      {country === "France" && (
        <section className="map-section px-4 pb-14 sm:pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
                {t("home.map.title")}
              </h2>
              <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
                {t("home.map.subtitleFrance")}.
              </p>
            </div>
            <FranceMap
              selectedRegion=""
              onSelect={() => {}}
              readOnly
              activeRegions={wilayas}
            />
          </div>
        </section>
      )}

      <section className="steps-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm dark:shadow-none p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-6 md:mb-10 text-center">
              {t("home.howItWorks.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {howItWorksSteps.map((s, i) => (
                <div
                  key={s.title}
                  className={`flex gap-4 ${i < 2 ? "md:border-e md:border-slate-100 dark:border-[#1c2220] md:pe-10 pb-6 md:pb-0 border-b md:border-b-0 border-slate-100 dark:border-[#1c2220]" : ""}`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-[#6fcf9f] flex-shrink-0 mt-0.5">
                    {ld(String(i + 1))}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-[#F5F5F4] mb-1.5">
                      {s.title}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="testimonials-section">
        <TestimonialsSection />
      </div>

      {topAvocats.length > 0 && (
        <section className="avocats-section pb-16 sm:pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
                {t("home.topRated.title")}
              </h2>
              <p className="text-slate-500 dark:text-[#A8A8A6] text-sm sm:text-base">
                {t("home.topRated.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {topAvocats.map((a) => (
                <div key={a.id} className="avocat-card">
                  <AvocatCard avocat={a} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() =>
                  router.push(
                    country === "France" ? "/search?pays=france" : "/search"
                  )
                }
                className="text-teal-600 dark:text-[#6fcf9f] inline-flex items-center gap-1.5 hover:text-teal-700 dark:hover:text-[#6fcf9f] cursor-pointer text-sm font-medium"
              >
                {t("home.topRated.seeAll")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="feedback-cta px-4 py-10 sm:py-12">
        <style>{`
          .dark .fb-avatar-0 { background: rgba(111, 207, 159, 0.18) !important; color: #6fcf9f !important; }
          .dark .fb-avatar-1 { background: #26492f !important; color: #9FE1CB !important; }
          .dark .fb-avatar-2 { background: #0F6E56 !important; color: #E1F5EE !important; }
        `}</style>
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#04342C] dark:bg-[#1c1c1e] rounded-2xl px-6 py-7 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex flex-shrink-0">
                {[
                  ["HB", "#1D9E75", "#E1F5EE"],
                  ["FA", "#5DCAA5", "#085041"],
                  ["AA", "#0F6E56", "#9FE1CB"],
                ].map(([init, bg, color], i) => (
                  <div
                    key={init}
                    className={`fb-avatar-${i} w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] border-[#04342C] dark:border-[#1c1c1e] flex items-center justify-center text-[13px] font-medium flex-shrink-0`}
                    style={{
                      background: bg,
                      color,
                      marginLeft: i > 0 ? "-12px" : "0",
                      zIndex: 3 - i,
                      position: "relative",
                    }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div className="sm:hidden">
                <p className="text-[15px] font-medium text-[#E1F5EE] dark:text-[#F5F5F4] leading-tight mb-0.5">
                  {t("home.feedbackCta.title")}
                </p>
                <p className="text-[12px] text-[#5DCAA5] dark:text-[#6fcf9f]">
                  {t("home.feedbackCta.subtitleShort")}
                </p>
              </div>
            </div>

            <div className="hidden sm:block flex-1">
              <p className="text-[17px] font-medium text-[#E1F5EE] dark:text-[#F5F5F4] mb-1">
                {t("home.feedbackCta.title")}
              </p>
              <p className="text-[13px] text-[#5DCAA5] dark:text-[#6fcf9f]">
                {t("home.feedbackCta.subtitleLong")}
              </p>
            </div>

            <Link href="/feedback" className="flex-shrink-0">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#1c1c1e] border border-teal-200 dark:border-[#6fcf9f]/20 text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] hover:border-teal-400 dark:hover:border-[#6fcf9f] text-sm font-semibold px-6 py-3 rounded-xl cursor-pointer transition-all">
                {t("home.feedbackCta.action")}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm dark:shadow-none p-7 sm:p-10 flex flex-col text-center sm:text-start">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
              {t("home.ctaClient.title")}
            </h3>
            <p className="text-slate-500 dark:text-[#A8A8A6] leading-relaxed mb-8 text-sm sm:text-base">
              {t("home.ctaClient.desc")}
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <button
                onClick={() =>
                  router.push(
                    country === "France" ? "/search?pays=france" : "/search"
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] hover:border-teal-400 dark:hover:border-[#6fcf9f] font-semibold rounded-xl cursor-pointer transition-all text-sm"
              >
                {t("home.ctaClient.action")}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-teal-600 dark:bg-[#0F6E56] rounded-2xl p-7 sm:p-10 flex flex-col text-center sm:text-start">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {t("home.ctaLawyer.title")}
            </h3>
            <p className="text-teal-100 dark:text-[#9FE1CB] leading-relaxed mb-8 text-sm sm:text-base">
              {t("home.ctaLawyer.desc")}
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <Link href="/auth/lawyer/register">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1c1c1e] border border-teal-200 dark:border-[#6fcf9f]/20 text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] hover:border-teal-400 dark:hover:border-[#6fcf9f] font-semibold rounded-xl cursor-pointer transition-all text-sm">
                  {t("home.ctaLawyer.action")}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
