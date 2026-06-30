"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowLeft,
  Users,
  SlidersHorizontal,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { SearchFilters, AvocatData } from "@/types";
import { searchAvocats } from "@/lib/avocatsData";
import { Link } from "@/i18n/navigation";
import { localizedDigits } from "@/lib/arabicNumerals";
import { getSpecialiteLabel } from "@/lib/i18nLabels";
import { gsap } from "gsap";

const PROF_KEY: Record<string, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
};

const PROFESSION_ICONS = [
  { id: "avocat", Icon: Scale },
  { id: "notaire", Icon: FileText },
  { id: "huissier", Icon: Briefcase },
  { id: "comptable", Icon: Calculator },
  { id: "expert-comptable", Icon: Calculator },
];

const PAGE_SIZE = 12;

const formatWilaya = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const MapPinSmall = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);

  const [avocats, setAvocats] = useState<AvocatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const prevPageRef = useRef(1);

  const PROFESSIONS = PROFESSION_ICONS.map((p) => ({
    ...p,
    label: t(`professions.${PROF_KEY[p.id]}.label`),
    plural: t(`professions.${PROF_KEY[p.id]}.plural`),
  }));

  const professionParam = searchParams.get("profession") || "avocat";
  const currentProf =
    PROFESSIONS.find((p) => p.id === professionParam) || PROFESSIONS[0];

  const readFilters = (): SearchFilters => {
    const f: SearchFilters = {};
    if (searchParams.get("wilaya")) f.wilaya = searchParams.get("wilaya")!;
    const specs = searchParams.getAll("specialite");
    if (specs.length) f.specialite = specs;
    if (searchParams.get("genre")) f.genre = searchParams.get("genre") as any;
    if (searchParams.get("experience_min"))
      f.experience_min = parseInt(searchParams.get("experience_min")!);
    if (searchParams.get("langues")) f.langues = searchParams.get("langues")!;
    return f;
  };

  const [filters, setFilters] = useState<SearchFilters>(readFilters);

  useEffect(() => {
    setFilters(readFilters());
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    searchAvocats(filters, professionParam)
      .then(setAvocats)
      .catch(() => setAvocats([]))
      .finally(() => setLoading(false));
  }, [filters, professionParam]);

  useEffect(() => {
    if (loading) return;
    gsap.fromTo(
      ".search-header",
      { autoAlpha: 0, y: -20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
    if (avocats.length > 0) {
      gsap.fromTo(
        ".search-avocat-card",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, delay: 0.1 }
      );
    }
    prevPageRef.current = 1;
  }, [loading, avocats.length, sortBy]);

  useEffect(() => {
    if (page <= 1 || page <= prevPageRef.current) return;
    prevPageRef.current = page;
    setTimeout(() => {
      const cards = document.querySelectorAll(".search-avocat-card");
      const newCards = Array.from(cards).slice((page - 1) * PAGE_SIZE);
      if (newCards.length > 0) {
        gsap.fromTo(
          newCards,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04 }
        );
      }
    }, 50);
  }, [page]);

  const updateURL = (f: SearchFilters) => {
    const p = new URLSearchParams();
    p.set("profession", professionParam);
    f.specialite?.forEach((s) => p.append("specialite", s));
    if (f.wilaya) p.set("wilaya", f.wilaya);
    if (f.genre) p.set("genre", f.genre);
    if (f.experience_min) p.set("experience_min", f.experience_min.toString());
    if (f.langues) p.set("langues", f.langues);
    window.history.replaceState({}, "", `${window.location.pathname}?${p}`);
  };

  const handleFilter = (key: keyof SearchFilters, value: any) => {
    const nf = { ...filters, [key]: value || undefined };
    if (!value || (Array.isArray(value) && value.length === 0)) delete nf[key];
    setFilters(nf);
    setPage(1);
    updateURL(nf);
  };

  const handleProfessionSwitch = (newProf: string) => {
    if (newProf === professionParam) return;
    if (!filters.specialite?.length) {
      const p = new URLSearchParams();
      p.set("profession", newProf);
      if (filters.wilaya) p.set("wilaya", filters.wilaya);
      router.push(`/search?${p.toString()}`);
    } else {
      router.push(`/${newProf}`);
    }
  };

  const clearLightFilters = () => {
    const nf: SearchFilters = {
      wilaya: filters.wilaya,
      specialite: filters.specialite,
    };
    if (!nf.wilaya) delete nf.wilaya;
    if (!nf.specialite?.length) delete nf.specialite;
    setFilters(nf);
    setPage(1);
    updateURL(nf);
  };

  const sortAvocats = (list: AvocatData[], type: string) => {
    const s = [...list];
    if (type === "rating")
      return s.sort(
        (a, b) =>
          (b.rating_google ?? b.rating_mizan ?? 0) -
          (a.rating_google ?? a.rating_mizan ?? 0)
      );
    if (type === "experience")
      return s.sort(
        (a, b) => (b.experience?.annees ?? 0) - (a.experience?.annees ?? 0)
      );
    if (type === "nom")
      return s.sort((a, b) =>
        `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`)
      );
    if (type === "recent")
      return s.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    return s;
  };

  const avocatsTries = sortBy ? sortAvocats(avocats, sortBy) : avocats;
  const displayed = avocatsTries.slice(0, page * PAGE_SIZE);
  const hasMore = avocatsTries.length > page * PAGE_SIZE;
  const hasLightFilters = !!(
    filters.genre ||
    filters.experience_min ||
    filters.langues
  );

  const LANGUAGE_OPTIONS = [
    { value: "", label: t("search.language.all") },
    {
      value: "Arabe",
      label: locale === "ar" ? "العربية" : locale === "en" ? "Arabic" : "Arabe",
    },
    {
      value: "Français",
      label:
        locale === "ar" ? "الفرنسية" : locale === "en" ? "French" : "Français",
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
      value: "Tamazight",
      label:
        locale === "ar"
          ? "الأمازيغية"
          : locale === "en"
            ? "Tamazight"
            : "Tamazight",
    },
  ];

  const LightFilters = () => (
    <div className="space-y-4">
      <div style={{ position: "relative", zIndex: 30 }}>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-2">
          {t("search.genre.label")}
        </p>
        <CustomSelect
          options={[
            { value: "", label: t("search.genre.all") },
            { value: "homme", label: t("search.genre.male") },
            { value: "femme", label: t("search.genre.female") },
          ]}
          placeholder={t("search.genre.all")}
          value={filters.genre || ""}
          onChange={(v) => handleFilter("genre", v)}
          className="h-9 text-sm"
        />
      </div>
      <div style={{ position: "relative", zIndex: 20 }}>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-2">
          {t("search.experience.label")}
        </p>
        <CustomSelect
          options={[
            { value: "", label: t("search.experience.all") },
            { value: "5", label: t("search.experience.5") },
            { value: "10", label: t("search.experience.10") },
            { value: "20", label: t("search.experience.20") },
          ]}
          placeholder={t("search.experience.all")}
          value={filters.experience_min?.toString() || ""}
          onChange={(v) =>
            handleFilter("experience_min", v ? parseInt(v) : undefined)
          }
          className="h-9 text-sm"
        />
      </div>
      <div style={{ position: "relative", zIndex: 10 }}>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-2">
          {t("search.language.label")}
        </p>
        <CustomSelect
          options={LANGUAGE_OPTIONS}
          placeholder={t("search.language.all")}
          value={filters.langues || ""}
          onChange={(v) => handleFilter("langues", v)}
          className="h-9 text-sm"
        />
      </div>
      {hasLightFilters && (
        <button
          onClick={clearLightFilters}
          className="w-full text-xs text-slate-500 dark:text-[#A8A8A6] hover:text-slate-700 dark:hover:text-[#E8E8E6] py-2 px-3 border border-slate-200 dark:border-[#1c2220] rounded-lg bg-white dark:bg-[#1c1c1e] hover:bg-slate-50 dark:hover:bg-[#1c2220] cursor-pointer font-medium"
        >
          {t("search.reset")}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.search-header { opacity:0; } .search-avocat-card { opacity:0; }`}</style>

      <div className="search-header sticky top-20 z-50 border-b border-slate-200 dark:border-[#1c2220] bg-white/90 dark:bg-[#1c1c1e]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
            <Link href={`/${professionParam}`}>
              <button className="flex items-center gap-1 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] text-xs sm:text-sm font-medium cursor-pointer me-1 sm:me-2">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline capitalize">
                  {currentProf.label}
                </span>
              </button>
            </Link>
            <div className="h-3.5 w-px bg-slate-200 me-1 hidden sm:block" />
            {PROFESSIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProfessionSwitch(p.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  professionParam === p.id
                    ? "bg-teal-600 dark:bg-[#0F6E56] text-white"
                    : "text-slate-500 dark:text-[#A8A8A6] hover:bg-slate-100 dark:hover:bg-[#1c2220]"
                }`}
              >
                <p.Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A8A6]">
                {ld(String(avocats.length))} {currentProf.plural}{" "}
                {t("search.found", { count: avocats.length })}
              </span>

              {filters.wilaya && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-600 dark:bg-[#0F6E56] text-white rounded-full text-xs font-semibold">
                  <MapPinSmall />
                  {formatWilaya(filters.wilaya)}
                  <button
                    onClick={() => handleFilter("wilaya", "")}
                    className="ms-0.5 text-teal-200 hover:text-white cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.specialite?.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-600 dark:bg-[#0F6E56] text-white rounded-full text-xs font-semibold"
                >
                  {getSpecialiteLabel(s, t)}
                  <button
                    onClick={() =>
                      handleFilter(
                        "specialite",
                        filters.specialite?.filter((sp) => sp !== s)
                      )
                    }
                    className="ms-0.5 text-teal-200 hover:text-white cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-lg text-xs font-medium text-slate-600 dark:text-[#E8E8E6] cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />{" "}
                {t("search.filters")}
              </button>
              <div className="w-36 sm:w-40">
                <CustomSelect
                  options={[
                    { value: "", label: t("search.sort.default") },
                    { value: "rating", label: t("search.sort.rating") },
                    { value: "experience", label: t("search.sort.experience") },
                    { value: "nom", label: t("search.sort.name") },
                    { value: "recent", label: t("search.sort.recent") },
                  ]}
                  placeholder={t("search.sort.default")}
                  value={sortBy}
                  onChange={(v) => {
                    setSortBy(v);
                    setPage(1);
                  }}
                  className="h-8 sm:h-9 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {showMobileFilters && (
          <div className="lg:hidden border-t border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] px-4 py-4">
            <LightFilters />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5 sm:gap-6">
          <aside className="hidden lg:block lg:sticky lg:top-44 lg:self-start">
            <div className="bg-white dark:bg-[#1c1c1e] shadow-sm dark:shadow-none rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-4">
                {t("search.refine")}
              </p>
              <LightFilters />
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 animate-pulse border border-slate-100 dark:border-[#1c2220]"
                  >
                    <div className="w-10 h-10 bg-slate-200 dark:bg-[#2a2a2d] rounded-full mb-3" />
                    <div className="h-3.5 bg-slate-200 dark:bg-[#2a2a2d] rounded mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-[#2a2a2d] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : avocatsTries.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {displayed.map((a) => (
                    <div key={a.id} className="search-avocat-card">
                      <AvocatCard avocat={a} searchParams={searchParams} />
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex flex-col items-center mt-8 gap-2">
                    <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
                      {ld(String(displayed.length))} {t("search.of")}{" "}
                      {ld(String(avocatsTries.length))} {currentProf.plural}
                    </p>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1c1c1e] border border-teal-200 dark:border-[#6fcf9f]/20 text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] hover:border-teal-400 dark:hover:border-[#6fcf9f] rounded-xl font-semibold text-sm cursor-pointer transition-all"
                    >
                      <ChevronDown className="w-4 h-4" />
                      {t("search.showMore")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 bg-slate-100 dark:bg-[#1c1c1e] rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400 dark:text-[#7A7A78]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-[#E8E8E6] mb-2">
                  {t("search.noResultsTitle", {
                    profession: currentProf.label.toLowerCase(),
                  })}
                </h3>
                <p className="text-slate-500 dark:text-[#A8A8A6] mb-6 max-w-sm mx-auto text-sm">
                  {t("search.noResultsDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasLightFilters && (
                    <Button onClick={clearLightFilters}>
                      {t("search.resetFilters")}
                    </Button>
                  )}
                  <Link href={`/${professionParam}`}>
                    <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white">
                      {t("search.changeWilaya")}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-[#6fcf9f]" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
