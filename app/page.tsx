"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  getTopRatedAvocats,
  getWilayas,
  getStatistiques,
} from "@/lib/avocatsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PROFESSIONS = [
  {
    id: "avocat",
    label: "Avocat",
    Icon: Scale,
    desc: "Droit civil, pénal, famille...",
  },
  {
    id: "notaire",
    label: "Notaire",
    Icon: FileText,
    desc: "Successions, immobilier...",
  },
  {
    id: "huissier",
    label: "Huissier",
    Icon: Briefcase,
    desc: "Constats, recouvrements...",
  },
  {
    id: "comptable",
    label: "Comptable",
    Icon: Calculator,
    desc: "Bilans, fiscalité, EURL...",
  },
  {
    id: "expert-comptable",
    label: "Expert Comptable",
    Icon: TrendingUp,
    desc: "Audit légal, due diligence",
  },
];

const HERO_TITLE = (
  <>
    Trouvez votre expert
    <br className="hidden sm:block" />{" "}
    <span className="text-teal-600">juridique en Algérie</span>
  </>
);

/* Carte desktop/tablet */
function ProfCard({ id, label, Icon, desc, size = "normal" }: any) {
  return (
    <Link href={`/${id}`}>
      <div
        className={`prof-card prof-card-btn bg-white rounded-2xl border-2 border-slate-200 cursor-pointer h-full flex flex-col items-center text-center hover:border-teal-400 hover:shadow-md transition-all ${size === "big" ? "px-6 py-6 gap-3" : "px-4 py-4 gap-2"}`}
      >
        <div
          className={`flex-shrink-0 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center ${size === "big" ? "w-12 h-12" : "w-9 h-9"}`}
        >
          <Icon
            className={`text-teal-600 ${size === "big" ? "w-6 h-6" : "w-4 h-4"}`}
          />
        </div>
        <div>
          <div
            className={`font-bold text-slate-800 ${size === "big" ? "text-base" : "text-sm"}`}
          >
            {label}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* Carte mobile */
function ProfCardHorizontal({ id, label, Icon, desc }: any) {
  return (
    <Link href={`/${id}`}>
      <div className="prof-card prof-card-btn bg-white rounded-2xl border-2 border-slate-200 cursor-pointer flex items-center gap-4 px-4 py-4 hover:border-teal-400 hover:shadow-md transition-all">
        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-teal-600" />
        </div>
        <div className="text-left">
          <div className="font-bold text-slate-800 text-sm">{label}</div>
          <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [topAvocats, setTopAvocats] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({
    total_avocats: 0,
    pourcentage_verification: 100,
  });

  useLayoutEffect(() => {
    getWilayas().then(setWilayas);
    Promise.all([getTopRatedAvocats(8), getStatistiques()]).then(
      ([top, st]) => {
        setTopAvocats(top);
        setStats(st);
      }
    );
  }, []);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ".prof-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      )
      .fromTo(
        ".stat-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.2"
      );
    gsap.fromTo(
      ".steps-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    gsap.fromTo(
      ".cta-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useLayoutEffect(() => {
    if (!topAvocats.length) return;
    gsap.fromTo(
      ".avocat-card",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".avocats-section",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [topAvocats]);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden">
      <style>{`
        .hero-title,.hero-sub,.prof-card,.stat-card,.steps-section,.avocat-card,.cta-section,.prof-roles-link { opacity:0; }
        .prof-card-btn { transition:all 0.2s ease; }
        .prof-card-btn:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(13,148,136,0.15); border-color:#0D9488 !important; }
      `}</style>

      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-2xl sm:text-4xl lg:text-6xl font-bold text-slate-800 mb-5 leading-tight tracking-tight">
            {HERO_TITLE}
          </h1>
          <p className="hero-sub text-sm sm:text-lg text-slate-500 mb-10 sm:mb-14 max-w-xl mx-auto leading-relaxed">
            L'annuaire qui vérifie pour vous.
            <br />
            Comparez. Choisissez. Contactez.
          </p>

          {/* Mobile */}
          <div className="flex flex-col gap-3 max-w-sm mx-auto sm:hidden">
            {PROFESSIONS.map((p) => (
              <ProfCardHorizontal key={p.id} {...p} />
            ))}
          </div>

          {/* Tablet T2 */}
          <div className="hidden sm:flex lg:hidden flex-col gap-3 max-w-2xl mx-auto w-full">
            <div className="grid grid-cols-2 gap-3">
              {PROFESSIONS.slice(0, 2).map((p) => (
                <ProfCard key={p.id} {...p} size="big" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PROFESSIONS.slice(2, 5).map((p) => (
                <ProfCard key={p.id} {...p} size="normal" />
              ))}
            </div>
          </div>

          {/* Desktop 5 col */}
          <div className="hidden lg:grid grid-cols-5 gap-4 max-w-5xl mx-auto">
            {PROFESSIONS.map((p) => (
              <ProfCard key={p.id} {...p} size="normal" />
            ))}
          </div>
        </div>
      </section>

      {/* Lien discret vers la page professions */}
      <section className="px-4 pb-4 pt-0">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/professions" className="prof-roles-link">
            <span className="text-xs text-slate-400 hover:text-teal-600 cursor-pointer transition-colors">
              Pas sûr de quelle profession vous avez besoin ?{" "}
              <span className="font-medium text-teal-600">
                Comprendre les rôles →
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section className="px-4 pb-14 sm:pb-20 pt-2">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { end: stats.total_avocats, label: "Professionnels inscrits" },
            { end: wilayas.length, label: "Wilayas couvertes" },
            { end: 5, label: "Catégories d'experts" },
            {
              end: stats.pourcentage_verification,
              label: "Taux de vérification",
              suffix: "%",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col items-center text-center"
            >
              <AnimatedCounter
                end={s.end}
                duration={2000}
                suffix={s.suffix}
                className="text-3xl sm:text-4xl font-bold text-teal-600 mb-2"
              />
              <div className="text-slate-600 text-xs sm:text-sm leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="steps-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 md:mb-10 text-center">
              Comment ça marche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {[
                {
                  n: "1",
                  title: "Choisissez votre expert",
                  desc: "Sélectionnez la catégorie adaptée — avocat, notaire, huissier ou comptable.",
                },
                {
                  n: "2",
                  title: "Filtrez par wilaya",
                  desc: "Choisissez votre wilaya sur la carte interactive ou via le sélecteur.",
                },
                {
                  n: "3",
                  title: "Contactez directement",
                  desc: "Messagerie sécurisée. Accessible depuis l'Algérie ou l'étranger. Inscription gratuite.",
                },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className={`flex gap-4 ${i < 2 ? "md:border-r md:border-slate-100 md:pr-10 pb-6 md:pb-0 border-b md:border-b-0 border-slate-100" : ""}`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-slate-800 mb-1.5">
                      {s.title}
                    </div>
                    <div className="text-sm text-slate-500 leading-relaxed">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {topAvocats.length > 0 && (
        <section className="avocats-section pb-16 sm:pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                Les mieux notés
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Recommandés par notre communauté · Vérifiés par Mizan
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {topAvocats.map((a) => (
                <div key={a.id} className="avocat-card">
                  <AvocatCard avocat={a} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => router.push("/search")}
                className="text-teal-600 inline-flex items-center gap-1.5 hover:text-teal-700 transition-colors cursor-pointer text-sm font-medium"
              >
                Voir tous les professionnels <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="cta-section py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-7 sm:p-10 flex flex-col text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
              Vous cherchez un expert juridique ?
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8 text-sm sm:text-base">
              Parcourez les profils vérifiés d'avocats, notaires, huissiers et
              comptables.
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <button
                onClick={() => router.push("/search")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Trouver un expert <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-teal-600 rounded-2xl p-7 sm:p-10 flex flex-col text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Vous êtes professionnel du droit ?
            </h3>
            <p className="text-teal-100 leading-relaxed mb-8 text-sm sm:text-base">
              Rejoignez Mizan et soyez visible par des clients de toute
              l'Algérie et de la diaspora.
            </p>
            <div className="mt-auto flex justify-center sm:justify-start">
              <Link href="/auth/lawyer/register">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer">
                  Créer mon profil <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
