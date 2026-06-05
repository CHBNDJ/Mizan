"use client";
import { useState } from "react";
import { Check } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 pt-16">
      <style>{`
        .plan-card {
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          cursor: pointer;
        }
        .plan-card:not(.selected):hover {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%) !important;
          border-color: #0D9488 !important;
          box-shadow: 0 8px 28px rgba(13,148,136,0.25) !important;
          transform: translateY(-4px);
        }
        .plan-card:not(.selected):hover .card-duration,
        .plan-card:not(.selected):hover .card-total,
        .plan-card:not(.selected):hover .card-desc {
          color: rgba(255,255,255,0.55) !important;
        }
        .plan-card:not(.selected):hover .card-price {
          color: white !important;
        }
        .plan-card:not(.selected):hover .card-unit {
          color: rgba(255,255,255,0.45) !important;
        }
        .plan-card:not(.selected):hover .card-divider {
          background: rgba(255,255,255,0.15) !important;
        }
        .plan-card:not(.selected):hover .feature-text {
          color: rgba(255,255,255,0.8) !important;
        }
        .plan-card:not(.selected):hover .feature-off {
          color: rgba(255,255,255,0.25) !important;
        }
        .plan-card:not(.selected):hover .feature-icon {
          background: rgba(255,255,255,0.15) !important;
        }
        .plan-card:not(.selected):hover .savings-pill {
          background: rgba(255,255,255,0.15) !important;
          color: #ccfbf1 !important;
        }
        .plan-card.selected {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%) !important;
          border-color: #0D9488 !important;
          box-shadow: 0 12px 36px rgba(13,148,136,0.3) !important;
          transform: translateY(-6px);
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span>⏳</span>
            Paiement en ligne bientôt disponible
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
            Rejoignez Mizan.
            <br />
            <span className="text-teal-600">Visibilité garantie.</span>
          </h1>
          <p className="text-slate-500 text-base max-w-xs mx-auto">
            Abonnement fixe. Zéro commission.
          </p>
        </div>

        {/* Mobile/tablet : tabs + 1 card */}
        <div className="lg:hidden mb-8">
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl p-1.5 mb-6">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selected === p.id
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-500 hover:text-teal-600"
                }`}
              >
                {p.duration}
              </button>
            ))}
          </div>

          {PLANS.filter((p) => p.id === selected).map((p) => (
            <div
              key={p.id}
              className="rounded-3xl p-7 border-2 border-teal-500"
              style={{
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                boxShadow: "0 12px 36px rgba(13,148,136,0.3)",
              }}
            >
              {p.badge && (
                <div
                  className={`inline-flex mb-4 px-3 py-1 rounded-full text-xs font-bold ${
                    p.id === "6mois"
                      ? "bg-white/20 text-white"
                      : "bg-amber-400 text-amber-900"
                  }`}
                >
                  {p.badge}
                </div>
              )}
              <div className="mb-1">
                <span className="text-5xl font-bold tracking-tight text-white leading-none">
                  {p.monthly.toLocaleString("fr-DZ")}
                </span>
                <span className="text-sm ml-2 text-white/50">DZD/mois</span>
              </div>
              <div className="text-sm text-white/40 mb-2">
                {fmt(p.price)} total · paiement unique
              </div>
              {p.savings && (
                <div className="inline-flex text-xs font-bold px-3 py-1.5 rounded-full mb-4 bg-white/15 text-teal-100">
                  ✓ {p.savings}
                </div>
              )}
              <p className="text-sm text-white/60 mb-5">{p.desc}</p>
              <div className="h-px bg-white/15 mb-5" />
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-center gap-3 text-sm ${f.included ? "text-white/80" : "text-white/25 line-through"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? "bg-white/15" : "bg-transparent"}`}
                    >
                      {f.included ? (
                        <Check
                          size={11}
                          className="text-teal-100"
                          strokeWidth={3}
                        />
                      ) : (
                        <span className="text-xs text-white/25">–</span>
                      )}
                    </div>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop : 3 colonnes */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5 mb-8 items-start">
          {PLANS.map((p) => {
            const on = selected === p.id;
            return (
              <div
                key={p.id}
                className={`plan-card relative rounded-3xl p-8 flex flex-col border-2 ${
                  on ? "selected" : "bg-teal-50 border-teal-300"
                }`}
                onClick={() => setSelected(p.id)}
              >
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

                <div
                  className={`card-duration text-xs font-bold uppercase tracking-widest mb-5 ${on ? "text-white/50" : "text-teal-700"}`}
                >
                  {p.duration}
                </div>

                <div className="mb-2">
                  <span
                    className={`card-price text-5xl font-bold tracking-tight leading-none ${on ? "text-white" : "text-slate-900"}`}
                  >
                    {p.monthly.toLocaleString("fr-DZ")}
                  </span>
                  <span
                    className={`card-unit text-sm ml-2 ${on ? "text-white/45" : "text-slate-400"}`}
                  >
                    DZD/mois
                  </span>
                </div>

                <div
                  className={`card-total text-sm mb-2 ${on ? "text-white/40" : "text-slate-400"}`}
                >
                  {fmt(p.price)} total · paiement unique
                </div>

                {p.savings ? (
                  <div
                    className={`savings-pill inline-flex self-start text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${
                      on
                        ? "bg-white/15 text-teal-100"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    ✓ {p.savings}
                  </div>
                ) : (
                  <div className="mb-5 h-7" />
                )}

                <p
                  className={`card-desc text-sm leading-relaxed mb-6 ${on ? "text-white/55" : "text-teal-800/70"}`}
                >
                  {p.desc}
                </p>

                <div
                  className={`card-divider h-px mb-6 ${on ? "bg-white/15" : "bg-teal-200"}`}
                />

                <ul className="space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={`flex items-center gap-3 text-sm ${
                        f.included
                          ? on
                            ? "feature-text text-white/80"
                            : "feature-text text-slate-700"
                          : on
                            ? "feature-off text-white/25 line-through"
                            : "feature-off text-slate-300 line-through"
                      }`}
                    >
                      <div
                        className={`feature-icon w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          f.included
                            ? on
                              ? "bg-white/15"
                              : "bg-teal-100"
                            : "bg-transparent"
                        }`}
                      >
                        {f.included ? (
                          <Check
                            size={11}
                            className={on ? "text-teal-100" : "text-teal-600"}
                            strokeWidth={3}
                          />
                        ) : (
                          <span
                            className={`text-xs ${on ? "text-white/25" : "text-slate-300"}`}
                          >
                            –
                          </span>
                        )}
                      </div>
                      {f.label}
                    </li>
                  ))}
                </ul>

                {on && (
                  <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-200" />
                    <span className="text-xs text-white/40 font-semibold">
                      Plan sélectionné
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Garanties */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ["🔒", "Sans engagement", "Pas de renouvellement automatique."],
            ["💯", "Zéro commission", "Vos honoraires vous appartiennent."],
            ["✅", "Profil vérifié", "Badge Mizan affiché sur votre profil."],
          ].map(([icon, title, desc]) => (
            <div
              key={title as string}
              className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 flex gap-4 items-center"
            >
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <div className="text-sm font-bold text-slate-800 mb-0.5">
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
