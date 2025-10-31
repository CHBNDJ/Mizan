"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  Search,
  UserCheck,
  MessageCircle,
  Shield,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksPage() {
  useEffect(() => {
    // Animation du hero
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .fromTo(
        ".hero-title",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 }
      )
      .fromTo(
        ".hero-subtitle",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        "-=0.5"
      );

    // Animation des cartes étapes
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
      .fromTo(
        ".section-title",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 }
      )
      .fromTo(
        ".section-subtitle",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        "-=0.5"
      );

    gsap.fromTo(
      ".step-card",
      { autoAlpha: 0, x: -50 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".steps-section",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animation des avantages
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: ".benefits-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
      .fromTo(
        ".benefits-title",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 }
      );

    gsap.fromTo(
      ".benefit-card",
      { autoAlpha: 0, x: -50 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".benefits-section",
          start: "top 60%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animation CTA
    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      })
      .fromTo(
        ".cta-title",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 }
      )
      .fromTo(
        ".cta-subtitle",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ".cta-button",
        { autoAlpha: 0, x: -50 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        "-=0.5"
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      {/* Style CSS classique au lieu de style jsx pour Turbopack */}
      <style>{`
        .hero-title,
        .hero-subtitle,
        .section-title,
        .section-subtitle,
        .step-card,
        .benefits-title,
        .benefit-card,
        .cta-title,
        .cta-subtitle,
        .cta-button {
          opacity: 0;
        }
      `}</style>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-title text-3xl md:text-5xl font-bold text-slate-800 mb-6">
            Comment fonctionne MIZAN ?
          </h1>
          <p className="hero-subtitle text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            La plateforme qui simplifie la recherche d'expertise juridique en
            Algérie. Découvrez comment clients et avocats se connectent en toute
            confiance.
          </p>
        </div>
      </section>

      {/* Pour les clients */}
      <section className="steps-section py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              Pour les clients
            </h2>
            <p className="section-subtitle text-lg text-slate-600">
              Trouvez votre avocat en 3 étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="step-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Recherchez votre avocat
              </h3>

              <p className="text-slate-600 mb-4">
                Utilisez notre barre de recherche pour filtrer par spécialité
                juridique et région.
              </p>

              <ul className="space-y-2 flex flex-col items-center">
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Plus de 15 spécialités</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Recherche par région</span>
                </li>
              </ul>
            </div>

            {/* Étape 2 */}
            <div className="step-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-teal-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Consultez les profils
              </h3>

              <p className="text-slate-600 mb-4">
                Découvrez l'expérience, les spécialités et les avis clients de
                chaque avocat vérifié.
              </p>

              <ul className="space-y-2 flex flex-col items-center">
                {/* ✅ Version standardisée pour TOUS les <li> */}
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Profils vérifiés</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Avis clients</span>
                </li>
              </ul>
            </div>

            {/* Étape 3 */}
            <div className="step-card bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-teal-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Discutez avec votre avocat
              </h3>

              <p className="text-slate-600 mb-4">
                Échangez directement avec votre avocat grâce à notre messagerie
                intégrée.
              </p>

              <ul className="space-y-2 flex flex-col items-center">
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Messagerie sécurisée</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <span>Alertes temps réel</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="benefits-section py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="benefits-title text-3xl font-bold text-slate-800 mb-4">
              Pourquoi choisir MIZAN ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="benefit-card text-center p-6 bg-white rounded-xl">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Avocats vérifiés
              </h3>
              <p className="text-slate-600 text-sm">
                Tous nos avocats sont inscrits au barreau et vérifiés.
              </p>
            </div>

            <div className="benefit-card text-center p-6 bg-white rounded-xl">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Gain de temps
              </h3>
              <p className="text-slate-600 text-sm">
                Trouvez rapidement l'avocat spécialisé dans votre domaine.
              </p>
            </div>

            <div className="benefit-card text-center p-6 bg-white rounded-xl">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Couverture nationale
              </h3>
              <p className="text-slate-600 text-sm">
                Des avocats disponibles dans toutes les wilayas d'Algérie.
              </p>
            </div>

            <div className="benefit-card text-center p-6 bg-white rounded-xl">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Qualité garantie
              </h3>
              <p className="text-slate-600 text-sm">
                Système d'avis pour choisir en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section py-16 bg-teal-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="cta-title text-3xl font-bold text-white mb-4">
            Prêt à trouver votre avocat ?
          </h2>
          <p className="cta-subtitle text-xl text-teal-100 mb-8">
            Rejoignez des milliers de clients qui font confiance à MIZAN
          </p>
          <Link href="/">
            <button
              className="cta-button bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold 
                   hover:bg-gradient-to-r hover:from-white hover:to-teal-50
                   hover:shadow-xl hover:scale-105
                   transition-all duration-500 ease-out
                   shadow-sm border border-teal-100 cursor-pointer"
            >
              Rechercher un avocat
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
