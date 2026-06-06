"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Search, ChevronRight, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AlgeriaMapV2 } from "@/components/AlgeriaMap";
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

const PROFESSIONS: Record<
  ProfId,
  {
    label: string;
    labelPlural: string;
    icon: string;
    hero: string;
    sub: string;
    searchLabel: string;
    domainLabel: string;
    color: string;
    badge: string;
    numLabel: string;
    steps: { title: string; desc: string }[];
  }
> = {
  avocat: {
    label: "Avocat",
    labelPlural: "avocats",
    icon: "⚖️",
    hero: "Trouvez votre avocat en Algérie",
    sub: "Filtrez par spécialité et wilaya. Consultez les avis, l'expérience et contactez directement. Que vous soyez en Algérie ou dans la diaspora.",
    searchLabel: "Rechercher un avocat",
    domainLabel: "Spécialité",
    color: "teal",
    badge: "Vérifié au barreau",
    numLabel: "N° de barreau",
    steps: [
      {
        title: "Choisissez votre wilaya",
        desc: "Cliquez directement sur la carte ou utilisez le sélecteur. Filtrez ensuite par spécialité juridique.",
      },
      {
        title: "Comparez les profils",
        desc: "Avis Google, années d'expérience, spécialités — tout est affiché pour vous aider à choisir.",
      },
      {
        title: "Contactez directement",
        desc: "Créez un compte gratuit et envoyez votre demande. L'avocat vous répond par messagerie sécurisée.",
      },
    ],
  },
  notaire: {
    label: "Notaire",
    labelPlural: "notaires",
    icon: "📜",
    hero: "Trouvez un notaire en Algérie",
    sub: "Actes immobiliers, successions, contrats de mariage, donations — nos notaires vérifiés vous accompagnent depuis n'importe où.",
    searchLabel: "Rechercher un notaire",
    domainLabel: "Domaine",
    color: "teal",
    badge: "Inscrit à la chambre",
    numLabel: "N° chambre des notaires",
    steps: [
      {
        title: "Sélectionnez votre wilaya",
        desc: "Le notaire doit être compétent dans la wilaya du bien ou de l'acte. Choisissez précisément.",
      },
      {
        title: "Choisissez votre domaine",
        desc: "Succession, immobilier, contrat de mariage — chaque notaire a ses spécialités.",
      },
      {
        title: "Prenez contact",
        desc: "Envoyez votre demande et décrivez votre situation. Le notaire vous répond directement.",
      },
    ],
  },
  huissier: {
    label: "Huissier",
    labelPlural: "huissiers",
    icon: "🔏",
    hero: "Trouvez un huissier en Algérie",
    sub: "Constats officiels, exécution de jugements, recouvrement de créances — nos huissiers assermentés interviennent dans toute l'Algérie.",
    searchLabel: "Rechercher un huissier",
    domainLabel: "Type d'intervention",
    color: "teal",
    badge: "Assermenté",
    numLabel: "N° d'huissier",
    steps: [
      {
        title: "Identifiez votre wilaya",
        desc: "L'huissier intervient dans sa zone de compétence territoriale. Choisissez la bonne wilaya.",
      },
      {
        title: "Type d'intervention",
        desc: "Constat, signification, recouvrement — chaque type d'acte a ses procédures spécifiques.",
      },
      {
        title: "Contactez rapidement",
        desc: "Certaines interventions sont urgentes. Décrivez votre situation pour obtenir une réponse rapide.",
      },
    ],
  },
  comptable: {
    label: "Comptable",
    labelPlural: "comptables",
    icon: "📊",
    hero: "Trouvez un comptable en Algérie",
    sub: "Création d'entreprise, bilans annuels, déclarations fiscales — nos experts-comptables et comptables agréés accompagnent entrepreneurs et diaspora.",
    searchLabel: "Rechercher un comptable",
    domainLabel: "Domaine",
    color: "teal",
    badge: "Agréé ONEC/ONCA",
    numLabel: "N° ONEC/ONCA",
    steps: [
      {
        title: "Choisissez votre wilaya",
        desc: "Même à distance, un comptable algérien connaît le contexte local et les exigences de l'administration.",
      },
      {
        title: "Votre besoin",
        desc: "Création d'entreprise, bilan annuel, déclarations — chaque comptable a ses domaines de prédilection.",
      },
      {
        title: "Consultation à distance",
        desc: "La plupart des missions comptables se font par messagerie et documents. Contactez directement.",
      },
    ],
  },
};

