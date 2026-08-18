"use client";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/SearchResults";
import { ChevronDown } from "lucide-react";

const VILLES_WILAYA: Record<string, string> = {
  alger: "alger",
  bejaia: "béjaïa",
  oran: "oran",
  constantine: "constantine",
  annaba: "annaba",
};

const VILLES_LABEL: Record<string, string> = {
  alger: "Alger",
  bejaia: "Béjaïa",
  oran: "Oran",
  constantine: "Constantine",
  annaba: "Annaba",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment prendre rendez-vous avec une avocate ?",
    a: "Sur MIZAN, chaque avocate dispose d'un profil vérifié avec ses coordonnées et ses modes de consultation. Vous pouvez la contacter directement, en ligne ou par téléphone, sans intermédiaire.",
  },
  {
    q: "Quels domaines du droit traitent les avocates ?",
    a: "Les avocates couvrent l'ensemble des domaines du droit : droit de la famille, divorce, droit immobilier, droit pénal, droit du travail, droit des affaires et bien d'autres. Chaque profil précise les spécialités de l'avocate.",
  },
  {
    q: "Peut-on consulter une avocate à distance ?",
    a: "Oui. De nombreuses avocates proposent des consultations à distance, par message, téléphone ou visioconférence, ce qui est particulièrement adapté aux Algériens vivant à l'étranger.",
  },
  {
    q: "Les avocates sont-elles inscrites au barreau ?",
    a: "Toutes les avocates présentes sur MIZAN sont inscrites au barreau et leur profil est vérifié par notre équipe. Vous consultez uniquement des professionnelles habilitées à exercer.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full text-start bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl px-4 py-3.5 cursor-pointer transition-all hover:border-teal-300 dark:hover:border-[#6fcf9f]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-800 dark:text-[#F5F5F4]">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-sm text-slate-600 dark:text-[#A8A8A6] leading-relaxed mt-3">
          {a}
        </p>
      )}
    </button>
  );
}

export default function AvocatesVillePage({
  params,
}: {
  params: Promise<{ wilaya: string }>;
}) {
  const { wilaya: slug } = use(params);
  const wilaya = VILLES_WILAYA[slug?.toLowerCase() ?? ""];
  const label = VILLES_LABEL[slug?.toLowerCase() ?? ""];
  if (!wilaya) notFound();

  return (
    <>
      <SearchResults forcedWilaya={wilaya} forcedGenre="femme" />

      <section className="px-4 py-12 sm:py-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-[#0a0a0a] dark:via-[#141415] dark:to-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
              Trouver une avocate à {label}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-[#A8A8A6] leading-relaxed">
              <p>
                Vous cherchez une avocate à {label} ? MIZAN référence des
                avocates inscrites au barreau de {label}, aux profils vérifiés,
                avec leurs domaines d'intervention, leurs avis clients et leurs
                honoraires. Que ce soit pour un divorce, une affaire familiale,
                un litige immobilier ou une question pénale, vous pouvez
                identifier l'avocate la mieux adaptée à votre situation.
              </p>
              <p>
                Certaines personnes préfèrent être accompagnées par une femme
                avocate, notamment pour les affaires familiales, les questions
                de garde d'enfants ou les situations sensibles. Sur MIZAN, vous
                consultez directement le profil de chaque avocate, ses
                spécialités et ses coordonnées, sans intermédiaire, que vous
                soyez en Algérie ou à l'étranger.
              </p>
              <p>
                Toutes les avocates présentes sur la plateforme sont inscrites
                au barreau et vérifiées par notre équipe. Vous pouvez les
                contacter directement et, pour beaucoup d'entre elles, prendre
                rendez-vous pour une consultation à distance.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
              Questions fréquentes
            </h2>
            <div className="flex flex-col gap-2.5">
              {FAQ.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
