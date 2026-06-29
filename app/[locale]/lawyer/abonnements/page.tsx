"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const PLANS_RAW = [
  {
    id: "3mois",
    price: 18000,
    monthly: 6000,
    badge: null as null | "mostChosen",
    savings: null as null | number,
    features: [
      { key: "publicProfile", included: true },
      { key: "clientRequests", included: true },
      { key: "messaging", included: true },
      { key: "verifiedReviews", included: true },
      { key: "prioritySupport", included: true },
      { key: "featuredBadge", included: false },
      { key: "searchPriority", included: false },
      { key: "visibilityStats", included: false },
    ],
  },
  {
    id: "6mois",
    price: 33000,
    monthly: 5500,
    badge: "mostChosen" as const,
    savings: 3000,
    features: [
      { key: "publicProfile", included: true },
      { key: "clientRequests", included: true },
      { key: "messaging", included: true },
      { key: "verifiedReviews", included: true },
      { key: "prioritySupport", included: true },
      { key: "featuredBadge", included: true },
      { key: "searchPriority", included: false },
      { key: "visibilityStats", included: false },
    ],
  },
  {
    id: "12mois",
    price: 60000,
    monthly: 5000,
    badge: "bestOffer" as const,
    savings: 12000,
    features: [
      { key: "publicProfile", included: true },
      { key: "clientRequests", included: true },
      { key: "messaging", included: true },
      { key: "verifiedReviews", included: true },
      { key: "prioritySupport", included: true },
      { key: "featuredBadge", included: true },
      { key: "searchPriority", included: true },
      { key: "visibilityStats", included: true },
    ],
  },
];

