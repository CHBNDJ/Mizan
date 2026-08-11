"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/SearchResults";

const VILLES_WILAYA: Record<string, string> = {
  alger: "alger",
  oran: "oran",
  constantine: "constantine",
  setif: "sétif",
  blida: "blida",
  annaba: "annaba",
  bejaia: "béjaïa",
  "tizi-ouzou": "tizi ouzou",
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
