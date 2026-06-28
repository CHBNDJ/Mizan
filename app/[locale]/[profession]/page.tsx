"use client";
import React from "react";
import { useState, useLayoutEffect, useEffect } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronRight,
  ArrowLeft,
  Scale,
  FileText,
  Briefcase,
  Calculator,
} from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AlgeriaMap } from "@/components/AlgeriaMap";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import {
  getWilayas,
  getTopRatedAvocats,
  DOMAINES_PAR_PROFESSION,
} from "@/lib/avocatsData";
import { getWilayaLabel, getSpecialiteLabel } from "@/lib/i18nLabels";
import { localizedDigits } from "@/lib/arabicNumerals";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
gsap.registerPlugin(ScrollTrigger);

type ProfId =
  | "avocat"
  | "notaire"
  | "huissier"
  | "comptable"
  | "expert-comptable";

const PROF_ICONS: Record<ProfId, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
  "expert-comptable": Calculator,
};

const PROF_KEY: Record<ProfId, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
};

function TopProsSection({
  topPros,
  plural,
  handleSearch,
  t,
}: {
  topPros: any[];
  plural: string;
  handleSearch: () => void;
  t: any;
}) {
  useLayoutEffect(() => {
    if (!topPros.length) return;
    const els = document.querySelectorAll(".pro-card-anim");
    if (!els.length) return;
    gsap.fromTo(
      els,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);
  return (
    <section className="ph-pros-section pb-14 sm:pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("professionLanding.topRatedTitle", {
              plural: plural.charAt(0).toUpperCase() + plural.slice(1),
            })}
          </h2>
          <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
            {t("professionLanding.topRatedSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {topPros.map((pro) => (
            <div key={pro.id} className="pro-card-anim" style={{ opacity: 0 }}>
              <AvocatCard avocat={pro} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:text-[#6fcf9f] font-medium cursor-pointer text-sm"
          >
            {t("professionLanding.seeAllPlural", { plural })}{" "}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProfessionContent({ profId }: { profId: ProfId }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const profKey = PROF_KEY[profId];
  const ProfIcon = PROF_ICONS[profId] || Scale;

  const label = t(`professions.${profKey}.label`);
  const labelPlural = t(`professions.${profKey}.plural`);
  const prof = {
    domainLabel: t(`professionLanding.professions.${profKey}.domainLabel`),
    hero: t(`professionLanding.professions.${profKey}.hero`),
    sub: t(`professionLanding.professions.${profKey}.sub`),
    searchLabel: t(`professionLanding.professions.${profKey}.searchLabel`),
    steps: t.raw(`professionLanding.professions.${profKey}.steps`) as {
      title: string;
      desc: string;
    }[],
  };

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState<string[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [topPros, setTopPros] = useState<any[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(true);

  const domaineOptions = (DOMAINES_PAR_PROFESSION[profId] || []).map((d) => ({
    value: d,
    label: getSpecialiteLabel(d, t),
  }));
  const wilayaOptions = React.useMemo(() => {
    const opts = wilayas.map((w) => ({
      value: w,
      label: getWilayaLabel(w, t),
    }));
    if (selectedWilaya && !opts.find((o) => o.value === selectedWilaya))
      opts.unshift({
        value: selectedWilaya,
        label: getWilayaLabel(selectedWilaya, t),
      });
    return opts;
  }, [wilayas, selectedWilaya, locale]);

  useEffect(() => {
    getWilayas().then((w) => {
      setWilayas(w);
      setLoadingWilayas(false);
    });
    getTopRatedAvocats(6, profId).then(setTopPros);
    setSelectedWilaya("");
    setSelectedDomaines([]);
  }, [profId]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".ph-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        ".ph-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ".ph-form",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        ".ph-map",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7 },
        "-=0.3"
      )
      .fromTo(
        ".ph-step",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [profId]);

  const handleSearch = () => {
    const p = new URLSearchParams();
    p.set("profession", profId);
    if (selectedWilaya) p.set("wilaya", selectedWilaya);
    selectedDomaines.forEach((d) => p.append("specialite", d));
    router.push(`/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-transparent">
      <style>{`.ph-title,.ph-sub,.ph-form,.ph-map,.ph-step { opacity:0; }`}</style>

      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <button className="inline-flex items-center gap-1.5 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:text-[#6fcf9f] text-sm font-medium mb-6 sm:mb-8 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h1 className="ph-title text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4 sm:mb-5 leading-tight text-center lg:text-start">
                {prof.hero}
              </h1>
              <p className="ph-sub text-sm sm:text-lg text-slate-600 dark:text-[#E8E8E6] mb-6 sm:mb-8 leading-relaxed text-center lg:text-start">
                {prof.sub}
              </p>
              <div
                className="ph-form bg-white dark:bg-[#0b1210] rounded-2xl shadow dark:shadow-none-md p-5 sm:p-6 space-y-4 relative"
                style={{ zIndex: 50 }}
              >
                <div className="relative" style={{ zIndex: 20 }}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-2">
                    {prof.domainLabel}
                  </label>
                  <MultiSelectWithCheckboxes
                    placeholder={
                      profId === "avocat"
                        ? t("professionLanding.specialitiesPlaceholder")
                        : t("professionLanding.domainsPlaceholder")
                    }
                    options={domaineOptions}
                    value={selectedDomaines}
                    onChange={setSelectedDomaines}
                    className="h-12"
                    placeholderClassName="text-slate-400 dark:text-[#7A7A78] font-medium text-sm"
                  />
                </div>
                <div className="relative" style={{ zIndex: 10 }}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-2">
                    {t("professionLanding.wilayaLabel")}
                  </label>
                  {loadingWilayas ? (
                    <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                  ) : (
                    <CustomSelect
                      placeholder={t("professionLanding.allWilayas")}
                      options={wilayaOptions}
                      value={selectedWilaya}
                      onChange={setSelectedWilaya}
                      className="h-12"
                    />
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer text-sm sm:text-base"
                >
                  {t("professionLanding.seeButton", { plural: labelPlural })}
                </button>
              </div>
              <div className="mt-8 space-y-4 relative" style={{ zIndex: 1 }}>
                {prof.steps.map((step, i) => (
                  <div key={i} className="ph-step flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-[#1F3D2E] border border-teal-200 dark:border-[#1F3D2E] flex items-center justify-center text-xs font-bold text-teal-700 dark:text-[#6fcf9f] flex-shrink-0 mt-0.5">
                      {ld(String(i + 1))}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] mb-0.5">
                        {step.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ph-map hidden lg:flex flex-col gap-3 sticky top-24">
              <AlgeriaMap
                selectedWilaya={selectedWilaya}
                onSelect={setSelectedWilaya}
                hideBar
              />
              <Link href={"/professions/" + profId}>
                <div className="bg-teal-50 dark:bg-[#1F3D2E] border border-teal-200 dark:border-[#1F3D2E] hover:border-teal-400 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm group">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ProfIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-teal-900 leading-snug">
                      {t("professionLanding.whyChoose", {
                        label: label.toLowerCase(),
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-teal-700 dark:text-[#6fcf9f] leading-relaxed mb-3">
                    {t("professionLanding.whyChooseDesc")}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] group-hover:text-teal-700 dark:text-[#6fcf9f]">
                    {t("professionLanding.learnMore")}{" "}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {topPros.length > 0 && (
        <TopProsSection
          topPros={topPros}
          plural={labelPlural}
          handleSearch={handleSearch}
          t={t}
        />
      )}

      <section className="py-12 px-4 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            {t("professionLanding.ctaTitle", { label: label.toLowerCase() })}
          </h2>
          <p className="text-teal-100 mb-6 leading-relaxed text-sm sm:text-base">
            {t("professionLanding.ctaDesc")}
          </p>
          <Link href="/auth/lawyer/register">
            <button className="inline-flex items-center gap-2 px-7 py-3 bg-white hover:bg-teal-50 dark:bg-[#1F3D2E] text-teal-600 dark:text-[#6fcf9f] font-semibold rounded-xl cursor-pointer shadow-sm text-sm sm:text-base">
              {t("professionLanding.ctaAction")}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function ProfessionLandingPage() {
  const params = useParams();
  const profId = params?.profession as ProfId;
  const validIds: ProfId[] = [
    "avocat",
    "notaire",
    "huissier",
    "comptable",
    "expert-comptable",
  ];

  if (!profId || !validIds.includes(profId)) {
    return notFound();
  }

  return <ProfessionContent profId={profId} />;
}
