"use client";
import { useState } from "react";
import { Check, Bell } from "lucide-react";

const PLANS = [
  {
    id: "3mois",
    duration: "3 mois",
    price: 18000,
    monthly: 6000,
    badge: null,
    savings: null,
  },
  {
    id: "6mois",
    duration: "6 mois",
    price: 33000,
    monthly: 5500,
    badge: "Le plus choisi",
    savings: "Économisez 3 000 DZD",
  },
  {
    id: "12mois",
    duration: "12 mois",
    price: 60000,
    monthly: 5000,
    badge: "Meilleure offre",
    savings: "Économisez 12 000 DZD",
  },
];

const BASE = [
  "Profil visible sur Mizan",
  "Accès aux demandes clients",
  "Messagerie intégrée",
  "Avis clients vérifiés",
  "Support prioritaire",
];

const EXTRA: Record<string, string[]> = {
  "6mois": ["Badge mis en avant"],
  "12mois": ["Badge mis en avant", "Tête de recherche", "Statistiques"],
};

const fmt = (n: number) => n.toLocaleString("fr-DZ") + " DZD";

export default function AbonnementsPage() {
  const [selected, setSelected] = useState("6mois");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const plan = PLANS.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span>⏳</span>
            Paiement en ligne bientôt disponible
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none mb-5">
            Votre cabinet,
            <br />
            <span className="text-teal-600">visible partout.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">
            Un abonnement fixe. Zéro commission sur vos honoraires.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {PLANS.map((p) => {
            const on = selected === p.id;
            const extras = EXTRA[p.id] || [];
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`relative text-left rounded-2xl p-6 transition-all duration-200 ${
                  on
                    ? "bg-slate-900 shadow-xl shadow-slate-900/20 -translate-y-1"
                    : "bg-white border border-slate-200 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                {p.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      p.id === "6mois"
                        ? "bg-teal-600 text-white"
                        : "bg-amber-400 text-amber-900"
                    }`}
                  >
                    {p.badge}
                  </div>
                )}

                <div
                  className={`text-xs font-semibold uppercase tracking-widest mb-4 ${on ? "text-slate-500" : "text-slate-400"}`}
                >
                  {p.duration}
                </div>

                <div className="mb-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${on ? "text-white" : "text-slate-900"}`}
                  >
                    {p.monthly.toLocaleString("fr-DZ")}
                  </span>
                  <span
                    className={`text-sm ml-1 ${on ? "text-slate-500" : "text-slate-400"}`}
                  >
                    DZD/mois
                  </span>
                </div>

                <div
                  className={`text-xs mb-3 ${on ? "text-slate-600" : "text-slate-400"}`}
                >
                  {fmt(p.price)} total
                </div>

                {p.savings && (
                  <div
                    className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full mb-4 ${
                      on
                        ? "bg-teal-900/40 text-teal-400"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    {p.savings}
                  </div>
                )}

                <div
                  className={`h-px mb-4 ${on ? "bg-white/10" : "bg-slate-100"}`}
                />

                <ul className="space-y-2">
                  {[...BASE, ...extras].map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-xs ${on ? "text-slate-400" : "text-slate-600"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          on ? "bg-teal-900/50" : "bg-teal-50"
                        }`}
                      >
                        <Check
                          size={9}
                          className={on ? "text-teal-400" : "text-teal-600"}
                          strokeWidth={3}
                        />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 mb-12 flex-wrap">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">
              Sélectionné
            </div>
            <div className="text-lg font-bold text-slate-900">
              {plan.duration} ·{" "}
              <span className="text-teal-600">{fmt(plan.price)}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {fmt(plan.monthly)}/mois · Sans engagement · Sans commission
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-base">⏳</span>
            <div>
              <div className="text-xs font-bold text-amber-800">
                Bientôt disponible
              </div>
              <div className="text-xs text-amber-600">
                Notifiez-moi ci-dessous
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,148,136,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />
          <div className="relative">
            <div className="text-3xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Soyez le premier notifié
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              Le paiement CIB et Edahabia arrive très bientôt. Laissez votre
              email.
            </p>

            {!submitted ? (
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email) setSubmitted(true);
                  }}
                  className="flex-1 bg-white/8 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  onClick={() => {
                    if (email) setSubmitted(true);
                  }}
                  className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Bell size={14} />
                  Me notifier
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-teal-900/40 border border-teal-700/50 px-5 py-3 rounded-xl">
                <Check size={16} className="text-teal-400" strokeWidth={2.5} />
                <span className="text-sm text-teal-400 font-semibold">
                  Vous serez notifié dès l'ouverture !
                </span>
              </div>
            )}

            <p className="text-slate-600 text-xs mt-6">
              En attendant :{" "}
              <a
                href="mailto:contact@mizan-dz.com"
                className="text-slate-500 hover:text-teal-400 transition-colors"
              >
                contact@mizan-dz.com
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            ["🔒", "Sans engagement", "Résiliable à l'expiration."],
            ["💯", "Zéro commission", "Vos honoraires vous appartiennent."],
            ["✅", "Profil vérifié", "Badge Mizan sur votre profil."],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-4 flex gap-3 items-start"
            >
              <span className="text-lg">{icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-0.5">
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
