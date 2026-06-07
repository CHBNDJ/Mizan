// "use client";
// import { useState, useLayoutEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Search, ArrowRight, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { CustomSelect } from "@/components/ui/CustomSelect";
// import { AvocatCard } from "@/components/cards/AvocatCard";
// import { AnimatedCounter } from "@/components/AnimatedCounter";
// import {
//   getTopRatedAvocats,
//   getSpecialites,
//   getWilayas,
//   getStatistiques,
// } from "@/lib/avocatsData";
// import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function HomePage() {
//   const router = useRouter();

//   const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([]);
//   const [selectedWilaya, setSelectedWilaya] = useState("");
//   const [topAvocats, setTopAvocats] = useState<any[]>([]);
//   const [wilayas, setWilayas] = useState<string[]>([]);
//   const [stats, setStats] = useState<any>({
//     total_avocats: 0,
//     pourcentage_verification: 100,
//   });
//   const [loading, setLoading] = useState(true);
//   const [loadingWilayas, setLoadingWilayas] = useState(true);

//   const specialites = getSpecialites();

//   useLayoutEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setLoadingWilayas(true);

//         getWilayas().then((data) => {
//           setWilayas(data);
//           setLoadingWilayas(false);
//         });

//         const [topAvocatsData, statsData] = await Promise.all([
//           getTopRatedAvocats(8),
//           getStatistiques(),
//         ]);
//         setTopAvocats(topAvocatsData);
//         setStats(statsData);
//       } catch (error) {
//         console.error("Erreur chargement données:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   useLayoutEffect(() => {
//     const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });
//     heroTL
//       .fromTo(
//         ".hero-title",
//         { opacity: 0, x: -50 },
//         { opacity: 1, x: 0, duration: 0.8 }
//       )
//       .fromTo(
//         ".hero-sub",
//         { opacity: 0, x: -50 },
//         { opacity: 1, x: 0, duration: 0.8 },
//         "-=0.5"
//       )
//       .fromTo(
//         ".hero-form",
//         { opacity: 0, x: -50 },
//         { opacity: 1, x: 0, duration: 0.8 },
//         "-=0.5"
//       )
//       .fromTo(
//         ".hero-stats",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
//         "-=0.3"
//       );

//     gsap.fromTo(
//       ".steps-section",
//       { opacity: 0, y: 30 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.7,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: ".steps-section",
//           start: "top 85%",
//           toggleActions: "play none none none",
//         },
//       }
//     );

//     gsap.fromTo(
//       ".cta-cards",
//       { opacity: 0, y: 30 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.7,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: ".cta-cards",
//           start: "top 85%",
//           toggleActions: "play none none none",
//         },
//       }
//     );

//     return () => ScrollTrigger.getAll().forEach((t) => t.kill());
//   }, []);

//   useLayoutEffect(() => {
//     if (topAvocats.length === 0 && wilayas.length === 0) return;

//     gsap.fromTo(
//       ".avocats-title",
//       { opacity: 0, x: -50 },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: ".avocats-section",
//           start: "top 80%",
//           toggleActions: "play none none none",
//         },
//       }
//     );

//     gsap.fromTo(
//       ".avocat-card",
//       { opacity: 0, x: -30 },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 1,
//         stagger: 0.08,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".avocats-section",
//           start: "top 60%",
//           toggleActions: "play none none none",
//         },
//       }
//     );

//     gsap.fromTo(
//       ".avocats-btn",
//       { opacity: 0, y: 30 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: ".avocats-btn",
//           start: "top 90%",
//           toggleActions: "play none none none",
//         },
//       }
//     );
//   }, [topAvocats, wilayas]);

