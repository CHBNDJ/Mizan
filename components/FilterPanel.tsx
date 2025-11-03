"use client";
import { useState } from "react";
import { Filter, Languages, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { FilterPanelProps } from "@/types";
import { CIVILITE_OPTIONS, toCivilite } from "@/lib/genderUtils";

export function FilterPanel({
  filters,
  onFilterChange,
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

  const genreOptions = CIVILITE_OPTIONS;

  const handleLangueChange = (value: string) => {
    if (filters.langues === value) {
      onFilterChange("langues", null);
    } else {
      onFilterChange("langues", value);
    }
  };

  const handleGenreChange = (value: string) => {
    if (filters.genre === value) {
      onFilterChange("genre", null);
    } else {
      onFilterChange("genre", value as "homme" | "femme");
    }
  };

  const handleExperienceChange = (value: string) => {
    const experienceValue = parseInt(value);
    if (
      filters.experience_min !== null &&
      filters.experience_min !== undefined &&
      filters.experience_min === experienceValue
    ) {
      onFilterChange("experience_min", null);
    } else {
      onFilterChange("experience_min", experienceValue);
    }
  };

  const activeFilters = [];

  if (searchParams?.getAll("specialite").length) {
    activeFilters.push({
      key: "specialite",
      label: `${searchParams.getAll("specialite").length} spécialité(s)`,
      color: "teal" as const,
    });
  }

  if (searchParams?.get("wilaya")) {
    activeFilters.push({
      key: "wilaya",
      label: searchParams.get("wilaya")!,
      color: "blue" as const,
    });
  }

  if (filters.langues) {
    activeFilters.push({
      key: "langue",
      label: filters.langues,
      color: "green" as const,
    });
  }

  if (filters.genre) {
    activeFilters.push({
      key: "genre",
      label: toCivilite(filters.genre),
      color: "orange" as const,
    });
  }

  if (filters.experience_min) {
    activeFilters.push({
      key: "experience_min",
      label: `${filters.experience_min}+ ans d'expérience`,
      color: "yellow" as const,
    });
  }

  return (
    <div className="relative z-50 rounded-lg shadow-sm bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Filter className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Filtres</h3>
            <p className="text-sm text-slate-500">
              {activeFilters.length === 0
                ? "Affiner votre recherche"
                : `${activeFilters.length} actif(s)`}
            </p>
          </div>
        </div>
        <Button>{isExpanded ? "Masquer" : "Afficher"}</Button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-50">
            <div className="space-y-2 relative z-[60]">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Languages className="w-4 h-4" />
                Langue parlée
              </label>
              <CustomSelect
                placeholder="Toutes les langues"
                options={langueOptions}
                value={filters.langues}
                onChange={handleLangueChange}
              />
            </div>

            <div className="space-y-2 relative z-[55]">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="w-4 h-4" />
                Civilité
              </label>
              <CustomSelect
                placeholder="Tous"
                options={genreOptions}
                value={filters.genre}
                onChange={handleGenreChange}
              />
            </div>

            <div className="space-y-2 relative z-50">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase className="w-4 h-4" />
                Expérience minimum
              </label>
              <CustomSelect
                placeholder="Toute expérience"
                options={experienceOptions}
                value={
                  filters.experience_min !== null &&
                  filters.experience_min !== undefined
                    ? filters.experience_min.toString()
                    : ""
                }
                onChange={handleExperienceChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
