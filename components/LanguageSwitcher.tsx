"use client";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LANGUAGES = [
  { code: "fr", label: "FR", full: "Français", flag: "🇫🇷" },
  { code: "ar", label: "AR", full: "العربية", flag: "🇩🇿" },
  { code: "en", label: "EN", full: "English", flag: "🇬🇧" },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Changer de langue"
        className="h-9 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 flex items-center gap-1.5 cursor-pointer transition-all"
      >
        <svg
          className="w-4 h-4 text-white flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-xs font-semibold text-white whitespace-nowrap">
          {current.label}
        </span>
      </button>

      {open && (
        <div className="absolute top-11 end-0 bg-white border border-slate-200 rounded-lg shadow-lg p-1 min-w-[140px] z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l.code });
              }}
              className={`w-full flex items-center gap-2 text-start px-2.5 py-1.5 rounded-md text-sm cursor-pointer transition-all whitespace-nowrap ${
                locale === l.code
                  ? "bg-teal-600 text-white font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {l.full}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