//   const specialiteOptions = specialites.map((s) => ({ value: s, label: s }));
//   const wilayaOptions = wilayas.map((w) => ({ value: w, label: w }));

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (selectedSpecialites.length > 0) {
//       selectedSpecialites.forEach((spec) => params.append("specialite", spec));
//     }
//     if (selectedWilaya) params.set("wilaya", selectedWilaya);
//     const qs = params.toString();
//     router.push(qs ? `/search?${qs}` : "/search");
//   };

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
//       <style>{`
//         .hero-title, .hero-sub, .hero-form, .hero-stats,
//         .steps-section, .avocats-title, .avocat-card,
//         .avocats-btn, .cta-cards { opacity: 0; }
//       `}</style>

//       <section className="relative z-10 py-16 px-4 overflow-visible">
//         <div className="max-w-3xl mx-auto text-center">
//           <h1 className="hero-title text-3xl sm:text-5xl font-bold text-slate-800 mb-6 leading-tight">
//             Besoin d'un avocat en Algérie ?
//           </h1>
//           <p className="hero-sub text-base sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
//             Trouvez l'avocat qui vous convient selon votre besoin juridique et
//             votre localisation.{" "}
//             <strong className="font-bold text-teal-600">
//               Que vous soyez en Algérie ou à l'étranger
//             </strong>
//             , avec Mizan, c'est simple, rapide et sécurisé.
//           </p>

//           <div className="hero-form bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto relative z-[200]">
//             <form onSubmit={handleSearch} className="space-y-4">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex-1 relative z-30">
//                   <MultiSelectWithCheckboxes
//                     placeholder="Choisir les spécialités..."
//                     options={specialiteOptions}
//                     value={selectedSpecialites}
//                     onChange={setSelectedSpecialites}
//                     className="h-12"
//                   />
//                 </div>
//                 <div className="lg:w-56 relative z-20">
//                   {loadingWilayas ? (
//                     <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
//                   ) : (
//                     <CustomSelect
//                       placeholder="Choisir une wilaya"
//                       options={wilayaOptions}
//                       value={selectedWilaya}
//                       onChange={setSelectedWilaya}
//                       className="h-12"
//                       size="large"
//                     />
//                   )}
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full h-12 px-8 bg-teal-600 hover:bg-teal-700 md:text-lg font-semibold whitespace-nowrap"
//                 disabled={loading}
//               >
//                 <Search className="w-5 h-5 mr-2" />
//                 Rechercher des avocats
//               </Button>
//             </form>
//           </div>
//         </div>
//       </section>

//       <section className="relative z-0 px-4 pb-16">
//         <div className="max-w-3xl mx-auto">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
//               <AnimatedCounter
//                 end={stats.total_avocats}
//                 duration={2000}
//                 className="text-3xl font-bold text-teal-600 mb-2"
//               />
//               <div className="text-slate-600 font-medium text-sm">
//                 Avocats inscrits
//               </div>
//             </div>
//             <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
//               <AnimatedCounter
//                 end={wilayas.length}
//                 duration={2000}
//                 className="text-3xl font-bold text-teal-600 mb-2"
//               />
//               <div className="text-slate-600 font-medium text-sm">
//                 Wilayas couvertes
//               </div>
//             </div>
//             <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
//               <AnimatedCounter
//                 end={specialites.length}
//                 duration={2000}
//                 className="text-3xl font-bold text-teal-600 mb-2"
//               />
//               <div className="text-slate-600 font-medium text-sm">
//                 Spécialités juridiques
//               </div>
//             </div>
//             <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
//               <AnimatedCounter
//                 end={stats.pourcentage_verification}
//                 duration={2000}
//                 suffix="%"
//                 className="text-3xl font-bold text-teal-600 mb-2"
//               />
//               <div className="text-slate-600 font-medium text-sm">
//                 Taux de vérification
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="steps-section py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm p-8">
//             <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">
//               Comment ça marche
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//               {[
//                 {
//                   n: "1",
//                   title: "Cherchez",
//                   desc: "Filtrez par spécialité et wilaya pour trouver le profil qui correspond à votre situation.",
//                 },
//                 {
//                   n: "2",
//                   title: "Comparez",
//                   desc: "Consultez les avis, les spécialités et l'expérience de chaque avocat.",
//                 },
//                 {
//                   n: "3",
//                   title: "Contactez",
//                   desc: "Envoyez une demande de consultation directement depuis le profil de l'avocat.",
//                 },
//               ].map((step) => (
//                 <div key={step.n} className="flex gap-4">
//                   <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0 mt-0.5">
//                     {step.n}
//                   </div>
//                   <div>
//                     <div className="text-sm font-semibold text-slate-800 mb-1">
//                       {step.title}
//                     </div>
//                     <div className="text-sm text-slate-500 leading-relaxed">
//                       {step.desc}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {topAvocats.length > 0 && (
//         <section className="avocats-section pb-16 px-4">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-10">
//               <h2 className="avocats-title text-3xl font-bold text-slate-800 mb-3">
//                 Avocats les mieux notés
//               </h2>
//               <p className="text-lg text-slate-600">
//                 Découvrez les avocats recommandés par notre communauté
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
//               {topAvocats.map((avocat) => (
//                 <div key={avocat.id} className="avocat-card">
//                   <AvocatCard avocat={avocat} />
//                 </div>
//               ))}
//             </div>

//             <div className="text-center avocats-btn">
//               <button
//                 className="text-teal-600 cursor-pointer items-center justify-center inline-flex hover:text-teal-700 transition-colors"
//                 onClick={() => router.push("/search")}
//               >
//                 Voir tous les avocats
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </button>
//             </div>
//           </div>
//         </section>
//       )}

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="cta-cards grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col justify-between">
//               <div>
//                 <h3 className="text-xl font-bold text-slate-800 mb-3">
//                   Vous cherchez un avocat ?
//                 </h3>
//                 <p className="text-slate-500 leading-relaxed mb-6">
//                   Que vous soyez en Algérie ou à l'étranger, parcourez les
//                   profils d'avocats vérifiés, comparez leurs spécialités et
//                   contactez-les directement.
//                 </p>
//               </div>
//               <button
//                 onClick={() => router.push("/search")}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all cursor-pointer w-fit"
//               >
//                 Trouver un avocat
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="bg-teal-600 rounded-2xl p-8 flex flex-col justify-between">
//               <div>
//                 <h3 className="text-xl font-bold text-white mb-3">
//                   Vous êtes avocat ?
//                 </h3>
//                 <p className="text-teal-100 leading-relaxed mb-6">
//                   Rejoignez notre plateforme, créez votre profil et soyez
//                   visible par des clients de toute l'Algérie et de la diaspora.
//                   Inscription gratuite.
//                 </p>
//               </div>
//               <Link href="/auth/lawyer/register">
//                 <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer w-fit">
//                   S'inscrire sur Mizan
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Scale,
  FileText,
  Briefcase,
  Calculator,
} from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  getTopRatedAvocats,
  getWilayas,
  getStatistiques,
} from "@/lib/avocatsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROFESSIONS = [
  {
    id: "avocat",
    label: "Avocat",
    Icon: Scale,
    desc: "Droit civil, pénal, famille, affaires...",
  },
  {
    id: "notaire",
    label: "Notaire",
    Icon: FileText,
    desc: "Successions, immobilier, mariages...",
  },
  {
    id: "huissier",
    label: "Huissier",
    Icon: Briefcase,
    desc: "Constats, exécutions, recouvrements...",
  },
  {
    id: "comptable",
    label: "Comptable",
    Icon: Calculator,
    desc: "Bilans, fiscalité, création société...",
  },
];

