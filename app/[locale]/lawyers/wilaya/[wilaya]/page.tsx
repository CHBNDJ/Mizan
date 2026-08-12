"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/SearchResults";

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

export default function VillePage({
  params,
}: {
  params: Promise<{ wilaya: string }>;
}) {
  const { wilaya: slug } = use(params);
  const wilaya = VILLES_WILAYA[slug?.toLowerCase() ?? ""];
  if (!wilaya) notFound();
  return <SearchResults forcedWilaya={wilaya} />;
}
