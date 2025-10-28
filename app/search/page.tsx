// "use client";
// import { useState, useEffect, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { ArrowLeft, Users } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { CustomSelect } from "@/components/ui/CustomSelect";
// import { AvocatCard } from "@/components/cards/AvocatCard";
// import { FilterPanel } from "@/components/FilterPanel";
// import { SearchFilters, AvocatData } from "@/types";
// import { searchAvocats } from "@/lib/avocatsData";
// import Link from "next/link";
// import { gsap } from "gsap";

// function SearchResults() {
//   const searchParams = useSearchParams();

//   const [avocats, setAvocats] = useState<AvocatData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState<string>("");

//   const [filters, setFilters] = useState<SearchFilters>(() => {
//     const specialites = searchParams.getAll("specialite");
//     const wilayaParam = searchParams.get("wilaya");
//     const genreParam = searchParams.get("genre");
//     const experienceParam = searchParams.get("experience_min");
//     const languesParam = searchParams.get("langues");

//     const initialFilters: SearchFilters = {};

//     if (specialites.length > 0) initialFilters.specialite = specialites;
//     if (wilayaParam) initialFilters.wilaya = wilayaParam;
//     if (genreParam) initialFilters.genre = genreParam as "homme" | "femme";
//     if (experienceParam)
//       initialFilters.experience_min = parseInt(experienceParam);
//     if (languesParam) initialFilters.langues = languesParam;

//     return initialFilters;
//   });

//   useEffect(() => {
//     const specialites = searchParams.getAll("specialite");
//     const wilayaParam = searchParams.get("wilaya");
//     const genreParam = searchParams.get("genre");
//     const experienceParam = searchParams.get("experience_min");
//     const languesParam = searchParams.get("langues");

//     const newFilters: SearchFilters = {};

//     if (specialites.length > 0) newFilters.specialite = specialites;
//     if (wilayaParam) newFilters.wilaya = wilayaParam;
//     if (genreParam) newFilters.genre = genreParam as "homme" | "femme";
//     if (experienceParam) newFilters.experience_min = parseInt(experienceParam);
//     if (languesParam) newFilters.langues = languesParam;

//     setFilters(newFilters);
//   }, [searchParams]);

//   useEffect(() => {
//     const loadAvocats = async () => {
//       setLoading(true);
//       try {
//         const results = await searchAvocats(filters);
//         setAvocats(results);
//       } catch (error) {
//         console.error("Erreur lors de la recherche:", error);
//         setAvocats([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAvocats();
//   }, [filters]);

//   useEffect(() => {
//     if (loading) return;

//     gsap.fromTo(
//       ".search-header-item",
//       { opacity: 0, x: -50 },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.8,
//         stagger: 0.15,
//         ease: "power3.out",
//       }
//     );

//     gsap.fromTo(
//       ".search-filters",
//       { opacity: 0, x: -50 },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.8,
//         delay: 0.3,
//         ease: "power3.out",
//       }
//     );

//     gsap.fromTo(
//       ".search-results-header",
//       { opacity: 0, x: -50 },
//       {
//         opacity: 1,
//         x: 0,
//         duration: 0.8,
//         delay: 0.5,
//         ease: "power3.out",
//       }
//     );

//     if (avocats.length > 0) {
//       gsap.fromTo(
//         ".search-avocat-card",
//         {
//           opacity: 0,
//           x: -30,
//         },
//         {
//           opacity: 1,
//           x: 0,
//           duration: 1,
//           stagger: 0.08,
//           ease: "power2.out",
//           delay: 0.7,
//         }
//       );
//     }
//   }, [loading, avocats.length]);

//   const updateURL = (newFilters: SearchFilters) => {
//     const params = new URLSearchParams();

//     if (newFilters.specialite && newFilters.specialite.length > 0) {
//       newFilters.specialite.forEach((spec) =>
//         params.append("specialite", spec)
//       );
//     }
//     if (newFilters.wilaya) params.set("wilaya", newFilters.wilaya);
//     if (newFilters.genre) params.set("genre", newFilters.genre);
//     if (newFilters.experience_min)
//       params.set("experience_min", newFilters.experience_min.toString());
//     if (newFilters.langues) params.set("langues", newFilters.langues);

//     const newUrl = `${window.location.pathname}?${params.toString()}`;
//     window.history.replaceState({}, "", newUrl);
//   };

//   const handleFilterChange = (key: keyof SearchFilters, value: any) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);
//     updateURL(newFilters);
//   };

