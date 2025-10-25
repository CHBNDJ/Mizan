"use client";

import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Général");
  const containerRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      category: "Général",
      questions: [
        {
          q: "Qu'est-ce que Mizan ?",
          a: "Mizan est une plateforme en ligne qui met en relation des clients à la recherche de services juridiques avec des avocats inscrits au barreau en Algérie. Nous facilitons la recherche et la prise de contact avec les professionnels du droit.",
        },
        {
          q: "L'utilisation de Mizan est-elle gratuite ?",
          a: "Oui, l'inscription et la recherche d'avocats sont entièrement gratuites pour les clients. Les avocats peuvent également réclamer et gérer leur profil gratuitement.",
        },
        {
          q: "Comment contacter le support ?",
          a: "Vous pouvez nous contacter via notre page de contact ou directement par email à support@mizan-dz.com pour les questions techniques.",
        },
      ],
    },
    {
      category: "Pour les clients",
      questions: [
        {
          q: "Comment trouver un avocat ?",
          a: "Utilisez notre moteur de recherche en page d'accueil pour filtrer les avocats par spécialité juridique et localisation (wilaya). Vous pouvez affiner votre recherche selon vos besoins.",
        },
        {
          q: "Comment contacter un avocat ?",
          a: "Visitez le profil de l'avocat et utilisez le formulaire de contact. L'avocat recevra votre demande par email et pourra vous répondre directement.",
        },
        {
          q: "Puis-je laisser un avis ?",
          a: "Oui, vous pouvez laisser un avis après avoir consulté un avocat. Les avis sont soumis à modération pour garantir leur authenticité et leur pertinence.",
        },
        {
          q: "Les avocats sont-ils vérifiés ?",
          a: "Oui, tous les avocats sur Mizan doivent prouver leur inscription au barreau en Algérie. Nous vérifions leurs documents avant d'activer leur profil.",
        },
      ],
    },
    {
      category: "Pour les avocats",
      questions: [
        {
          q: "Comment réclamer mon profil ?",
          a: "Si vous trouvez votre profil sur Mizan, cliquez sur 'Réclamer ce profil'. Vous recevrez un code de vérification sur votre email professionnel pour confirmer votre identité.",
        },
        {
          q: "Comment modifier mon profil ?",
          a: "Après avoir réclamé votre profil, connectez-vous à votre espace personnel. Vous pourrez modifier vos informations, spécialités, coordonnées et ajouter une photo.",
        },
        {
          q: "Qui peut voir mes coordonnées ?",
          a: "Vos coordonnées professionnelles (téléphone, adresse cabinet) sont visibles sur votre profil public. Votre email professionnel est utilisé uniquement pour les notifications système.",
        },
        {
          q: "Comment supprimer mon profil ?",
          a: "Vous pouvez supprimer votre profil directement depuis les paramètres de votre compte. La suppression est immédiate et définitive.",
        },
        {
          q: "Comment recevoir des demandes de consultation ?",
          a: "Lorsqu'un client vous contacte via votre profil, vous recevez une notification par email. Vous pouvez ensuite répondre directement au client.",
        },
      ],
    },
    {
      category: "Sécurité et confidentialité",
      questions: [
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Oui, nous utilisons des protocoles de sécurité avancés (HTTPS, cryptage des mots de passe) et hébergeons vos données sur des serveurs sécurisés Supabase.",
        },
        {
          q: "Qui a accès à mes informations personnelles ?",
          a: "Vos données personnelles ne sont jamais vendues. Seules les informations publiques de votre profil sont visibles par les utilisateurs. Consultez notre Politique de Confidentialité pour plus de détails.",
        },
        {
          q: "Comment exercer mes droits RGPD ?",
          a: "Vous pouvez exercer vos droits d'accès, rectification ou suppression en nous contactant à contact@mizan-dz.com ou directement depuis les paramètres de votre compte.",
        },
        {
          q: "Les avis sont-ils modérés ?",
          a: "Oui, tous les avis publiés sont soumis à une modération pour garantir leur authenticité et éviter les abus.",
        },
      ],
    },
  ];

  const tabs = [
    "Général",
    "Pour les clients",
    "Pour les avocats",
    "Sécurité et confidentialité",
  ];

  const filteredFaqs = faqs.filter(
    (category) => category.category === activeTab
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".back-btn",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".main-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".tabs-wrapper",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".cta-block",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    const faqItems = document.querySelectorAll(".faq-item");

    gsap.fromTo(
      faqItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      }
    );
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .back-btn,
        .main-title,
        .subtitle,
        .tabs-wrapper,
        .faq-item,
        .cta-block {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-5 py-16" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="back-btn cursor-pointer inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-all mb-8 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="main-title text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Questions Fréquentes
          </h1>
          <p className="subtitle text-xl text-slate-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="tabs-wrapper mb-12">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={faqIndex}
                        className="faq-item bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                      >
                        <button
                          onClick={() =>
                            setOpenIndex(isOpen ? null : globalIndex)
                          }
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                        >
                          <span className="font-semibold text-slate-900 pr-4 text-base md:text-lg">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-teal-600 transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Aucun résultat
            </h3>
            <p className="text-slate-600">
              Essayez avec d'autres mots-clés ou contactez-nous directement.
            </p>
          </div>
        )}

        <div className="cta-block mt-16 bg-teal-500 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-teal-50 text-base md:text-lg">
                Notre équipe est là pour vous aider rapidement
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold text-lg rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
