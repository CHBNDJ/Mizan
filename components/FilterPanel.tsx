// "use client";
// import { useState } from "react";
// import { Filter, X, Languages, User, Briefcase } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { CustomSelect } from "@/components/ui/CustomSelect";
// import { SearchFilters } from "@/types";
// import { FilterPanelProps } from "@/types";

// export function FilterPanel({
//   filters,
//   onFilterChange,
//   onClearFilters,
//   searchParams,
// }: FilterPanelProps) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const experienceOptions = [
//     { value: "5", label: "5+ ans d'expérience" },
//     { value: "10", label: "10+ ans d'expérience" },
//     { value: "20", label: "20+ ans d'expérience" },
//     { value: "30", label: "30+ ans d'expérience" },
//   ];

//   const langueOptions = [
//     { value: "Français", label: "Français" },
//     { value: "Arabe", label: "العربية" },
//     { value: "Anglais", label: "English" },
//     { value: "Berbère", label: "Tamazight" },
//     { value: "Espagnol", label: "Español" },
//   ];

//   const genreOptions = [
//     { value: "homme", label: "Avocat (Homme)" },
//     { value: "femme", label: "Avocate (Femme)" },
//   ];

//   // Fonctions de toggle pour désélectionner
//   const handleLangueChange = (value: string) => {
//     if (filters.langues === value) {
//       // Si la même langue est sélectionnée, on la désélectionne
//       onFilterChange("langues", null);
//     } else {
//       // Sinon on la sélectionne
//       onFilterChange("langues", value);
//     }
//   };

//   const handleGenreChange = (value: string) => {
//     if (filters.genre === value) {
//       // Si le même genre est sélectionné, on le désélectionne
//       onFilterChange("genre", null);
//     } else {
//       // Sinon on le sélectionne
//       onFilterChange("genre", value);
//     }
//   };

//   const handleExperienceChange = (value: string) => {
//     const experienceValue = parseInt(value);
//     // Comparaison pour les nombres entiers
//     if (
//       filters.experience_min !== null &&
//       filters.experience_min !== undefined &&
//       filters.experience_min === experienceValue
//     ) {
//       // Si la même expérience est sélectionnée, on la désélectionne
//       onFilterChange("experience_min", null);
//     } else {
//       // Sinon on la sélectionne
//       onFilterChange("experience_min", experienceValue);
//     }
//   };

//   // Filtres actifs
//   const activeFilters = [];

//   if (searchParams?.getAll("specialite").length) {
//     activeFilters.push({
//       key: "specialite",
//       label: `${searchParams.getAll("specialite").length} spécialité(s)`,
//       color: "teal" as const,
//     });
//   }

//   if (searchParams?.get("wilaya")) {
//     activeFilters.push({
//       key: "wilaya",
//       label: searchParams.get("wilaya")!,
//       color: "blue" as const,
//     });
//   }

//   if (filters.langues) {
//     activeFilters.push({
//       key: "langue",
//       label: filters.langues,
//       color: "green" as const,
//     });
//   }

//   if (filters.genre) {
//     activeFilters.push({
//       key: "genre",
//       label: filters.genre === "homme" ? "Avocat" : "Avocate",
//       color: "orange" as const,
//     });
//   }

//   if (filters.experience_min) {
//     activeFilters.push({
//       key: "experience_min",
//       label: `${filters.experience_min}+ ans d'expérience`,
//       color: "yellow" as const,
//     });
//   }

//   return (
//     <div className="rounded-lg shadow-sm">
//       {/* Header cliquable */}
//       <div
//         className="flex items-center justify-between p-4 cursor-pointer"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-teal-100 rounded-lg">
//             <Filter className="w-4 h-4 text-teal-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-slate-800">Filtres</h3>
//             <p className="text-sm text-slate-500">
//               {activeFilters.length === 0
//                 ? "Affiner votre recherche"
//                 : `${activeFilters.length} actif(s)`}
//             </p>
//           </div>
//         </div>
//         <Button>{isExpanded ? "Masquer" : "Afficher"}</Button>
//       </div>

