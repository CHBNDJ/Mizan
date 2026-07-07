// "use client";
// import { useEffect, useRef } from "react";
// import { notFound, useRouter, useParams } from "next/navigation";
// import { Link } from "@/i18n/navigation";
// import { useTranslations, useLocale } from "next-intl";
// import {
//   ArrowLeft,
//   CheckCircle,
//   ChevronRight,
//   Scale,
//   FileText,
//   Briefcase,
//   Calculator,
//   TrendingUp,
// } from "lucide-react";
// import { PROFESSIONS_LIST, ProfessionSlug } from "@/lib/professionsData";
// import { localizedDigits } from "@/lib/arabicNumerals";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

// const PROF_ICONS: Record<string, any> = {
//   avocat: Scale,
//   notaire: FileText,
//   huissier: Briefcase,
//   comptable: Calculator,
//   "expert-comptable": TrendingUp,
// };

// const PROF_KEY: Record<ProfessionSlug, string> = {
//   avocat: "avocat",
//   notaire: "notaire",
//   huissier: "huissier",
//   comptable: "comptable",
//   "expert-comptable": "expertComptable",
// };

// interface ProfessionDataShape {
//   label: string;
//   tagline: string;
//   cadreJuridique: string;
//   missions: { emoji: string; title: string; desc: string }[];
//   quandFaireAppel: { situation: string; detail: string }[];
//   differences: { avec: string; distinction: string }[];
// }

// export default function ProfessionPage() {
//   const params = useParams();
//   const router = useRouter();
//   const t = useTranslations();
//   const locale = useLocale();
//   const ld = (s: string) => localizedDigits(s, locale);
//   const slug = (params?.slug as ProfessionSlug) || "avocat";

//   if (!PROF_KEY[slug]) notFound();
//   const profKey = PROF_KEY[slug];

//   const data: ProfessionDataShape = {
//     label: t(`professionsData.${profKey}.label`),
//     tagline: t(`professionsData.${profKey}.tagline`),
//     cadreJuridique: t(`professionsData.${profKey}.cadreJuridique`),
//     missions: t.raw(`professionsData.${profKey}.missions`),
//     quandFaireAppel: t.raw(`professionsData.${profKey}.quandFaireAppel`),
//     differences: t.raw(`professionsData.${profKey}.differences`),
//   };

