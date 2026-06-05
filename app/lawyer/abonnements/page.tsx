"use client";
import { useState } from "react";
import { Check, ArrowRight, MessageCircle } from "lucide-react";

const PLANS = [
  {
    id: "3mois",
    duration: "3 mois",
    price: 18000,
    monthly: 6000,
    badge: null,
    savings: null,
    desc: "Pour découvrir Mizan et tester votre visibilité.",
    features: [
      { label: "Profil public visible", included: true },
      { label: "Accès aux demandes clients", included: true },
      { label: "Messagerie intégrée", included: true },
      { label: "Avis clients vérifiés", included: true },
      { label: "Support prioritaire", included: true },
      { label: "Badge « Mis en avant »", included: false },
      { label: "Priorité dans la recherche", included: false },
      { label: "Statistiques de visibilité", included: false },
    ],
  },
  {
    id: "6mois",
    duration: "6 mois",
    price: 33000,
    monthly: 5500,
    badge: "Le plus choisi",
    savings: "Économisez 3 000 DZD",
    desc: "L'essentiel pour développer votre clientèle.",
    features: [
      { label: "Profil public visible", included: true },
      { label: "Accès aux demandes clients", included: true },
      { label: "Messagerie intégrée", included: true },
      { label: "Avis clients vérifiés", included: true },
      { label: "Support prioritaire", included: true },
      { label: "Badge « Mis en avant »", included: true },
      { label: "Priorité dans la recherche", included: false },
      { label: "Statistiques de visibilité", included: false },
    ],
  },
  {
    id: "12mois",
    duration: "12 mois",
    price: 60000,
    monthly: 5000,
    badge: "Meilleure offre",
    savings: "Économisez 12 000 DZD",
    desc: "Visibilité maximale et position dominante.",
    features: [
      { label: "Profil public visible", included: true },
      { label: "Accès aux demandes clients", included: true },
      { label: "Messagerie intégrée", included: true },
      { label: "Avis clients vérifiés", included: true },
      { label: "Support prioritaire", included: true },
      { label: "Badge « Mis en avant »", included: true },
      { label: "Priorité dans la recherche", included: true },
      { label: "Statistiques de visibilité", included: true },
    ],
  },
];

const fmt = (n: number) => n.toLocaleString("fr-DZ") + " DZD";

export default function AbonnementsPage() {
  const [selected, setSelected] = useState("6mois");
  const plan = PLANS.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span>⏳</span>
            Paiement en ligne bientôt disponible
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none mb-5">
            Rejoignez Mizan.
            <br />
            <span className="text-teal-600">Visibilité garantie.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Un abonnement fixe. Vos honoraires restent les vôtres. Annulable à
            tout moment.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-3 gap-4 mb-8 items-stretch">
          {PLANS.map((p) => {
            const on = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative text-left rounded-3xl p-8 transition-all duration-200 flex flex-col ${
                  on
                    ? "bg-slate-900 shadow-2xl shadow-slate-900/25 -translate-y-2 ring-2 ring-teal-500"
                    : "bg-white border border-slate-200 hover:-translate-y-1 hover:shadow-xl hover:border-teal-200"
                }`}
              >
                {/* Badge */}
                {p.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                      p.id === "6mois"
                        ? "bg-teal-600 text-white"
                        : "bg-amber-400 text-amber-900"
                    }`}
                  >
                    {p.badge}
                  </div>
                )}

                {/* Duration */}
                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-5 ${on ? "text-slate-500" : "text-slate-400"}`}
                >
                  {p.duration}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span
                    className={`text-5xl font-bold tracking-tight leading-none ${on ? "text-white" : "text-slate-900"}`}
                  >
                    {p.monthly.toLocaleString("fr-DZ")}
                  </span>
                  <span
                    className={`text-sm ml-2 ${on ? "text-slate-500" : "text-slate-400"}`}
                  >
                    DZD/mois
                  </span>
                </div>

                <div
                  className={`text-sm mb-2 ${on ? "text-slate-500" : "text-slate-400"}`}
                >
                  {fmt(p.price)} total · paiement unique
                </div>

                {p.savings ? (
                  <div
                    className={`inline-flex self-start text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${
                      on
                        ? "bg-teal-900/40 text-teal-400"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    ✓ {p.savings}
                  </div>
                ) : (
                  <div className="mb-5 h-7" />
                )}

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed mb-6 ${on ? "text-slate-400" : "text-slate-500"}`}
                >
                  {p.desc}
                </p>

                {/* Divider */}
                <div
                  className={`h-px mb-6 ${on ? "bg-white/10" : "bg-slate-100"}`}
                />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-center gap-3 text-sm ${
                        f.included
                          ? on
                            ? "text-slate-300"
                            : "text-slate-700"
                          : on
                            ? "text-slate-700"
                            : "text-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          f.included
                            ? on
                              ? "bg-teal-900/50"
                              : "bg-teal-50"
                            : "bg-transparent"
                        }`}
                      >
                        {f.included ? (
                          <Check
                            size={11}
                            className={on ? "text-teal-400" : "text-teal-600"}
                            strokeWidth={3}
                          />
                        ) : (
                          <span
                            className={`text-xs ${on ? "text-slate-700" : "text-slate-300"}`}
                          >
                            –
                          </span>
                        )}
                      </div>
                      <span className={!f.included ? "line-through" : ""}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Selected indicator */}
                {on && (
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                    <span className="text-xs text-slate-500 font-semibold">
                      Plan sélectionné
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA bar */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-8 py-5 flex items-center justify-between gap-6 flex-wrap mb-6">
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1.5">
              Récapitulatif
            </div>
            <div className="text-xl font-bold text-slate-900">
              {plan.duration} ·{" "}
              <span className="text-teal-600">{fmt(plan.price)}</span>
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {fmt(plan.monthly)}/mois · Sans engagement · Zéro commission
            </div>
          </div>
          <div className="flex gap-3">
            <a href="mailto:contact@mizan-dz.com">
              <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-600/25">
                S'abonner maintenant
                <ArrowRight size={16} />
              </button>
            </a>
            <a href="mailto:contact@mizan-dz.com">
              <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-medium text-sm transition-colors">
                <MessageCircle size={15} />
                Nous contacter
              </button>
            </a>
          </div>
        </div>

        {/* Garanties */}
        <div className="grid grid-cols-3 gap-3">
          {[
            [
              "🔒",
              "Sans engagement",
              "Pas de renouvellement automatique. Vous choisissez votre durée.",
            ],
            [
              "💯",
              "Zéro commission",
              "Vos honoraires vous appartiennent. Mizan ne touche rien.",
            ],
            [
              "✅",
              "Profil vérifié",
              "Badge Mizan affiché publiquement pour rassurer vos clients.",
            ],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-5 flex gap-3 items-start"
            >
              <span className="text-xl">{icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-1">
                  {title}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
