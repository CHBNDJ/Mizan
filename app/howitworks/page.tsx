"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"client" | "avocat">("client");

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7 }
    )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        ".tabs-row",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      );

    gsap.fromTo(
      ".cta-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".step-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
    gsap.fromTo(
      ".faq-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, [activeTab]);

  const clientSteps = [
    {
      n: "1",
      title: "Cherchez",
      desc: "Filtrez par spécialité juridique et wilaya. Que vous soyez à Alger, Batna ou depuis la France — les résultats s'adaptent à votre situation.",
      points: [
        "20 spécialités disponibles",
        "Recherche par wilaya",
        "Accessible depuis l'étranger",
      ],
    },
    {
      n: "2",
      title: "Comparez",
      desc: "Consultez les profils : expérience, spécialités, barreau d'inscription, avis Google et avis Mizan. Chaque avocat est vérifié avant d'apparaître.",
      points: [
        "Avis Google affichés",
        "Vérification barreau",
        "Années d'expérience",
      ],
    },
    {
      n: "3",
      title: "Contactez",
      desc: "Créez un compte gratuitement et envoyez une demande de consultation directement depuis le profil. L'avocat vous répond par messagerie.",
      points: [
        "Inscription gratuite",
        "Messagerie sécurisée",
        "Notifications temps réel",
      ],
    },
  ];

  const clientFaqs = [
    {
      q: "Puis-je utiliser Mizan depuis l'étranger ?",
      a: "Oui, la plateforme est accessible depuis n'importe quel pays. La diaspora algérienne peut contacter un avocat algérien directement depuis la France, le Canada ou ailleurs.",
    },
    {
      q: "L'inscription est-elle payante ?",
      a: "Non, l'inscription et la recherche d'avocats sont entièrement gratuites pour les clients.",
    },
    {
      q: "Comment savoir si un avocat est fiable ?",
      a: "Chaque avocat est vérifié par notre équipe avant activation. Les avis Google et Mizan sont affichés sur son profil.",
    },
    {
      q: "Je ne connais pas d'avocat dans la wilaya dont j'ai besoin",
      a: "C'est exactement pour ça que Mizan existe. Filtrez par wilaya et spécialité — vous trouverez le bon profil sans avoir besoin de recommandations.",
    },
  ];

  const avocatSteps = [
    {
      n: "1",
      title: "Inscrivez-vous",
      desc: "Créez votre profil en quelques minutes — spécialités, expérience, cabinet, coordonnées. Votre numéro de carte professionnelle sera demandé pour la vérification.",
      points: ["Profil complet", "Carte professionnelle requise", "Gratuit"],
    },
    {
      n: "2",
      title: "Vérification",
      desc: "Notre équipe valide votre inscription au barreau sous 24-48h. Une fois activé, votre profil apparaît dans les résultats de recherche.",
      points: ["Délai 24-48h", "Vérification barreau", "Activation manuelle"],
    },
    {
      n: "3",
      title: "Recevez des clients",
      desc: "Les clients vous contactent via la messagerie intégrée. Vous recevez une notification par email à chaque nouvelle demande de consultation.",
      points: [
        "Messagerie intégrée",
        "Notification email",
        "Gestion des consultations",
      ],
    },
  ];

  const avocatFaqs = [
    {
      q: "Mon profil existe peut-être déjà sur Mizan",
      a: "Si vous avez un Google Business ou un site web professionnel, vos informations publiques ont pu être référencées. Vous pouvez réclamer et prendre le contrôle de votre profil existant.",
    },
    {
      q: "L'inscription est-elle payante pour les avocats ?",
      a: "Non, l'inscription et la gestion de profil sont gratuites. Mizan est actuellement en phase de lancement.",
    },
    {
      q: "Qui peut voir mes coordonnées ?",
      a: "Vos coordonnées professionnelles sont visibles sur votre profil public uniquement pour les clients connectés.",
    },
    {
      q: "Comment modifier ou supprimer mon profil ?",
      a: "Depuis votre espace personnel, vous pouvez modifier vos informations à tout moment. La suppression est immédiate et définitive depuis les paramètres.",
    },
  ];

  const steps = activeTab === "client" ? clientSteps : avocatSteps;
  const faqs = activeTab === "client" ? clientFaqs : avocatFaqs;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .hero-title, .hero-sub, .tabs-row,
        .step-card, .faq-card, .cta-section { opacity: 0; }
      `}</style>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="hero-title text-3xl sm:text-5xl font-bold text-slate-800 mb-5 leading-tight">
            Comment fonctionne Mizan ?
          </h1>
          <p className="hero-sub text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Mizan connecte des clients — en Algérie ou à l'étranger — avec des
            avocats vérifiés, inscrits au barreau. Simple, direct, sans
            intermédiaire.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="tabs-row flex justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveTab("client")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "client"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-200"
              }`}
            >
              Vous êtes client
            </button>
            <button
              onClick={() => setActiveTab("avocat")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "avocat"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-200"
              }`}
            >
              Vous êtes avocat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {steps.map((step) => (
              <div
                key={step.n}
                className="step-card bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-bold text-teal-700 flex-shrink-0">
                    {step.n}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {step.title}
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {step.desc}
                </p>
                <div className="space-y-1.5">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {activeTab === "avocat" && (
            <div className="mb-10 bg-teal-50 border border-teal-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-teal-800 mb-1">
                  Votre profil existe peut-être déjà sur Mizan
                </div>
                <div className="text-xs text-teal-700 leading-relaxed">
                  Si vous avez un Google Business ou un site web, vos
                  informations publiques ont pu être référencées. Réclamez votre
                  profil pour en prendre le contrôle.
                </div>
              </div>
              <Link href="/search">
                <button className="flex-shrink-0 text-sm px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap">
                  Chercher mon profil
                </button>
              </Link>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4 text-center">
              Questions fréquentes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-card bg-white border border-slate-200 rounded-xl p-4 hover:border-teal-100 transition-all"
                >
                  <div className="text-sm font-semibold text-slate-800 mb-1.5">
                    {faq.q}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section py-12 px-4 bg-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-teal-100 mb-8 text-base">
            Trouvez votre avocat ou rejoignez la plateforme
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <button className="px-8 py-3 bg-white hover:bg-teal-50 text-teal-600 font-semibold rounded-xl transition-all cursor-pointer shadow-sm">
                Trouver un avocat
              </button>
            </Link>
            <Link href="/auth/lawyer/register">
              <button className="px-8 py-3 bg-transparent hover:bg-teal-500 text-white font-semibold rounded-xl border border-white/50 transition-all cursor-pointer">
                S'inscrire comme avocat
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
