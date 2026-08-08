"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { getPaysAvecAvocats } from "@/lib/avocatsData";

export function CountrySwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pays, setPays] = useState<string[]>([]);
  const current = searchParams.get("pays") === "france" ? "France" : "Algérie";

  useEffect(() => {
    getPaysAvecAvocats().then(setPays);
  }, []);

  if (!pays.includes("France")) return null;

  const changeCountry = (country: string) => {
    if (country === "France") {
      router.push(`${pathname}?pays=france`);
    } else {
      router.push(pathname);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => changeCountry("Algérie")}
        className={`text-sm px-1.5 rounded transition-all ${current === "Algérie" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
        title="Algérie"
      >
        🇩��
      </button>
      <button
        onClick={() => changeCountry("France")}
        className={`text-sm px-1.5 rounded transition-all ${current === "France" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
        title="France"
      >
        🇫🇷
      </button>
    </div>
  );
}