//   const clearFilters = () => {
//     const urlFilters: SearchFilters = {};
//     const specialites = searchParams.getAll("specialite");
//     const wilayaParam = searchParams.get("wilaya");

//     if (specialites.length > 0) urlFilters.specialite = specialites;
//     if (wilayaParam) urlFilters.wilaya = wilayaParam;

//     setFilters(urlFilters);
//     updateURL(urlFilters);
//   };

//   const sortAvocats = (
//     avocats: AvocatData[],
//     sortType: string
//   ): AvocatData[] => {
//     const sorted = [...avocats];

//     switch (sortType) {
//       case "rating":
//         return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//       case "experience":
//         return sorted.sort((a, b) => b.experience.annees - a.experience.annees);
//       case "nom":
//         return sorted.sort((a, b) => {
//           const nomA = `${a.nom} ${a.prenom || ""}`.toLowerCase();
//           const nomB = `${b.nom} ${b.prenom || ""}`.toLowerCase();
//           return nomA.localeCompare(nomB);
//         });
//       case "recent":
//         return sorted.sort((a, b) => {
//           const dateA = new Date(a.experience.date_inscription);
//           const dateB = new Date(b.experience.date_inscription);
//           return dateB.getTime() - dateA.getTime();
//         });
//       default:
//         return sorted;
//     }
//   };

//   const avocatsTries = sortBy ? sortAvocats(avocats, sortBy) : avocats;
//   const handleSortChange = (value: string) => setSortBy(value);

//   const triOptions = [
//     { value: "", label: "Par défaut" },
//     { value: "rating", label: "Mieux notés" },
//     { value: "experience", label: "Plus expérimentés" },
//     { value: "nom", label: "Ordre alphabétique" },
//     { value: "recent", label: "Récemment inscrits" },
//   ];

//   const totalAvocats = avocats.length;
//   const specialitesURL = searchParams.getAll("specialite");
//   const wilayaURL = searchParams.get("wilaya");

