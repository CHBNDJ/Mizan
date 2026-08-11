"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { MapPin, ChevronDown } from "lucide-react";
import { getPaysAvecAvocats } from "@/lib/avocatsData";

export function CountrySwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pays, setPays] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string>("Algérie");
  const paysParam = searchParams.get("pays");
  useEffect(() => {
    if (paysParam === "france") {
      setCurrent("France");
    } else if (paysParam === "algerie") {
      setCurrent("Algérie");
    } else {
      try {
        const stored = localStorage.getItem("mizan-pays");
        setCurrent(stored === "France" ? "France" : "Algérie");
      } catch {
        setCurrent("Algérie");
      }
    }
  }, [paysParam]);
  useEffect(() => {
    getPaysAvecAvocats().then(setPays);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!pays.includes("France")) return null;

  const changeCountry = (country: string) => {
    setOpen(false);
    try {
      localStorage.setItem("mizan-pays", country);
      window.dispatchEvent(new Event("mizan-pays-change"));
    } catch {}
    if (country === "France") router.push(`${pathname}?pays=france`);
    else router.push(`${pathname}?pays=algerie`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 border border-teal-600 dark:border-[#6fcf9f] rounded-full px-3 py-1.5 text-sm font-medium text-teal-600 dark:text-[#6fcf9f] bg-white dark:bg-[#1c1c1e] hover:shadow-md hover:shadow-teal-600/15 dark:hover:shadow-[#6fcf9f]/15 transition-all cursor-pointer"
      >
        <MapPin className="w-4 h-4" />
        {current}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 start-0 min-w-[140px] bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl shadow-lg dark:shadow-none overflow-hidden z-[999]">
          {["Algérie", "France"].map((c) => (
            <button
              key={c}
              onClick={() => changeCountry(c)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                current === c
                  ? "bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f] font-medium"
                  : "text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 dark:hover:bg-[#1c2220]"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