export default function AbonnementsPage() {
  const [selected, setSelected] = useState("6mois");
  const t = useTranslations();
  const locale = useLocale();
  const numLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ";

  const fmt = (n: number) =>
    n.toLocaleString(numLocale) +
    " " +
    t("subscriptionPlans.perMonth").split("/")[0];

  const PLANS = PLANS_RAW.map((p) => ({
    ...p,
    duration: t(`durations.${p.id}`),
    badgeLabel:
      p.badge === "mostChosen"
        ? t("subscriptionPlans.badgeMostChosen")
        : p.badge === "bestOffer"
          ? t("subscriptionPlans.badgeBestOffer")
          : null,
    savingsLabel:
      p.savings != null
        ? t("subscriptionPlans.savings", {
            amount: p.savings.toLocaleString(numLocale),
          })
        : null,
    features: p.features.map((f) => ({
      ...f,
      label: t(`subscriptionPlans.features.${f.key}`),
    })),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none pt-16">
      <style>{`
        .plan-card {
          transition: all 0.22s cubic-bezier(.4,0,.2,1);
          cursor: pointer;
        }
        .plan-card:not(.selected):hover {
          box-shadow dark:shadow-none: 0 12px 32px rgba(13,148,136,0.12) !important;
          border-color: rgba(13,148,136,0.3) !important;
          transform: translateY(-6px);
        }
        .plan-card.selected {
          background: #0D9488 !important;
          box-shadow dark:shadow-none: 0 12px 36px rgba(13,148,136,0.25) !important;
          transform: translateY(-4px);
        }
        .dark .plan-card.selected {
          background: #0F6E56 !important;
        }
        .dark .plan-card-mobile {
          background: linear-gradient(135deg, #0F6E56 0%, #085041 100%) !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span>⏳</span>
            {t("subscriptionPlans.paymentSoonBadge")}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-[#F5F5F4] tracking-tight leading-tight mb-3">
            {t("subscriptionPlans.heroTitle1")}
            <br />
            <span className="text-teal-600 dark:text-[#6fcf9f]">
              {t("subscriptionPlans.heroTitle2")}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-[#A8A8A6] text-base max-w-xs mx-auto">
            {t("subscriptionPlans.heroSubtitle")}
          </p>
        </div>

        <div className="lg:hidden mb-8">
          <div className="flex gap-2 bg-white dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-slate-200 dark:border-[#1c2220] rounded-2xl p-1.5 mb-6">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selected === p.id
                    ? "bg-teal-600 dark:bg-[#0F6E56] text-white shadow-md dark:shadow-none"
                    : "text-slate-500 dark:text-[#A8A8A6] hover:text-teal-600"
                }`}
              >
                {p.duration}
              </button>
            ))}
          </div>

          {PLANS.filter((p) => p.id === selected).map((p) => (
            <div
              key={p.id}
              className="plan-card-mobile rounded-3xl p-7 border-2 border-teal-500 dark:border-[#6fcf9f]"
              style={{
                background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                boxShadow: "0 12px 36px rgba(13,148,136,0.3)",
              }}
            >
              {p.badgeLabel && (
                <div
                  className={`inline-flex mb-4 px-3 py-1 rounded-full text-xs font-bold ${
                    p.id === "6mois"
                      ? "bg-white/20 text-white"
                      : "bg-amber-400 text-amber-900"
                  }`}
                >
                  {p.badgeLabel}
                </div>
              )}
              <div className="mb-1">
                <span className="text-5xl font-bold tracking-tight text-white leading-none">
                  {p.monthly.toLocaleString(numLocale)}
                </span>
                <span className="text-sm ml-2 text-white/50">
                  {t("subscriptionPlans.perMonth")}
                </span>
              </div>
              <div className="text-sm text-white/40 mb-2">
                {t("subscriptionPlans.totalOnce", { price: fmt(p.price) })}
              </div>
              {p.savingsLabel && (
                <div className="inline-flex text-xs font-bold px-3 py-1.5 rounded-full mb-4 bg-white/15 text-teal-100">
                  ✓ {p.savingsLabel}
                </div>
              )}

              <div className="h-px bg-white/15 mb-5" />
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f.key}
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

        <div className="hidden lg:grid lg:grid-cols-3 gap-5 mb-8 items-start">
          {PLANS.map((p) => {
            const on = selected === p.id;
            return (
              <div
                key={p.id}
                className={`plan-card relative rounded-3xl p-8 flex flex-col border-2 ${
                  on
                    ? "selected shadow-lg dark:shadow-none shadow-teal-500/20"
                    : "bg-white dark:bg-[#1c1c1e] shadow-md dark:shadow-none shadow-slate-200/80"
                }`}
                onClick={() => setSelected(p.id)}
              >
                {p.badgeLabel && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                      p.id === "6mois"
                        ? "bg-teal-600 dark:bg-[#0F6E56] text-white"
                        : "bg-amber-400 text-amber-900"
                    }`}
                  >
                    {p.badgeLabel}
                  </div>
                )}

                <div
                  className={`card-duration text-xs font-bold uppercase tracking-widest mb-5 ${on ? "text-white/50" : "text-slate-500 dark:text-[#A8A8A6]"}`}
                >
                  {p.duration}
                </div>

                <div className="mb-2">
                  <span
                    className={`card-price text-5xl font-bold tracking-tight leading-none ${on ? "text-white" : "text-slate-900 dark:text-[#F5F5F4]"}`}
                  >
                    {p.monthly.toLocaleString(numLocale)}
                  </span>
                  <span
                    className={`card-unit text-sm ml-2 ${on ? "text-white/45" : "text-slate-400 dark:text-[#7A7A78]"}`}
                  >
                    {t("subscriptionPlans.perMonth")}
                  </span>
                </div>

                <div
                  className={`card-total text-sm mb-2 ${on ? "text-white/40" : "text-slate-400 dark:text-[#7A7A78]"}`}
                >
                  {t("subscriptionPlans.totalOnce", { price: fmt(p.price) })}
                </div>

                {p.savingsLabel ? (
                  <div
                    className={`savings-pill inline-flex self-start text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${
                      on
                        ? "bg-white/15 text-teal-100"
                        : "bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f]"
                    }`}
                  >
                    ✓ {p.savingsLabel}
                  </div>
                ) : (
                  <div className="mb-5 h-7" />
                )}

                <div
                  className={`card-divider h-px mb-6 ${on ? "bg-white/15" : "bg-slate-100 dark:bg-[#1c2220]"}`}
                />

                <ul className="space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li
                      key={f.key}
                      className={`flex items-center gap-3 text-sm ${
                        f.included
                          ? on
                            ? "feature-text text-white/80"
                            : "feature-text text-slate-700 dark:text-[#E8E8E6]"
                          : on
                            ? "feature-off text-white/25 line-through"
                            : "feature-off text-slate-300 dark:text-[#5a5a5d] line-through"
                      }`}
                    >
                      <div
                        className={`feature-icon w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          f.included
                            ? on
                              ? "bg-white/15"
                              : "bg-teal-50 dark:bg-[#6fcf9f]/10"
                            : "bg-transparent"
                        }`}
                      >
                        {f.included ? (
                          <Check
                            size={11}
                            className={
                              on
                                ? "text-teal-100"
                                : "text-teal-600 dark:text-[#6fcf9f]"
                            }
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
