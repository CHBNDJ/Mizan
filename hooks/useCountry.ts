"use client";
import { useSearchParams } from "next/navigation";

export function useCountry(): string {
  const searchParams = useSearchParams();
  const pays = searchParams.get("pays");
  return pays === "france" ? "France" : "Algérie";
}