//   const titreRecherche = [];
//   if (specialitesURL.length > 0) {
//     titreRecherche.push(
//       `${specialitesURL.length} spécialité${specialitesURL.length > 1 ? "s" : ""}`
//     );
//   }
//   if (wilayaURL) titreRecherche.push(`à ${wilayaURL}`);

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style jsx>{`
//         .search-header-item,
//         .search-filters,
//         .search-results-header,
//         .search-avocat-card {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <div className="search-header-item flex items-center mb-4">
//           <Link href="/">
//             <button className="flex items-center gap-2 text-teal-600 cursor-pointer hover:text-teal-700 transition-colors">
//               <ArrowLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Retour à l'accueil</span>
//               <span className="sm:hidden">Retour</span>
//             </button>
//           </Link>
//         </div>

//         <div className="search-header-item">
//           <h1 className="text-2xl font-bold text-slate-800 mb-2">
//             {titreRecherche.length > 0
//               ? `Avocats spécialisés ${titreRecherche.join(" ")}`
//               : "Tous les avocats"}
//           </h1>

//           <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
//             <div className="flex items-center gap-2">
//               <Users className="w-4 h-4" />
//               <span className="font-medium">
//                 {totalAvocats} résultats trouvés
//               </span>
//             </div>

//             {specialitesURL.length > 0 && (
//               <div className="flex items-center gap-1 flex-wrap">
//                 <span>Spécialités :</span>
//                 {specialitesURL.map((spec: string, index: number) => (
//                   <span
//                     key={spec}
//                     className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs"
//                   >
//                     {spec}
//                     {index < specialitesURL.length - 1 ? "," : ""}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="search-filters">
//           <FilterPanel
//             filters={filters}
//             onFilterChange={handleFilterChange}
//             onClearFilters={clearFilters}
//             searchParams={searchParams}
//           />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="w-full">
//           <div className="search-results-header">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">
//                   {totalAvocats === 0
//                     ? "Aucun avocat trouvé"
//                     : `${totalAvocats} avocat${totalAvocats > 1 ? "s" : ""} disponible${totalAvocats > 1 ? "s" : ""}`}
//                 </h2>
//                 <p className="text-sm text-slate-500 mt-1">
//                   {totalAvocats > 0 && (
//                     <>
//                       Cliquez sur un avocat pour voir ses détails
//                       {sortBy && (
//                         <span className="ml-2 text-teal-600">
//                           • Trié par{" "}
//                           {triOptions
//                             .find((opt) => opt.value === sortBy)
//                             ?.label.toLowerCase()}
//                         </span>
//                       )}
//                     </>
//                   )}
//                 </p>
//               </div>

//               {totalAvocats > 1 && (
//                 <div className="w-full sm:w-48">
//                   <CustomSelect
//                     options={triOptions}
//                     placeholder="Trier par..."
//                     value={sortBy}
//                     onChange={handleSortChange}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {[...Array(6)].map((_, i: number) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl p-6 animate-pulse shadow-sm"
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
//                     <div className="flex-1">
//                       <div className="h-4 bg-slate-200 rounded mb-2"></div>
//                       <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
//                       <div className="h-3 bg-slate-200 rounded w-1/2"></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <>
//               {totalAvocats > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                   {avocatsTries.map((avocat: AvocatData) => (
//                     <div key={avocat.id} className="search-avocat-card">
//                       <AvocatCard avocat={avocat} searchParams={searchParams} />
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-16">
//                   <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
//                     <Users className="w-10 h-10 text-slate-400" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-slate-700 mb-2">
//                     Aucun avocat ne correspond à vos critères
//                   </h3>
//                   <p className="text-slate-500 mb-6 max-w-md mx-auto">
//                     Essayez de modifier vos filtres ou
//                     {specialitesURL.length > 0 &&
//                       " choisissez d'autres spécialités"}
//                     {wilayaURL && " sélectionnez une autre région"}
//                   </p>
//                   <div className="space-y-3">
//                     <Button onClick={clearFilters}>
//                       Effacer les filtres additionnels
//                     </Button>
//                     <div>
//                       <Link href="/">
//                         <Button className="bg-teal-600 hover:bg-teal-700">
//                           Nouvelle recherche
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function SearchPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//         </div>
//       }
//     >
//       <SearchResults />
//     </Suspense>
//   );
// }

"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SearchFilters, AvocatData } from "@/types";
import { searchAvocats } from "@/lib/avocatsData";
import Link from "next/link";
import { gsap } from "gsap";

function SearchResults() {
  const searchParams = useSearchParams();

  const [avocats, setAvocats] = useState<AvocatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("");

  const [filters, setFilters] = useState<SearchFilters>(() => {
    const specialites = searchParams.getAll("specialite");
    const wilayaParam = searchParams.get("wilaya");
    const genreParam = searchParams.get("genre");
    const experienceParam = searchParams.get("experience_min");
    const languesParam = searchParams.get("langues");

    const initialFilters: SearchFilters = {};

    if (specialites.length > 0) initialFilters.specialite = specialites;
    if (wilayaParam) initialFilters.wilaya = wilayaParam;
    if (genreParam) initialFilters.genre = genreParam as "homme" | "femme";
    if (experienceParam)
      initialFilters.experience_min = parseInt(experienceParam);
    if (languesParam) initialFilters.langues = languesParam;

    return initialFilters;
  });

  useEffect(() => {
    const specialites = searchParams.getAll("specialite");
    const wilayaParam = searchParams.get("wilaya");
    const genreParam = searchParams.get("genre");
    const experienceParam = searchParams.get("experience_min");
    const languesParam = searchParams.get("langues");

    const newFilters: SearchFilters = {};

    if (specialites.length > 0) newFilters.specialite = specialites;
    if (wilayaParam) newFilters.wilaya = wilayaParam;
    if (genreParam) newFilters.genre = genreParam as "homme" | "femme";
    if (experienceParam) newFilters.experience_min = parseInt(experienceParam);
    if (languesParam) newFilters.langues = languesParam;

    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    const loadAvocats = async () => {
      setLoading(true);
      try {
        const results = await searchAvocats(filters);
        setAvocats(results);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setAvocats([]);
      } finally {
        setLoading(false);
      }
    };
    loadAvocats();
  }, [filters]);

  useEffect(() => {
    if (loading) return;

    gsap.fromTo(
      ".search-header-item",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".search-filters",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".search-results-header",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      }
    );

    if (avocats.length > 0) {
      gsap.fromTo(
        ".search-avocat-card",
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.7,
        }
      );
    }
  }, [loading, avocats.length]);

  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();

    if (newFilters.specialite && newFilters.specialite.length > 0) {
      newFilters.specialite.forEach((spec) =>
        params.append("specialite", spec)
      );
    }
    if (newFilters.wilaya) params.set("wilaya", newFilters.wilaya);
    if (newFilters.genre) params.set("genre", newFilters.genre);
    if (newFilters.experience_min)
      params.set("experience_min", newFilters.experience_min.toString());
    if (newFilters.langues) params.set("langues", newFilters.langues);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const urlFilters: SearchFilters = {};
    const specialites = searchParams.getAll("specialite");
    const wilayaParam = searchParams.get("wilaya");

    if (specialites.length > 0) urlFilters.specialite = specialites;
    if (wilayaParam) urlFilters.wilaya = wilayaParam;

    setFilters(urlFilters);
    updateURL(urlFilters);
  };

  const sortAvocats = (
    avocats: AvocatData[],
    sortType: string
  ): AvocatData[] => {
    const sorted = [...avocats];

    switch (sortType) {
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "experience":
        return sorted.sort((a, b) => b.experience.annees - a.experience.annees);
      case "nom":
        return sorted.sort((a, b) => {
          const nomA = `${a.nom} ${a.prenom || ""}`.toLowerCase();
          const nomB = `${b.nom} ${b.prenom || ""}`.toLowerCase();
          return nomA.localeCompare(nomB);
        });
      case "recent":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.experience.date_inscription);
          const dateB = new Date(b.experience.date_inscription);
          return dateB.getTime() - dateA.getTime();
        });
      default:
        return sorted;
    }
  };

  const avocatsTries = sortBy ? sortAvocats(avocats, sortBy) : avocats;
  const handleSortChange = (value: string) => setSortBy(value);

  const triOptions = [
    { value: "", label: "Par défaut" },
    { value: "rating", label: "Mieux notés" },
    { value: "experience", label: "Plus expérimentés" },
    { value: "nom", label: "Ordre alphabétique" },
    { value: "recent", label: "Récemment inscrits" },
  ];

  const totalAvocats = avocats.length;
  const specialitesURL = searchParams.getAll("specialite");
  const wilayaURL = searchParams.get("wilaya");

  const titreRecherche = [];
  if (specialitesURL.length > 0) {
    titreRecherche.push(
      `${specialitesURL.length} spécialité${specialitesURL.length > 1 ? "s" : ""}`
    );
  }
  if (wilayaURL) titreRecherche.push(`à ${wilayaURL}`);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style jsx>{`
        .search-header-item,
        .search-filters,
        .search-results-header,
        .search-avocat-card {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="search-header-item flex items-center mb-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-teal-600 cursor-pointer hover:text-teal-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
              <span className="sm:hidden">Retour</span>
            </button>
          </Link>
        </div>

        <div className="search-header-item">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {titreRecherche.length > 0
              ? `Avocats spécialisés ${titreRecherche.join(" ")}`
              : "Tous les avocats"}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">
                {totalAvocats} résultats trouvés
              </span>
            </div>

            {specialitesURL.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <span>Spécialités :</span>
                {specialitesURL.map((spec: string, index: number) => (
                  <span
                    key={spec}
                    className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs"
                  >
                    {spec}
                    {index < specialitesURL.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="search-filters">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            searchParams={searchParams}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full">
          <div className="search-results-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {totalAvocats === 0
                    ? "Aucun avocat trouvé"
                    : `${totalAvocats} avocat${totalAvocats > 1 ? "s" : ""} disponible${totalAvocats > 1 ? "s" : ""}`}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {totalAvocats > 0 && (
                    <>
                      Cliquez sur un avocat pour voir ses détails
                      {sortBy && (
                        <span className="ml-2 text-teal-600">
                          • Trié par{" "}
                          {triOptions
                            .find((opt) => opt.value === sortBy)
                            ?.label.toLowerCase()}
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {totalAvocats > 1 && (
                <div className="w-full sm:w-48">
                  <CustomSelect
                    options={triOptions}
                    placeholder="Trier par..."
                    value={sortBy}
                    onChange={handleSortChange}
                  />
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i: number) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 animate-pulse shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {totalAvocats > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {avocatsTries.map((avocat: AvocatData) => (
                    <div key={avocat.id} className="search-avocat-card">
                      <AvocatCard avocat={avocat} searchParams={searchParams} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    Aucun avocat ne correspond à vos critères
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Essayez de modifier vos filtres ou
                    {specialitesURL.length > 0 &&
                      " choisissez d'autres spécialités"}
                    {wilayaURL && " sélectionnez une autre région"}
                  </p>
                  <div className="space-y-3">
                    <Button onClick={clearFilters}>
                      Effacer les filtres additionnels
                    </Button>
                    <div>
                      <Link href="/">
                        <Button className="bg-teal-600 hover:bg-teal-700">
                          Nouvelle recherche
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