//   const Icon = PROF_ICONS[slug] || Scale;
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     gsap.fromTo(
//       ".pf-hero",
//       { opacity: 0, y: 24 },
//       { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
//     );
//     gsap.fromTo(
//       ".pf-section",
//       { opacity: 0, y: 20 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         stagger: 0.08,
//         ease: "power3.out",
//         delay: 0.3,
//       }
//     );
//     gsap.fromTo(
//       ".pf-cta",
//       { opacity: 0, y: 24 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.6,
//         scrollTrigger: {
//           trigger: ".pf-cta",
//           start: "top 88%",
//           toggleActions: "play none none none",
//         },
//       }
//     );
//     return () => ScrollTrigger.getAll().forEach((t) => t.kill());
//   }, []);

//   const otherProfs = PROFESSIONS_LIST.filter((p) => p !== slug);

//   return (
//     <div
//       className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none"
//       ref={ref}
//     >
//       <style>{`.pf-hero,.pf-section,.pf-cta{opacity:0;}`}</style>
//       <div className="max-w-3xl mx-auto px-4 py-10">
//         <button
//           onClick={() => router.back()}
//           className="inline-flex items-center gap-1.5 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] mb-8 text-sm font-medium cursor-pointer transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </button>

//         <div className="pf-hero bg-teal-600 rounded-2xl p-7 sm:p-8 mb-6 text-white">
//           <div className="flex items-start gap-4 mb-5">
//             <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//               <Icon className="w-7 h-7 text-white" />
//             </div>
//             <div>
//               <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">
//                 {t("professionDetailPage.regulatedTag")}
//               </p>
//               <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
//                 {data.label}
//               </h1>
//               <p className="text-teal-100 text-sm mt-1.5 leading-snug">
//                 {data.tagline}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 mt-4">
//             {data.missions.slice(0, 4).map((m, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full"
//               >
//                 <span className="text-xs">{m.emoji}</span>
//                 <span className="text-xs font-medium text-white">
//                   {m.title}
//                 </span>
//               </div>
//             ))}
//             {data.missions.length > 4 && (
//               <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
//                 <span className="text-xs text-teal-100">
//                   {t("professionDetailPage.othersBadge", {
//                     n: ld(String(data.missions.length - 4)),
//                   })}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-4 shadow-sm">
//           <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-3 flex items-center gap-2">
//             <span className="w-6 h-6 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-lg flex items-center justify-center text-xs">
//               ⚖️
//             </span>
//             {t("professionDetailPage.legalFrameworkTitle")}
//           </h2>
//           <p className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed">
//             {data.cadreJuridique}
//           </p>
//         </div>

//         <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-4 shadow-sm">
//           <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-5">
//             {t("professionDetailPage.missionsTitle")}
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {data.missions.map((m, i) => (
//               <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
//                 <span className="text-lg flex-shrink-0">{m.emoji}</span>
//                 <div>
//                   <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F5F4] mb-1">
//                     {m.title}
//                   </p>
//                   <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
//                     {m.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="pf-section bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-2xl p-6 mb-4">
//           <h2 className="text-sm font-bold text-teal-900 mb-4">
//             {t("professionDetailPage.whenToCallTitle", {
//               label: data.label.toLowerCase(),
//             })}
//           </h2>
//           <div className="space-y-3">
//             {data.quandFaireAppel.map((q, i) => (
//               <div
//                 key={i}
//                 className="flex gap-3 bg-white rounded-xl p-4 shadow-sm"
//               >
//                 <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F5F4] mb-0.5">
//                     {q.situation}
//                   </p>
//                   <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
//                     {q.detail}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-7 shadow-sm">
//           <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-4">
//             {t("professionDetailPage.vsOthersTitle", { label: data.label })}
//           </h2>
//           <div className="space-y-3">
//             {data.differences.map((d, i) => (
//               <div
//                 key={i}
//                 className="p-4 bg-slate-50 border-s-4 border-teal-400 rounded-e-xl"
//               >
//                 <p className="text-xs font-bold text-teal-700 dark:text-[#6fcf9f] uppercase tracking-wide mb-1">
//                   {t("professionDetailPage.vsLabel", {
//                     label: data.label,
//                     avec: d.avec,
//                   })}
//                 </p>
//                 <p className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed">
//                   {d.distinction}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="pf-cta bg-teal-600 rounded-2xl p-7 text-center mb-8">
//           <h2 className="text-lg font-bold text-white mb-2">
//             {t("professionDetailPage.ctaTitle", {
//               label: data.label.toLowerCase(),
//             })}
//           </h2>
//           <p className="text-teal-100 text-sm mb-5">
//             {t("professionDetailPage.ctaDesc")}
//           </p>
//           <Link href={`/${slug}`}>
//             <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-600 dark:text-[#6fcf9f] font-semibold text-sm rounded-xl cursor-pointer transition-all">
//               {t("professionDetailPage.ctaAction", {
//                 label: data.label.toLowerCase(),
//               })}{" "}
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </Link>
//         </div>

//         <div className="pf-section">
//           <p className="text-xs font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-3">
//             {t("professionDetailPage.otherProfessions")}
//           </p>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {otherProfs.map((p) => {
//               const otherKey = PROF_KEY[p];
//               const otherLabel = t(`professionsData.${otherKey}.label`);
//               const OtherIcon = PROF_ICONS[p];
//               return (
//                 <Link key={p} href={`/professions/${p}`}>
//                   <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] hover:border-teal-200 dark:border-[#6fcf9f]/20 rounded-xl p-3 text-center cursor-pointer transition-all hover:shadow-sm">
//                     <div className="w-9 h-9 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
//                       <OtherIcon className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
//                     </div>
//                     <p className="text-xs font-semibold text-slate-700">
//                       {otherLabel}
//                     </p>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useRef } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  Languages,
} from "lucide-react";
import { PROFESSIONS_LIST, ProfessionSlug } from "@/lib/professionsData";
import { localizedDigits } from "@/lib/arabicNumerals";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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

interface ProfessionDataShape {
  label: string;
  tagline: string;
  cadreJuridique: string;
  missions: { emoji: string; title: string; desc: string }[];
  quandFaireAppel: { situation: string; detail: string }[];
  differences: { avec: string; distinction: string }[];
}

export default function ProfessionPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const slug = (params?.slug as ProfessionSlug) || "avocat";

  if (!PROF_KEY[slug]) notFound();
  const profKey = PROF_KEY[slug];

  const data: ProfessionDataShape = {
    label: t(`professionsData.${profKey}.label`),
    tagline: t(`professionsData.${profKey}.tagline`),
    cadreJuridique: t(`professionsData.${profKey}.cadreJuridique`),
    missions: t.raw(`professionsData.${profKey}.missions`),
    quandFaireAppel: t.raw(`professionsData.${profKey}.quandFaireAppel`),
    differences: t.raw(`professionsData.${profKey}.differences`),
  };

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
    <div
      className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none"
      ref={ref}
    >
      <style>{`.pf-hero,.pf-section,.pf-cta{opacity:0;}`}</style>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] mb-8 text-sm font-medium cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="pf-hero bg-teal-600 rounded-2xl p-7 sm:p-8 mb-6 text-white">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">
                {t("professionDetailPage.regulatedTag")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {data.label}
              </h1>
              <p className="text-teal-100 text-sm mt-1.5 leading-snug">
                {data.tagline}
              </p>
            </div>
          </div>

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
                  {t("professionDetailPage.othersBadge", {
                    n: ld(String(data.missions.length - 4)),
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-lg flex items-center justify-center text-xs">
              ⚖️
            </span>
            {t("professionDetailPage.legalFrameworkTitle")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed">
            {data.cadreJuridique}
          </p>
        </div>

        <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-5">
            {t("professionDetailPage.missionsTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.missions.map((m, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 bg-slate-50 dark:bg-[#141415] rounded-xl"
              >
                <span className="text-lg flex-shrink-0">{m.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F5F4] mb-1">
                    {m.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-section bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-bold text-teal-900 dark:text-[#6fcf9f] mb-4">
            {t("professionDetailPage.whenToCallTitle", {
              label: data.label.toLowerCase(),
            })}
          </h2>
          <div className="space-y-3">
            {data.quandFaireAppel.map((q, i) => (
              <div
                key={i}
                className="flex gap-3 bg-white dark:bg-[#1c1c1e] rounded-xl p-4 shadow-sm dark:shadow-none"
              >
                <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F5F4] mb-0.5">
                    {q.situation}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                    {q.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-section bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-6 mb-7 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-4">
            {t("professionDetailPage.vsOthersTitle", { label: data.label })}
          </h2>
          <div className="space-y-3">
            {data.differences.map((d, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 dark:bg-[#141415] border-s-4 border-teal-400 rounded-e-xl"
              >
                <p className="text-xs font-bold text-teal-700 dark:text-[#6fcf9f] uppercase tracking-wide mb-1">
                  {t("professionDetailPage.vsLabel", {
                    label: data.label,
                    avec: d.avec,
                  })}
                </p>
                <p className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed">
                  {d.distinction}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-cta bg-teal-600 rounded-2xl p-7 text-center mb-8">
          <h2 className="text-lg font-bold text-white mb-2">
            {t("professionDetailPage.ctaTitle", {
              label: data.label.toLowerCase(),
            })}
          </h2>
          <p className="text-teal-100 text-sm mb-5">
            {t("professionDetailPage.ctaDesc")}
          </p>
          <Link href={`/${slug}`}>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-600 dark:text-[#6fcf9f] font-semibold text-sm rounded-xl cursor-pointer transition-all">
              {t("professionDetailPage.ctaAction", {
                label: data.label.toLowerCase(),
              })}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="pf-section">
          <p className="text-xs font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-3">
            {t("professionDetailPage.otherProfessions")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherProfs.map((p) => {
              const otherKey = PROF_KEY[p];
              const otherLabel = t(`professionsData.${otherKey}.label`);
              const OtherIcon = PROF_ICONS[p];
              return (
                <Link key={p} href={`/professions/${p}`}>
                  <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] hover:border-teal-200 dark:border-[#6fcf9f]/20 rounded-xl p-3 text-center cursor-pointer transition-all hover:shadow-sm">
                    <div className="w-9 h-9 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <OtherIcon className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {otherLabel}
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
