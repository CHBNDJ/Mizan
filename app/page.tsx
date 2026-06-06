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
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  getTopRatedAvocats,
  getSpecialites,
  getWilayas,
  getStatistiques,
} from "@/lib/avocatsData";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROFESSIONS = [
  {
    id: "avocat",
    label: "Avocat",
    labelAr: "محامي",
    icon: "⚖️",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    hover: "hover:border-teal-500 hover:bg-teal-100",
  },
  {
    id: "notaire",
    label: "Notaire",
    labelAr: "موثق",
    icon: "📜",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    hover: "hover:border-blue-500 hover:bg-blue-100",
  },
  {
    id: "huissier",
    label: "Huissier",
    labelAr: "محضر",
    icon: "🔏",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    hover: "hover:border-purple-500 hover:bg-purple-100",
  },
  {
    id: "expert_comptable",
    label: "Expert-comptable",
    labelAr: "خبير محاسبي",
    icon: "📊",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    hover: "hover:border-amber-500 hover:bg-amber-100",
  },
  {
    id: "comptable",
    label: "Comptable",
    labelAr: "محاسب",
    icon: "🧮",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    hover: "hover:border-orange-500 hover:bg-orange-100",
  },
  {
    id: "traducteur_assermente",
    label: "Traducteur assermenté",
    labelAr: "مترجم محلف",
    icon: "🌐",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    hover: "hover:border-green-500 hover:bg-green-100",
  },
];

