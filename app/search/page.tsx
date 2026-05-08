"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Users, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AvocatCard } from "@/components/cards/AvocatCard";
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
        console.error("Erreur recherche:", error);
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
      ".search-header",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    gsap.fromTo(
      ".sidebar",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, delay: 0.1, ease: "power3.out" }
    );

    if (avocats.length > 0) {
      gsap.fromTo(
        ".search-avocat-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.2,
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
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
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

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const sortAvocats = (
    avocats: AvocatData[],
    sortType: string
  ): AvocatData[] => {
    const sorted = [...avocats];
    switch (sortType) {
      case "rating":
        return sorted.sort(
          (a, b) =>
            (b.rating_google || b.rating_mizan || 0) -
            (a.rating_google || a.rating_mizan || 0)
        );
      case "experience":
        return sorted.sort((a, b) => b.experience.annees - a.experience.annees);
      case "nom":
        return sorted.sort((a, b) =>
          `${a.nom} ${a.prenom || ""}`
            .toLowerCase()
            .localeCompare(`${b.nom} ${b.prenom || ""}`.toLowerCase())
        );
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.experience.date_inscription).getTime() -
            new Date(a.experience.date_inscription).getTime()
        );
      default:
        return sorted;
    }
  };

  const avocatsTries = sortBy ? sortAvocats(avocats, sortBy) : avocats;

  const triOptions = [
    { value: "", label: "Par défaut" },
    { value: "rating", label: "Mieux notés" },
    { value: "experience", label: "Plus expérimentés" },
    { value: "nom", label: "Alphabétique" },
    { value: "recent", label: "Récemment inscrits" },
  ];

  const experienceOptions = [
    { value: "", label: "Tous niveaux" },
    { value: "5", label: "5 ans et plus" },
    { value: "10", label: "10 ans et plus" },
    { value: "20", label: "20 ans et plus" },
  ];

  const genreOptions = [
    { value: "", label: "Tous" },
    { value: "homme", label: "Homme" },
    { value: "femme", label: "Femme" },
  ];

  const langueOptions = [
    { value: "", label: "Toutes les langues" },
    { value: "arabe", label: "Arabe" },
    { value: "francais", label: "Français" },
    { value: "anglais", label: "Anglais" },
    { value: "tamazight", label: "Tamazight" },
  ];

  const totalAvocats = avocats.length;
  const specialitesURL = searchParams.getAll("specialite");
  const wilayaURL = searchParams.get("wilaya");

  const activeFilters: { key: keyof SearchFilters; label: string }[] = [];
  if (filters.genre)
    activeFilters.push({
      key: "genre",
      label: filters.genre === "homme" ? "Homme" : "Femme",
    });
  if (filters.experience_min)
    activeFilters.push({
      key: "experience_min",
      label: `${filters.experience_min} ans min.`,
    });
  if (filters.langues)
    activeFilters.push({ key: "langues", label: filters.langues });

  const hasAdditionalFilters = activeFilters.length > 0;

  const specialitesLabel =
    specialitesURL.length > 1
      ? `${specialitesURL.length} spécialités sélectionnées`
      : specialitesURL.length === 1
        ? specialitesURL[0]
        : "Tous les avocats";

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.search-header, .sidebar, .search-avocat-card { opacity: 0; }`}</style>

      <div className="search-header sticky top-16 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 flex-wrap flex-1">
            <span className="text-sm font-semibold text-slate-800">
              {specialitesLabel}
            </span>
            {wilayaURL && (
              <span className="text-sm text-slate-400">· {wilayaURL}</span>
            )}
            <span className="text-sm text-slate-400">
              — {totalAvocats} résultat{totalAvocats > 1 ? "s" : ""}
            </span>

            {activeFilters.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-xs font-medium"
              >
                {f.label}
                <button
                  onClick={() => removeFilter(f.key)}
                  className="hover:text-teal-900 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 relative z-[999]">
            <span className="text-sm text-slate-500 hidden sm:inline">
              Trier par
            </span>
            <div className="w-44">
              <CustomSelect
                options={triOptions}
                placeholder="Par défaut"
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <aside className="sidebar lg:sticky lg:top-36 lg:self-start">
            <div className="bg-white shadow-sm rounded-xl p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Genre
                </p>
                <div className="relative z-30">
                  <CustomSelect
                    options={genreOptions}
                    placeholder="Tous"
                    value={filters.genre || ""}
                    onChange={(value) =>
                      handleFilterChange("genre", value || undefined)
                    }
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Expérience minimum
                </p>
                <div className="relative z-20">
                  <CustomSelect
                    options={experienceOptions}
                    placeholder="Tous niveaux"
                    value={filters.experience_min?.toString() || ""}
                    onChange={(value) =>
                      handleFilterChange(
                        "experience_min",
                        value ? parseInt(value) : undefined
                      )
                    }
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Langue
                </p>
                <div className="relative z-10">
                  <CustomSelect
                    options={langueOptions}
                    placeholder="Toutes les langues"
                    value={filters.langues || ""}
                    onChange={(value) =>
                      handleFilterChange("langues", value || undefined)
                    }
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {hasAdditionalFilters && (
                <div className="pt-2">
                  <button
                    onClick={clearFilters}
                    className="w-full text-xs text-slate-500 hover:text-slate-700 py-2 px-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all cursor-pointer font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 animate-pulse border border-slate-100"
                  >
                    <div className="w-10 h-10 bg-slate-200 rounded-full mb-3" />
                    <div className="h-3.5 bg-slate-200 rounded mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : totalAvocats > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {avocatsTries.map((avocat: AvocatData) => (
                  <div key={avocat.id} className="search-avocat-card">
                    <AvocatCard avocat={avocat} searchParams={searchParams} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-5 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="w-9 h-9 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Aucun avocat ne correspond à vos critères
                </h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
                  Essayez de modifier ou réinitialiser vos filtres
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={clearFilters}>
                    Réinitialiser les filtres
                  </Button>
                  <Link href="/">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                      Nouvelle recherche
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
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
