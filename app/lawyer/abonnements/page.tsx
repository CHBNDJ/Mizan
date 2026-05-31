"use client";
import { useState } from "react";
import {
  CheckCircle,
  Zap,
  Shield,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "3mois",
    label: "3 mois",
    price: 15000,
    pricePerMonth: 5000,
    discount: null,
    badge: null,
    description: "Pour découvrir la plateforme",
    features: [
      "Profil visible sur Mizan",
      "Accès aux demandes clients",
      "Messagerie intégrée",
      "Avis clients Mizan",
      "Support email",
    ],
  },
  {
    id: "6mois",
    label: "6 mois",
    price: 27000,
    pricePerMonth: 4500,
    discount: "Économisez 3 000 DZD",
    badge: "Populaire",
    description: "L'équilibre idéal",
    features: [
      "Profil visible sur Mizan",
      "Accès aux demandes clients",
      "Messagerie intégrée",
      "Avis clients Mizan",
      "Support email prioritaire",
      "Badge profil mis en avant",
    ],
  },
  {
    id: "12mois",
    label: "12 mois",
    price: 48000,
    pricePerMonth: 4000,
    discount: "Économisez 12 000 DZD",
    badge: "Meilleure offre",
    description: "Le plus avantageux",
    features: [
      "Profil visible sur Mizan",
      "Accès aux demandes clients",
      "Messagerie intégrée",
      "Avis clients Mizan",
      "Support email prioritaire",
      "Badge profil mis en avant",
      "Apparition en tête de recherche",
      "Statistiques de visibilité",
    ],
  },
];

const formatDZD = (amount: number) => amount.toLocaleString("fr-DZ") + " DZD";

export default function AbonnementsPage() {
  const [selected, setSelected] = useState("6mois");
  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-semibold text-teal-700 mb-4">
            <Zap className="w-3 h-3" />
            Tarification simple et transparente
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            Rejoignez les avocats <br className="hidden sm:block" />
            visibles sur Mizan
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Un abonnement fixe, sans commission sur vos honoraires.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-teal-600 bg-white shadow-lg shadow-teal-100"
                    : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${plan.badge === "Meilleure offre" ? "bg-teal-600 text-white" : "bg-amber-400 text-amber-900"}`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-slate-500 mb-1">
                    {plan.label}
                  </div>
                  <div className="text-3xl font-bold text-slate-800">
                    {formatDZD(plan.price)}
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5">
                    {formatDZD(plan.pricePerMonth)} / mois
                  </div>
                  {plan.discount && (
                    <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                      {plan.discount}
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  {plan.description}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? "text-teal-600" : "text-slate-300"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm text-slate-500 mb-1">Plan sélectionné</div>
            <div className="text-xl font-bold text-slate-800">
              {selectedPlan.label} — {formatDZD(selectedPlan.price)}
            </div>
            <div className="text-sm text-slate-400 mt-0.5">
              Soit {formatDZD(selectedPlan.pricePerMonth)} par mois · Paiement
              unique
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a href="mailto:contact@mizan-dz.com">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer">
                S'abonner maintenant
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <a href="mailto:contact@mizan-dz.com">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-medium text-sm transition-all cursor-pointer">
                <MessageCircle className="w-4 h-4" />
                Nous contacter
              </button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: Shield,
              title: "Sans engagement",
              desc: "Pas de renouvellement automatique. Vous choisissez votre durée.",
            },
            {
              icon: Star,
              title: "Sans commission",
              desc: "Vos honoraires vous appartiennent. Mizan ne touche rien sur vos consultations.",
            },
            {
              icon: CheckCircle,
              title: "Profil vérifié",
              desc: "Votre profil affiche le badge Mizan pour rassurer vos clients.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                <item.icon className="w-4 h-4 text-teal-600" />
              </div>
              <div className="font-semibold text-slate-800 text-sm mb-1">
                {item.title}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">
            Questions fréquentes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                q: "Comment se fait le paiement ?",
                r: "Par virement CIB, Edahabia via Chargily, ou par tout autre moyen disponible. Vous recevez une confirmation par email dès réception.",
              },
              {
                q: "Puis-je changer de plan ?",
                r: "Oui — à l'expiration de votre abonnement en cours vous pouvez choisir un nouveau plan.",
              },
              {
                q: "Mes honoraires sont-ils impactés ?",
                r: "Non. Mizan ne prend aucune commission sur vos consultations. Vos tarifs sont sur demande.",
              },
              {
                q: "Comment activer mon profil ?",
                r: "Après inscription et paiement, votre profil est examiné sous 24 à 48h puis mis en ligne automatiquement.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="font-semibold text-slate-800 text-sm mb-2">
                  {item.q}
                </div>
                <div className="text-sm text-slate-500 leading-relaxed">
                  {item.r}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
