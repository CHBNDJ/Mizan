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
import { getTopRatedAvocats } from "@/lib/avocatsData";
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
    badge: string;
    steps: { title: string; desc: string }[];
  }
> = {
  avocat: {
    label: "Avocat",
    labelPlural: "avocats",
    badge: "Vérifié au barreau",
    hero: "Trouvez votre avocat en Algérie",
    sub: "Filtrez par spécialité et wilaya. Avis, expérience, contact direct — depuis l'Algérie ou la diaspora.",
    searchLabel: "Rechercher un avocat",
    steps: [
      {
        title: "Choisissez votre wilaya",
        desc: "Filtrez par wilaya depuis la page de recherche.",
      },
      {
        title: "Comparez les profils",
        desc: "Avis, expérience, spécialités — tout est visible.",
      },
      {
        title: "Contactez directement",
        desc: "Messagerie sécurisée, inscription gratuite.",
      },
    ],
  },
  notaire: {
    label: "Notaire",
    labelPlural: "notaires",
    badge: "Inscrit à la chambre",
    hero: "Trouvez un notaire en Algérie",
    sub: "Actes immobiliers, successions, mariages, donations — nos notaires vérifiés depuis n'importe où.",
    searchLabel: "Rechercher un notaire",
    steps: [
      {
        title: "Choisissez la wilaya",
        desc: "Le notaire doit être compétent dans la wilaya du bien.",
      },
      {
        title: "Votre domaine",
        desc: "Succession, immobilier, mariage — chaque notaire a ses spécialités.",
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
    badge: "Assermenté",
    hero: "Trouvez un huissier en Algérie",
    sub: "Constats officiels, exécution de jugements, recouvrement de créances — partout en Algérie.",
    searchLabel: "Rechercher un huissier",
    steps: [
      {
        title: "Identifiez la wilaya",
        desc: "L'huissier intervient dans sa zone de compétence.",
      },
      {
        title: "Type d'acte",
        desc: "Constat, signification, recouvrement — chacun a sa procédure.",
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
    badge: "Agréé ONEC/ONCA",
    hero: "Trouvez un comptable en Algérie",
    sub: "Création d'entreprise, bilans, déclarations fiscales — pour entrepreneurs et diaspora.",
    searchLabel: "Rechercher un comptable",
    steps: [
      {
        title: "Choisissez la wilaya",
        desc: "Un comptable algérien connaît les exigences locales.",
      },
      {
        title: "Votre besoin",
        desc: "Bilan, déclarations, création EURL — chacun sa spécialité.",
      },
      {
        title: "Consultation à distance",
        desc: "La plupart des missions se font par messagerie.",
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

  const [topPros, setTopPros] = useState<any[]>([]);

  useEffect(() => {
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
        ".ph-cta",
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

  const handleSearch = () => router.push(`/search?profession=${profId}`);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.ph-badge,.ph-title,.ph-sub,.ph-cta,.ph-map,.ph-steps,.ph-pros{opacity:0;}`}</style>

      {/* Hero */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <button className="ph-badge inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium mb-8 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4" /> Accueil
            </button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gauche — hero + bouton */}
            <div>
              <div className="ph-badge inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <ProfIcon className="w-3.5 h-3.5" /> {prof.badge}
              </div>

              <h1 className="ph-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-5 leading-tight">
                {prof.hero}
              </h1>

              <p className="ph-sub text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
                {prof.sub}
              </p>

              {/* Bouton unique — pas de selects ici */}
              <div className="ph-cta">
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-base transition-all cursor-pointer shadow-sm"
                >
                  <Search className="w-5 h-5" />
                  {prof.searchLabel}
                </button>
              </div>

              {/* Steps */}
              <div className="mt-10 space-y-4">
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

            {/* Droite — carte seule, pas de selects */}
            <div className="ph-map hidden lg:block">
              <AlgeriaMap
                selectedWilaya={undefined}
                onSelect={() => {
                  // Sur la landing, un clic wilaya redirige vers la search avec la wilaya
                  // On passe par un handler local
                }}
                onSelectAndSearch={(wilaya: string) => {
                  router.push(
                    `/search?profession=${profId}&wilaya=${encodeURIComponent(wilaya)}`
                  );
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top professionnels */}
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
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
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
          <h2 className="text-2xl font-bold text-white mb-3">
            Vous êtes {prof.label.toLowerCase()} en Algérie ?
          </h2>
          <p className="text-teal-100 mb-6 leading-relaxed">
            Rejoignez Mizan — inscription gratuite, vérification sous 24-48h.
          </p>
          <Link href="/auth/lawyer/register">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl cursor-pointer shadow-sm">
              Créer mon profil {prof.label.toLowerCase()}{" "}
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
