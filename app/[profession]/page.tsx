"use client";
import React from "react";
import { useState, useLayoutEffect, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
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

const PROFESSIONS: Record<
  ProfId,
  {
    label: string;
    labelPlural: string;
    hero: string;
    sub: string;
    searchLabel: string;
    domainLabel: string;
    steps: { title: string; desc: string }[];
  }
> = {
  avocat: {
    label: "Avocat",
    labelPlural: "avocats",
    hero: "Trouvez votre avocat en Algérie",
    sub: "Filtrez par spécialité et wilaya. Avis clients, expérience, contact direct — depuis l'Algérie ou la diaspora.",
    searchLabel: "Rechercher un avocat",
    domainLabel: "Spécialité",
    steps: [
      {
        title: "Choisissez votre spécialité",
        desc: "Précisez votre besoin : droit civil, pénal, famille, affaires...",
      },
      {
        title: "Sélectionnez votre wilaya",
        desc: "Sur la carte interactive ou via le menu — synchronisés en temps réel.",
      },
      {
        title: "Contactez directement",
        desc: "Messagerie sécurisée. Inscription client gratuite.",
      },
    ],
  },
  notaire: {
    label: "Notaire",
    labelPlural: "notaires",
    hero: "Trouvez un notaire en Algérie",
    sub: "Actes immobiliers, successions, mariages, donations — nos notaires vérifiés depuis n'importe où.",
    searchLabel: "Rechercher un notaire",
    domainLabel: "Domaine",
    steps: [
      {
        title: "Précisez votre besoin",
        desc: "Succession, immobilier, mariage — chaque notaire a ses spécialités.",
      },
      {
        title: "Choisissez la wilaya",
        desc: "Le notaire doit être compétent dans la wilaya du bien ou de l'acte.",
      },
      {
        title: "Prenez contact",
        desc: "Décrivez votre situation, le notaire vous répond directement.",
      },
    ],
  },
  huissier: {
    label: "Huissier",
    labelPlural: "huissiers",
    hero: "Trouvez un huissier en Algérie",
    sub: "Constats officiels, exécution de jugements, recouvrement de créances — partout en Algérie.",
    searchLabel: "Rechercher un huissier",
    domainLabel: "Type d'intervention",
    steps: [
      {
        title: "Type d'acte",
        desc: "Constat, signification, recouvrement — précisez votre besoin.",
      },
      {
        title: "Identifiez la wilaya",
        desc: "L'huissier intervient dans sa zone de compétence territoriale.",
      },
      {
        title: "Contact rapide",
        desc: "Certaines interventions sont urgentes. Contactez directement.",
      },
    ],
  },
  comptable: {
    label: "Comptable",
    labelPlural: "comptables",
    hero: "Trouvez un comptable en Algérie",
    sub: "Création d'entreprise, bilans, déclarations fiscales — pour entrepreneurs résidents et diaspora.",
    searchLabel: "Rechercher un comptable",
    domainLabel: "Domaine",
    steps: [
      {
        title: "Précisez votre besoin",
        desc: "Bilan, déclarations IFU/G50, création EURL — chacun sa spécialité.",
      },
      {
        title: "Choisissez la wilaya",
        desc: "Un comptable local connaît les exigences de l'administration algérienne.",
      },
      {
        title: "Consultation à distance",
        desc: "La plupart des missions se font par messagerie et documents.",
      },
    ],
  },
  "expert-comptable": {
    label: "Expert Comptable",
    labelPlural: "experts comptables",
    hero: "Trouvez un expert-comptable en Algérie",
    sub: "Audit, évaluation d'entreprise, consolidation, due diligence — pour entreprises et diaspora.",
    searchLabel: "Rechercher un expert-comptable",
    domainLabel: "Domaine",
    steps: [
      {
        title: "Précisez votre mission",
        desc: "Audit légal, évaluation, due diligence, consolidation — chaque expert a ses spécialités.",
      },
      {
        title: "Choisissez la wilaya",
        desc: "Un expert-comptable local connaît l'environnement fiscal et réglementaire algérien.",
      },
      {
        title: "Consultation à distance",
        desc: "La majorité des missions d'expertise se font à distance par échange de documents.",
      },
    ],
  },
};

function TopProsSection({
  topPros,
  prof,
  handleSearch,
}: {
  topPros: any[];
  prof: { labelPlural: string };
  handleSearch: () => void;
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
            {prof.labelPlural.charAt(0).toUpperCase() +
              prof.labelPlural.slice(1)}{" "}
            les mieux notés
          </h2>
          <p className="text-slate-500 text-sm">
            Recommandés par notre communauté · Vérifiés par Mizan
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
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium cursor-pointer text-sm"
          >
            Voir tous les {prof.labelPlural}{" "}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ProfessionLandingPage() {
  const params = useParams();
  const router = useRouter();
  const profId = (params?.profession as ProfId) || "avocat";
  const prof = PROFESSIONS[profId] || PROFESSIONS.avocat;
  const ProfIcon = PROF_ICONS[profId] || Scale;

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState<string[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [topPros, setTopPros] = useState<any[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(true);

  const domaineOptions = (DOMAINES_PAR_PROFESSION[profId] || []).map((d) => ({
    value: d,
    label: d,
  }));
  const wilayaOptions = React.useMemo(() => {
    const opts = wilayas.map((w) => ({ value: w, label: w }));
    if (selectedWilaya && !opts.find((o) => o.value === selectedWilaya))
      opts.unshift({ value: selectedWilaya, label: selectedWilaya });
    return opts;
  }, [wilayas, selectedWilaya]);

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
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.ph-title,.ph-sub,.ph-form,.ph-map,.ph-step { opacity:0; }`}</style>

      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <button className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 sm:mb-8 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h1 className="ph-title text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-5 leading-tight text-center lg:text-left">
                {prof.hero}
              </h1>
              <p className="ph-sub text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
                {prof.sub}
              </p>
              <div
                className="ph-form bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4 relative"
                style={{ zIndex: 50 }}
              >
                <div className="relative" style={{ zIndex: 20 }}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    {prof.domainLabel}
                  </label>
                  <MultiSelectWithCheckboxes
                    placeholder={`Choisir ${profId === "avocat" ? "des spécialités" : "des domaines"}...`}
                    options={domaineOptions}
                    value={selectedDomaines}
                    onChange={setSelectedDomaines}
                    className="h-12"
                    placeholderClassName="text-slate-400 font-medium text-sm"
                  />
                </div>
                <div className="relative" style={{ zIndex: 10 }}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Wilaya
                  </label>
                  {loadingWilayas ? (
                    <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                  ) : (
                    <CustomSelect
                      placeholder="Toutes les wilayas"
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
                  {`Voir les ${prof.labelPlural}`}
                </button>
              </div>
              <div className="mt-8 space-y-4 relative" style={{ zIndex: 1 }}>
                {prof.steps.map((step, i) => (
                  <div key={i} className="ph-step flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xs font-bold text-teal-700 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 mb-0.5">
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
            <div className="ph-map hidden lg:flex flex-col gap-3 sticky top-24">
              <AlgeriaMap
                selectedWilaya={selectedWilaya}
                onSelect={setSelectedWilaya}
                hideBar
              />
              <Link href={`/professions/${profId}`}>
                <div className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl px-4 py-4 flex items-center justify-between gap-3 cursor-pointer transition-all hover:shadow-sm group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ProfIcon className="w-4 h-4 text-teal-600" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      Pourquoi choisir un {prof.label.toLowerCase()} en Algérie
                      ?
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs font-semibold text-teal-600 group-hover:text-teal-700 whitespace-nowrap">
                    En savoir plus →
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
          prof={prof}
          handleSearch={handleSearch}
        />
      )}

      <section className="py-12 px-4 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Vous êtes {prof.label.toLowerCase()} en Algérie ?
          </h2>
          <p className="text-teal-100 mb-6 leading-relaxed text-sm sm:text-base">
            Inscription gratuite, vérification sous 24-48h.
          </p>
          <Link href="/auth/lawyer/register">
            <button className="inline-flex items-center gap-2 px-7 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl cursor-pointer shadow-sm text-sm sm:text-base">
              Créer mon profil <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