export default function HomePage() {
  const router = useRouter();

  const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [topAvocats, setTopAvocats] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({
    total_avocats: 0,
    pourcentage_verification: 100,
  });
  const [loading, setLoading] = useState(true);
  const [loadingWilayas, setLoadingWilayas] = useState(true);

  const specialites = getSpecialites();

  useLayoutEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingWilayas(true);
        getWilayas().then((data) => {
          setWilayas(data);
          setLoadingWilayas(false);
        });
        const [topAvocatsData, statsData] = await Promise.all([
          getTopRatedAvocats(8),
          getStatistiques(),
        ]);
        setTopAvocats(topAvocatsData);
        setStats(statsData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useLayoutEffect(() => {
    const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTL
      .fromTo(
        ".hero-title",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 }
      )
      .fromTo(
        ".hero-sub",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ".hero-form",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ".hero-prof",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
        "-=0.3"
      )
      .fromTo(
        ".hero-stats",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.3"
      );

    gsap.fromTo(
      ".steps-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      ".cta-cards",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-cards",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useLayoutEffect(() => {
    if (topAvocats.length === 0 && wilayas.length === 0) return;
    gsap.fromTo(
      ".avocats-title",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".avocats-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      ".avocat-card",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".avocats-section",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      ".avocats-btn",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".avocats-btn",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [topAvocats, wilayas]);

  const professionOptions = [
    { value: "", label: "Tous les professionnels" },
    ...PROFESSIONS.map((p) => ({ value: p.id, label: `${p.icon} ${p.label}` })),
  ];

  const specialiteOptions = specialites.map((s) => ({ value: s, label: s }));
  const wilayaOptions = wilayas.map((w) => ({ value: w, label: w }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedProfession) params.set("profession", selectedProfession);
    if (selectedSpecialites.length > 0) {
      selectedSpecialites.forEach((spec) => params.append("specialite", spec));
    }
    if (selectedWilaya) params.set("wilaya", selectedWilaya);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleProfessionClick = (profId: string) => {
    router.push(`/search?profession=${profId}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
      <style>{`
        .hero-title, .hero-sub, .hero-form, .hero-prof, .hero-stats,
        .steps-section, .avocats-title, .avocat-card,
        .avocats-btn, .cta-cards { opacity: 0; }
        .prof-card { transition: all 0.18s ease; }
        .prof-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Hero */}
      <section className="relative z-10 py-16 px-4 overflow-visible">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="hero-title text-3xl sm:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Trouvez le bon expert
            <br className="hidden sm:block" /> juridique en Algérie
          </h1>
          <p className="hero-sub text-base sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Avocats, notaires, huissiers, experts-comptables, traducteurs — tous
            vérifiés, avec avis clients.{" "}
            <strong className="font-bold text-teal-600">
              Que vous soyez en Algérie ou à l'étranger
            </strong>
            , Mizan vous connecte au bon professionnel.
          </p>

          {/* Formulaire de recherche */}
          <div className="hero-form bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto relative z-[200]">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative z-40">
                <CustomSelect
                  placeholder="Tous les professionnels"
                  options={professionOptions}
                  value={selectedProfession}
                  onChange={setSelectedProfession}
                  className="h-12"
                  size="large"
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative z-30">
                  <MultiSelectWithCheckboxes
                    placeholder="Choisir les spécialités..."
                    options={specialiteOptions}
                    value={selectedSpecialites}
                    onChange={setSelectedSpecialites}
                    className="h-12"
                  />
                </div>
                <div className="lg:w-56 relative z-20">
                  {loadingWilayas ? (
                    <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                  ) : (
                    <CustomSelect
                      placeholder="Choisir une wilaya"
                      options={wilayaOptions}
                      value={selectedWilaya}
                      onChange={setSelectedWilaya}
                      className="h-12"
                      size="large"
                    />
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 px-8 bg-teal-600 hover:bg-teal-700 md:text-lg font-semibold whitespace-nowrap"
                disabled={loading}
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </form>
          </div>

          {/* Profession pills */}
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto">
            {PROFESSIONS.map((p) => (
              <button
                key={p.id}
                className={`hero-prof prof-card flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer ${p.bg} ${p.border} ${p.hover}`}
                onClick={() => handleProfessionClick(p.id)}
              >
                <span className="text-2xl">{p.icon}</span>
                <span
                  className={`text-xs font-semibold leading-tight text-center ${p.color}`}
                >
                  {p.label}
                </span>
                <span className="text-xs text-slate-400">{p.labelAr}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-0 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
              <AnimatedCounter
                end={stats.total_avocats}
                duration={2000}
                className="text-3xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 font-medium text-sm">
                Professionnels inscrits
              </div>
            </div>
            <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
              <AnimatedCounter
                end={wilayas.length}
                duration={2000}
                className="text-3xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 font-medium text-sm">
                Wilayas couvertes
              </div>
            </div>
            <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
              <AnimatedCounter
                end={6}
                duration={2000}
                className="text-3xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 font-medium text-sm">
                Catégories d'experts
              </div>
            </div>
            <div className="hero-stats bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center">
              <AnimatedCounter
                end={stats.pourcentage_verification}
                duration={2000}
                suffix="%"
                className="text-3xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 font-medium text-sm">
                Taux de vérification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="steps-section py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">
              Comment ça marche
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  n: "1",
                  title: "Cherchez",
                  desc: "Choisissez votre type d'expert, filtrez par spécialité et wilaya.",
                },
                {
                  n: "2",
                  title: "Comparez",
                  desc: "Consultez les avis, les spécialités et l'expérience de chaque professionnel.",
                },
                {
                  n: "3",
                  title: "Contactez",
                  desc: "Envoyez une demande directement depuis le profil du professionnel.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0 mt-0.5">
                    {step.n}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 mb-1">
                      {step.title}
                    </div>
                    <div className="text-sm text-slate-500 leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top avocats */}
      {topAvocats.length > 0 && (
        <section className="avocats-section pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="avocats-title text-3xl font-bold text-slate-800 mb-3">
                Professionnels les mieux notés
              </h2>
              <p className="text-lg text-slate-600">
                Découvrez les experts recommandés par notre communauté
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {topAvocats.map((avocat) => (
                <div key={avocat.id} className="avocat-card">
                  <AvocatCard avocat={avocat} />
                </div>
              ))}
            </div>
            <div className="text-center avocats-btn">
              <button
                className="text-teal-600 cursor-pointer items-center justify-center inline-flex hover:text-teal-700 transition-colors"
                onClick={() => router.push("/search")}
              >
                Voir tous les professionnels
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="cta-cards grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Vous cherchez un expert juridique ?
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Que vous soyez en Algérie ou à l'étranger, parcourez les
                  profils d'avocats, notaires, experts-comptables et traducteurs
                  vérifiés. Contactez-les directement.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {PROFESSIONS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProfessionClick(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${p.bg} ${p.border} ${p.color} hover:opacity-80`}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => router.push("/search")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all cursor-pointer w-fit"
              >
                Rechercher un expert
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-teal-600 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Vous êtes professionnel du droit ?
                </h3>
                <p className="text-teal-100 leading-relaxed mb-4">
                  Avocat, notaire, huissier, expert-comptable, comptable ou
                  traducteur — rejoignez Mizan et soyez visible par des clients
                  de toute l'Algérie et de la diaspora.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {PROFESSIONS.map((p) => (
                    <span
                      key={p.id}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white/15 text-white rounded-full text-xs font-medium"
                    >
                      {p.icon} {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/auth/lawyer/register">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer w-fit">
                  Créer mon profil professionnel
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