//       {/* Panel de filtres expandable */}
//       {isExpanded && (
//         <div className="p-4 space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {/* Langue */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                 <Languages className="w-4 h-4" />
//                 Langue parlée
//               </label>
//               <CustomSelect
//                 placeholder="Toutes les langues"
//                 options={langueOptions}
//                 value={filters.langues}
//                 onChange={handleLangueChange}
//               />
//             </div>

//             {/* Genre */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                 <User className="w-4 h-4" />
//                 Genre
//               </label>
//               <CustomSelect
//                 placeholder="Tous"
//                 options={genreOptions}
//                 value={filters.genre}
//                 onChange={handleGenreChange}
//               />
//             </div>

//             {/* Expérience minimum */}
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
//                 <Briefcase className="w-4 h-4" />
//                 Expérience minimum
//               </label>
//               <CustomSelect
//                 placeholder="Toute expérience"
//                 options={experienceOptions}
//                 value={
//                   filters.experience_min !== null &&
//                   filters.experience_min !== undefined
//                     ? filters.experience_min.toString()
//                     : ""
//                 }
//                 onChange={handleExperienceChange}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Filter, Languages, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SearchFilters } from "@/types";
import { FilterPanelProps } from "@/types";

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  searchParams,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const experienceOptions = [
    { value: "5", label: "5+ ans d'expérience" },
    { value: "10", label: "10+ ans d'expérience" },
    { value: "20", label: "20+ ans d'expérience" },
    { value: "30", label: "30+ ans d'expérience" },
  ];

  const langueOptions = [
    { value: "Français", label: "Français" },
    { value: "Arabe", label: "العربية" },
    { value: "Anglais", label: "English" },
    { value: "Berbère", label: "Tamazight" },
    { value: "Espagnol", label: "Español" },
  ];

  const genreOptions = [
    { value: "homme", label: "Avocat (Homme)" },
    { value: "femme", label: "Avocate (Femme)" },
  ];

  // ✅ FIX: Simplifier avec undefined au lieu de null
  const handleLangueChange = (value: string) => {
    onFilterChange("langues", filters.langues === value ? undefined : value);
  };

  const handleGenreChange = (value: string) => {
    onFilterChange(
      "genre",
      filters.genre === value ? undefined : (value as "homme" | "femme")
    );
  };

  const handleExperienceChange = (value: string) => {
    const experienceValue = parseInt(value);
    onFilterChange(
      "experience_min",
      filters.experience_min === experienceValue ? undefined : experienceValue
    );
  };

  // Compteur de filtres actifs
  const activeFiltersCount = [
    filters.langues,
    filters.genre,
    filters.experience_min,
  ].filter(Boolean).length;

  return (
    <div className="rounded-lg shadow-sm bg-white">
      {/* Header cliquable */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors rounded-t-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Filter className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              Filtres additionnels
            </h3>
            <p className="text-sm text-slate-500">
              {activeFiltersCount === 0
                ? "Affiner votre recherche"
                : `${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""} actif${activeFiltersCount > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Button className="text-sm">
          {isExpanded ? "Masquer" : "Afficher"}
        </Button>
      </div>

      {/* Panel de filtres expandable */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Langue */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Languages className="w-4 h-4" />
                Langue parlée
              </label>
              <CustomSelect
                placeholder="Toutes les langues"
                options={langueOptions}
                value={filters.langues || ""}
                onChange={handleLangueChange}
              />
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4" />
                Genre
              </label>
              <CustomSelect
                placeholder="Tous"
                options={genreOptions}
                value={filters.genre || ""}
                onChange={handleGenreChange}
              />
            </div>

            {/* Expérience minimum */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase className="w-4 h-4" />
                Expérience minimum
              </label>
              <CustomSelect
                placeholder="Toute expérience"
                options={experienceOptions}
                value={
                  filters.experience_min
                    ? filters.experience_min.toString()
                    : ""
                }
                onChange={handleExperienceChange}
              />
            </div>
          </div>

          {/* Bouton Effacer les filtres */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={onClearFilters}
                className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700"
              >
                Effacer les filtres additionnels
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
