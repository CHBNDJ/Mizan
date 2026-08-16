"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/SearchResults";

const SPECIALITES_LABEL: Record<string, string> = {
  "droit-de-la-famille": "Droit de la famille",
  "droit-commercial": "Droit commercial et des affaires",
  "droit-penal": "Droit pénal",
  "droit-immobilier": "Droit de l'immobilier",
  "droit-du-travail": "Droit du travail et social",
  "droit-des-etrangers": "Droit des étrangers et immigration",
  "droit-fiscal": "Droit fiscal",
  "droit-administratif": "Droit administratif",
};

export default function SpecialitePage({
  params,
}: {
  params: Promise<{ specialite: string }>;
}) {
  const { specialite } = use(params);
  const label = SPECIALITES_LABEL[specialite?.toLowerCase() ?? ""];
  if (!label) notFound();
  return <SearchResults forcedSpecialite={label} />;
}
