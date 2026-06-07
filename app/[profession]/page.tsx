"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
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

type ProfId = "avocat" | "notaire" | "huissier" | "comptable";

const PROF_ICONS: Record<ProfId, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
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
};

export default function ProfessionPage() {
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
  const wilayaOptions = [
    { value: "", label: "Toutes les wilayas" },
    ...wilayas.map((w) => ({ value: w, label: w })),
  ];

  useEffect(() => {
    getWilayas().then((w) => {
      setWilayas(w);
      setLoadingWilayas(false);
    });
    getTopRatedAvocats(6, profId).then(setTopPros);
    // Reset state on profession change
    setSelectedWilaya("");
    setSelectedDomaines([]);
  }, [profId]);

  useLayoutEffect(() => {
    // autoAlpha pour éviter le flash opacity:0
    gsap.set([".ph-title", ".ph-sub", ".ph-form", ".ph-map", ".ph-step"], {
      autoAlpha: 0,
    });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".ph-title", { autoAlpha: 1, y: 0, duration: 0.8, from: { y: 30 } })
      .to(".ph-sub", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
      .to(".ph-form", { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4")
      .to(".ph-map", { autoAlpha: 1, x: 0, duration: 0.7 }, "-=0.3")
      .to(
        ".ph-step",
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );

    if (topPros.length > 0) {
      gsap.fromTo(
        ".ph-pro",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".ph-pros-section",
            start: "top 90%",
            once: true,
          },
        }
      );
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [profId, topPros.length]);

  const handleSearch = () => {
    const p = new URLSearchParams();
    p.set("profession", profId);
    if (selectedWilaya) p.set("wilaya", selectedWilaya);
    selectedDomaines.forEach((d) => p.append("specialite", d));
    router.push(`/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      {/* ── Hero ── */}
      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <button className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium mb-6 sm:mb-8 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" /> Accueil
            </button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Gauche */}
            <div>
              <h1 className="ph-title text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-5 leading-tight">
                {prof.hero}
              </h1>
              <p className="ph-sub text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                {prof.sub}
              </p>

              {/* Formulaire — domaine PUIS wilaya */}
              <div className="ph-form bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-4">
                {/* 1. Domaines / Spécialités EN PREMIER */}
                <div>
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

                {/* 2. Wilaya EN SECOND — valeur visible dans le select lui-même */}
                <div>
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
                      placeholderClassName="text-slate-400 font-medium text-sm"
                    />
                  )}
                  {/* Pas de badge vert — la valeur sélectionnée apparaît directement dans le CustomSelect */}
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base"
                >
                  <Search className="w-5 h-5" />
                  {prof.searchLabel}
                </button>
              </div>

              {/* Steps */}
              <div className="mt-8 space-y-4">
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

            {/* Carte — desktop uniquement, synchronisée avec le CustomSelect wilaya */}
            <div className="ph-map hidden lg:block sticky top-24">
              <AlgeriaMap
                selectedWilaya={selectedWilaya}
                onSelect={setSelectedWilaya}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top pros */}
      {topPros.length > 0 && (
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
                <div key={pro.id} className="ph-pro">
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
      )}

      {/* CTA pro */}
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
