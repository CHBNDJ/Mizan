"use client";
import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";

function getStored(): string {
  if (typeof window === "undefined") return "Algérie";
  try {
    return localStorage.getItem("mizan-pays") === "France"
      ? "France"
      : "Algérie";
  } catch {
    return "Algérie";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("mizan-pays-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("mizan-pays-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCountry(): string {
  const searchParams = useSearchParams();
  const paysParam = searchParams.get("pays");
  const stored = useSyncExternalStore(subscribe, getStored, () => "Algérie");

  if (paysParam === "france") return "France";
  if (paysParam === "algerie") return "Algérie";
  return stored;
}