const HERO_TITLE = (
  <>
    L'expertise juridique
    <br className="hidden sm:block" />{" "}
    <span className="text-teal-600">algérienne à portée de clic</span>
  </>
);
const HERO_SUB =
  "Des professionnels vérifiés dans toutes les wilayas. Consultez les avis, comparez, contactez directement.";

export default function HomePage() {
  const router = useRouter();
  const [topAvocats, setTopAvocats] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({
    total_avocats: 0,
    pourcentage_verification: 100,
  });

  useLayoutEffect(() => {
    getWilayas().then(setWilayas);
    Promise.all([getTopRatedAvocats(8), getStatistiques()]).then(
      ([top, st]) => {
        setTopAvocats(top);
        setStats(st);
      }
    );
  }, []);

  useLayoutEffect(() => {
    gsap.set([".hero-title", ".hero-sub", ".prof-card", ".stat-card"], {
      autoAlpha: 0,
      y: 20,
    });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-title", { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
      .to(
        ".prof-card",
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      )
      .to(
        ".stat-card",
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      );

    gsap.fromTo(
      ".steps-section",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 90%",
          once: true,
        },
      }
    );
    gsap.fromTo(
      ".cta-section",
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 90%",
          once: true,
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useLayoutEffect(() => {
    if (!topAvocats.length) return;
    gsap.fromTo(
      ".avocat-card",
      { autoAlpha: 0, x: -20 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".avocats-section",
          start: "top 90%",
          once: true,
        },
      }
    );
  }, [topAvocats]);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden">
      <style>{`
        .prof-card-btn { transition:all 0.2s ease; }
        .prof-card-btn:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(13,148,136,0.15); border-color:#0D9488 !important; }
      `}</style>

      {/* ── Hero ── */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-2xl sm:text-4xl lg:text-6xl font-bold text-slate-800 mb-5 leading-tight tracking-tight">
            {HERO_TITLE}
          </h1>
          <p className="hero-sub text-sm sm:text-lg text-slate-500 mb-10 sm:mb-14 max-w-xl mx-auto leading-relaxed">
            {HERO_SUB}
          </p>

          {/* 4 cards — 2 colonnes mobile, 4 desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {PROFESSIONS.map(({ id, label, Icon, desc }) => (
              <Link key={id} href={`/${id}`}>
                <div className="prof-card prof-card-btn bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 cursor-pointer text-center h-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm sm:text-base">
                      {label}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed hidden sm:block">
                      {desc}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 mt-auto">
                    Rechercher <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[
            { end: stats.total_avocats, label: "Professionnels inscrits" },
            { end: wilayas.length, label: "Wilayas couvertes" },
            { end: 4, label: "Catégories d'experts" },
            {
              end: stats.pourcentage_verification,
              label: "Taux de vérification",
              suffix: "%",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-7 flex flex-col items-center text-center"
            >
              <AnimatedCounter
                end={s.end}
                duration={2000}
                suffix={s.suffix}
                className="text-3xl sm:text-4xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 font-medium text-xs sm:text-sm leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="steps-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 sm:mb-10 text-center">
              Comment ça marche
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
              {[
                {
                  n: "1",
                  title: "Choisissez votre expert",
                  desc: "Sélectionnez la catégorie adaptée — avocat, notaire, huissier ou comptable.",
                },
                {
                  n: "2",
                  title: "Filtrez par wilaya",
                  desc: "Choisissez votre wilaya sur la carte interactive ou via le sélecteur.",
                },
                {
                  n: "3",
                  title: "Contactez directement",
                  desc: "Messagerie sécurisée. Accessible depuis l'Algérie ou l'étranger. Inscription gratuite.",
                },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className={`flex gap-4 ${i < 2 ? "sm:border-r sm:border-slate-100 sm:pr-8" : ""}`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-slate-800 mb-1.5">
                      {s.title}
                    </div>
                    <div className="text-sm text-slate-500 leading-relaxed">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Top professionnels ── */}
      {topAvocats.length > 0 && (
        <section className="avocats-section pb-16 sm:pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                Les mieux notés
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Recommandés par notre communauté · Vérifiés par Mizan
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
                onClick={() => router.push("/search")}
                className="text-teal-600 inline-flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer text-sm font-medium"
              >
                Voir tous les professionnels <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA double — responsive centré ── */}
      <section className="cta-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-7 sm:p-10 flex flex-col text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
              Vous cherchez un expert juridique ?
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8 text-sm sm:text-base">
              Parcourez les profils vérifiés d'avocats, notaires, huissiers et
              comptables. Consultez les avis et contactez directement depuis
              n'importe où.
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <button
                onClick={() => router.push("/search")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Trouver un expert <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-teal-600 rounded-2xl p-7 sm:p-10 flex flex-col text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Vous êtes professionnel du droit ?
            </h3>
            <p className="text-teal-100 leading-relaxed mb-8 text-sm sm:text-base">
              Avocat, notaire, huissier ou comptable — rejoignez Mizan et soyez
              visible par des clients de toute l'Algérie et de la diaspora.
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <Link href="/auth/lawyer/register">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer">
                  Créer mon profil <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