export default function ProfessionPage() {
  const params = useParams();
  const router = useRouter();
  const profId = (params?.profession as ProfId) || "avocat";
  const prof = PROFESSIONS[profId] || PROFESSIONS.avocat;

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState<string[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [topPros, setTopPros] = useState<any[]>([]);
  const [loadingWilayas, setLoadingWilayas] = useState(true);

  const domaines = DOMAINES_PAR_PROFESSION[profId] || [];
  const domaineOptions = domaines.map((d) => ({ value: d, label: d }));
  const wilayaOptions = wilayas.map((w) => ({ value: w, label: w }));

  useEffect(() => {
    getWilayas().then((w) => {
      setWilayas(w);
      setLoadingWilayas(false);
    });
    getTopRatedAvocats(6, profId).then(setTopPros);
  }, [profId]);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".ph-badge",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
      .fromTo(
        ".ph-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.3"
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
        ".ph-steps",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.2"
      );

    gsap.fromTo(
      ".ph-pros",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".ph-pros-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [profId]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("profession", profId);
    if (selectedWilaya) params.set("wilaya", selectedWilaya);
    selectedDomaines.forEach((d) => params.append("specialite", d));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .ph-badge, .ph-title, .ph-sub, .ph-form, .ph-map,
        .ph-steps, .ph-pros { opacity:0; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Retour */}
          <Link href="/">
            <button className="ph-badge inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium mb-8 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" /> Accueil
            </button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Colonne gauche — texte + formulaire */}
            <div>
              <div className="ph-badge inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <span>{prof.icon}</span> {prof.badge}
              </div>

              <h1 className="ph-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-5 leading-tight">
                {prof.hero}
              </h1>

              <p className="ph-sub text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
                {prof.sub}
              </p>

              {/* Formulaire de recherche */}
              <div className="ph-form bg-white rounded-2xl shadow-md p-5 space-y-3">
                {/* Domaines — tous les professions */}
                <div className="relative z-30">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
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

                {/* Wilaya — mobile uniquement (desktop a la carte) */}
                <div className="lg:hidden relative z-20">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
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
                      size="large"
                    />
                  )}
                </div>

                {/* Wilaya sélectionnée sur desktop (depuis la carte) */}
                {selectedWilaya && (
                  <div className="hidden lg:flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-500" />
                      <span className="text-sm font-semibold text-teal-700">
                        📍 {selectedWilaya}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedWilaya("")}
                      className="text-xs text-teal-400 hover:text-teal-600 cursor-pointer font-medium"
                    >
                      Effacer ✕
                    </button>
                  </div>
                )}

                <Button
                  onClick={handleSearch}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 font-semibold text-base"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {prof.searchLabel}
                </Button>
              </div>

              {/* Steps */}
              <div className="mt-8 space-y-4">
                {prof.steps.map((step, i) => (
                  <div key={i} className="ph-steps flex gap-3">
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

            {/* Colonne droite — Carte Algérie (desktop/tablette uniquement) */}
            <div className="ph-map hidden lg:block sticky top-24">
              <AlgeriaMapV2
                selectedWilaya={selectedWilaya}
                onSelect={setSelectedWilaya}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Top professionnels ───────────────────────────── */}
      {topPros.length > 0 && (
        <section className="ph-pros-section pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="ph-pros text-2xl font-bold text-slate-800 mb-2">
                {prof.labelPlural.charAt(0).toUpperCase() +
                  prof.labelPlural.slice(1)}{" "}
                les mieux notés
              </h2>
              <p className="text-slate-500">
                Recommandés par notre communauté · Vérifiés par Mizan
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {topPros.map((pro) => (
                <div key={pro.id} className="ph-pros">
                  <AvocatCard avocat={pro} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors cursor-pointer"
              >
                Voir tous les {prof.labelPlural}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA inscription professionnel ────────────────── */}
      <section className="py-12 px-4 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Vous êtes {prof.label.toLowerCase()} en Algérie ?
          </h2>
          <p className="text-teal-100 mb-6 leading-relaxed">
            Rejoignez Mizan et soyez visible par des clients de toute l'Algérie
            et de la diaspora. Inscription gratuite, vérification sous 24-48h.
          </p>
          <Link href="/auth/lawyer/register">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer shadow-sm">
              Créer mon profil {prof.label.toLowerCase()}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
