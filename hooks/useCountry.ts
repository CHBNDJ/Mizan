"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useCountry(): string {
  const searchParams = useSearchParams();
  const paysParam = searchParams.get("pays");
  const [country, setCountry] = useState<string>("Algérie");

  useEffect(() => {
    if (paysParam === "france") {
      setCountry("France");
      try {
        localStorage.setItem("mizan-pays", "France");
      } catch {}
    } else if (paysParam === "algerie") {
      setCountry("Algérie");
      try {
        localStorage.setItem("mizan-pays", "Algérie");
      } catch {}
    } else {
      try {
        const stored = localStorage.getItem("mizan-pays");
        if (stored === "France") setCountry("France");
      } catch {}
    }
  }, [paysParam]);

  return country;
}
