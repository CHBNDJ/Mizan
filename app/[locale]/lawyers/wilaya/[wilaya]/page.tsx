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
  blida: "blida",
  tlemcen: "tlemcen",
  skikda: "skikda",
  setif: "sétif",
  batna: "batna",
  "bordj-bou-arreridj": "bordj-bou-arréridj",
  medea: "médéa",
  "tizi-ouzou": "tizi-ouzou",
  tiaret: "tiaret",
  chlef: "chlef",
  tipaza: "tipaza",
  mostaganem: "mostaganem",
  "ain-temouchent": "aïn-témouchent",
  jijel: "jijel",
  ghardaia: "ghardaïa",
  laghouat: "laghouat",
  bouira: "bouira",
};

const VILLES_LABEL: Record<string, string> = {
  alger: "Alger",
  bejaia: "Béjaïa",
  oran: "Oran",
  constantine: "Constantine",
  annaba: "Annaba",
  blida: "Blida",
  tlemcen: "Tlemcen",
  skikda: "Skikda",
  setif: "Sétif",
  batna: "Batna",
  "bordj-bou-arreridj": "Bordj Bou Arréridj",
  medea: "Médéa",
  "tizi-ouzou": "Tizi Ouzou",
  tiaret: "Tiaret",
  chlef: "Chlef",
  tipaza: "Tipaza",
  mostaganem: "Mostaganem",
  "ain-temouchent": "Aïn Témouchent",
  jijel: "Jijel",
  ghardaia: "Ghardaïa",
  laghouat: "Laghouat",
  bouira: "Bouira",
};

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

export default function VillePage({
  params,
}: {
  params: Promise<{ wilaya: string }>;
}) {
  const { wilaya: slug } = use(params);
  const key = slug?.toLowerCase() ?? "";
  const wilaya = VILLES_WILAYA[key];
  const label = VILLES_LABEL[key];
  if (!wilaya) notFound();

  const faq = [
    {
      q: `Comment trouver un avocat à ${label} ?`,
      a: `Sur MIZAN, vous consultez les profils d'avocats inscrits au barreau de ${label}, avec leurs domaines d'intervention, leurs avis clients et leurs coordonnées. Vous pouvez filtrer par spécialité et contacter directement l'avocat de votre choix, sans intermédiaire.`,
    },
    {
      q: `Quels domaines du droit sont couverts à ${label} ?`,
      a: `Les avocats de ${label} interviennent en droit de la famille, divorce, droit immobilier, droit pénal, droit du travail, droit des affaires et bien d'autres domaines. Chaque profil précise les spécialités de l'avocat.`,
    },
    {
      q: `Peut-on consulter un avocat de ${label} à distance ?`,
      a: `Oui. De nombreux avocats proposent des consultations à distance, par message, téléphone ou visioconférence. C'est particulièrement adapté aux Algériens de l'étranger qui doivent régler une affaire en Algérie.`,
    },
    {
      q: `Les avocats sur MIZAN sont-ils vérifiés ?`,
      a: `Oui. Tous les avocats présents sur MIZAN sont inscrits au barreau et leur profil est vérifié par notre équipe avant publication. Vous consultez uniquement des professionnels habilités à exercer.`,
    },
  ];

  return (
    <>
      <SearchResults forcedWilaya={wilaya} />
      <section className="px-4 py-12 sm:py-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:from-[#0a0a0a] dark:via-[#141415] dark:to-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
              Trouver un avocat à {label}
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-[#A8A8A6] leading-relaxed">
              <p>
                Vous cherchez un avocat à {label} ? MIZAN référence des avocats
                inscrits au barreau de {label}, aux profils vérifiés, avec leurs
                domaines d'intervention, leurs avis clients et leurs honoraires.
                Que ce soit pour un divorce, une affaire familiale, un litige
                immobilier, une question pénale ou un dossier commercial, vous
                pouvez identifier l'avocat le mieux adapté à votre situation.
              </p>
              <p>
                Sur MIZAN, vous consultez directement le profil de chaque
                avocat, ses spécialités et ses coordonnées, sans intermédiaire,
                que vous soyez à {label}, ailleurs en Algérie ou à l'étranger.
                Vous pouvez comparer les profils, lire les avis et contacter
                l'avocat de votre choix.
              </p>
              <p>
                Tous les avocats présents sur la plateforme sont inscrits au
                barreau et vérifiés par notre équipe. Pour beaucoup d'entre eux,
                vous pouvez prendre rendez-vous pour une consultation à
                distance, un atout précieux pour les Algériens de l'étranger.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
              Questions fréquentes
            </h2>
            <div className="flex flex-col gap-2.5">
              {faq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
