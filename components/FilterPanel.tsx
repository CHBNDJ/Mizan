"use client";
import { useState } from "react";
import { Filter, Languages, User, Briefcase } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { FilterPanelProps } from "@/types";
import { CIVILITE_OPTIONS, toCivilite } from "@/lib/genderUtils";
import { localizedDigits } from "@/lib/arabicNumerals";

export function FilterPanel({
  filters,
  onFilterChange,
  searchParams,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("filterPanel");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);

  const experienceOptions = [
    { value: "5", label: t("experienceOption", { n: ld("5") }) },
    { value: "10", label: t("experienceOption", { n: ld("10") }) },
    { value: "20", label: t("experienceOption", { n: ld("20") }) },
    { value: "30", label: t("experienceOption", { n: ld("30") }) },
  ];

  const langueOptions = [
    {
      value: "Français",
      label:
        locale === "ar" ? "الفرنسية" : locale === "en" ? "French" : "Français",
    },
    {
      value: "Arabe",
      label: locale === "ar" ? "العربية" : locale === "en" ? "Arabic" : "Arabe",
    },
    {
      value: "Anglais",
      label:
        locale === "ar"
          ? "الإنجليزية"
          : locale === "en"
            ? "English"
            : "Anglais",
    },
    {
      value: "Berbère",
      label:
        locale === "ar"
          ? "الأمازيغية"
          : locale === "en"
            ? "Tamazight"
            : "Tamazight",
    },
    {
      value: "Espagnol",
      label:
        locale === "ar" ? "الإسبانية" : locale === "en" ? "Spanish" : "Español",
    },
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
      label: t("specialitesCount", {
        n: ld(String(searchParams.getAll("specialite").length)),
      }),
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
      label: t("experienceOption", { n: ld(String(filters.experience_min)) }),
      color: "yellow" as const,
    });
  }

  return (
    <div className="relative z-50 rounded-lg shadow-sm dark:shadow-none bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:from-[#1c1c1e] dark:via-[#1c1c1e] dark:to-[#1c1c1e] dark:border dark:border-[#1c2220]">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-lg">
            <Filter className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4]">
              {t("title")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
              {activeFilters.length === 0
                ? t("subtitleEmpty")
                : t("subtitleActive", { n: ld(String(activeFilters.length)) })}
            </p>
          </div>
        </div>
        <Button>{isExpanded ? t("hide") : t("show")}</Button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-50">
            <div className="space-y-2 relative z-[60]">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6]">
                <Languages className="w-4 h-4" />
                {t("languageLabel")}
              </label>
              <CustomSelect
                placeholder={t("languageAll")}
                options={langueOptions}
                value={filters.langues}
                onChange={handleLangueChange}
              />
            </div>

            <div className="space-y-2 relative z-[55]">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6]">
                <User className="w-4 h-4" />
                {t("civiliteLabel")}
              </label>
              <CustomSelect
                placeholder={t("civiliteAll")}
                options={genreOptions}
                value={filters.genre}
                onChange={handleGenreChange}
              />
            </div>

            <div className="space-y-2 relative z-50">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6]">
                <Briefcase className="w-4 h-4" />
                {t("experienceLabel")}
              </label>
              <CustomSelect
                placeholder={t("experienceAll")}
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
